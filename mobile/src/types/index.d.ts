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

type UserStatus = 'online' | 'offline';

type User = {
  id: string;
  fullName: string;
  avatar: string;
  status: UserStatus;
};
