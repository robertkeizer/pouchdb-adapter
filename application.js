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
						response.___key = database.___key;

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

	findQuery: function( store, type, query, options ){

		var self = this;

		return new Ember.RSVP.Promise( function( resolve, reject ){

			// Based on the type we want to figure out what attributes
			// are a hasMany relationship; We don't want to emit a 
			// basic type or a complex array in the key.. we want
			// multiple emit lines.

			// To facilitate this we create an array of keys that
			// we should treat as arrays instead of single simple
			// values.
			var hasManyKeys = [ ];

			// I can't find a better way to enumerate the relationships of a
			// given type; So we create an instance here.. even though we do
			// nothing with it. ( It isn't saved ).
			store.createRecord( type, { } ).eachRelationship( function( relationship, options ){
				if( options.kind == "hasMany" ){
					hasManyKeys.push( relationship );
				}
			} );

			// We want to populate singleKeys with an array
			// of keys that are belongsTo or direct reference comparisons.
			// Also since we're iterating over query anyways, we build up
			// what the view name should be.
			var singleKeys		= [ ];
			var viewNameKeys	= [ ];
			for( var key in query ){
				if( hasManyKeys.indexOf( key ) < 0 ){
					singleKeys.push( key );
				}
				viewNameKeys.push( key );
			}

			var viewName = type.typeKey + "-" + viewNameKeys.join( "-" );

			// Check if the design doc and the view exist.
			self.viewExists( viewName ).then( function( ){
				
				// Lets figure out what our queryKeys are going to be;
				// These are the actual values passed in in the query
				// object to the search.. 
				var queryKeys = [ ];
				for( var key in query ){
					if( !singleKeys.indexOf( key ) ){
						// Querying by hasMany; we should
						// make sure the actual query key is an
						// array or automatically wrap it in an 
						// array ourselves.
						
						if( Array.isArray( query[key] ) ){
							queryKeys.push( query[key] );
						}else{
							queryKeys.push( [ query[key] ] );
						}
					}

					// Single; just use the value we have.
					queryKeys.push( query[key] );
				}
			} );

		} );
	},

	// This function makes sure that the given view doesn't already exist.
	// It makes use of the fact that design document name is the first 
	// split of '-'
	viewExists: function( viewName ){
		var self = this;
		return new Ember.RSVP.Promise( function( resolve, reject ){

			// The design doc name is the first part in the view name.
			var _split		= viewName.split( "-" );
			var _designDocName	= _split[0];

			// Check to make sure the design document exists; If
			// it doesn't we should create it.

			self.runOnAllDatabases( function( database ){
				database.get( "_design/" + _designDocName, function( err, res ){
					if( err && err.status != 404 ){ 
						return reject( err );
					}else if( err ){
						// 404 error.. lets create the design document.
						// First we need to get the map function geneated for
						// the view.
						self.generateMapFunctionForView( viewName ).then( function( mapFunctionString ){
							
						}, reject );
					}
					
					// Exists already; Resolve.
					return resolve( );
				} );
			} );
		} );
	},

	generateMapFunctionForView: function( viewName ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			/*

			// Because we want to iterate over an array inside our
			// function that we're defining, we should create an array
			// that contains doc.zzz for zzz in query.
			var docKeys = singleKeys.map( function( key ){ return "doc." + key; } );
			
			var mapFn = 'function(doc){ ' +
			'  if( doc._id.indexOf( "_" ) > 0 ){' +
			'    try { ' +
			'      var _split = doc._id.split( "_" );' +
			'      if( _split[0] == "' + type.typeKey + '" ){';

			// If we have a hasManyKey we want to iterate over all the 
			// hasManyKeys and have multiple emits in the function.
			if( hasManyKeys.length > 0 ){

				// Go through them each and make sure the map function
				// has a block that checks to see if the key exists
				// in the document, and is an array. If it is,
				// we want to have multiple emit lines..
				hasManyKeys.forEach( function( hasManyKey ){

					mapFn += 'if( doc.' + hasManyKey + ' && Array.isArray( doc.' + hasManyKey + ' ) ){';

					mapFn += '  doc.' + hasManyKey + '.forEach( function( particularVal ){';
	
					

					mapFn += '  } )';

					mapFn += '}';
				} );

			}else{
				mapFn += 'emit( [ ' + docKeys.join(',') + ' ], null );';
			}
			
			mapFn += '      }' +
			'    } catch( e ){ }' +
			'  }'
			'}';
			*/

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
