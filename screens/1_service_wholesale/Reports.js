import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    Text,
    Alert,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Dimensions, BackHandler,
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import AppHeader from '../../components/AppHeader';
import CommonFunctions from '../../helpers/CommonFunctions';
import DocumentDetails from '../../prototypes/DocumentDetails';
import MobidServer1C from '../../helpers/MobidServer1C';

export class Reports extends React.Component {

    static navigationOptions = CommonFunctions.getNavigationOptions('Отчеты', 'show-chart');

    TITLE = 'Отчет';
    LIST_SCREEN = 'HomeScreen';
    DEF_STATE = {
        data: [],
    };

    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('document') || this.DEF_STATE;
        this.props.navigation.addListener('willFocus', () => this._willFocus());
        this.props.navigation.addListener('didBlur', () => this._didBlur());
    }

    _willFocus() {
        let params = {
            UserCode: global.user.name,
            UserKey: global.user.key,
        };

        console.log(params);
        MobidServer1C.fetch('GetTechnikReport', params)
            .then((data) => {
                this.setState({data: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error.toString());
            });
    }

    _didBlur() {
        BackHandler.removeEventListener('hardwareBackPress', this._goBack);
    }

    _goBack = () => {
        if (this.state.hasChange) {
            this.setState({dialog_save: true});
            return true;
        }
        this.props.navigation.navigate(this.LIST_SCREEN);
        return true;
    };

    renderItem_0 = rowData => {
        let item = rowData.item;

        return (
            <View>
                <ListItem
                    pad={20}
                    key={item.name}
                    title={item.name}
                    rightTitle={item.sum}
                    bottomDivider
                    containerStyle={styles.item_0_container}
                    titleStyle={styles.item_0_title}
                    rightTitleStyle={styles.item_0_title}
                />
                <FlatList
                    data={item.data}
                    renderItem={this.renderItem_1}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        );
    };

    renderItem_1 = rowData => {
        let item = rowData.item;

        return (
            <View>
                <ListItem
                    pad={20}
                    key={item.name}
                    title={item.name}
                    rightTitle={item.sum}
                    containerStyle={styles.item_1_container}
                    titleStyle={styles.item_1_title}
                    rightTitleStyle={styles.item_1_title}
                />
                <FlatList
                    data={item.data}
                    renderItem={this.renderItem_2}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        );
    };

    renderItem_2 = rowData => {
        let item = rowData.item;

        return (
            <View>
                <ListItem
                    pad={20}
                    key={item.order}
                    title={item.order}
                    rightTitle={item.sum}
                    containerStyle={styles.item_2_container}
                    titleStyle={styles.item_2_title}
                    rightTitleStyle={styles.item_2_title}
                />
                <FlatList
                    data={item.items}
                    renderItem={this.renderItem_3}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        );
    };

    renderItem_3 = rowData => {
        let item = rowData.item;

        return (
            <View>
                <ListItem
                    pad={20}
                    key={item.name}
                    title={item.name}
                    rightTitle={item.sum}
                    containerStyle={styles.item_3_container}
                    titleStyle={styles.item_3_title}
                    rightTitleStyle={styles.item_3_title}
                />
            </View>
        );
    };

    render() {
        return (
            <View>
                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="arrow-back"
                    rightIcon={'done'}
                    title={this.TITLE}
                    leftIconAction={this._goBack}
                    rightIconAction={this._save}
                />
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem_0}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item_0_container: {
        height: 40,
        padding: 5,
        backgroundColor: '#ccc',
    },
    item_0_title: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    item_1_container: {
        height: 40,
        paddingRight: 5,
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 15,
        backgroundColor: '#dfdfdf',
    },
    item_1_title: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    item_2_container: {
        height: 40,
        paddingRight: 5,
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 25,
        backgroundColor: '#f0f0f0',
    },
    item_2_title: {
        fontSize: 13,
    },
    item_3_container: {
        height: 40,
        paddingRight: 5,
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 35,
        backgroundColor: '#fff',
    },
    item_3_title: {
        fontSize: 11,
    },
});

export default Reports;
