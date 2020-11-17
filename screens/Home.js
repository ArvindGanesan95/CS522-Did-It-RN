import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

import MyAppText from '../components/MyAppText';

const Home = () => {
  return (
    <View style={styles.container}>
      <Foundation
        style={[styles.icon, { paddingLeft: 20 }]}
        name="clipboard-pencil"
        size={120}
        color="#2A9D8F"
      />
      <MyAppText>
        <Text style={styles.modeText}>Create Task</Text>
      </MyAppText>
      <FontAwesome5
        name="tasks"
        color="#2A9D8F"
        size={120}
        style={[styles.icon]}
      ></FontAwesome5>
      <MyAppText>
        <Text style={styles.modeText}>View Tasks</Text>
      </MyAppText>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginTop: 40,

    marginHorizontal: 20,
  },
  modeText: {
    fontSize: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
