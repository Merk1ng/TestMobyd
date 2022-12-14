import * as firebase from "firebase";
import {Alert, AsyncStorage} from "react-native";

export default class DeamonUpdater {

    static start() {
        if (!global.user)
            return;

        switch (global.user.type) {
            case 1:
                return;
            case 2:
                return;
            case 3:
                return;
        }

        setTimeout(() => {
            this.start();
        }, 90000);
    }

    static retailExchange() {
        this.setInternalOrders();
        this.getInternalOrders();
    }

    static getInternalOrders() {

        let promises = [];
        global.storages.forEach(storage => {
            promises.push(new Promise((resolve, reject) => {
                firebase.database().ref('e/InternalOrders/_' + storage.guid.replace(/[^a-z0-9]/gi, '_')).on('value', (snapshot) => {
                    resolve(snapshot.val());
                });
            }));
        });

        let newArr = [];

        Promise.all(promises).then(results => {
            results.forEach(result => {
                newArr = newArr.concat(result);
            });
            if(!Array.isArray(newArr))
                newArr = [];
            global.internalOrders = newArr;
            AsyncStorage.setItem('internalOrders', JSON.stringify(global.internalOrders));
        })
    }

    static setInternalOrders() {

        let promises = [];

        if (!Array.isArray(global.internalOrdersDraft))
            return;



    }
}