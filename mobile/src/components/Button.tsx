import React from 'react';
import {StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import Text from '@/components/Text';
import View from './View';
import {colors, values} from '@/lib';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'default',
  disabled = false,
  loading = false,
}) => {
  const {background, color, disabledBackground} = stylesVariants[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.buttonBase,
        {backgroundColor: disabled ? disabledBackground : background},
      ]}
      disabled={loading || disabled}>
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <View flexDirection="row" alignItems="center">
          <Text
            semibold
            textAlign="center"
            color={disabled ? colors.disabledForegroundColor : color}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const stylesVariants = {
  default: {
    background: colors.primaryColor,
    color: colors.primaryForegroundColor,
    disabledBackground: colors.disabledColor,
  },
  secondary: {
    background: colors.secondaryColor,
    color: colors.secondaryForegroundColor,
    disabledBackground: colors.disabledColor,
  },
};

const styles = StyleSheet.create({
  buttonBase: {
    padding: 12,
    height: 52,
    borderRadius: values.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexible: {},
});

export default Button;
