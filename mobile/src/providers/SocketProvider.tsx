import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {useSelector} from 'react-redux';
import io, {Socket} from 'socket.io-client';
import {selectUser} from '@/store/reducers/user/selectors';
import {SOCKET_SERVER} from '@/lib/api';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({children}: {children: ReactNode}) => {
  const user = useSelector(selectUser);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketConnection = io(SOCKET_SERVER);
    setSocket(socketConnection);

    socketConnection.emit('register', user.id);

    socketConnection.on('connect', () => {
      console.log('Connected to the socket server');
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
