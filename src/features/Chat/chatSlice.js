import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatApi from "./chatApi";
import { setExtraReducer } from "../../utilities/reduxUtil";

const initialState = {
  messages: [],
  currentRoomId: null,
  paticipantId: null,
  isChatOpen: false,
  chatRooms: [],
  loading: false,
  error: null,
  participants: {},
};

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  chatApi.getMessages
);

const getMessagesFullfilled = (state, { payload }) => {
  state.messages = payload;
};

export const fetchEnterChatRoom = createAsyncThunk(
  "chat/enterChatRoom",
  chatApi.enterChatRoom
);

const enterChatRoomFullfilled = (state, { payload }) => {
  state.currentRoomId = payload.roomId;
};

export const fetchChatRooms = createAsyncThunk(
  "chat/getChatRooms",
  chatApi.getChatRooms
);

const getChatRoomsFullfilled = (state, { payload }) => {
  state.chatRooms = payload;
  payload.forEach((room) => {
    room.participants.forEach((participant) => {
      state.participants[participant._id] = participant;
    });
  });
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setCurrentRoomId: (state, action) => {
      state.currentRoomId = action.payload;
    },
    setChatOpen: (state, action) => {
      state.isChatOpen = action.payload;
    },
    setParticipantId: (state, action) => {
      state.paticipantId = action.payload;
    },
    openChatWithFriend: (state, action) => {
      state.isChatOpen = true;
      state.paticipantId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    ...setExtraReducer(fetchEnterChatRoom, enterChatRoomFullfilled),
    ...setExtraReducer(fetchChatRooms, getChatRoomsFullfilled),
    ...setExtraReducer(getMessages, getMessagesFullfilled),
  },
});

export const getParticipant = (userId) => (state) => {
  return state.chat.participants[userId];
};

export const {
  addMessage,
  setCurrentRoomId,
  setChatOpen,
  openChatWithFriend,
  setParticipantId,
  setChatRooms,
  setLoading,
  setError,
} = chatSlice.actions;
export default chatSlice.reducer;
