import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as userBookApi from "./userBookCalls";
import * as status from "../../data/asyncStatus";
import { setExtraReducer } from "../../utilities/reduxUtil";

export const addBook = createAsyncThunk(
  "userBooks/addBooks",
  userBookApi.addBook
);

const addBookFullfilled = (state, action) => {
  state.books.owned = [...state.books.owned, action.payload];
};

export const fetchReturnedBooks = createAsyncThunk(
  "userBooks/fetchReturnedBooks",
  userBookApi.fetchReturnedBooks
);

const fetchReturnedBooksFulfilled = (state, action) => {
  state.books.returnedBooks = action.payload;
};

export const deleteUserBook = createAsyncThunk(
  "userBooks/deleteUserBook",
  userBookApi.deleteUserBook
);

const deleteUserBookFulfilled = (state, action) => {
  state.books.owned = state.books.owned.filter(
    (book) => book._id !== action.payload.userBook_id
  );
};

export const getAllBookRequests = createAsyncThunk(
  "userBooks/getAllBookRequests",
  userBookApi.getAllBookRequests
);

const getAllBookRequestsFulfilled = (state, action) => {
  state.books.requests = action.payload;
};

export const createBookRequest = createAsyncThunk(
  "userBooks/createRequest",
  userBookApi.createBookRequest
);

const createBookRequestFullfilled = (state, action) => {
  state.books.borrowed.push(action.payload.bookRequest);
};

export const updateCurrentRead = createAsyncThunk(
  "useBooks/updateCurrentRead",
  userBookApi.updateCurrentRead
);

const updateCurrentReadFulfilled = (state, action) => {
  console.log("state", state);
  const new_id = action.payload.userBook_id;
  state.currentRead = state.books.borrowed.find(({ _id }) => _id === new_id);
};

export const updateCurrentPage = createAsyncThunk(
  "userBooks/updateCurrentPage",
  userBookApi.updateCurrentPage
);

const updateCurrentPageFulfilled = (state, action) => {
  console.log("state in updateCurrentPageFulfilled", state);
  const book_id = action.payload.userBook_id;
  const bookIdx = state.books.borrowed.findIndex(({ _id }) => {
    console.log("_id === book_id", _id === book_id, _id, book_id);
    return _id === book_id;
  });
  console.log("state.books.borrowed", state.books.borrowed);
  console.log("bookIdx", bookIdx);
  state.books.borrowed[bookIdx].currentPage = action.payload.currentPage;
};

export const updateLendRequestStatus = createAsyncThunk(
  "userBooks/updateLendRequestStatus",
  userBookApi.nextBookRequestStatus
);

const updateLendRequestStatusFulfilled = (state, action) => {
  const request_id = action.payload.bookRequest._id;
  // Update the request status in the owned books array
  const bookIdx = state.books.owned.findIndex((book) => {
    console.log("book.requests", book.requests);
    return book.requests?.some((request) => request._id === request_id);
  });
  if (bookIdx !== -1) {
    const requestIdx = state.books.owned[bookIdx].requests.findIndex(
      (request) => request._id === request_id
    );
    state.books.owned[bookIdx].requests[requestIdx] = {
      ...state.books.owned[bookIdx].requests[requestIdx],
      status: action.payload.bookRequest.status,
      statusHistory: action.payload.bookRequest.statusHistory,
    };
  }
};

export const updateBorrowRequestStatus = createAsyncThunk(
  "userBooks/updateBorrowRequestStatus",
  userBookApi.nextBookRequestStatus
);

const updateBorrowRequestStatusFulfilled = (state, action) => {
  const request_id = action.payload.bookRequest._id;
  // Update the request status in the borrowed books array
  const bookIdx = state.books.borrowed.findIndex(({ request }) => {
    return request._id === request_id;
  });
  if (bookIdx !== -1) {
    state.books.borrowed[bookIdx].request = {
      ...state.books.borrowed[bookIdx].request,
      status: action.payload.bookRequest.status,
      statusHistory: action.payload.bookRequest.statusHistory,
    };
  }
};

export const initiateBookReturnRequest = createAsyncThunk(
  "userBooks/initiateBookReturnRequest ",
  userBookApi.initiateBookReturnRequest
);

export const cancelBookReturnRequest = createAsyncThunk(
  "userBooks/cancelBookReturnRequest",
  userBookApi.cancelBookReturnRequest
);

