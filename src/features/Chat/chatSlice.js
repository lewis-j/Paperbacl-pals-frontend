import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatApi from "./chatApi";

const initialState = {
  messages: {},
  currentRoomId: null,
  paticipantId: null,
  isChatOpen: false,
  chatRooms: [],
  loading: false,
  error: null,
  participants: {},
  hasMoreMessages: true,
  currentPage: 1,
};

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  chatApi.getMessages
);

export const fetchEnterChatRoom = createAsyncThunk(
  "chat/enterChatRoom",
  chatApi.enterChatRoom
);

export const fetchChatRooms = createAsyncThunk(
  "chat/getChatRooms",
  chatApi.getChatRooms
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { roomId } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(action.payload);
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
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.fulfilled, (state, { payload }) => {
        const { roomId, messages, hasMore, page } = payload;
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }

        if (page === 1) {
          state.messages[roomId] = messages;
        } else {
          state.messages[roomId] = [...messages, ...state.messages[roomId]];
        }
        state.hasMoreMessages = hasMore;
        state.currentPage = page;
      })
      .addCase(fetchEnterChatRoom.fulfilled, (state, { payload }) => {
        state.currentRoomId = payload.roomId;
      })
      .addCase(fetchChatRooms.fulfilled, (state, { payload }) => {
        state.chatRooms = payload;
        payload.forEach((room) => {
          room.participants.forEach((participant) => {
            state.participants[participant._id] = participant;
          });
        });
      })
      // Add matchers for common status handling
      .addMatcher(
        (action) =>
          action.type.startsWith("chat/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("chat/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("chat/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
          console.error(action.error.message);
        }
      );
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
