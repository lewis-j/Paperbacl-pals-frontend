import * as status from "../data/asyncStatus";

const rejectionReducer = (state, action) => {
  state.status = status.FAILED;
  state.error = action.error.message;
  console.error(action.error.message);
};

const pendingReducer = (state, action) => {
  state.status = status.LOADING;
  state.error = null;
};

const setSuccessState = (fulfilledReducer) => (state, action) => {
  fulfilledReducer(state, action);
  state.status = status.SUCCEEDED;
  state.error = null;
};

const setExtraReducer = (asyncThunk, fulfilledReducer) => {
  return {
    [asyncThunk.fulfilled]: setSuccessState(fulfilledReducer),
    [asyncThunk.rejected]: rejectionReducer,
    [asyncThunk.pending]: pendingReducer,
  };
};

export { setExtraReducer };
