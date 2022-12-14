import React from 'react';
import {StyleSheet, AsyncStorage} from 'react-native';
import {Button, Icon} from 'react-native-elements'

class DropButton extends React.Component {

    static navigationOptions = {
        title: 'Drop',
        drawerIcon:
            <Icon
                name='clear'
                color='#000'
            />
    };

    constructor(props) {
        super(props);
        global.internalOrders = [];
        AsyncStorage.clear().then(res => {
            this.props.navigation.navigate('Splash');
        });
    }

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back home"
            />
        );
    }

}

export default DropButton;
