import React from 'react';
import { StyleSheet, Text, TextInput, View, InteractionManager, TouchableOpacity, Button,Icon } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import ConversationCard from '../components/ConversationCard';
import MyAppText from '../components/MyAppText';
import NextStepButton from "../components/NextStepButton";


const SetTaskNameVerification = ({navigation, route}) => {
    const chosenText = route.params.chosenText;
    return (
        <View style={styles.container}>
            <ConversationCard avatarText="Choose your name" userText={chosenText}/>
            <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                    <NextStepButton content="Next Step" action={() => navigation.navigate("SetTaskNameKeyboard")}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor: '#264653',
    },
    input:{ 
        height: 40,
        width: 300,
        color: '#FFFF',
        borderColor: 'gray',
        borderWidth: 1,
    }
});

export default SetTaskNameVerification;
