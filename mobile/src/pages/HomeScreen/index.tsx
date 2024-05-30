import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {KeyboardAvoidingView, Text, View} from '@/components';
import {colors} from '@/lib';
import {selectUser} from '@/store/reducers/user/selectors';
import {useSelector} from 'react-redux';
import CallForm from './components/CallForm';

export default function HomeScreen() {
  const user = useSelector(selectUser);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView>
        <Text variant="xlarge" bold>
          Video Call With WebRTC
        </Text>
        <View style={styles.userIdContainer}>
          <Text>Your ID:</Text>
          <View>
            <Text variant="large" bold>
              {user.id}
            </Text>
          </View>
        </View>
        <CallForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
    gap: 16,
  },
  userIdContainer: {
    padding: 18,
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: colors.secondaryColor,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 16,
  },
});
