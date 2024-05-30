import React from 'react';
import IonIcon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '@/lib';
import {StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  state: boolean;
  onPress: () => void;
};

export default function MicrophoneButton({state, onPress}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}>
      <IonIcon
        name={state ? 'mic-off' : 'mic-off'}
        size={26}
        color={colors.whiteColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: 72,
    backgroundColor: colors.primaryColor,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
