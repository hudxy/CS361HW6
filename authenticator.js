var fs = require('fs')
var router = require('./router')
var auth = {
		getID: function (login,pw) {
			//Returns User ID if U/N and Password Correct, return 0 otherwise
			//User ID should be a random number+an indicator of user permissions (ultility,admin,basic)
				// load db and see if user exists
			const dataBuffer = fs.readFileSync("db.json")
			const dataJSON = dataBuffer.toString()
			const users = JSON.parse(dataJSON)
			let currentUser = {}
			let success = false
			users.forEach((user) => {
				if (user.login === login && user.pw === pw) {
					success = true
					currentUser = user
				}
			})
			if (success){
				return currentUser
			}
			else {
				return 0
			}
		},
		getUserName:function (userID) {
			//Returns name of User associated with ID.
			return 'test'
		},
		assignID:function (newlogin, newName, newPW) {
			//Returns name of User associated with ID.
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

			return newUser
		},
		changePassword:function (userName,oldPW,newPW) {
				//Updates password in database
				// load db and see if user exists
			const dataBuffer = fs.readFileSync("db.json")
			const dataJSON = dataBuffer.toString()
			const users = JSON.parse(dataJSON)
			let currentUser = {}
			let success = false
			users.forEach((user) => {
				if (user.login === userName && user.pw === oldPW) {
					success = true
					currentUser = user
					user.pw = newPW

					// save users
					fs.writeFileSync('db.json', JSON.stringify(users))
				}
			})
			if (success === true) {
				return true
			}
			// No matching passwords!
			return false
		},
		getWatchlist:function (userName) {
			const dataBuffer = fs.readFileSync("watchdb.json")
			const dataJSON = dataBuffer.toString()
			const issues = JSON.parse(dataJSON)
			var  retIssues = []
			issues.forEach((issue) => {
				if (issue.user === userName) {
					var thisIssue = router.getIssuesbyID(issue.id)
					retIssues.push(thisIssue)
				}
			})
			return retIssues
		},
		getWatchlistwFilter:function (userName,categories) {
			const dataBuffer = fs.readFileSync("watchdb.json")
			const dataJSON = dataBuffer.toString()
			const issues = JSON.parse(dataJSON)
			let hashmap = {}
			for (let i = 0; i < categories.length; i++) {
				hashmap[categories[i]] = true
			}
			var  retIssues = []
			issues.forEach((issue) => {
				if (issue.user === userName) {
					var thisIssue = router.getIssuesbyID(issue.id)
					if (hashmap[thisIssue.category] === true) {
						retIssues.push(thisIssue)
					}
				}
			})
			return retIssues
		},
		addWatchlist:function (userName,issueId) {
				//Create new Issue Ticket with issue data
			const dataBuffer = fs.readFileSync("watchdb.json")
			const dataJSON = dataBuffer.toString()
			let watchlist = JSON.parse(dataJSON)
			watchlist.push({user: userName,id: issueId})
			fs.writeFileSync('watchdb.json', JSON.stringify(watchlist))
		},
		removeWatchlist:function (userName,issueId) {
			const dataBuffer = fs.readFileSync("watchdb.json")
			const dataJSON = dataBuffer.toString()
			const watchlist = JSON.parse(dataJSON)
			var  row=0
			watchlist.forEach((issue) => {
				if (issue.user == userName && issue.id == issueId) {
					watchlist.splice(row,1)
				}
				row++
			})
			fs.writeFileSync('watchdb.json', JSON.stringify(watchlist))
		}
	}

module.exports = auth
