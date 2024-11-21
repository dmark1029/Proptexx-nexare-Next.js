import { createSlice } from "@reduxjs/toolkit";

let detectedLanguage = "en"; // Default to 'en'

if (typeof navigator !== "undefined") {
  detectedLanguage = navigator.language || "en";
}

const initialState = {
  user: {},
  redirection: {
    pathname: "",
    stepsData: {},
  },
  finalImage: null,
  language: detectedLanguage,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRedirection: (state, action) => {
      state.redirection = action.payload;
    },
    setFinalImage: (state, action) => {
      state.finalImage = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    resetUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const selectUserId = (state) => {
  if (state?.auth?.user?.user?._id) {
    return state.auth.user.user._id;
  }
};

export const {
  setUser,
  setRedirection,
  setFinalImage,
  setLanguage,
  resetUser,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
