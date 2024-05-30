import {
  KeyboardAvoidingView as BaseKeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function KeyboardAvoidingView({children}: Props) {
  return (
    <BaseKeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {children}
    </BaseKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
    gap: 16,
  },
});
