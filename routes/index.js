var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var phone = require('phone-regex');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome' });
});
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Sign Up' });
});
router.get('/thanks', function(req, res, next) {
    res.render('thanks', { title: 'Thanks', name: req.body.firstname });
});


router.post('/register', function(req, res, next) {

    req.checkBody("email", "Enter a valid email address.").isEmail();
	req.checkBody("phonenumber", "Enter a proper phone number").matches(/\d{10}/);
	if (phone().test(req.body.phonenumber)){
	// req.checkBody("phonenumber", "Enter a proper phone number").isMobilePhone("en-US");

	
    
    if (req.body.email &&
        req.body.firstname &&
        req.body.lastname) {

        var postData = querystring.stringify({
            'email': req.body.email,
            'firstname': req.body.firstname,
            'lastname': req.body.lastname,
            'favorite_movie': req.body.favoritemovie,
            'hs_searchable_calculated_mobile_number': req.body.phonenumber,
            'hs_context': JSON.stringify({
                "hutk": req.cookies.hubspotutk,
                "ipAddress": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                "pageUrl": "http://www.example.com/myregisterform",
                "pageName": "register test"
            })
        });

        // set the post options, changing out the HUB ID and FORM GUID variables.
        // APIKEY 6c6de0fe-69ce-475e-a91b-1e5a163498bb

        var options = {
            hostname: 'forms.hubspot.com',
            path: '/uploads/form/v2/4042858/e92b6899-6d19-4b2f-a6bd-0bae2c644c37',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }

        // set up the request

        var request = https.request(options, function(response) {
            console.log("Status: " + response.statusCode);
            console.log("Headers: " + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                console.log('Body: ' + chunk)
            });
        });

        request.on('error', function(e) {
            console.log("Problem with request " + e.message)
        });

        // post the data

        request.write(postData);
        res.redirect('/thanks');
        request.end();

       }
       else{

       }
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

module.exports = router;