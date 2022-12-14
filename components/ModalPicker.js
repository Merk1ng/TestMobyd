import React from 'react';
import {
    StyleSheet,
    View,
    Modal,
    FlatList,
} from 'react-native';
import {
    ListItem,
    SearchBar, Button, Icon,
} from 'react-native-elements';

export class ModalPicker extends React.Component {

    GOODS_DEFAULT = [];

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            displayList: this.GOODS_DEFAULT
        };
    }

    _SearchFilterFunction = text => {

        if (!text) {
            this.setState({displayList: this.GOODS_DEFAULT, text: ''});
            return;
        }

        let displayList = this.GOODS_DEFAULT.filter(function (item) {
            return item.name.toUpperCase().indexOf(text.toUpperCase()) > -1;
        });

        this.setState({displayList: displayList, text: text});

    };

    _setVisible = (value) => () => {
        this.setState({visible: value});
    };

    _clickItem = (item) => () => {
        this.props.onChange(item);
    };

    _renderItem = (rowData, index) => () => {

        let item = rowData.item;

        return (
            <ListItem
                key={index}
                leftIcon={item.items ? {name: 'folder'} : null}
                title={item.name}
                onPress={this._clickItem(item)}
            />
        );
    };

    _keyExtractor = (item, index) => index;

    render() {
        return (
            <View style={styles.container}>

                <Button
                    onPress={this._setVisible(true)}
                    buttonStyle={styles.button}
                    icon={{name: 'add', color: '#fff'}}
                    title={this.props.buttonLabel}
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.visible}
                    onRequestClose={this._setVisible(false)}>

                    <View style={styles.viewStyle}>
                        <SearchBar
                            round
                            value={''}
                            searchIcon={
                                <Icon
                                    type='material-community'
                                    name="barcode-scan"
                                    color="white"
                                    onPress={() => this.setState({barcodeScannerVisible: true})}
                                />
                            }
                            onChangeText={this._SearchFilterFunction}
                            onClear={this._SearchFilterFunction}
                            placeholder="Type Here..."
                        />

                        <FlatList
                            data={this.state.displayList}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem(rowData, index)}
                            enableEmptySections={true}
                        />
                    </View>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    listContainer: {
        marginTop: 10,
    },
    listRow: {
        flexDirection: 'row',
    },
});

export default ModalPicker;
