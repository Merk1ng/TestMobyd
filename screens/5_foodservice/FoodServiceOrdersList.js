import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    FlatList
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {Icon, ListItem} from "react-native-elements";
import * as firebase from "firebase";
import CommonFunctions from "../../helpers/CommonFunctions";
import Fab from "../../components/Fab";

export class FoodServiceOrdersList extends Component {

    static navigationOptions = {
        title: 'Заказы на склад',
        drawerIcon:
            <Icon
                name='parachute'
                type='material-community'
            />
    };

    timerID;

    constructor(props) {
        super(props);

        if (!Array.isArray(global.internalOrdersDraft))
            global.internalOrdersDraft = [];
        if (!Array.isArray(global.internalOrders))
            global.internalOrders = [];

        this.state = {list: global.internalOrdersDraft.concat(global.internalOrders)};


    }

    refreshItems() {

            if (!Array.isArray(global.internalOrdersDraft))
                global.internalOrdersDraft = [];
            if (!Array.isArray(global.internalOrders))
                global.internalOrders = [];
            this.setState({list: global.internalOrdersDraft.concat(global.internalOrders)});

    }

    static getIcon(item) {
        let color = item.comment === 'Тест МобиД' ? '#595' : '#777';

        switch (item.status) {
            case 'draft':
                return (
                    <Icon
                        name="file-outline"
                        type='material-community'
                        color={color}
                    />
                );
            case 'new':
                return (
                    <Icon
                        name="file-check"
                        type='material-community'
                        color={color}
                    />
                );
            case 'В пути':
                return (
                    <Icon
                        type='material-community'
                        name={"truck-fast"}
                        color={color}
                    />
                );
            case 'Обрабатывается':
                return (
                    <Icon
                        type='material-community'
                        name={"progress-clock"}
                        color={color}
                    />
                );
            case 'Принят':
                return (
                    <Icon
                        type='material-community'
                        name={"check-outline"}
                        color={color}
                    />
                );
            default :
                return (
                    <Icon
                        type='material-community'
                        name={"truck-fast"}
                        color={color}
                    />
                );
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => this.startTimer());
        this.props.navigation.addListener('didBlur', () => this.stopTimer());
        this.refreshItems();
    }

    refresh() {

            let promises = [];

            if (!global.storages || !Array.isArray(global.storages))
                return;

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

                global.internalOrders = newArr;
                AsyncStorage.setItem('internalOrders', JSON.stringify(global.internalOrders));
            });

            firebase.database().ref('i/' + global.user.name + '/InternalOrders').on('value', (snapshot) => {
                let docs = snapshot.val();

                let newDrafts = [];
                global.internalOrdersDraft.forEach(draft => {
                    if (draft.status === 'draft' || (docs && docs[draft.id] && draft.id === docs[draft.id].id)) {
                        newDrafts.push(draft);
                    }
                });

                global.internalOrdersDraft = newDrafts;
                AsyncStorage.setItem('internalOrdersDraft', JSON.stringify(global.internalOrdersDraft));
            });

    }

    startTimer() {

        this.refresh();
        this.refreshItems();

    }

    stopTimer() {

    }

    renderItem(rowData) {
        if (!rowData.item) {
            return (
                <Text>Нет данных</Text>
            );
        }

        return (
            <ListItem
                pad={20}
                leftIcon={FoodServiceOrdersList.getIcon(rowData.item)}
                badge={{
                    value: rowData.item.items.length,
                    textStyle: {color: 'white'},
                    containerStyle: {width: 30}
                }}
                key={rowData.item.id}
                title={CommonFunctions.getStringDate(rowData.item.date)}
                subtitle={rowData.item.status === 'new' ? 'Новый, отправлен' : rowData.item.status === 'draft' ? 'Новый, не отправлен' : rowData.item.status + ", " + rowData.item.id}
                rightSubtitle={rowData.item.automatic ? "Aвто" : ""}
                onPress={() => this.props.navigation.navigate('InternalOrderDetails', {document: rowData.item})}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="menu"
                    title="Заказы на склад"
                    leftIconAction={() => {
                        this.props.navigation.openDrawer();
                    }}
                />

                <FlatList extraData={this.state.refreshItems}
                          data={this.state.list}
                          renderItem={rowData => this.renderItem(rowData)}
                          keyExtractor={(rowData, index) => index.toString()}
                />
                <Fab
                    action={() => {
                        this.props.navigation.navigate('InternalOrderDetails', {document: null})
                    }}
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
    indicator: {
        margin: 40,
        color: '#999'
    }
});

export default FoodServiceOrdersList;
