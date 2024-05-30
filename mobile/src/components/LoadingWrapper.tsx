import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors} from '@/lib';

interface Props {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function LoadingWrapper({isLoading, children}: Props) {
  return (
    <>
      {children}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.whiteColor} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000090',
  },
});
