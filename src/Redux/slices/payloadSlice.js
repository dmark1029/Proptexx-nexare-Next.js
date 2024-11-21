import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const payloadSlice = createSlice({
  name: "payload",
  initialState,
  reducers: {
    setPayload: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const selectPayload = (state) => state?.payload?.data || null;
export const { setPayload, resetPayload } = payloadSlice.actions;
export const payloadReducer = payloadSlice.reducer;