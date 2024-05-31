export interface CallData {
    fromUser: string
    toUser: string;
}

export interface IOffer {
  toUser: string, 
  sdp: RTCSessionDescription
}

export interface IIceCandidate {
  toUser: string, 
  candidate: RTCIceCandidate
}