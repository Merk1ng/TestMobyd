import React, {Component} from 'react';
import CommonFunctions from '../../helpers/CommonFunctions';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
//import {VersionController} from '../../helpers/VersionController';
import AppHeader from '../../components/AppHeader';

export class Main extends Component {

    static navigationOptions = CommonFunctions.getNavigationOptions('Главная', 'home', 'font-awesome');

    constructor(props) {
        super(props);
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
                <View style={styles.retailView}>
                    <Button
                        buttonStyle={styles.retailButton}
                        titleStyle={{fontSize: 14}}
                        title="Заказ на склад"
                        type="outline"
                        icon={{name: 'add', color: '#2089dc'}}
                        onPress={() => {
                            this.props.navigation.navigate('InternalOrderDetails', {document: null, previousScreen: 'HomeScreen'});
                        }}
                    />
                    
                </View>
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


export default Main;

//<Button
//buttonStyle={styles.retailButton}
//titleStyle={{fontSize: 14}}
//title="Заказ поставщику"
//type="outline"
//icon={{name: 'add', color: '#2089dc'}}
//onPress={() => {
  //  this.props.navigation.navigate('ExternalOrderDetails', {document: null, previousScreen: 'HomeScreen'});
//}}
///>

// 20 строка для обновления <VersionController/>