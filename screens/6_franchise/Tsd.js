import React from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    ScrollView,
    Picker,
    Text,
    ActivityIndicator,
    View,
    FlatList, TouchableOpacity, Dimensions, TextInput,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import CommonFunctions from '../../helpers/CommonFunctions';
import {Button} from 'react-native-elements';
import Fab from '../../components/Fab';
import TSDScanner from '../../components/TSDScanner';


export class Tsd extends React.Component {

    static _Title = 'ТСД';

    static navigationOptions = CommonFunctions.getNavigationOptions(this._Title, 'barcode', 'material-community');

    goBack = () => this.props.navigation.navigate('HomeScreen');

    constructor(props) {
        super(props);

        this.state = {
            scannerVisible: false,
            items: [],
        };

        this.props.navigation.addListener('willFocus', () => this.willFocus());
    }

    willFocus() {

    }

    openScanner = () => {
        this.setState({scannerVisible: true});
    };

    add(val) {

        console.log(val);

        let good = this.findGoodByBarcode(val);

        console.log(good);

        if (!good) {
            return;
        }

        let finded = false;

        console.log('start finding...');

        this.state.items.forEach(item => {
            if (item.id === good.id) {
                finded = true;
            }
        });

        if (finded) {
            return;
        }

        console.log(this.state.items);
        let newServ = this.state.items.slice();


        let a = newServ.push(good);
        this.setState({items: a});
    };

    findGoodByBarcode(barcodes) {

        if (!Array.isArray(barcodes)) {
            return null;
        }

        let first = barcodes[0];

        let finded = global.barcodes.find(current => {
            return current.bc === first.data;
        });

        return CommonFunctions.getReferenceByID(finded, global.goods);

    }

    renderGoodItem = itemRow => {

        return (
            <TouchableOpacity
                style={{flexDirection: 'row', backgroundColor: '#fff'}}
                onPress={() => {

                }}
                onLongPress={() => {

                }}
            >
                <Text numberOfLines={2} style={styles.item33}>{itemRow.item.name}</Text>

            </TouchableOpacity>
        );
    };

    render() {
        return (
            <ScrollView
                style={styles.container}>
                <AppHeader
                    navigation={this.props.navigation}
                    title={Tsd._Title}
                    leftIcon="menu"
                    leftIconAction={this.props.navigation.openDrawer}
                    rightIcon={'add'}
                    rightIconAction={this.openScanner}
                />

                <FlatList
                    style={{backgroundColor: '#fff'}}
                    data={this.state.items}
                    renderItem={this.renderGoodItem}
                />

                <TSDScanner
                    visible={this.state.scannerVisible}
                    onCancel={() => this.setState({scannerVisible: false})}
                    onChange={(val) => this.add(val)}
                />

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0FF',
    },
});

export default Tsd;
