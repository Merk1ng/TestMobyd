import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    ScrollView,
    Alert,
    Picker,
    Modal, AsyncStorage, TextInput
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

export class DialogSave extends React.Component {

    render() {
        return (

            <PopupDialog
                visible={this.props.visible}
                onTouchOutside={() => {

                }}
                footer={
                    <DialogFooter style={{flexDirection: 'row'}}>
                        <DialogButton
                            text="Нет"
                            onPress={() => this.props.onPressNo()}
                        />
                        <DialogButton
                            text="Да"
                            onPress={() => this.props.onPressYes()}
                        />
                    </DialogFooter>
                }>
                <DialogTitle
                    title="Сохранить документ перед выходом?"
                />
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
    }
});

