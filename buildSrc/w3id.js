
let CERT_PATH = './buildSrc/cert';
let URL, AssertPage,AssertEndpoint;
let app = { get: () => { }, post: () => { } };
let sp_options, sp, idp_options, idp;
let saml2 = require('saml2-js'),
    saml2FJ = require('saml2fj'),
    fs = require('fs');


const setAppURL = (URL) => {
    this.URL = URL;
}

const setAssertPage = (page) => {
    this.AssertPage = page;
}

const setAssertEndpoint = (path) => {
    this.AssertEndpoint = path;
}
const init = (app) => {
    this.app = app;
    sp_options = {
        entity_id: `${this.URL}/metadata.xml`,
        private_key: fs.readFileSync(`${CERT_PATH}/key.pem`).toString(),
        certificate: fs.readFileSync(`${CERT_PATH}/cert.pem`).toString(),
        assert_endpoint: `${this.URL + this.AssertEndpoint}`
    }

    sp = new saml2.ServiceProvider(sp_options);

    idp_options = {
        ///NameIdFormat=Email&PartnerId=*entityID-from-SP-metadata-file*
        
        sso_login_url: `https://w3id.alpha.sso.ibm.com/auth/sps/samlidp/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=${sp_options.entity_id}&NameIdFormat=Email&Target=${this.URL}`,
        certificates: fs.readFileSync(`${CERT_PATH}/w3id.sso.ibm.com`).toString()
    }

    idp = new saml2.IdentityProvider(idp_options);
}


const login = (req, res) => {
    sp.create_login_request_url(idp, {}, (err, login_url, request_id) => {
        if (err != null)
            return res.send(500);
        res.redirect(login_url);
    });
    // res.render('auth.html', {data: {firstName: "Rabah", lastName: "Zeineddine", blueGroups:[{name: "CloudWarrior/Admin"}]}})
}

const assert = (req, res) => {
    let response = req.body.SAMLResponse || req.body.SAMLRequest;
    saml2FJ.toFiltredJSON(response, (data) => {
        res.render(this.AssertPage, { data: data });
    })
}


const metadata = (req, res) => {
    res.type('application/xml');
    res.send(sp.create_metadata());
}

module.exports = {
    setAppURL,
    setAssertPage,
    setAssertEndpoint,
    init,
    login,
    assert,
    metadata
}
