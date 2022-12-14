import React from 'react';
import {AsyncStorage, Alert, FlatList, View, StyleSheet} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import CommonFunctions from '../helpers/CommonFunctions';
import * as firebase from 'firebase';
import Fab from './Fab';

export class FranchOrders extends React.Component {
    ordersRef = firebase.database().ref('e/FranchOrders/' + global.user.name);
    ordersIRef = firebase.database().ref('franch/' + global.user.name);
    list1C = [];
    listMD = [];
    DOCUMENT_DETAILS_SCREEN = 'FranchOrderDetails';
    EMPTY_DOCUMENT = {
        id: CommonFunctions.getDocumentID('FO'),
        date: new Date(),
        shipment_date: new Date(),
        sum: 0,
        items: [],
    };

    constructor(props) {
        super(props);
        this.state = {list: [], listI: []};
        this.props.navigation.addListener('willFocus', () => this.willFocus());
    }

    willFocus() {

        this.EMPTY_DOCUMENT.id = CommonFunctions.getDocumentID('FO');
        this.EMPTY_DOCUMENT.date = new Date();

        this.ordersRef.on('value', (snapshot) => {
            let val = snapshot.val();
            this.list1C = Array.isArray(val) ? val : [];
            this.setState({list: this.listMD.concat(this.list1C)});
        });

        this.ordersIRef.on('value', (snapshot) => {
            let val = snapshot.val();
            this.listMD = [];
            Object.keys(val).forEach(key => {
                this.listMD.push(val[key]);
            });
            this.setState({list: this.listMD.concat(this.list1C)});
        });
    }

    getPreview = (items) => () => {
        let str = '';
        if (!items) {
            return '';
        }

        for (let i = 0; i < items.length && i < 5; i++) {
            if (items[i].name) {
                str += items[i].name + '\n';
            }
        }

        return <Text style={{fontStyle: 'italic'}}>{str}</Text>;
    };

    onPressItem = (item) => () => this.props.navigation.navigate(this.DOCUMENT_DETAILS_SCREEN, {document: item});

    renderItem = (rowData) => {

        let item = rowData.item;

        return (
            <ListItem
                title={
                    <ListItem
                        containerStyle={styles.containerStyle}
                        titleStyle={styles.titleStyle}
                        rightTitleStyle={styles.rightTitleStyle}
                        title={CommonFunctions.getStringDate(item.date) + '\n' + (item.id.indexOf('FO') > -1 ? 'В обработке' : '№' + item.id)}
                        rightTitle={Number.parseFloat(item.sum).toFixed(2) + '₽' + (item.cashless ? '\n' + 'Безнал' : '') + (item.pickup ? '\n' + 'Самовывоз' : '')}
                    />
                }
                topDivider={true}
                // subtitle={this.getPreview(item.items)}
                onPress={this.onPressItem(item)}
            />
        );
    };

    render() {
        return (
            <View style={styles.container}>

                <FlatList
                    data={this.state.list}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />

                <Fab
                    stack={this.props.navigation}
                    screen={'FranchOrderDetails'}
                    document={this.EMPTY_DOCUMENT}
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
    titleStyle: {
        margin: 0,
        padding: 0,
    },
    rightTitleStyle: {
        textAlign: 'right',
        margin: 0,
        padding: 0
    },
    containerStyle: {
        padding: 0,
    },
});
