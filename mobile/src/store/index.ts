import {configureStore} from '@reduxjs/toolkit';

import friendsReducer from './reducers/friends';
import userReducer from './reducers/user';

export const store = configureStore({
  reducer: {
    friends: friendsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
