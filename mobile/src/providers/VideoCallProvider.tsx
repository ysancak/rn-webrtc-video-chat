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
    if (activeCall) {
      setupPeerConnection();
      startLocalStream();
    }
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      peerConnection.current = null;
    };
  }, [activeCall]);

  useEffect(() => {
    socket?.on('ice_candidate', handleIceCandidateEvent);
    socket?.on('offer', handleOffer);
    socket?.on('answer', handleAnswer);
    socket?.on('incoming_call', handleIncomingCall);
    socket?.on('call_accepted', handleCallAccepted);
    socket?.on('call_rejected', handleCallRejected);
    return () => {
      socket?.off('offer', handleOffer);
      socket?.off('answer', handleAnswer);
      socket?.off('ice_candidate', handleIceCandidateEvent);
      socket?.off('incoming_call', handleIncomingCall);
      socket?.off('call_accepted', handleCallAccepted);
      socket?.off('call_rejected', handleCallRejected);
    };
  }, [socket, activeCall]);

  const setupPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:stun1.l.google.com:19302'},
        {urls: 'stun:stun2.l.google.com:19302'},
      ],
    });

    peerConnection.current.addEventListener('icecandidate', handleIceCandidate);
    peerConnection.current.addEventListener('track', handleTrackEvent);
    peerConnection.current.addEventListener(
      'negotiationneeded',
      handleNegotiationNeeded,
    );
    peerConnection.current.addEventListener(
      'connectionstatechange',
      handleConnectionChange,
    );
  };

  const startLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {frameRate: 30, facingMode: 'user'},
      });
      setLocalStream(stream);
      stream
        .getTracks()
        .forEach(track => peerConnection.current?.addTrack(track, stream));
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const handleIceCandidate = (event: any) => {
    if (event.candidate) {
      socket?.emit('ice_candidate', {
        toUser: toUser,
        candidate: event.candidate,
      });
    }
  };

  const handleTrackEvent = (event: any) => {
    setRemoteStream(event.streams[0]);
  };

  const handleNegotiationNeeded = async () => {
    if (peerConnection.current) {
      const offer = await peerConnection.current.createOffer({});
      await peerConnection.current.setLocalDescription(offer);
      socket?.emit('offer', {toUser: toUser, sdp: offer});
    }
  };

  const handleOffer = async ({sdp}: {sdp: RTCSessionDescription}) => {
    if (peerConnection.current) {
      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp),
        );
        if (peerConnection.current.remoteDescription?.type === 'offer') {
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket?.emit('answer', {toUser: toUser, sdp: answer});
        }
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    }
  };

  const handleAnswer = async ({sdp}: {sdp: RTCSessionDescription}) => {
    if (peerConnection.current) {
      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp),
        );
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  };

  const handleConnectionChange = () => {
    switch (peerConnection.current?.connectionState) {
      case 'connecting':
        setIsLoading(true);
        break;
      case 'failed':
        endCall();
        break;
      default:
        setIsLoading(false);
    }
  };

  const handleIceCandidateEvent = async ({
    candidate,
  }: {
    candidate: RTCIceCandidate;
  }) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
      }
    } catch (error) {
      console.error('Error adding received ice candidate', error);
    }
  };

  const handleIncomingCall = (data: {fromUser: string}) => {
    navigation.navigate('IncomingCallScreen', {userId: data.fromUser});
  };

  const handleCallAccepted = (data: {fromUser: string}) => {
    setActiveCall({
      fromUser: data.fromUser,
      toUser: user.id,
      startDate: new Date(),
      status: 'LIVE',
    });
    navigation.navigate('VideoChatScreen');
  };

  const handleCallRejected = () => {
    setActiveCall(null);
    navigation.navigate('HomeScreen');
  };

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
