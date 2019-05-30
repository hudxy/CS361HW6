var fs = require('fs');
var router = {
            getIssuesbyID:function (user) {
                //Returns issues tied to a User ID
                const dataBuffer = fs.readFileSync("issuedb.json");
				const dataJSON = dataBuffer.toString()
        //console.log(dataJSON);
				const issues = JSON.parse(dataJSON)
                var retIssues = [];
                console.log(typeof retIssues)
				issues.forEach((issue) => {
				if (issue.submitter === user) {
                      console.log(typeof issue)
                      retIssues.push(issue);
                      //Original code from cloned copy
                        // if (retIssues = {}){
                        //     retIssues = issue;
                        //     //console.log(issue);
                        //     }
                        // else {
                        //     retIssues.push(issue);
                        //     //console.log(issue);
                        //
                        // }
					}
				});

                return retIssues;
			},
            getIssueswFilter:function (user,filter) {
                //Returns issues that satisfy the parameters set in filter
            },
            addIssue:function (user,issue) {
                //Create new Issue Ticket with issue data
                 issue= {city: issue.city, state: issue.state, zipcode: issue.zipcode, category: issue.category, urgency: issue.urgency, description: issue.description, submitter: user, id: Math.round(Math.random()*1000000)}

        //Original code from cloned copy
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
    };

module.exports = router
