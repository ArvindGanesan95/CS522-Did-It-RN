import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Button,
  Icon,
  Modal,
} from 'react-native';
import AvatarComponent from '../assets/avatarSVG';
import MyAppText from '../components/MyAppText';
import {
  useNavigation,
  CommonActions,
  useTheme,
} from '@react-navigation/native';

const TaskCreatedModal = (modalVisible, action, lines) => {
  const navigation = useNavigation();
  const {
    primaryColor,
    secondaryColor,
    tertiaryColor,
    accentColor,
  } = useTheme();
  return (
    <View style={styles({}).centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles({}).centeredView}>
          <View style={styles({ secondaryColor }).modalView}>
            <AvatarComponent></AvatarComponent>
            {lines.map((line) => (
              <MyAppText>
                <Text style={styles({}).textStyle}>{line}</Text>
              </MyAppText>
            ))}
            <TouchableHighlight
              style={{
                ...styles({ tertiaryColor }).openButton,
                marginTop: 60,
              }}
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [
                      { name: 'Home', params: { headerShown: false } },
                      {
                        name: 'ViewTasks',
                        params: { title: 'View Tasks', headerShown: false },
                      },
                    ],
                  }),
                );
              }}
            >
              <Text style={styles({}).textStyle}>OK!</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = ({ primaryColor, secondaryColor, tertiaryColor, accentColor }) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: secondaryColor,
      borderRadius: 20,
      padding: 35,
      height: 500,
      width: 350,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      backgroundColor: tertiaryColor,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      height: 50,
      width: 70,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

export default TaskCreatedModal;
