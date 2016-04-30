var application_root = __dirname,
    express = require( 'express' ),
    path = require( 'path' ),
    mongoose = require( 'mongoose' );
	gcm = require( 'node-gcm' ); 

//Create server
var app = express();

// Configure server
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );
    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );
    //perform route lookup based on url and HTTP method
    app.use( app.router );
    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	console.log('connected to db');
});

mongoose.connect( 'mongodb://localhost/unlaze' );

//Database Structure
var UnlazeUserSchema = new mongoose.Schema({
	detail: {
		id: String,
		created: { type: Date, default: Date.now },
		last: Date,
		email: String,
		name: String,
		gender: Boolean,
		coords: {
			type: { type: String },
			coordinates: { type: [ Number ], default: [ 0, 0 ] }
		},
		city: String,
		birth: String,
		face: [{
			id: String,
			source: String
		}],
		about: String,
		gcm: String,
		online: Boolean,
		selected_gender: Number,
		selected_radius: Number
	},
	activity: [{
		_type: String,
		valid: Boolean,
		created: { type: Date, default: Date.now },
		last: Date
	}],
	connect: [{
		_with: String,
		_type: [{
			name: String,
			created: { type: Date, default: Date.now } 
		}],
		valid: Boolean,
		created: { type: Date, default: Date.now },
		last: Date
	}],
	request: [{
		_with: String,
		_type: String,
		name: String,
		valid: Boolean,
		outcome: Boolean,
		created: { type: Date, default: Date.now },
		finish: Date
	}],
	chat: [{
		_with: String,
		content: [{
			text: String,
			created: { type: Date, default: Date.now }
		}]
	}],
	abuse: [{
		id: String,
		created: { type: Date, default: Date.now }
	}]
});
UnlazeUserSchema.index({ 'detail.coords': '2dsphere' });
var UnlazeUserModel = mongoose.model( 'User', UnlazeUserSchema );

/*
var thor = new UnlazeUserModel({
    
});

thor.save(function(err, thor) {
	if (err) return console.error(err);
	console.dir(thor);
});*/

//Get all users
app.get( '/api/user', function( request, response ) {
    return UnlazeUserModel.find(function( err, users ) {
        if( !err ) {
            return response.send( users );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

//Insert a new user
app.post( '/api/users', function( request, response ) {
    //Put received user
	var user = new UnlazeUserModel(request.body);
    user.save( function( err ) {
        if( !err ) {
            console.log('// User created');
            return response.send( user );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

//Get a single user by id
app.get( '/api/id/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
        if( user ) {
			console.log('// GET user ' + request.params.id);
            return response.send( user );
        } else {
			console.log('// GET user null ' + request.params.id);
            return response.send( {} );
		}
		if( err ) {
            console.log( err );
            return response.send( {} );
        }
    });
});

//Get a single user detail by id
app.get( '/api/detail/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
        if( user ) {
			console.log('// GET user detail ' + request.params.id);
            return response.send( user.detail );
        } else {
			console.log('// GET user detail null ' + request.params.id);
            return response.send( {} );
		}
		if( err ) {
            console.log( err );
            return response.send( {} );
        }
    });
});

//Get a single user activity by id
app.get( '/api/activity/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
        if( !err ) {
			console.log('// GET user activity ' + request.params.id);
            return response.send( user.activity );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

//Get a single user connections by id
app.get( '/api/connect/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
        if( !err ) {
			console.log('// GET user connect ' + request.params.id)
            return response.send( user.connect );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

//Get a single user requests by id
app.get( '/api/request/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
        if( !err ) {
			console.log('// GET user request ' + request.params.id)
            return response.send( user.request );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

//Update a users detail
app.put( '/api/update/detail/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
		//Put user
		user.detail = request.body;
		//Set last date
		user.detail.last = new Date();
		user.save( function( err, user ) {
			if( !err ) {
				console.log('// User detail updated ' + request.params.id);
				return response.send( user.detail );
			} else {
				console.log( err );
				return response.send('ERROR');
			}
		});
    });
});

//Update a users activity
app.put( '/api/update/activity/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
		//Put user
		user.activity = request.body;
		user.save( function( err, user ) {
			if( !err ) {
				console.log('// User activity updated ' + request.params.id);
				return response.send( user.activity );
			} else {
				console.log( err );
				return response.send('ERROR');
			}
		});
    });
});

//Update a users connections
app.put( '/api/update/connect/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
		//Put user connect
		user.connect = request.body;
		user.save( function( err, user ) {
			if( !err ) {
				console.log('// User connect updated ' + request.params.id);
				return response.send( user.connect );
			} else {
				console.log( err );
				return response.send('ERROR');
			}
		});
    });
});

//Update a users requests
app.put( '/api/update/request/:id', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
		//Put user request
		user.request = request.body;
		user.save( function( err, user ) {
			if( !err ) {
				console.log('// User request updated ' + request.params.id);
				return response.send( user.request );
			} else {
				console.log( err );
				return response.send('ERROR');
			}
		});
    });
});

