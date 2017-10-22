/**
 * @file This file contains methods to make HTTP requests using Get or POST, 
 * also some methods to manipulate the local session and saves local informations
 * @author Rabah Zeineddine
 */

//utilities
function createXHR () {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) { }
        }
    }
    return null;
}


/**
 * Make GET Request
 * @param {String} url the endpoint URL
 * @param {Function} callback a callback function is called when the response status is 200
 * @param {Function} errback  a callback function is called when an error occur.
 */
const xhrGet = (url, callback, errback) => {
    var xhr = new createXHR();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(parseJson(xhr.responseText));
            } else {
                errback('service not available');
            }
        }
    };

    xhr.timeout = 100000;
    xhr.ontimeout = errback;
    xhr.send();
}


/**
 * Make POST Request
 * @param {String} url the endpoint URL
 * @param {Object} data the body content you need to send to the endpoind
 * @param {Function} callback a callback function is called when the response status is 200
 * @param {Function} errback  a callback function is called when an error occur.
 */
const xhrPost = (url, data, callback, errback) => {
    var xhr = new createXHR();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                errback(JSON.parse(xhr.responseText));
            }
        }
    };
    // xhr.onerror = errback();
    xhr.timeout = 5000;
    xhr.ontimeout = errback;
    xhr.send(JSON.stringify(data));
}


const setSession = (name, value) => {
    if (typeof (Storage) !== "undefined") {
        sessionStorage.setItem(name, JSON.stringify(value));
    }
    else {
        setCookie(name, JSON.stringify(value));
    }
}



const setCookie = (cname, cvalue) => {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


const getSession = (name) => {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        return JSON.parse(sessionStorage.getItem(name));
    }
    else {
        // Sorry! No Web Storage support.. use cookie instead..
        return JSON.parse(getCookie(name));
    }
}

const sessionCheck = (name) => {

    if (typeof (Storage) !== "undefined") {
        if (sessionStorage.getItem(name)) {
            return true;
        }
        return false;
        // return sessionStorage.user != null && sessionStorage.user != '' && sessionStorage.user !== "undefined";
    }
    else {
        //No storage , use cookie..
        return checkCookie(name);
    }
}

const getCookie = (cname) => {
    name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";

}

const checkCookie = (cname) => {
    var username = getCookie(cname);

    if (username != "" && username != null) {
        return true;
    }
    else {
        return false;
    }
}

const deleteSession = (name) => {
    if (typeof (Storage) !== "undefined") {
        sessionStorage.removeItem(name);
    }
    else {
        deleteCookie(name);
    }
}


const deleteCookie = (cname) => {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
