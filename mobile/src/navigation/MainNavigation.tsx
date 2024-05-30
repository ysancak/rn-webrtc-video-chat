import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  FriendListScreen,
  HomeScreen,
  IncomingCallScreen,
  OutgoingCallScreen,
  VideoChatScreen,
} from '@/pages';
import {SocketProvider} from '@/providers/SocketProvider';

const Stack = createNativeStackNavigator();

function MainNavigation(): React.JSX.Element {
  return (
    <NavigationContainer>
      <SocketProvider>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{gestureEnabled: false}}>
          <Stack.Screen
            name="FriendListScreen"
            component={FriendListScreen}
            options={{
              title: 'Kişilerim',
              headerRight: () => <IonIcon name="add" size={28} />,
            }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="IncomingCallScreen"
            component={IncomingCallScreen}
            options={{
              headerShown: false,
              presentation: 'containedModal',
            }}
          />
          <Stack.Screen
            name="OutgoingCallScreen"
            component={OutgoingCallScreen}
            options={{
              headerShown: false,
              presentation: 'containedModal',
            }}
          />
          <Stack.Screen
            name="VideoChatScreen"
            component={VideoChatScreen}
            options={{
              headerShown: false,
              presentation: 'containedModal',
            }}
          />
        </Stack.Navigator>
      </SocketProvider>
    </NavigationContainer>
  );
}

export default MainNavigation;
