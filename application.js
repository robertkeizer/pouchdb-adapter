export default DS.Adapter.extend( {

	databaseParticulars: Ember.Object.create( { 
		"default": Ember.Object.create( {
			databaseName: "ember-application-db",
			databaseOptions: { adapter: "websql", size: 50 }
		} )
	} ),

	// This variable makes sure that
	// all the databases respond back with the
	// same results. The promise will fail if
	// this is set to true and different results
	// are returned. Otherwise the datatabase
	// specified by winningDatabase wins.
	enforceSync: false,
	winningDatabase: "default",

	replicationObjects: Ember.Object.create( ),

	createRecord: function( store, type, record ){
		var self = this;
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	updateRecord: function( store, type, record ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	deleteRecord: function( store, type, record ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},
	
	find: function( store, type, id ){
		var self = this;
		return new Ember.RSVP.Promise( function( resolve, reject ){

			self.runOnAllDatabases( function( database ){

				return new Ember.RSVP.Promise( function( resolve, reject ){
					database.get( self.databaseId( id, type ), function( err, response ){
						if( err ){ return reject( err ); }

						// We want to know what the database name is; so we shunt
						// it into the response to be ripped out later.
						response.___key = activeDatabase.___key;

						return resolve( response );
					} );
				} );

			} ).then( resolve, reject );
		} );
	},

	findMany: function( ){
		console.log( "FINDMANY" );
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	findAll: function( ){
		var self = this;
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	findQuery: function( ){
		console.log( "FINDQUERY" );
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	startReplication: function( name, particulars ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	stopReplication: function( name ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	// This function takes care of enumerating all the active databases
	// and running a given function against all of them; The results
	// are also parsed such that the functions using this don't need
	// to care about logic surrounding multiple databases.

	runOnAllDatabases: function( functionToRun ){
		var self = this;
		return new Ember.RSVP.Promise( function( resolve, reject ){
			self.getActiveDatabases( ).then( function( activeDatabases ){
				var _promises = [ ];

				activeDatabases.forEach( function( activeDatabase ){
					_promises.push( functionToRun( activeDatabase ) );
				} );

				Ember.RSVP.all( _promises ).then( function( results ){

					// Depending on our configuration we want to either
					// enforce that there is only a single unique result
					// or pick a given response back from one of the databases
					// in particular. See enforceSync.

					// If we don't care about multiple disparate results coming
					// back, go with the default.
					if( !self.enforceSync ){
						
						// We know that this filter function will return 
						// a single result because we're inside a RSVP.all..
						// if the winning database has rejected the find we
						// wouldn't be here.
						return resolve( results.filter( function( result ){
							if( result.___key == self.winningDatabase ){
								return true;
							}
							return false;
						} )[0] );
					}

					// Make sure all the results are the same; If they're not, fail.
					// TODO make this a deep comparison.
					if( new Ember.Array( results ).uniq( ).length == results.length ){
						return resolve( results[0] );
					}

					return reject( "Disparate results coming back from multiple databases." );

				}, reject );
			}, reject );

		} );
	},

	// This function takes an ember id and a type, and transforms
	// it into a pouchdb id.. 
	databaseId: function( id, type ){
		return type.typeKey + "_" + id;
	},

	// This function goes through databaseParticulars and 
	// enumerates all the databases that are actuall valid.. ie 
	// _database is defined and it isn't a promise.

	// It rejects if no valid databases were found.
	getActiveDatabases: function( ){
		var self = this;
		return new Ember.RSVP.Promise( function( resolve, reject ){
			var _promises = [ ];

			Object.keys( self.databaseParticulars ).forEach( function( databaseParticularKey ){
				_promises.push( new Ember.RSVP.Promise( function( resolve, reject ){

					// Get the database itself.
					var _database = self.databaseParticulars.get( databaseParticularKey ).get( "_database" );

					// Sanity check against if the database is actually null or undefined or the like.
					if( _database ){

						// We inject the databaseParticularKey into the PouchDB instance so that
						// iterating over databaseParticulars isn't required later, to find what
						// pouchdb database goes with what connection.
						_database.___key = databaseParticularKey;
					}

					return resolve( _database );
				} ) );
			} );

			Ember.RSVP.filter( _promises, function( databaseInstance ){
				if( !databaseInstance || databaseInstance.then ){
					return false;
				}
				return true;
			} ).then( function( results ){
				if( results.length > 0 ){
					return resolve( results );
				}
				return reject( "No active databases found." );
			} );
		} );
	},

	// This function returns a promsie that either
	// is resolved with the pouchdb database, or fails getting it.
	_getDatabase: function( name ){

		var self = this;

		// If a name wasn't specified we should 
		// make sure its the default.
		if( !name ){ name = "default"; }

		// Check to make sure the database configuration exists
		// in databaseParticulars; If it doesn't, exit out.
		if( !this.databaseParticulars.get( name ) ){
			return new Ember.RSVP.Promise( function( resolve, reject ){
				return reject( "Not defined." );
			} );
		}

		// We only really care about this particular database and its particulars.
		// so lets not trouble ourselves by calling this.databaseParticulars.get( name )
		// over and over again.
		var _thisDatabaseParticulars = this.databaseParticulars.get( name );

		// If we have the database already, and it is a promise we want to return.
		if( _thisDatabaseParticulars.get( "_database" ) && _thisDatabaseParticulars.get( "_database" ).then ){
			return _thisDatabaseParticulars.get( "_database" );
		}

		// If we have the database but it isn't a promise, we should wrap
		// it in one so that our code doesn't have to handle multiple return
		// values from this function..
		if( _thisDatabaseParticulars.get( "_database" ) ){
			return new Ember.RSVP.Promise( function( resolve, reject ){
				return resolve( _thisDatabaseParticulars.get( "_database" ) );
			} );
		}

		// Lets create a new promise that gets the actual database.. we want
		// to set this so that any subsequent hits to _getDatabase don't hit
		// this logic again.
		_thisDatabaseParticulars.set( "_database", new Ember.RSVP.Promise( function( resolve, reject ){
			new PouchDB( _thisDatabaseParticulars.get( "databaseName" ), _thisDatabaseParticulars.get( "databaseOptions" ), function( err, database ){

				// We should reject if we get an error back.
				// Also we should make sure that _database is
				// cleared of this now rejected promise.
				if( err ){
					reject( err );
					return _thisDatabaseParticulars.set( "_database", null );
				}

				// Lets set the database ..
				resolve( database );
				_thisDatabaseParticulars.set( "_database", database );
			} );
		} ) );

		return _thisDatabaseParticulars.get( "_database" );
	}
} );
