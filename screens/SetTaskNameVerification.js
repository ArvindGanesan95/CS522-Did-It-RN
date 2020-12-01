import React from 'react';
import { StyleSheet, View } from 'react-native';
import ConversationCard from '../components/ConversationCard';
import NextStepButton from '../components/NextStepButton';

const SetTaskNameVerification = ({ navigation, route }) => {
  const chosenText = route.params.chosenText;

  const redoAction = () => {
    navigation.navigate('CreateTask', {
      screen: 'SetTaskName',
      params: { taskCategory: "chore" },
    });
  };

  return (
    <View style={styles.container}>
      <ConversationCard
        style={{ flex: 2 }}
        avatarText="Is this your task name?"
        userText={chosenText}
        redoAction = {redoAction}
      />
      <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 30 }}>
        <NextStepButton action={() => navigation.navigate('SetTaskDate')} />
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
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#264653',
  },
  input: {
    height: 40,
    width: 300,
    color: '#FFFF',
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default SetTaskNameVerification;
