export default DS.Adapter.extend( {

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

			self._getDatabase( ).then( function( database ){
				database.get( self.databaseId( id, type ), function( err, response ){
					if( err ){ return reject( err ); }

					return resolve( response );
				} );
			}, reject );
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

	// This function takes an ember id and a type, and transforms
	// it into a pouchdb id.. 
	databaseId: function( id, type ){
		return type.typeKey + "_" + id;
	},

	// Gets the pouchdb database..
	_getDatabase: function( ){

		var self = this;

		if( this.get("_database") && this.get("_database").then ){
			return this.get( "_database" );
		}

		if( this.get( "_database" ) ){
			return new Ember.RSVP.Promise( function( resolve, reject ){
				return resolve( self.get( "_database" ) );
			} );
		}

		this.set( "_database", new Ember.RSVP.Promise( function( resolve, reject ){
			new PouchDB( self.get( "databaseName", self.get( "databaseOptions" ), function( err, database ){

				// We should reject if we get an error back.
				// Also we should make sure that _database is
				// cleared of this now rejected promise.
				if( err ){
					reject( err );
					self.set( "_database", null );
				}

				// Lets set the database ..
				resolve( database );
				self.set( "_database", database );
			} );
		} ) );

		return this.get( "_database" );
	}
} );
