import React, {useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import useNavigation from '@/hooks/useNavigation';
import {colors} from '@/lib';
import {Text, View} from '@/components';

export default function FriendListItem({id, fullName, avatar, status}) {
  const navigation = useNavigation();

  const startCallOnPressHandler = () => {
    navigation.navigate('CallScreen');
  };

  const isOnline = useMemo(() => status === 'online', [status]);

  const renderStatus = useMemo(() => {
    return (
      <View style={styles.statusContainer}>
        <Text>{isOnline ? 'Müsait' : 'Müsait değil'}</Text>
      </View>
    );
  }, [isOnline]);

  const renderCallButton = useMemo(() => {
    const buttonBgColor = isOnline
      ? colors.callButtonColor
      : colors.disabledColor;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!isOnline}
        onPress={startCallOnPressHandler}
        style={[styles.callButton, {backgroundColor: buttonBgColor}]}>
        <IonIcon name="call" size={20} color={colors.whiteColor} />
      </TouchableOpacity>
    );
  }, [isOnline]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image
          source={{uri: avatar}}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text variant="large" bold>
            {fullName}
          </Text>
          {renderStatus}
        </View>
      </View>
      {renderCallButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: colors.secondaryColor,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 99,
  },
  textContainer: {
    gap: 6,
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callButton: {
    backgroundColor: colors.callButtonColor,
    width: 42,
    height: 42,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
