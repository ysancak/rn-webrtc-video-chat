import {TextInput as BaseTextInput, StyleSheet} from 'react-native';
import React from 'react';
import {colors, values} from '@/lib';
import Text from './Text';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  errorText?: string;
};

export default function TextInput({
  value,
  onChangeText,
  onBlur,
  errorText,
}: Props) {
  return (
    <>
      <BaseTextInput
        style={style.container}
        keyboardType="numeric"
        placeholder="Aramak istediğiniz kullanıcının id'si"
        value={value}
        onBlur={onBlur}
        onChangeText={onChangeText}
      />
      {errorText && <Text style={style.errorText}>{errorText}</Text>}
    </>
  );
}

const style = StyleSheet.create({
  container: {
    height: 42,
    borderRadius: values.borderRadius,
    backgroundColor: colors.whiteColor,
    borderWidth: 1,
    borderColor: colors.secondaryColor,
    paddingHorizontal: 16,
  },
  errorText: {
    color: colors.redColor,
  },
});
