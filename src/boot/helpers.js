import { LocalStorage } from 'quasar';

export function getStoreExpiry(key = 'expiry') {
    if(!LocalStorage.has(key)) {
        return getFetchMainData();
    }
    else {
        const expiry = LocalStorage.getItem(key);
        if (new Date().getTime() > expiry) {
            return getFetchMainData();
        }
    }

    return false;
}


export function isset(parent, keyitem, nulled) {
    let keys = keyitem.split('>');

    return keys.forEach(key => {
        if(typeof parent[key] === 'undefined') {
            return nulled;
        }
        else {
            return parent[key];
        }
    });
}


export function getValueByArray(parent, keyitem) {
    if(parent == null) { return []; }
    
    let keys = keyitem.split('>');

    return keys.forEach(key => {
        if(typeof parent[key] === 'undefined') {
            return [];
        }
        else {
            return parent[key];
        }
    });
}


export function apiLogin(url, username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url + '/auth');
    xhr.timeout = 5000;
    xhr.setRequestHeader('accept', 'text/plain');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if(xhr.responseText.indexOf('HTTP Status') < 0 && xhr.responseText.length == 128) { 
                    setWithExpiry('Authorization', 'Bearer ' + xhr.responseText, (1000*60*60*24*28));
                }
                else {
                    localStorage.removeItem('Authorization');
                    console.log(xhr.responseText);
                }
            }
        }
    };
    xhr.onerror = function () {
        localStorage.removeItem('Authorization');
        console.log({ status: this.status, statusText: xhr.statusText });
    };

    xhr.send('username=' + username + '&password=' + password + '&origin=MOBILE');
}

export function setWithExpiry(key, value, ttl) {
	const now = new Date();
	const item = { value: value, expiry: now.getTime() + ttl };
	localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) { return null };

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
}

export function apiRequest(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://stage-api.webtorn.com/?query=' + b64EncodeUnicode(url) + '&token=' + getWithExpiry('Authorization') + '&referer=BAUNETAPP');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if(xhr.responseText.indexOf('WsVwClientsTasks') >= 0) { 
                    let rows = JSON.parse(xhr.responseText)['WsVwClientsTasks'];
                    setWithExpiry('tasksList', rows, (1000*60*5));
                }
                else {
                    console.log(xhr.responseText);
                }
            }
        }        
    };
    xhr.onerror = function () {
        console.log({ status: this.status, statusText: xhr.statusText });
    };

    xhr.send();
}

export function apiSubRequest(url, storagename) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://stage-api.webtorn.com/?query=' + b64EncodeUnicode(url) + '&token=' + getWithExpiry('Authorization') + '&referer=BAUNETAPP');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if(xhr.responseText.indexOf('WsVwClientsTasks' + storagename) >= 0) { 
                    let rows = JSON.parse(xhr.responseText)['WsVwClientsTasks' + storagename];
                    localStorage.setItem(storagename + 'List', JSON.stringify(rows));
                }
                else {
                    console.log(xhr.responseText);
                    localStorage.setItem(storagename + 'List', JSON.stringify([]));
                }
            }
        }        
    };
    xhr.onerror = function () {
        console.log({ status: this.status, statusText: xhr.statusText });
    };

    xhr.send();
}

export function tryParseJSON (json){
    try {
        if (json && typeof json === 'object') {
            return true;
        }
    }
    catch (e) { }

    return false;
};

function b64EncodeUnicode (text){
    return window.btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) { return String.fromCharCode('0x' + p1); }));
}
