import useNavigation from '@/hooks/useNavigation';
import {selectUser} from '@/store/reducers/user/selectors';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {useSelector} from 'react-redux';
import io, {Socket} from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  startCall: (toUser: string) => void;
  acceptCall: (toUser: string) => void;
  rejectCall: (toUser: string) => void;
  activeCall: ActiveCall | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({children}: {children: ReactNode}) => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  useEffect(() => {
    const socketConnection = io('http://192.168.1.88:3000');
    setSocket(socketConnection);

    socketConnection.emit('register', user.id);

    socketConnection.on('connect', () => {
      console.log('Connected to the socket server');
    });

    socketConnection.on('incoming_call', (data: {fromUser: string}) => {
      console.log('Incoming call:', data.fromUser);
      navigation.navigate('IncomingCallScreen', {userId: data.fromUser});
    });

    socketConnection.on('call_accepted', (data: {fromUser: string}) => {
      console.log('Call accepted:', data.fromUser);
      setActiveCall({
        fromUser: data.fromUser,
        toUser: user.id,
        startDate: new Date(),
        status: 'LIVE',
      });
      navigation.navigate('VideoChatScreen');
    });

    socketConnection.on('call_rejected', (data: {fromUser: string}) => {
      console.log('Call rejected:', data.fromUser);
      setActiveCall(null);
      navigation.navigate('HomeScreen');
    });

    return () => {
      socketConnection.off('incoming_call');
      socketConnection.off('call_accepted');
      socketConnection.off('call_rejected');
      socketConnection.disconnect();
    };
  }, [user, navigation]);

  const startCall = (toUser: string) => {
    console.log(`Starting call to ${toUser} from ${user.id}`);
    socket?.emit('start_call', {fromUser: user.id, toUser});
    navigation.navigate('OutgoingCallScreen', {userId: toUser});
  };

  const acceptCall = (toUser: string) => {
    console.log(`Accepting call from ${user.id} by ${toUser}`);
    socket?.emit('accept_call', {fromUser: user.id, toUser});
    setActiveCall({
      fromUser: user.id,
      toUser: toUser,
      startDate: new Date(),
      status: 'LIVE',
    });
    navigation.navigate('VideoChatScreen');
  };

  const rejectCall = (toUser: string) => {
    console.log(`Rejecting call from ${user.id} to ${toUser}`);
    socket?.emit('reject_call', {fromUser: user.id, toUser});
    setActiveCall(null);
    navigation.navigate('HomeScreen');
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        startCall,
        acceptCall,
        rejectCall,
        activeCall,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
