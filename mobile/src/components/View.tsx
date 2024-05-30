import React from 'react';
import {View as BaseView, StyleProp, ViewProps, ViewStyle} from 'react-native';

interface Props extends ViewProps {
  flex?: boolean;
  flexDirection?: 'row' | 'column';
  gap?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  margin?: number;
  marginLeft?: number;
  marginRight?: number;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  fullWidth?: boolean;
  fullHeight?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const View: React.FC<Props> = ({
  children,
  flex,
  flexDirection,
  gap,
  justifyContent,
  alignItems,
  fullWidth,
  fullHeight,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginLeft,
  marginRight,
  style,
  ...props
}) => {
  const customStyles: StyleProp<ViewStyle> = {
    ...(flex && {flex: 1}),
    justifyContent,
    alignItems,
    flexDirection,
    gap,
    padding,
    paddingHorizontal,
    paddingVertical,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginLeft,
    marginRight,
    ...(fullWidth && {width: '100%'}),
    ...(fullHeight && {height: '100%'}),
  };

  return (
    <BaseView style={[customStyles, style]} {...props}>
      {children}
    </BaseView>
  );
};

export default View;
