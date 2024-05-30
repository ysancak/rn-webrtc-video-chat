import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: User[] = [
  {
    id: '77523de3c75a',
    fullName: 'Mehmet Yılmaz',
    avatar: 'https://avatar.iran.liara.run/public/15',
    status: 'online',
  },
  {
    id: 'a835f5d5f76d',
    fullName: 'Fatma Demir',
    avatar: 'https://avatar.iran.liara.run/public/62',
    status: 'offline',
  },
  {
    id: 'c45b7e6a8e1f',
    fullName: 'Zeynep Çelik',
    avatar: 'https://avatar.iran.liara.run/public/88',
    status: 'online',
  },
  {
    id: 'e96f3d4b1c2e',
    fullName: 'Hüseyin Kılıç',
    avatar: 'https://avatar.iran.liara.run/public/37',
    status: 'online',
  },
];

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addNewFriend: (state, action: PayloadAction<User>) => {
      state = [...state, action.payload];
    },
  },
});

export const {addNewFriend} = friendsSlice.actions;

export default friendsSlice.reducer;