//People Search
app.get( '/api/search/:gender/:activity/:long/:lat/:radius', function( request, response ) {
	
	//console.log(request);
	
	if(request.params.gender == 0) {
		var query = {
			activity: {
				$elemMatch: {
					valid: true,
					_type: request.params.activity
				}
			},
			'detail.coords': {
				$nearSphere: [
					request.params.long,
					request.params.lat
				],
				$maxDistance: request.params.radius/6371007
			}
		}
	} else if(request.params.gender == 1) {
		var query = {
			activity: {
				$elemMatch: {
					valid: true,
					_type: request.params.activity
				}
			},
			'detail.gender': true,
			'detail.coords': {
				$nearSphere: [
					request.params.long,
					request.params.lat
				],
				$maxDistance: request.params.radius/6371007
			}
		}
	} else {
		var query = {
			activity: {
				$elemMatch: {
					valid: true,
					_type: request.params.activity
				}
			},
			'detail.gender': false,
			'detail.coords': {
				$nearSphere: [
					request.params.long,
					request.params.lat
				],
				$maxDistance: request.params.radius/6371007
			}
		}
	}
	return UnlazeUserModel.find(query, function(err, results, stats) {
		if( !err ) {
			console.log('// People search complete');
			//console.log(results);
			var details = [];
			var requests = [];
			var holder = [];
			for(var i = 0; i < results.length; i++){
				details.push(results[i].detail);
				requests.push(results[i].request);
			}
			holder.push(details);
			holder.push(requests);
			return response.send( holder );
		} else {
			console.log( err );
			return response.send('ERROR');
		}
    });
});

