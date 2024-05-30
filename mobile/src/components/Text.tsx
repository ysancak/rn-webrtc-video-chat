import React from 'react';
import {
  StyleSheet,
  Text as BaseText,
  TextProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import {colors, values} from '@/lib';

interface Props extends TextProps {
  fontSize?: number;
  color?: string;
  variant?: 'small' | 'body' | 'large' | 'xlarge';
  bold?: boolean;
  semibold?: boolean;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const Text: React.FC<Props> = ({
  fontSize,
  color,
  variant = 'body',
  bold,
  semibold,
  textAlign,
  fontStyle,
  textTransform,
  children,
  style,
  ...restProps
}) => {
  const textStyle: StyleProp<TextStyle> = [
    styles.text,
    variant && styles[variant],
    fontSize && {fontSize},
    textAlign && {textAlign},
    fontStyle && {fontStyle},
    textTransform && {textTransform},
    bold && styles.bold,
    semibold && styles.semibold,
    color && {color},
    style,
  ];

  return (
    <BaseText {...restProps} style={textStyle}>
      {children}
    </BaseText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.textColor,
  },
  small: {
    fontSize: values.smallFontSize,
  },
  body: {
    fontSize: values.bodyFontSize,
    lineHeight: 24,
  },
  large: {
    fontSize: values.largeFontSize,
  },
  xlarge: {
    fontSize: values.XLFontSize,
  },
  bold: {
    fontWeight: 'bold',
  },
  semibold: {
    fontWeight: '600',
  },
});

export default Text;
