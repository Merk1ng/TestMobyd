import React, {Component} from 'react';
import {StyleSheet, FlatList, View, TextInput, Text} from 'react-native';
import AppHeader from '../components/AppHeader';
import {Icon, ListItem} from 'react-native-elements';
import CommonFunctions from '../helpers/CommonFunctions';
import Fab from '../components/Fab';
import AsyncStorage from '@react-native-community/async-storage';
import Logger from '../helpers/Logger';
import Dialog, {DialogButton, DialogContent, DialogFooter, DialogTitle} from 'react-native-popup-dialog';
import {DropdownPicker} from '../components/DropdownPicker';

export class DocumentList extends Component {

    /*
    * Параметры ссылки в sidebar-меню.
    * 1. Надпись,
    * 2. Имя иконки в коллекции,
    * 3. Имя коллекции иконок. По умолчанию - 'material'. Также доступны 'font-awesome', 'octicon', 'ionicon' и др.
    *
    * Подробнее об иконках:
    * https://react-native-elements.github.io/react-native-elements/docs/icon.html
    *
    * */
    static navigationOptions = CommonFunctions.getNavigationOptions('Document list example', 'list', 'material-community');

    ASYNC_STORAGE_KEY = 'Documents_Default';        // По этому ключу из AsyncStorage загружается список документов
    TITLE = 'Documents List Example';
    DOCUMENT_DETAILS_SCREEN = 'InventoryDetails';   // Ключ в стеке навигации. Стек определяется в App.js
    FILTER_FIELDS = null;

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            dialog_filter: false,
        };
        this.props.navigation.addListener('willFocus', () => this._willFocus());
    }

    _willFocus() {
        Promise.all([
            AsyncStorage.getItem(this.ASYNC_STORAGE_KEY + '_Local'),
            AsyncStorage.getItem(this.ASYNC_STORAGE_KEY),
        ]).then(results => {
            let data_0 = JSON.parse(results[0]) || [];
            let data_1 = JSON.parse(results[1]) || [];
            this.setState({list: data_1.concat(data_0)});
        }).catch(error => {
            Logger.log(JSON.stringify(error));
        });
    }

    // Стрелочные функции не стоит использовать в методе render(). Связано с оптимальным расходованием памяти.

    keyExtractor = (rowData, index) => index.toString();

    onPressItem = (item) => () => this.props.navigation.navigate(this.DOCUMENT_DETAILS_SCREEN, {document: item});

    onLongPressItem = (item) => () => console.log('long press');

    renderItem = (rowData) => {

        let item = rowData.item;

        /* тут надо вкрутить проверок... */

        return (

            // Документация по ListItem: https://react-native-elements.github.io/react-native-elements/docs/listitem.html

            <ListItem
                title={'Document Example №' + item.id}
                subtitle={'Lorem ipsum dolor sit amet'}
            />
        );
    };

    getHeader() {
        return (
            <AppHeader
                navigation={this.props.navigation}
                leftIcon="menu"
                title={this.TITLE}
                leftIconAction={this.props.navigation.openDrawer}
                rightIcon={this.FILTER_FIELDS ?
                    <Icon
                        name='filter-outline'
                        size={28}
                        color={'#f0f0ff'}
                        type={'material-community'}
                    /> : null
                }
                rightIconAction={() => this.onClickFilterIcon()}
            />
        );
    }

    confirmFilterFunction() {

    }

    updateFilter() {
        this.state.list;
    }

    getDialogFilter() {
        return (
            <Dialog
                width={0.9}
                visible={this.state.dialog_filter}
                onTouchOutside={() => {
                    this.setState({dialog_filter: false});
                }}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>

                        <DialogButton
                            text="Cancel"
                            onPress={() => {
                                this.setState({dialog_filter: false});
                            }}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => {
                                this.confirmFilterFunction();
                            }}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title={'Настройка списка'}
                />
                <DialogContent>

                </DialogContent>
            </Dialog>
        );
    }

    render() {
        return (
            <View style={styles.container}>

                {this.getHeader()}

                <FlatList
                    data={this.state.list}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />

                {this.getDialogFilter()}

                <Fab
                    stack={this.props.navigation}
                    screen={this.DOCUMENT_DETAILS_SCREEN}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

export default DocumentList;
