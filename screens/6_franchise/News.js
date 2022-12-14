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
import {CheckBox} from 'react-native-elements';
import {DatePicker} from '../../components/DatePicker';
import FranchGoodsPicker from '../../components/FranchGoodsPicker';

export class News extends React.Component {
    static _Title = 'Новости';
    static navigationOptions = CommonFunctions.getNavigationOptions(News._Title, 'newspaper', 'material-community');


    goBack = () => this.props.navigation.navigate('HomeScreen');
    render() {
        return (
            <View>
                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="menu"
                    title={News._Title}
                    leftIconAction={this.props.navigation.openDrawer}
                />
                <Text>Раздел в разработке</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

});

export default News;
