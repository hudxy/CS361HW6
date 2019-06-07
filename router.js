const fs = require('fs')
let router = {
            getIssuesbyID:function (id) {
                //Returns issues tied to a User ID
                const dataBuffer = fs.readFileSync("issuedb.json")
				const dataJSON = dataBuffer.toString()
				const issues = JSON.parse(dataJSON)
                var retIssues = {}
				issues.forEach((issue) => {
				if (issue.id === id) {
                        retIssues = issue
					}
				})
                return retIssues
			},
            getIssuesAll:function () {
                //Returns all issues in issue database
                    const dataBuffer = fs.readFileSync("issuedb.json")
                    const dataJSON = dataBuffer.toString()
                    const issues = JSON.parse(dataJSON)
                    retIssues = []
                    issues.forEach((issue) => {
                        retIssues.push(issue)

                })
                return retIssues
            },
            getIssuesbyUser:function (user) {
                //Returns issues tied to a User ID
                const dataBuffer = fs.readFileSync("issuedb.json")
				const dataJSON = dataBuffer.toString()
                //console.log(dataJSON)
				const issues = JSON.parse(dataJSON)
                var retIssues = []
                //console.log(typeof retIssues)
				issues.forEach((issue) => {
                    if (issue.submitter === user) {
                        //console.log(typeof issue)
                        retIssues.push(issue)
                    }
                })
                return retIssues
			},
            getIssueswFilter:function (user, categories) {
                //Returns issues that satisfy the parameters set in filter
                let hashmap = {}
                console.log('categories', categories)
                for (let i = 0; i < categories.length; i++) {
                  hashmap[categories[i]] = true
                }
                let allIssues = this.getIssuesbyUser(user)
                let filteredIssues = []
                allIssues.forEach((issue) => {
                    if (hashmap[issue.category] === true) {
                        filteredIssues.push(issue)
                    }
                })
                return filteredIssues

            },
            addIssue:function (user,issue) {
                //Create new Issue Ticket with issue data
                var randNum = Math.round(Math.random()*1000000)
                var strRandNum = randNum.toString()
                issue = {city: issue.city, state: issue.state, zipcode: issue.zipcode, category: issue.category, urgency: issue.urgency, description: issue.description, submitter: user, id: strRandNum}

				const dataBuffer = fs.readFileSync("issuedb.json")
  				const dataJSON = dataBuffer.toString()
  				let currIssues = JSON.parse(dataJSON)
  				currIssues.push(issue)
				// save users
				fs.writeFileSync('issuedb.json', JSON.stringify(currIssues))
             },
			updateIssue:function (user,issue) {
                //Update Issue ticket with new data
            },
			resolveIssue:function (user,issue) {
                //Resolve Issue ticket
            }
        }

module.exports = router
