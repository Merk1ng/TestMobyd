import React, {Component} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {Button, Header, Icon} from 'react-native-elements';

export class AppHeader extends Component {

    constructor(props) {
        super(props);
    }

    static getBgColor() {
        switch (global.theme) {
            case 'Версия для Турсов' :
                return "#ED164F";
            default:
                return "#1E88E5";
        }
    }

    render() {
        return (
            <View>
                <StatusBar backgroundColor="rgba(0, 0, 0, 0.20)" showHideTransition={'fade'} animated translucent/>
                <Header
                    placement="left"
                    backgroundColor={AppHeader.getBgColor()}
                    leftComponent={
                        <Button
                            buttonStyle={styles.headerButtons}
                            icon={
                                <Icon
                                    name={this.props.leftIcon}
                                    color='#fff'
                                />
                            }
                            onPress={() => {
                                this.props.leftIconAction()
                            }}
                        />
                    }
                    centerComponent={{text: this.props.title, style: styles.title}}
                    rightComponent={
                        <View>
                            <Button
                                buttonStyle={styles.headerButtons}
                                icon={
                                    <Icon
                                        name={this.props.rightIcon}
                                        size={28}
                                        color="white"
                                    />
                                }
                                onPress={() => {
                                    this.props.rightIconAction();
                                }}
                            />
                        </View>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color: '#fff',
        fontSize: 18
    },
    headerButtons: {
        width: 60,
        margin: -10,
        height: 55
    }
});

export default AppHeader;
