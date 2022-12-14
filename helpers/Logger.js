import React from 'react';
import * as firebase from "firebase";

export default class Logger {

    static log(info, lvl) {
        firebase.database().ref('logs/' + global.user.name).push({t: new Date().toISOString(), i: info});
    }
}
