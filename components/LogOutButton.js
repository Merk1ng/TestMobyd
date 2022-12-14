import React from 'react';
import {StyleSheet, AsyncStorage} from 'react-native';
import {Button, Icon} from 'react-native-elements'

class LogOutButton extends React.Component {

    static navigationOptions = {
        title: 'Выйти',
        drawerIcon:
            <Icon
                name='exit-to-app'
                color='#000'
            />
    };

    constructor(props) {
        super(props);

        AsyncStorage.clear();
        AsyncStorage.removeItem('user')
            .then(res => {
                return AsyncStorage.removeItem('documents');
            })
            .then(res => {
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



export default LogOutButton;
