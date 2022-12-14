import {Icon} from "react-native-elements";
import React from "react";
import {Alert} from 'react-native';

export default class CommonFunctions {

    static getStringDate(date) {

        let d = new Date(date);

        if (isNaN(d.valueOf())) {
            return "invalid date";
        }

        let month = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        let days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        

        return days[d.getDay()] + ', ' + d.getDate() + ' ' + month[d.getMonth()] + " ";
    }

    static getMoneyRUR(value) {
        return Number.parseFloat(value).toFixed(2) + '₽';
    }

    static getMoney(value) {
        return Number.parseFloat(value).toFixed(2).toString().replace(".", ",");
    }

    static getStringDateddMMMM(date) {

        let d = new Date(date);

        if (isNaN(d.valueOf())) {
            return "invalid date";
        }

        let month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

        return d.getDate() + ' ' + month[d.getMonth()];
    }

    static getDocumentID(prefix) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return prefix + text + new Date().getTime().toString().substring(6, 10);
    }

    static getDocIcon(doc) {

        let color = doc.comment === 'Тест МобиД' ? '#4a4' : '#777';
        let name;

        switch (doc.status) {
            case 'draft':
                name = "file-outline";
                break;
            case 'new':
                name = "file-check";
                break;
            case 'В пути':
                name = "truck-fast";
                break;
            case 'Обрабатывается':
                name = "progress-clock";
                break;
            case 'Принят':
                name = "check-outline";
                break;
            default :
                name = "progress-clock";
                break;
        }

        return (
            <Icon
                type='material-community'
                name={name}
                color={color}
            />
        );
    }

    static getReference(obj, array) {

        if (!Array.isArray(array))
            return null;

        if (!obj)
            return array[0];

        return array.find(el => {
            return el.id === obj.id;
        });
    }

    static getReferenceByID(obj, array) {
        return this.getReference();
    }

    static getNodeFromGuid(guid) {
        return '_' + guid.replace(/[^a-z0-9]/gi, '_')
    }

    static getNavigationOptions(title, iconName, iconType = 'material') {
        return {
            title: title,
            drawerIcon:
                <Icon
                    name={iconName}
                    type={iconType}
                />
        };
    }

    static getArrayLength(array) {
        if(!Array.isArray(array)) {
            return 0;
        }
        return array.length;
    }

    static showAlert(title, err) {
        Alert.alert(title, err);
    }

    static getReferenceOnSupplier(obj, array) {

        if (!Array.isArray(array))
            return null;

        if (!obj)
            return array[0];

        return array.find(el => {
            return el.guid === obj.guid;
        });
    }

}
