var fs = require('fs');
var auth = {
            getID: function (login,pw) { 
                console.log(login, pw);
                //Returns User ID if U/N and Password Correct, return 0 otherwise
				//User ID should be a random number+an indicator of user permissions (ultility,admin,basic)
				 // load db and see if user exists
				const dataBuffer = fs.readFileSync("db.json")
				const dataJSON = dataBuffer.toString()
				const users = JSON.parse(dataJSON)
				let currentUser = {}
				let success = false
				users.forEach((user) => {
					console.log(user.login, user.pw)
					if (user.login === login && user.pw === pw) {
						success = true
                        //console.log('success')
						currentUser = user
					}
				})
                if (success){
                    return currentUser;
                }
                else {
                   return 0; 
                }
            },
            getUserName:function (userID) { 
                //Returns name of User associated with ID. 
				return 'test';
            },
			assignID:function (newlogin, newName, newPW) { 
                //Returns name of User associated with ID. 
                //console.log(newlogin, newName, newPW);
				const newUser = {login: newlogin, name: newName, pw: newPW}
    
				// load users
				const dataBuffer = fs.readFileSync("db.json")
				const dataJSON = dataBuffer.toString()
				let currUsers = JSON.parse(dataJSON)
				console.log(currUsers)
				// add new user
				currUsers.push(newUser)

				// save users
				fs.writeFileSync('db.json', JSON.stringify(currUsers))
				
				return newUser;
            },
            changePassword:function (userName,oldPW,newPW) { 
					//Updates password in database
					// load db and see if user exists
                console.log(userName,oldPW,newPW);
				const dataBuffer = fs.readFileSync("db.json")
				const dataJSON = dataBuffer.toString()
				const users = JSON.parse(dataJSON)
				let currentUser = {}
				let success = false
				users.forEach((user) => {
				console.log(user.login, user.pw)
				if (user.login === userName && user.pw === oldPW) {
						success = true
						currentUser = user
						user.pw = newPW

						// save users
						fs.writeFileSync('db.json', JSON.stringify(users))
					}
				})
            }
    };

module.exports = auth