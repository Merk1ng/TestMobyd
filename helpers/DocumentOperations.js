import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import CommonFunctions from './CommonFunctions';

export default class DocumentOperations {

    static pushToAsyncStorage(key, value) : void {

        AsyncStorage.getItem(key).then(listStr => {

            let listArr = JSON.parse(listStr);
            if (!Array.isArray(listArr)) {
                listArr = [];
            }
            listArr.push(value);
            AsyncStorage.setItem(key, JSON.stringify(listArr)).then(result => {
                console.log(result);
            }).catch(err => {
                console.log(JSON.stringify(err));
            });

        });
    }

    static pushToSendingBuffer(resource, value) {
        AsyncStorage.getItem('SendingBuffer').then(listStr => {
            let listArr = JSON.parse(listStr);
            if (!Array.isArray(listArr)) {
                listArr = [];
            }
            listArr.push({resource: resource, value: value});

            AsyncStorage.setItem('SendingBuffer', JSON.stringify(list));
        });
    }

    static checkBufferToSend() {

    }

    static getDocuments(AsyncStorageKey) {

        return new Promise((onSuccess, onError) => {

        });

    }
}
