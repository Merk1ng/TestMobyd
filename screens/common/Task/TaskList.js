import React, {Component} from 'react';
import {StyleSheet, View, Text, Linking, Alert, YellowBox, TextInput, Picker, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from 'firebase';
import CommonFunctions from '../../../helpers/CommonFunctions';
import {ButtonGroup, Card} from 'react-native-elements';
import AppHeader from '../../../components/AppHeader';

export class TaskList extends Component {

    static navigationOptions = CommonFunctions.getNavigationOptions('Задачи', 'check', 'font-awesome');

    tasks = [['one', 'two'],['three', 'four'],['five', 'six']];

    constructor() {
        super();
        this.state = {
            selectedIndex: 2,
            items: this.tasks[2],
        };
        this.updateIndex = this.updateIndex.bind(this);
    }

    updateIndex(selectedIndex) {
        this.setState({selectedIndex, items: this.tasks[selectedIndex]});
    }

    render() {

        let component1 = () => <Text>НОВЫЕ</Text>;
        let component2 = () => <Text>В ПРОЦЕССЕ</Text>;
        let component3 = () => <Text>КОНТРОЛЬ</Text>;

        const buttons = [{element: component1}, {element: component2}, {element: component3}];
        const {selectedIndex} = this.state;

        return (
            <ScrollView>
                <AppHeader
                    navigation={this.props.navigation}
                    leftIcon="arrow-back"
                    title={"Задачи"}
                    leftIconAction={this.props.navigation.goBack}
                />
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{height: 50}}
                />

                {this.state.items.map(item => {
                    return(
                        <Card
                            title={item}
                        >
                            <Text style={{marginBottom: 10}}>
                                The idea with React Native Elements is more about component structure than actual design.
                            </Text>
                        </Card>
                    )
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

});

export default TaskList;
