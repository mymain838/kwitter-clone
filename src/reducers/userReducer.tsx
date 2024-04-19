import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  email: null,
  password: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setuser(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
