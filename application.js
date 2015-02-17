export default DS.Adapter.extend( {

	databaseParticulars: new Ember.Object( {
		"default": {
			databaseName: "ember-application-db",
			databaseOptions: { adapter: "websql", size: 50 }
		}
	} ),

	replicationObjects: new Ember.Object( { } );

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

	findMany: function( ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	findAll: function( ){
		return new Ember.RSVP.Promise( function( resolve, reject ){
			
		} );
	},

	findQuery: function( ){
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
