import React, {Component} from 'react';
import {ScrollView, Alert, View, StyleSheet, Text, StatusBar, Linking, Dimensions, FlatList} from 'react-native';
import AppHeader from '../components/AppHeader';
import RetailTechnicList from './4_service_retail/RetailTechnicList';
import Logger from '../helpers/Logger';
//import {VersionController} from '../helpers/VersionController';
import CommonFunctions from '../helpers/CommonFunctions';
import {FranchOrders} from '../components/FranchOrderList';
import Main from './3_retail/Main';

export class Home extends Component {

    static navigationOptions = CommonFunctions.getNavigationOptions('Главная', 'home', 'font-awesome');

    constructor(props) {
        super(props);
        Logger.log('app is started');
    }

    getHomeContent() {

        switch (global.user.type) {
            case 1:

            case 2:

            case 3:
                return <Main/>;
            case 4:

            case 6:
                return (
                    <View style={styles.container}>
                        <FranchOrders
                            navigation={this.props.navigation}
                        />
                    </View>
                );
        }
    }

    render() {
        return (
            <View style={styles.container}>


                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="menu"
                    rightIcon={global.user.type !== 3 && global.user.type !== 6 ? 'add' : null}
                    title="Главная"
                    leftIconAction={this.props.navigation.openDrawer}
                    rightIconAction={() => this.props.navigation.navigate('DetailsScreen', {document: null})}
                />

                {this.getHomeContent()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    retailView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 7,
        justifyContent: 'space-around',
        fontSize: 10,
    },
    retailButton: {
        width: Dimensions.get('window').width * 0.45,
        height: 60,
    },
});

export default Home;
