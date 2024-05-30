import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {useSelector} from 'react-redux';
import {useSocket} from '@/providers/SocketProvider';
import {selectUser} from '@/store/reducers/user/selectors';
import useNavigation from '@/hooks/useNavigation';

interface CallContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isLoading: boolean;
  startCall: (toUser: string) => void;
  acceptCall: (toUser: string) => void;
  rejectCall: (toUser: string) => void;
  endCall: () => void;
  isMicrophoneOn: boolean;
  isCameraOn: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
}

const CallContext = React.createContext<CallContextType | undefined>(undefined);

export const VideoCallProvider = ({children}: {children: React.ReactNode}) => {
  const {socket} = useSocket();
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const toUser = useMemo(() => {
    if (activeCall) {
      return activeCall.fromUser === user.id
        ? activeCall.toUser
        : activeCall.fromUser;
    }
  }, [activeCall, user]);

  useEffect(() => {
    const setupPeerConnection = () => {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {urls: 'stun:stun.l.google.com:19302'},
          {urls: 'stun:stun1.l.google.com:19302'},
          {urls: 'stun:stun2.l.google.com:19302'},
        ],
      });

      peerConnection.current.addEventListener('icecandidate', event => {
        if (event.candidate) {
          socket?.emit('ice_candidate', {
            toUser: toUser,
            candidate: event.candidate,
          });
        }
      });

      peerConnection.current.addEventListener('track', event => {
        setRemoteStream(event.streams[0]);
      });

      peerConnection.current.addEventListener('negotiationneeded', async () => {
        if (peerConnection.current) {
          const offer = await peerConnection.current.createOffer({});
          await peerConnection.current.setLocalDescription(offer);
          socket?.emit('offer', {
            toUser: toUser,
            sdp: offer,
          });
        }
      });
    };

    const startLocalStream = async () => {
      setIsLoading(true);
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: {frameRate: 60, facingMode: 'user'},
        });
        setLocalStream(stream);

        if (peerConnection.current) {
          stream.getTracks().forEach(track => {
            peerConnection.current?.addTrack(track, stream);
          });
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeCall) {
      setupPeerConnection();
      startLocalStream();
    }

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      peerConnection.current = null;
    };
  }, [activeCall, socket]);

  useEffect(() => {
    socket?.on('offer', async ({sdp}) => {
      if (peerConnection.current) {
        setIsLoading(true);
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(sdp),
          );
          if (peerConnection.current.remoteDescription?.type === 'offer') {
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket?.emit('answer', {
              toUser: toUser,
              sdp: answer,
            });
          }
        } finally {
          setIsLoading(false);
        }
      }
    });

    socket?.on('answer', async ({sdp}) => {
      if (peerConnection.current) {
        setIsLoading(true);
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(sdp),
          );
        } finally {
          setIsLoading(false);
        }
      }
    });

    socket?.on('ice_candidate', async ({candidate}) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        }
      } catch (error) {
        console.error('Error adding received ice candidate', error);
      }
    });

    socket?.on('incoming_call', (data: {fromUser: string}) => {
      navigation.navigate('IncomingCallScreen', {userId: data.fromUser});
    });

    socket?.on('call_accepted', (data: {fromUser: string}) => {
      setActiveCall({
        fromUser: data.fromUser,
        toUser: user.id,
        startDate: new Date(),
        status: 'LIVE',
      });
      navigation.navigate('VideoChatScreen');
    });

    socket?.on('call_rejected', () => {
      setActiveCall(null);
      navigation.navigate('HomeScreen');
    });

    return () => {
      socket?.off('offer');
      socket?.off('answer');
      socket?.off('ice_candidate');
      socket?.off('incoming_call');
      socket?.off('call_accepted');
      socket?.off('call_rejected');
    };
  }, [socket]);

  const startCall = (to: string) => {
    socket?.emit('start_call', {fromUser: user.id, toUser: to});
    navigation.navigate('OutgoingCallScreen', {userId: to});
  };

  const acceptCall = (to: string) => {
    socket?.emit('accept_call', {fromUser: user.id, toUser: to});
    setActiveCall({
      fromUser: user.id,
      toUser: to,
      startDate: new Date(),
      status: 'LIVE',
    });
    navigation.navigate('VideoChatScreen');
  };

  const rejectCall = (to: string) => {
    socket?.emit('reject_call', {fromUser: user.id, toUser: to});
    setActiveCall(null);
    navigation.navigate('HomeScreen');
  };

  const endCall = () => {
    if (toUser) {
      rejectCall(toUser);
    }
  };

  const toggleMicrophone = () => {
    const enabled = !isMicrophoneOn;
    setIsMicrophoneOn(enabled);
    localStream?.getAudioTracks().forEach(track => (track.enabled = enabled));
  };

  const toggleCamera = () => {
    const enabled = !isCameraOn;
    setIsCameraOn(enabled);
    localStream?.getVideoTracks().forEach(track => (track.enabled = enabled));
  };

  return (
    <CallContext.Provider
      value={{
        localStream,
        remoteStream,
        isLoading,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        isMicrophoneOn,
        isCameraOn,
        toggleMicrophone,
        toggleCamera,
      }}>
      {children}
    </CallContext.Provider>
  );
};

export const useVideoCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};