export const cancelBorrowRequest = createAsyncThunk(
  "userBooks/cancelBorrowRequest",
  userBookApi.cancelBorrowRequest
);

const cancelBorrowRequestFulfilled = (state, action) => {
  state.books.borrowed = state.books.borrowed.map((book) => {
    if (book.request._id === action.payload.bookRequest._id) {
      // Return the book with the updated request
      return {
        ...book,
        request: action.payload.bookRequest,
      };
    }
    return book; // Return unchanged book if it's not the one being updated
  });
};

export const declineLendingRequest = createAsyncThunk(
  "userBooks/declineLendingRequest",
  userBookApi.declineLendingRequest
);

const declineLendingRequestFulfilled = (state, action) => {
  state.books.owned.forEach((book) => {
    book.requests = book.requests.filter(
      (request) => request._id !== action.payload.bookRequest._id
    );
  });
};

export const updateRequestPictureRequired = createAsyncThunk(
  "userBooks/updateRequestPictureRequired",
  userBookApi.updateRequestPictureRequired
);

const updateRequestPictureRequiredFulfilled = (state, action) => {
  const request_id = action.payload.bookRequest._id;
  let requestIdx;

  const bookIdx = state.books.owned.findIndex((book) => {
    requestIdx = book.requests?.findIndex(
      (request) => request._id === request_id
    );
    return requestIdx !== -1;
  });

  if (bookIdx !== -1) {
    state.books.owned[bookIdx].requests[requestIdx].pictureRequired =
      action.payload.bookRequest.pictureRequired;
  }
};

export const userBooksSlice = createSlice({
  name: "userBooks",

  initialState: {
    currentRead: null,
    books: {
      borrowed: [],
      owned: [],
      returnedBooks: null,
      requests: [],
    },
    status: status.IDLE,
    error: null,
  },
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    setCurrentRead: (state, action) => {
      state.currentRead = action.payload.currentRead;
    },
  },
  extraReducers: {
    ...setExtraReducer(fetchReturnedBooks, fetchReturnedBooksFulfilled),
    ...setExtraReducer(addBook, addBookFullfilled),
    ...setExtraReducer(deleteUserBook, deleteUserBookFulfilled),
    ...setExtraReducer(createBookRequest, createBookRequestFullfilled),
    ...setExtraReducer(updateCurrentRead, updateCurrentReadFulfilled),
    ...setExtraReducer(updateCurrentPage, updateCurrentPageFulfilled),
    ...setExtraReducer(
      updateLendRequestStatus,
      updateLendRequestStatusFulfilled
    ),
    ...setExtraReducer(
      updateBorrowRequestStatus,
      updateBorrowRequestStatusFulfilled
    ),
    ...setExtraReducer(
      initiateBookReturnRequest,
      updateLendRequestStatusFulfilled
    ),
    ...setExtraReducer(
      cancelBookReturnRequest,
      updateLendRequestStatusFulfilled
    ),
    ...setExtraReducer(cancelBorrowRequest, cancelBorrowRequestFulfilled),
    ...setExtraReducer(declineLendingRequest, declineLendingRequestFulfilled),
    ...setExtraReducer(
      updateRequestPictureRequired,
      updateRequestPictureRequiredFulfilled
    ),
    ...setExtraReducer(getAllBookRequests, getAllBookRequestsFulfilled),
  },
});
export const createBookFromRequestFinder = (state) => (request_id) => {
  const bookFromOwned = state.userBooks.books.owned.find((book) =>
    book.requests?.some((request) => request._id === request_id)
  );
  const bookFromBorrowed = state.userBooks.books.borrowed.find(
    (book) => book.request._id === request_id
  );

  if (bookFromOwned) {
    const request = bookFromOwned.requests.find(
      (req) => req._id === request_id
    );
    return {
      ...bookFromOwned,
      isOwned: true,
      sender: request.sender,
      request: { status: request.status, _id: request._id },
    };
  }
  if (bookFromBorrowed) {
    console.log("bookFromBorrowed", bookFromBorrowed);
    return {
      ...bookFromBorrowed,
      isOwned: false,
      request: {
        status: bookFromBorrowed.request.status,
        _id: bookFromBorrowed.request._id,
      },
    };
  }
};

export const { setBooks, setCurrentRead } = userBooksSlice.actions;

export default userBooksSlice.reducer;
