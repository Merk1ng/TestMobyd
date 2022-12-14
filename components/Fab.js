import {View, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import {Icon} from 'react-native-elements';

export default class Fab extends Component {

    actionHandler = () => this.props.stack.navigate(this.props.screen, {document: null});

    render() {
        return (
            <View style={styles.container}>
                <Icon
                    name='add'
                    iconStyle={styles.icon}
                    onPress={this.actionHandler}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    icon: {
        color: 'white',
        backgroundColor: 'rgba(0, 90, 0, 0.8)',
        padding: 18,
        fontSize: 30,
        borderRadius: 50,
        right: 15,
        bottom: 15,
    },
});
