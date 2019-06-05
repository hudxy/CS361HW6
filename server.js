
var express = require('express');
var bodyParser = require("body-parser");
var session = require('express-session');
var authenticator = require('./authenticator');
var router = require('./router');
var fs = require('fs');
const path = require('path')

var app = express();
app.use(session({secret:'SuperSecretPassword'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defnie paths
const viewsPath = path.join(__dirname, '/templates');

// Set up hbs and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.set('port', 8555);


//Funtion that returns true if a valid session is not active.
function notloggedin(req){
	return (!req.session.user);
}

//Home page-----------------------------------------------
app.get('/',function(req,res,next){
	if(notloggedin(req)){
		res.render('home');
	}
    else {
      //context.name = authenticator.getUserName(req.session.user.login);
	res.render('success', req.session.user);
    }

  });

//signin---------------------------------------------------
//signin Page
app.get('/signin',function(req,res,next){
		res.render('signin');
  });

//signin Request
app.post('/signin',function(req,res,next){
		req.session.user = authenticator.getID(req.body.login, req.body.pw);
        if (req.session.user == 0){
            req.session.destroy();
			res.render('signin');
		}
        else {
        console.log(req.session.user);
        res.render('success', req.session.user)
        }
  });

  //Create Page
  app.get('/signup',function(req,res,next){
		res.render('signup');
  });

  //Create Request
app.post('/addUser',function(req,res,next){
		req.session.user = authenticator.assignID(req.body.login, req.body.name, req.body.pw);
		if (req.session.user == 0){
            req.session.destroy();
			res.render('signin');
		}
        else {
		//context.name = authenticator.getUserName(req.session.user.login);
		  res.render('success', req.session.user);
        }
  });

 //Logout
    app.get('/logout',function(req,res,next){
		req.session.user.login = 0;
        req.session.destroy();
		res.render('home');
  });

 //Change Password---------------------------------------------------
 //Change Password page
 //app.get('/resetPassword',function(req,res,next){
//		res.render('changepassword');
  //});

//Change password request
app.post('/resetPassword',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
        else {
		authenticator.changePassword(req.session.user.login,req.body.oldPW,req.body.newPW);
		res.render('success', req.session.user);
        }
  });

  //View Issues-----------------------------------------------------
  //MY Issues page
 app.get('/userissues',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
        else {
					var context = router.getIssuesbyUser(req.session.user.login);
					res.render('myissues', context)
        }

  });


  //Filtered Issues (filter can be NULL)
 app.post('/filter',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
    else {
			console.log("req.body.category", typeof(req.body.category))
			let categoryArr;
			if (typeof(req.body.category) === 'string') {
				categoryArr = [req.body.category]
			}
			else {
				categoryArr = req.body.category

			}
			context = router.getIssueswFilter(req.session.user.login, categoryArr);
			res.render('myissues',context)
    }

  });

    //Change Issues-----------------------------------------------------
		//Get report form page
		app.get('/addissue',function(req,res,next){
			if (notloggedin(req)){
				res.render('signin');
			}
	     else  {
	    //     req.session.user={ login: 'doddc', name: 'doddco2', pw: 't' }
			// router.addIssue(req.session.user.login, req.body);
			// context = router.getIssuesbyUser(req.session.user.login);
			res.render('issueform', req.session.user);
	     }
	  });
		//Redirect Home after successful report submission
		app.get('/redirecthome',function(req,res,next){
			if (notloggedin(req)){
				res.render('signin');
			} else  {
			res.render('success', req.session.user);
	     }
	  });
  //Submit New Issue
  app.post('/addissue',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
     else  {
        //req.session.user={ login: 'doddc', name: 'doddco2', pw: 't' }
		router.addIssue(req.session.user.login, req.body);
		//context = router.getIssuesbyUser(req.session.user.login);
		var context = req.body;
		res.render('issuesuccess', context);
     }
  });

  //Update Issue
  app.post('/updateissue',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
      else {
		router.updateIssue(req.session.user.login, req.body);
		context = router.getIssuesbyUser(req.session.user.login);
		res.render('myissues',context)
      }
  });

	//Resolve Issue
    app.post('/resolveissue',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
        else {
		router.resolveIssue(req.session.user.login, req.body);
		context = router.getIssuesbyUser(req.session.user.login);
		res.render('myissues',context)
        }
  });

 //Watchlist-----------------------------------------------------

  //MY Issues page
 app.get('/watchlist',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
        else {
		context = authenticator.getWatchlist(req.session.user.login);
		res.render('watchlist',context)
        }	
  });
  

app.post('/addwatch',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
        else {
        console.log(req.session.user.login, req.body.id)  
        authenticator.addWatchlist(req.session.user.login, req.body.id);    
		context = authenticator.getWatchlist(req.session.user.login);
		  res.render('watchlist', req.session.user);
        }
  });

app.post('/removewatch',function(req,res,next){
		if (notloggedin(req)){
			res.render('signin');
		}
        else {
        authenticator.removeWatchlist(req.session.user.login, req.body.id);    
		context = authenticator.getWatchlist(req.session.user.login);
		  res.render('watchlist', req.session.user);
        }
  });

//Not found and Error handling (from activity)
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
