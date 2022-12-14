import React from 'react';
import {decode as atob, encode as btoa} from 'base-64';

export default class MobidServer1C {

    static username = 'MobiD загрузка';
    static password = '{S?Ok1pu';
    static url = 'https://1c.pivzavoz.ru/pivzavoz_new_eii/hs/pivMobiDD/V1/';
    static urlExec = 'https://1c.pivzavoz.ru/pivzavoz_new_eii/hs/pivHTTP/1S_ExecutorParam/';
    static ok;

    // static username = 'Регламент';
    // static password = '911';
    // static url = 'https://1c.pivzavoz.ru/pivzavoz_sdi/hs/pivMobiDD/V1/';

    static authString = `${unescape(encodeURIComponent(this.username))}:${this.password}`;
    static headers = new Headers();

    static fetch(resource, body) {

        this.headers.set('Authorization', 'Basic ' + btoa(this.authString));
        this.headers.set('Content-Type', 'application/json');
        this.headers.set('Accept', 'application/json');

        return new Promise((result, reject) => {
            body.UserCode = global.user.name;
            body.UserKey = global.user.key;
            // body.Version = '6.1.20';
            fetch(this.url + resource, {method: 'post', headers: this.headers, body: JSON.stringify(body)})
                .then(response => {
                    console.log(response.status);
                    this.ok = response.status === 400 || response.status === 200;
                    return response.text();
                })
                .then(text => {
                    console.log(this.ok);
                    console.log(text);
                    if (this.ok) {
                        result(JSON.parse(text));
                    } else {
                        reject(JSON.parse(text));
                    }
                })
                .catch(err => {
                    console.log('err');
                    console.log(err);
                    reject(err);
                });
        });
    }

    static fetchExec(resource, body) {

        this.headers.set('Authorization', 'Basic ' + btoa(this.authString));
        this.headers.set('Content-Type', 'application/json');
        this.headers.set('Accept', 'application/json');

        return new Promise((result, reject) => {

            fetch(this.urlExec + resource, {method: 'post', headers: this.headers, body: JSON.stringify(body)})
                .then(response => {
                    this.ok = response.ok;
                    return response.text();
                })
                .then(text => {
                    if (this.ok) {
                        result(text);
                    } else {
                        reject(text);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
