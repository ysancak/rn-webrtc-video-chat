type RootStackParamList = {
  FriendListScreen: undefined;
  HomeScreen: undefined;
  IncomingCallScreen: {
    userId: string;
  };
  OutgoingCallScreen: {
    userId: string;
  };
  VideoChatScreen: undefined;
};

interface CallData {
  fromUser: string;
  toUser: string;
}

interface ActiveCall extends CallData {
  startDate: Date;
  status: 'IDLE' | 'LIVE';
}

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

type UserStatus = 'online' | 'offline';

type User = {
  id: string;
  fullName: string;
  avatar: string;
  status: UserStatus;
};
