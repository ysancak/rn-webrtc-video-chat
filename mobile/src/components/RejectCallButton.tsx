import React from 'react';
import IonIcon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '@/lib';
import {StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  onPress: () => void;
};

export default function RejectCallButton({onPress}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}>
      <IonIcon name="call-end" size={26} color={colors.whiteColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: 72,
    backgroundColor: colors.redColor,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
