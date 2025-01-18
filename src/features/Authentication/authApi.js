import API, { setcsrfToken } from "../../lib/authAxios";

const createRefPath = (parentPath) => (path) => {
  return `${parentPath}/${path}`;
};

const setAuthHeader = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};

const createAuthPath = createRefPath("authentication");

export const googleAuth = async (idToken) => {
  try {
    const res = await API.post(
      createAuthPath("google"),
      {},
      setAuthHeader(idToken)
    );
    const user = res.data;
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUser = async (updates) => {
  try {
    // Filter out null/undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value != null)
    );

    const res = await API.put("user/update", filteredUpdates);
    const updatedUser = res.data;
    return updatedUser;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUserProfileImg = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    // Debug FormData contents properly
    for (let pair of formData.entries()) {
      console.log("FormData content:", pair[0], pair[1]);
    }

    const res = await API.put("user/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const imgUrl = res.data;
    return imgUrl;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUserEmail = async (newEmail) => {
  try {
    const res = await API.put(createAuthPath("email"), { email: newEmail });
    const updatedUser = res.data;
    return updatedUser;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const authUserLogin = async (idToken) => {
  try {
    const res = await API.post(
      createAuthPath("login"),
      {},
      setAuthHeader(idToken)
    );
    const user = res.data;
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const authUserRegister = async (freshIdToken) => {
  try {
    const res = await API.post(
      createAuthPath("register"),
      {},
      setAuthHeader(freshIdToken)
    );
    const user = res.data;
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const authUserFetch = async () => {
  try {
    const res = await API.get("authentication");
    const user = res.data;
    return user;
  } catch (error) {
    if (error.response.status === 401) error.message = "Please login again";
    return Promise.reject(error);
  }
};

export const authUserUpdate = async (updatedUser) => {
  try {
    const res = await API.update("authentication", updatedUser);
    const user = res.data;
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enableCsrfProtection = async () => {
  try {
    const res = await API.get(createAuthPath("token"));
    setcsrfToken(res.data.csrfToken);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const logout = async () => {
  try {
    return await API.delete(createAuthPath("logout"));
  } catch (error) {
    return Promise.reject(error);
  }
};
