import {useSocket} from '@/providers/SocketProvider';
import {selectUser} from '@/store/reducers/user/selectors';
import {useEffect, useMemo, useRef, useState} from 'react';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {useSelector} from 'react-redux';

const iceConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'stun:stun2.l.google.com:19302',
    },
  ],
};

const mediaConfig = {
  audio: true,
  video: {
    frameRate: 60,
    facingMode: 'user',
  },
};

export default function useCall() {
  const {socket, activeCall, rejectCall} = useSocket();
  const user = useSelector(selectUser);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const toUser = useMemo(() => {
    if (activeCall) {
      return activeCall.fromUser === user.id
        ? activeCall.toUser
        : activeCall.fromUser;
    }
  }, [activeCall, user]);

  useEffect(() => {
    if (!activeCall) {
      return;
    }

    const startLocalStream = async () => {
      const stream = await mediaDevices.getUserMedia(mediaConfig);
      setLocalStream(stream);

      if (peerConnection.current) {
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream);
        });
      }
    };

    const setupPeerConnection = () => {
      peerConnection.current = new RTCPeerConnection(iceConfig);
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

    startLocalStream();
    setupPeerConnection();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      peerConnection.current = null;
    };
  }, [activeCall, socket]);

  useEffect(() => {
    socket?.on('offer', async ({sdp}) => {
      if (peerConnection.current) {
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
      }
    });

    socket?.on('answer', async ({sdp}) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp),
        );
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

    return () => {
      socket?.off('offer');
      socket?.off('answer');
      socket?.off('ice_candidate');
    };
  }, [socket]);

  const endCallHandler = () => {
    if (toUser) {
      rejectCall(toUser);
    }
  };

  return {
    localStream,
    remoteStream,
    endCall: endCallHandler,
  };
}
