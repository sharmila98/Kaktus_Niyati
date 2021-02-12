import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Button, Text, Alert} from 'react-native';

import ZoomUs from 'react-native-zoom-us';


// 1. `TODO`: Go to https://marketplace.zoom.us/develop/create and Create SDK App then fill `sdkKey` and `sdkSecret`
const skdKey = 'cHrk4IE3XSLjL8Nt0ZtLtxbxP9yxoN9Lx2Px';
const sdkSecret = 'PIsni2MEMwRTVOQfhWv4JiRH26axPUUPfZru';

// 2. `TODO` Fill in the following fields:
const exampleMeeting = {
  // for both startMeeting and joinMeeting
  meetingNumber: '96040043254',

  // for startMeeting
//   userId: '',
//   zoomAccessToken: '',

  // for joinMeeting
  password: '967943',
};

const ZoomJoinMeeting = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const initializeResult = await ZoomUs.initialize({
          clientKey: skdKey,
          clientSecret: sdkSecret,
        });

        console.log({initializeResult});

        setIsInitialized(true);
      } catch (e) {
        Alert.alert('Error', 'Could not execute initialize');
        console.error(e);
      }
    })();
  }, []);

  const joinMeeting = async () => {
    try {
      const joinMeetingResult = await ZoomUs.joinMeeting({
        userName: 'Wick',
        meetingNumber: exampleMeeting.meetingNumber,
        password: exampleMeeting.password,
      });

      console.log({joinMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute joinMeeting');
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() => joinMeeting()}
        title="Join example meeting"
        disabled={!isInitialized}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default ZoomJoinMeeting;