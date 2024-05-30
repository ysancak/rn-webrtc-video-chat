import {AcceptCallButton, RejectCallButton, Text, View} from '@/components';
import useRoute from '@/hooks/useRoute';
import {colors} from '@/lib';
import {useSocket} from '@/providers/SocketProvider';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

export default function IncomingCallScreen() {
  const route = useRoute();
  const {rejectCall, acceptCall} = useSocket();

  const rejectButtonHandler = () => {
    rejectCall(route.params?.userId);
  };

  const acceptButtonHandler = () => {
    acceptCall(route.params?.userId);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.textContainer}>
          <Text color={colors.whiteColor} variant="xlarge" bold>
            {route.params?.userId}
          </Text>
          <Text color={colors.whiteColor}>Gelen çağrı...</Text>
        </View>
        <View style={styles.buttonContainer}>
          <RejectCallButton onPress={rejectButtonHandler} />
          <AcceptCallButton onPress={acceptButtonHandler} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  content: {
    flex: 1,
    backgroundColor: colors.primaryColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 120,
  },
  textContainer: {
    gap: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
});
