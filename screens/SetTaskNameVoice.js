import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ConversationCard from '../components/ConversationCard';
import InputModeButton from '../components/InputModeButton';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import config from '../config.json';
import { InstantSearch } from 'react-instantsearch-native';
import algoliasearch from 'algoliasearch/lite';

const SetTaskNameVoice = ({ route, navigation }) => {
  const taskID = route.params.taskID ? route.params.taskID : null;
  const taskType = route.params.taskType;

  const [recording, setRecording] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [query, setQuery] = useState('');
  const [speech, setSpeech] = React.useState(
    'Press and hold the microphone button and speak your task description into the phone.',
  );

  useEffect(() => {
    Permissions.askAsync(Permissions.AUDIO_RECORDING);
  }, []);

  const recordingOptions = {
    // android not currently in use. Not getting results from speech to text with .m4a
    // but parameters are required
    android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const deleteRecordingFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      await FileSystem.deleteAsync(info.uri);
    } catch (error) {
      console.log('There was an error deleting recording file', error);
    }
  };

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const sampleResponse = async () => {
    await sleep(2000);
    return 'Sample text';
  };

  const getTranscription = async () => {
    setIsFetching(true);
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      const uri = info.uri;
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/x-wav',
        name: 'speech2text',
      });
      // console.log(formData);
      const response = await fetch(config.CLOUD_FUNCTION_URL, {
        method: 'POST',
        body: formData,
      });
      const resp = await response;
      const data = await resp.json();
      if(data.transcript != ''){
        navigation.navigate('CreateTask', {
          screen: 'SetTaskNameVerification',
          params: {
            chosenText: data.transcript,
            taskID,
            taskType,
          },
        });
      } else {
        setSpeech('Hmm..I couldn\'t hear anything. Why don\'t you try again? Push the microphone button and speak your task description into the phone');
      }
    } catch (error) {
      console.log('There was an error reading file', error);
      stopRecording();
      resetRecording();
    }
    setIsFetching(false);
  };

  const startRecording = async () => {
    console.log('Initiated recording');
    const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') return;

    setIsRecording(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    });
    const recording = new Audio.Recording();

    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      console.log(error);
      stopRecording();
    }
    setSpeech('Listening...When you are done release the button');
    setRecording(recording);
  };

  const stopRecording = async () => {
    console.log('Done recording');
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
  };

  const resetRecording = () => {
    deleteRecordingFile();
    setRecording(null);
  };

  const handleOnPressIn = () => {
    console.log('Pressed');
    startRecording();
  };

  const handleOnPressOut = () => {
    stopRecording();
    setSpeech('Hmm...Processing');
    getTranscription();
  };

  const handleQueryChange = (query) => {
    setQuery(query);
  };


  return (
    <View style={styles.container}>
      <ConversationCard avatarText={speech} />
      <View style={{ flex: 3, flexDirection: 'row' }}>
        <View style={styles.options}>
            {!isFetching && <InputModeButton
                isVoice="true"
                icon="microphone"
                onPressIn={handleOnPressIn}
                onPressOut={handleOnPressOut}
                />
            }
        </View>
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#264653',
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  options: {
    flex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default SetTaskNameVoice;
