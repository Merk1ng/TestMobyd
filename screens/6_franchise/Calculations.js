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
import SupplierGoodsPicker from '../../components/SupplierGoodsPicker';
import {RetailComment} from '../../components/RetailComment';
import CommonFunctions from '../../helpers/CommonFunctions';
import Dialog, {
    DialogButton,
    DialogContent,
    DialogFooter,
    DialogTitle,
    SlideAnimation,
} from 'react-native-popup-dialog';
import * as firebase from 'firebase';
import {CategoryPicker} from '../../components/CategoryPicker';
import InventoryGoodsPicker from '../3_retail/components/InventoryGoodsPicker';
import MobidServer1C from '../../helpers/MobidServer1C';
import DocumentOperations from '../../helpers/DocumentOperations';
import DocumentDetails from '../../prototypes/DocumentDetails';
import {DialogProcess} from '../../components/DialogProcess';
import {CheckBox, ListItem} from 'react-native-elements';
import {DatePicker} from '../../components/DatePicker';
import FranchGoodsPicker from '../../components/FranchGoodsPicker';
import Education from './Education';
import {DropdownPicker} from '../../components/DropdownPicker';

export class Calculations extends React.Component {

    static _Title = 'Взаиморасчеты';
    listAll = [];
    static navigationOptions = CommonFunctions.getNavigationOptions(Calculations._Title, 'calculator', 'material-community');

    reference = firebase.database().ref('calculations/' + global.user.name);
    paymentTypes = [{name: 'Наличный', Casheless: false}, {name: 'Безналичный', Casheless: true}];

    goBack = () => this.props.navigation.navigate('HomeScreen');

    constructor(props) {
        super(props);
        this.state = {list: [], paymentType: this.paymentTypes[0], loading: true};
        this.props.navigation.addListener('willFocus', () => this.willFocus());
    }

    willFocus() {
        this.reference.on('value', (snapshot) => {
            this.listAll = snapshot.val();
            console.log(this.listAll);
            this.setPaymentType(this.state.paymentType);
        });
    }

    renderItem = (rowData) => {
        let item = rowData.item;
        return (
            <ListItem
                containerStyle={styles.itemContainer}
                title={CommonFunctions.getStringDateddMMMM(item.date)}
                subtitle={
                    <View>
                        <Text>Приход</Text>
                        <Text>Расход</Text>
                        <Text style={styles.totalLabel}>Итог</Text>
                    </View>
                }
                rightSubtitle={
                    <View>
                        <Text style={styles.sum}>{CommonFunctions.getMoney(item.MoneyIn)}</Text>
                        <Text style={styles.sum}>{CommonFunctions.getMoney(item.MoneyOut)}</Text>
                        <Text style={styles.totalSum}>{CommonFunctions.getMoney(item.Total)}</Text>
                    </View>
                }
                rightTitle={
                    <View><Text></Text></View>
                }
            />
        );
    };

    setPaymentType(value) {
        console.log(this.state.paymentType);
        this.setState({
            paymentType: value,
            list: this.listAll.filter(item => {
                return item.Casheless === value.Casheless;
            }),
        });
    };

    render() {
        return (
            <View>
                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="menu"
                    title={Calculations._Title}
                    leftIconAction={this.props.navigation.openDrawer}
                />
                <DropdownPicker
                    title={'Вид расчетов'}
                    items={this.paymentTypes}
                    value={this.state.paymentType}
                    onChange={(value) => this.setPaymentType(value)}
                />

                <FlatList
                    style={styles.flatListStyle}
                    data={this.state.list}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />
                <ActivityIndicator size="large" color="#0000ff" style={styles.indicator}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalSum: {
        fontWeight: 'bold',
        textAlign: 'right',
    },
    itemContainer: {
        borderBottomColor: '#eee',
        borderBottomWidth: 0.5,
    },
    sum: {
        textAlign: 'right',
    },
    flatListStyle: {
        marginBottom: 140,
    },

});

export default Calculations;
