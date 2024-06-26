import {LoadingWrapper, RejectCallButton, View} from '@/components';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import CameraButton from './components/CameraButton';
import MicrophoneButton from './components/MicrophoneButton';
import {useVideoCall} from '@/providers/VideoCallProvider';

export default function VideoChatScreen() {
  const {
    isLoading,
    localStream,
    remoteStream,
    endCall,
    isMicrophoneOn,
    isCameraOn,
    toggleMicrophone,
    toggleCamera,
  } = useVideoCall();

  return (
    <LoadingWrapper isLoading={isLoading}>
      <SafeAreaView style={styles.container}>
        <View style={styles.remoteStream}>
          {remoteStream && (
            <RTCView
              streamURL={remoteStream.toURL()}
              mirror={false}
              objectFit="cover"
              style={styles.remoteStreamVideo}
            />
          )}
        </View>
        <View style={styles.localStream}>
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()}
              mirror={false}
              objectFit="cover"
              style={styles.localStreamVideo}
            />
          )}
        </View>
        <View style={styles.floatingButtonsContainer}>
          <CameraButton state={isCameraOn} onPress={toggleCamera} />
          <RejectCallButton onPress={endCall} />
          <MicrophoneButton state={isMicrophoneOn} onPress={toggleMicrophone} />
        </View>
      </SafeAreaView>
    </LoadingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  localStream: {
    position: 'absolute',
    top: 80,
    right: 30,
    width: 120,
    height: 160,
    backgroundColor: 'gray',
    borderRadius: 16,
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 6,
  },
  localStreamVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  remoteStream: {
    flex: 1,
    backgroundColor: 'black',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  remoteStreamVideo: {
    width: '100%',
    height: '100%',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});
