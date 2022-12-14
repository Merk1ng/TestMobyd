import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    ScrollView,
    Alert,
    Picker,
    Modal, AsyncStorage, TextInput, ActivityIndicator,
} from 'react-native';
import {
    ListItem,
    Input,
    FormLabel,
    SearchBar, Divider
} from 'react-native-elements'
import PopupDialog from 'react-native-popup-dialog';
import Dialog from "react-native-popup-dialog/src/components/Dialog";
import {DialogButton, DialogContent, DialogFooter, DialogTitle} from "react-native-popup-dialog";

export class DialogProcess extends React.PureComponent {

    render() {
        return (

            <PopupDialog
                visible={this.props.visible}
                onTouchOutside={() => {

                }}
                footer={null}>

                <DialogContent style={styles.transparent} containerStyle = {styles.transparent}>
                    <Text style={{padding: 15}}>Отправка документа...</Text>
                    <ActivityIndicator size="large" color="#0000ff" style={styles.indicator}/>
                </DialogContent>
            </PopupDialog>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        height: 30,
        color: "#789"
    },
    label: {
        marginTop: 5,
        color: "#89a",
        left: 8
    },
    transparent: {
        backgroundColor: 'rgba(52, 52, 52, 0)'
    },
    indicator : {

    }
});

