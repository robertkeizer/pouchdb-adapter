export default DS.Adapter.extend( {

	// Just some placeholder values for testing
	// and developing.
	databaseName: "ember-application-db",
	databaseOptions: { adapter: "websql", size: 50 },


	createRecord: function( store, type, record ){
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
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	findMany: function( resolve, reject ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	findAll: function( resolve, reject ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	findQuery: function( resolve, reject ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	// This function returns a promsie that either
	// is resolved with the pouchdb database, or fails getting it.
	_getDatabase: function( ){

		var self = this;

		// If we have the database already, and it is a promise..
		if( this._database && self._database.then ){
			return self._database;
		}

		// If we have the database but it isn't a promise, we should wrap
		// it in one so that our code doesn't have to handle multiple return
		// values from this function..
		if( this._database ){
			return new Ember.RSVP.Promise( function( resolve, reject ){
				return resolve( self._database );
			} );
		}

		// Lets create a new promise that gets the actual database.. we want
		// to set this to this._database so that any subsequent hits to _getDatabase
		// don't hit this again.
		this._database = new Ember.RSVP.Promise( function( resolve, reject ){
			new PouchDB( self.databaseName, self.databaseOptions, function( err, database ){
				if( err ){ return reject( err ); }

				self._database = database;
				return resolve( self._database );
			} );
		} );

		return this._database;
	}
} );
