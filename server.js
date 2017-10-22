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





app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`Server starting on ${app.get('port')} `);
})