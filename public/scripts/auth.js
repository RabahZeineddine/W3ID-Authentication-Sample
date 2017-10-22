var USER = JSON.parse(document.getElementById('user').value);

function checkBlueGroup() {
    var authenticated = false;

    xhrPost('/api/v1/authenticate', USER, (result) => {
        if (result.authenticated) {
            setSession("w3id", result.user);
            window.location.href = result.redirect;
        } else {
            deleteSession("w3id");
            alert("User not authenticated!");
            window.location.href = result.redirect;
        }
    }, (error) => {
        deleteSession("w3id");
        alert("User not authenticated!");
        window.location.href = '/';
    })
}


checkBlueGroup();