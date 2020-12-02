import React ,{useState}from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ConversationCard from '../components/ConversationCard';
import MyAppText from '../components/MyAppText';
import { useTheme } from '@react-navigation/native';
import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import { setTaskRepeating } from '../store/CreateTaskActions';
import { createTask } from '../database/Utilities/api';
import moment from 'moment';
import TaskCreatedModal from "../components/TaskCreatedModal";
import {useNavigation} from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

const option = (text, action) => {
  const { tertiaryColor } = useTheme();

  return (
    <TouchableOpacity
      style={styles({ tertiaryColor }).button}
      onPress={() => action()}
    >
      <MyAppText>
        <Text style={styles({}).modeText}>{text}</Text>
      </MyAppText>
    </TouchableOpacity>
  );
};

const reduxStore = async (state) => state.createTask;

const toMoment = (taskTime, taskDate) => {
  var taskTimeInSeconds  = taskTime.hours*3600 + taskTime.minutes*60 + taskTime.seconds;
  // // Get seconds in HH:mm:ss format
  taskTimeInSeconds = moment(taskDate).startOf('day').seconds(taskTimeInSeconds).format('HH:mm:ss');
  // console.log("Task time is "+taskTimeInSeconds);
  
  // // Concat date and time
 return moment(
    `${taskDate} ${taskTimeInSeconds}`,
    'YYYY-MM-DD HH:mm',
  ).format('YYYY MM DD');
}

const create = async (taskObject) => {
  const task = {};
  task.name = taskObject.taskName;
  task.category = taskObject.taskCategory;
  task.isCompleted = 0;
  task.isRecurring = false;
  // console.log(taskObject);
  // console.log("Tasktime hours "+JSON.stringify(taskObject.taskTime.hours)+ " "+JSON.stringify(taskObject.taskTime.minutes)+
  // " "+JSON.stringify(taskObject.taskTime.seconds))
  
  // convert time to seconds
  var taskTimeInSeconds  = taskObject.taskTime.hours*3600 + taskObject.taskTime.minutes*60 + taskObject.taskTime.seconds;
  // // Get seconds in HH:mm:ss format
  taskTimeInSeconds = moment(taskObject.taskDate).startOf('day').seconds(taskTimeInSeconds).format('HH:mm:ss');
  // console.log("Task time is "+taskTimeInSeconds);
  
  // // Concat date and time
  task.taskFinishBy = moment(
    `${taskObject.taskDate} ${taskTimeInSeconds}`,
    'YYYY-MM-DD HH:mm:ss',
  ).toISOString();
  // console.log("task object "+ JSON.stringify(task))
  task.createdDate = new Date().toISOString();

  // console.log('Task object is ' + JSON.stringify(task));
  await createTask(task);
};





const SetTaskRecurrance = ({ route, navigation, setTaskRepeating }) => {
  const taskObject = useSelector(reduxStore);
  const [isVisible, setIsVisible] = useState(false);
  const [lines, setLines] = useState(["You're all set", "I have created a task for you"]);
  const navigate = () => {
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
}
  return (
    <View style={styles({}).container}>
       {TaskCreatedModal(isVisible, navigate,lines)}
      <ConversationCard avatarText="Does this task repeat?" />
      <View style={{ flex: 3, flexDirection: 'row' }}>
        <View style={styles({}).options}>
          {option('Yes', () => {
            setTaskRepeating({
              isRecurring: 1,
            });
            navigation.navigate('SetTaskRecurranceSchedule');
          })}
          {option('No', async () => {
            // console.log("Creating task in recurrance");
            const _taskObject = await taskObject;
            await create(_taskObject);
            setLines(["You're all set", "I have created a " + _taskObject.taskCategory + " for you to finish by " + toMoment(_taskObject.taskTime, _taskObject.taskDate)]);
            setIsVisible(!isVisible);
          })}
        </View>
      </View>
    </View>
  );
};

const styles = ({ tertiaryColor, secondaryColor }) =>
  StyleSheet.create({
    icon: {
      marginTop: 20,
      marginHorizontal: 20,
    },
    container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: '#264653',
    },
    button: {
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      height: 100,
      backgroundColor: tertiaryColor,
      borderRadius: 100,
    },
    modeText: {
      fontSize: 35,
    },
    options: {
      flex: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setTaskRepeating,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(SetTaskRecurrance);