//Delete a user
app.delete( '/api/users/:id', function( request, response ) {
    UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
        return user.remove( function( err ) {
            if( !err ) {
                console.log( '// DELETE user ' + request.params.id );
                return response.send( null );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    });
});

//Send notification
app.put( '/api/notif/:to/:from/:activity', function( request, response ) {
	return UnlazeUserModel.findOne( { 'detail.id': request.params.to }, function( err, user ) {
		if( !err ) {
			//Put request
			user.request = request.body;
			user.save( function( err, user ) {
				if( !err ) {
					console.log( '// PUT user request ' + user.detail.id );
					// get from user
					UnlazeUserModel.findOne( { 'detail.id': request.params.from }, function( err, _user ) {
						if( !err ) {
							// Send gcm notif
							var gcmObject = new gcm.Sender('AIzaSyDs-njs3tZnY0BmXH7a9obszR6Pqpsg064');
							var message = new gcm.Message({
								data: {
									user: request.params.from,
									activity: request.params.activity,
									name: _user.detail.name,
									form: 'notification'
								},
								delay_while_idle: true,
								time_to_live: 33,
								dry_run: false
							});
							var reg = [];
							reg.push(user.detail.gcm);
							gcmObject.send(message, reg, true, function(err, res) {
								if(!err) {
									console.log('// GCM Notif sent to ' + _user.detail.name);
									return response.send( _user.request );
								} else console.log( err );
							});
						} else console.log( err );
					});
				} else {
					console.log( err );
					return response.send('ERROR');
				}
			});
		} else {
			console.log( err );
			return response.send('ERROR');
		}
	});
});

//Get a conversation by user and person
app.get( '/api/chat/:id/:_with', function( request, response ) {
    return UnlazeUserModel.findOne( { 'detail.id': request.params.id }, function( err, user ) {
        if( !err ) {
			return UnlazeUserModel.findOne( { 'detail.id': request.params._with }, function( err, _user ) {
				if( !err ) {
					var messages = [];
					for(var i = 0; i < user.chat.length; i++) {
						if(user.chat[i]._with == request.params._with) {
							messages.push(user.chat[i].content);
						}
					}
					for(var i = 0; i < _user.chat.length; i++) {
						if(_user.chat[i]._with == request.params.id) {
							messages.push(_user.chat[i].content);
						}
					}
					console.log('// GET user chat ' + user.detail.id + ' with ' + _user.detail.id);
					return response.send( messages );
				} else {
					console.log( err );
					return response.send('ERROR');
				}
			});
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

//Chat notification
app.put( '/api/chat/:to/:from', function( request, response ) {
	return UnlazeUserModel.findOne( { 'detail.id': request.params.from }, function( err, user ) {
		if( !err ) {
			//Put chat
			var create = true;
			for(var i = 0; i < user.chat.length; i++) {
				if(user.chat[i]._with == request.params.to) {
					user.chat[i].content.push(request.body);
					create = false;
				}
			}
			// create new
			if(create) {
				var content = [];
				content.push(request.body);
				var chat = {
					'_with': request.params.to,
					'content': content
				};
				user.chat.push(chat);
				console.log( '// Created chat object for ' + user.detail.id );
			}
			user.save( function( err, user ) {
				if( !err ) {
					console.log( '// PUT user chat message ' + user.detail.id );
					// get from user
					UnlazeUserModel.findOne( { 'detail.id': request.params.to }, function( err, _user ) {
						if( !err ) {
							// Send gcm notif
							var gcmObject = new gcm.Sender('AIzaSyDs-njs3tZnY0BmXH7a9obszR6Pqpsg064');
							var message = new gcm.Message({
								data: {
									user: request.params.from,
									message: request.body.text,
									name: user.detail.name,
									form: 'conversation'
								},
								delay_while_idle: true,
								time_to_live: 33,
								dry_run: false
							});
							var reg = [];
							reg.push(_user.detail.gcm);
							gcmObject.send(message, reg, true, function(err, res) {
								if(!err) {
									console.log('// GCM chat message sent to ' + _user.detail.name);
									return response.send( {} );
								} else console.log( err );
							});
						} else console.log( err );
					});
				} else {
					console.log( err );
					return response.send('ERROR');
				}
			});
		} else {
			console.log( err );
			return response.send('ERROR');
		}
	});
});

// TEMP NOTIFICATION
/*
var gcmObject = new gcm.Sender('AIzaSyDs-njs3tZnY0BmXH7a9obszR6Pqpsg064');
var message = new gcm.Message({
	data: {
		user: '10153906735572627',
		message: 'Swimming',
		name: 'Ankit Patil',
		form: 'conversation'
	},
	delay_while_idle: true,
	time_to_live: 33,
	dry_run: false
});
var reg = [];
reg.push('APA91bGPUhFmoLF1yeIeWKxJqGHcFQYuFsSCfS9UICipsuCD3CL4gzOayzEyZfwc0q5cINFym8Y-PzJnkfVPpWSMbp-Glh5Aq4gb7hLnT0T-QqZUTQv_xvAOGHSBaa_U5qX-1T_Oi20A');
gcmObject.send(message, reg, true, function(err, response) {
	console.log('// GCM Notif sent');
	if(err) console.log(err);
	else console.log(response);
});*/

//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});
