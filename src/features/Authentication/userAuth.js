import * as firebaseApi from "./firebase";
import { getNewDefaultUserImg } from "../../utilities/getDefaultUserImg";
import * as authApi from "./authApi";
import { parseAndDispatchUserData } from "./userDataMapper";

const parseSlice = (dispatch, _user) => {
  const user = parseAndDispatchUserData(dispatch, _user);
  return user;
};

const fetchUser = async (_, { dispatch }) => {
  try {
    // await authApi.enableCsrfProtection();
    const authUser = await authApi.authUserFetch();
    return parseSlice(dispatch, authUser);
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateUser = async ({ updates }, { dispatch }) => {
  console.log("updates", updates);
  try {
    const updatedUser = await authApi.updateUser(updates);
    return { user: updatedUser };
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateUserProfileImg = async ({ file }, { dispatch }) => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const userImgUrl = await authApi.updateUserProfileImg(file);
    return { userImgUrl };
  } catch (error) {
    console.error("Error in updateUserProfileImg:", error);
    return Promise.reject(error);
  }
};

const loginWithGoogle = async (_, { dispatch }) => {
  try {
    // await authApi.enableCsrfProtection();
    const res = await firebaseApi.loginGoogle();
    const token = await res?.user?.getIdToken();
    const user = await authApi.googleAuth(token);
    return parseSlice(dispatch, user);
  } catch (err) {
    console.error("error", err);
    return Promise.reject(err);
  }
};

const loginWithForm = async ({ email, password }, { dispatch }) => {
  try {
    const res = await firebaseApi.loginWithForm(email, password);
    const token = await res?.user?.getIdToken();
    const user = await authApi.authUserLogin(token);
    return parseSlice(dispatch, user);
  } catch (err) {
    return Promise.reject(err);
  }
};

const registerUser = async ({ username, email, password }, { dispatch }) => {
  const res = await firebaseApi.registerWithEmailAndPassword(email, password);
  const defaultPic = getNewDefaultUserImg(username);
  await firebaseApi.setUsernameAndPictire(res.user, username, defaultPic);
  const token = await res?.user?.getIdToken(true);
  const user = await authApi.authUserRegister(token);
  return { user };
};

const logout = async () => {
  try {
    // First logout from Firebase (though not strictly necessary
    // since we're not using Firebase tokens)
    await firebaseApi.logout();

    // Invalidate the session on your backend
    await authApi.logout();
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
};

const updateUserProfile = async (updates) => {
  try {
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value != null)
    );
    // Handle non-security critical updates
    const updatedUser = await authApi.updateUser(filteredUpdates);
    return updatedUser;
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateUserEmail = async (newEmail) => {
  try {
    // 1. Update Firebase email
    await firebaseApi.setNewEmail(newEmail);
    // 2. force logout
    const updatedUser = await authApi.logout();
    return updatedUser;
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
  fetchUser,
  loginWithGoogle,
  loginWithForm,
  registerUser,
  logout,
  updateUser,
  updateUserProfile,
  updateUserProfileImg,
  updateUserEmail,
};
