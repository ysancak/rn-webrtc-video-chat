import {generateRandomUserId} from '@/lib/helpers';
import {createSlice} from '@reduxjs/toolkit';

type UserStatus = 'IDLE';

interface State {
  id: string;
  status: UserStatus;
}

const initialState: State = {
  id: generateRandomUserId(),
  status: 'IDLE',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export const {} = userSlice.actions;

export default userSlice.reducer;
