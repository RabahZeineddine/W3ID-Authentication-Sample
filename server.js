/**
 * @file application server file.
 * @author Rabah Zeineddine
 */

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let path = require('path');
let routes = require('./buildSrc/routes');

let w3id = require('./buildSrc/w3id');


app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);


/* W3ID app configurations */
w3id.setAppURL("https://w3id.localtunnel.me");
w3id.setAssertPage("auth.html");
w3id.setAssertEndpoint("/assert");
w3id.init(app);

// Starting point for login
app.get("/login", w3id.login);

// Assert endpoint for when login completes
app.post("/assert", w3id.assert);

app.get('/metadata.xml', w3id.metadata);

// Use your own strategy to authenticate a user, we are going to use BlueGroup.
app.post('/api/v1/authenticate', (req, res) => {
    let user = req.body;
    let authenticated = false;
    for(let bluegroup of user.blueGroups){
        if(bluegroup.name == "W3ID Sample") { // You can choose whatever you want, as long as you add your users to that bluegroup.
            authenticated = true;
            break;
        }
    }

    if(authenticated){
        res.status(200).json({authenticated, redirect: '/home'});
    }else{
        res.status(403).json({authenticated, redirect: '/'});
    }


});


app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`Server starting on ${app.get('port')} `);
})