import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import ViewDetailedTask from './screens/ViewDetailedTask';
import Home from './screens/Home';
import ViewTasks from './screens/ViewTasks';
import PickTaskCategory from './screens/PickTaskCategory';
import SetTaskName from './screens/SetTaskName';
import SetTaskNameKeyboard from './screens/SetTaskNameKeyboard';
import SetTaskNameVerification from './screens/SetTaskNameVerification';
import GetUserCameraPreference from './screens/GetUserCameraPreference';
import TaskCompletedModal from './components/TaskMarkedDoneModal';
import TaskComponent from './components/BackgroundTask';
import TakePhotoFromCamera from './screens/TakePhotoFromCamera';
import SetTaskRecurrance from './screens/SetTaskRecurrance';
import SetTaskRecurranceSchedule from './screens/SetRecurranceSchedule';
import EditTaskOptions from './screens/EditTaskOptions';
import SetTaskNameVoice from './screens/SetTaskNameVoice';
import SetTaskDate from './screens/SetTaskDate';
import SetTaskTime from './screens/SetTaskTime';
import Task from './database/Models/Task';
import CreateTaskReducer from './store/CreateTaskReducer';
import { checkTableExists } from './database/Utilities/api';
import {initialiseNotifications} from './background/Notifications'

const ViewTaskStack = createStackNavigator();
const CreateTaskStack = createStackNavigator();
const RootStack = createStackNavigator();

let notificationToken = null;
const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
  primaryColor: '#264653',
  secondaryColor: '#E9C46A',
  tertiaryColor: '#2A9D8F',
  accentColor: '#E76F51',
};

const createTaskScreens = () => {
  return (
    <CreateTaskStack.Navigator initialRouteName="PickTaskCategory">
      <CreateTaskStack.Screen
        name="PickTaskCategory"
        component={PickTaskCategory}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskName"
        component={SetTaskName}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskNameVoice"
        component={SetTaskNameVoice}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskNameKeyboard"
        component={SetTaskNameKeyboard}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskDate"
        component={SetTaskDate}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskTime"
        component={SetTaskTime}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskNameVerification"
        component={SetTaskNameVerification}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskRecurrance"
        component={SetTaskRecurrance}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="SetTaskRecurranceSchedule"
        component={SetTaskRecurranceSchedule}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
      <CreateTaskStack.Screen
        name="EditTaskOptions"
        component={EditTaskOptions}
        options={{ headerShown: false }}
      ></CreateTaskStack.Screen>
    </CreateTaskStack.Navigator>
  );
};

const viewTaskScreens = () => {
  const headerStyles = {
    headerStyle: {
      backgroundColor: '#264653',
    },
    headerTintColor: '#F4A261',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  return (
    <ViewTaskStack.Navigator>
      <ViewTaskStack.Screen
        name="ViewTasksMain"
        component={ViewTasks}
        options={{ headerShown: false }}
      ></ViewTaskStack.Screen>
      <ViewTaskStack.Screen
        name="MarkTaskAsDone"
        component={ViewDetailedTask}
        options={{ ...headerStyles, title: 'Task Information' }}
      ></ViewTaskStack.Screen>
      <ViewTaskStack.Screen
        name="GetUserCameraPreference"
        component={GetUserCameraPreference}
        options={{ ...headerStyles, title: 'Add a memory' }}
      ></ViewTaskStack.Screen>
      <ViewTaskStack.Screen
        name="TaskCompletedModal"
        component={TaskCompletedModal}
        options={{ headerShown: false }}
      ></ViewTaskStack.Screen>
      <ViewTaskStack.Screen
        name="TakePhotoFromCamera"
        component={TakePhotoFromCamera}
        options={{ ...headerStyles, title: 'Taking a Picture' }}
      ></ViewTaskStack.Screen>
    </ViewTaskStack.Navigator>
  );
};

export default function App() {
  function nextweek() {
    var today = new Date();
    var nextweek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 10,
    );
    return nextweek;
  }

  useEffect(() => {
    const createTable = async () => {
      //Task.destroyAll()
      console.log('Creating table');
      await Task.checkTableExists()
      let result = await Task.createTable();
      let result2 = await checkTableExists(Task.tableName);
       console.log('Table name ' + JSON.stringify(result2));
      if (result2.rows.length > 0) {
        console.log('Table exists');
      } else {
        console.log('Table does not exist');
      }
    };
    createTable();
    initialiseNotifications().then(token => {
     
      if(notificationToken == null) {

        console.log("Notification token is null ")
        notificationToken = token
      }
    });
    
  }, []);

  const store = createStore(CreateTaskReducer);

  const headerStyles = {
    headerStyle: {
      backgroundColor: '#264653',
    },
    headerTintColor: '#F4A261',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  return (
    <View style={styles.container}>
      <Provider store={store}>
        <NavigationContainer theme={MyTheme}>
          <RootStack.Navigator>
            <RootStack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            ></RootStack.Screen>
            <RootStack.Screen
              name="CreateTask"
              component={createTaskScreens}
              options={{ ...headerStyles, title: 'Create Tasks' }}
            ></RootStack.Screen>
            <RootStack.Screen
              name="ViewTasks"
              component={viewTaskScreens}
              options={{
                ...headerStyles,
                title: 'View Tasks',
                headerShown: false,
              }}
            ></RootStack.Screen>
          </RootStack.Navigator>
        </NavigationContainer>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#264653',
  },
});
