import {RejectCallButton, Text, View} from '@/components';
import useRoute from '@/hooks/useRoute';
import {colors} from '@/lib';
import {useVideoCall} from '@/providers/VideoCallProvider';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

export default function OutgoingCallScreen() {
  const route = useRoute();
  const {rejectCall} = useVideoCall();

  const rejectButtonHandler = () => {
    rejectCall(route.params?.userId);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.textContainer}>
          <Text color={colors.whiteColor} variant="xlarge" bold>
            {route.params?.userId}
          </Text>
          <Text color={colors.whiteColor}>Aranıyor...</Text>
        </View>
        <View>
          <RejectCallButton onPress={rejectButtonHandler} />
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
});
