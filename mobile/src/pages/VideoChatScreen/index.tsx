import {RejectCallButton, View} from '@/components';
import {useSocket} from '@/providers/SocketProvider';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

export default function VideoChatScreen() {
  const {activeCall} = useSocket();

  const callRejectHandler = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.remoteStream} />
      <View style={styles.localStream} />
      <View style={styles.floatingButtonsContainer}>
        <RejectCallButton onPress={callRejectHandler} />
      </View>
    </SafeAreaView>
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
    height: 140,
    backgroundColor: 'gray',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: 6,
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
  floatingButtonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
