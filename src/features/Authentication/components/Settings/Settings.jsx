import {
  faEnvelope,
  faUser,
  faLock,
  faAddressCard,
  faLocationDot,
  faEye,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, EditButtons, EditInput } from "../../../../components";
import styles from "./Settings.module.scss";
import { sendPasswordReset } from "../../firebase";
import { updateUser, updateUserProfileImg } from "../../authUserSlice";
import useLocationSearch from "./hooks/useLocationSearch";
import * as asyncStatus from "../../../../data/asyncStatus";
const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser, userStatus } = useSelector((state) => state.authUser);
  const [settingsState, setSettingsState] = useState({
    values: {
      img: "",
      name: "",
      bio: "",
      location: "",
      visibility: "public",
      email: "",
    },
    initialValues: {
      img: "",
      name: "",
      bio: "",
      location: "",
      visibility: "public",
      email: "",
    },
    editMode: {
      img: false,
      name: false,
      email: false,
      password: false,
      bio: false,
      location: false,
      visibility: false,
    },
  });

  const isLoading = userStatus === asyncStatus.LOADING;
  const isSuccess = userStatus === asyncStatus.SUCCEEDED;
  console.log("isLoading", isLoading, userStatus);

  const { debouncedSearchLocation, isLoadingLocations, locationSuggestions } =
    useLocationSearch();

  const nameInputRef = useRef(null);

  const [errors, setErrors] = useState({
    email: "",
    name: "",
  });

  useEffect(() => {
    if (currentUser) {
      const newValues = {
        img: currentUser.profilePic || "",
        name: currentUser.username || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        visibility: currentUser.visibility || "public",
        email: currentUser.email || "",
      };

      setSettingsState((prev) => ({
        ...prev,
        values: newValues,
        initialValues: newValues,
      }));
    }
  }, [currentUser]);

  const areValuesEqual = {
    name: settingsState.values.name === settingsState.initialValues.name,
    bio: settingsState.values.bio === settingsState.initialValues.bio,
    location:
      settingsState.values.location === settingsState.initialValues.location,
    visibility:
      settingsState.values.visibility ===
      settingsState.initialValues.visibility,
    email: settingsState.values.email === settingsState.initialValues.email,
  };

  const setAllEditModesToFalse = () => {
    setSettingsState((prev) => ({
      ...prev,
      editMode: Object.keys(prev.editMode).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    }));
  };

  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
    return () => {};
  }, []);

  const fileInputRef = useRef("");
  if (!currentUser) return null;

  const handleFileUpload = async (file) => {
    if (!file) {
      console.error("file is undefined or null");
      return;
    }
    try {
      console.log("file in fileupload", file);
      await dispatch(updateUserProfileImg({ file })).unwrap();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username must be less than 30 characters";
    // You can add more rules like: only alphanumeric characters
    if (!/^[a-zA-Z0-9_ ]+$/.test(username))
      return "Username can only contain letters, numbers, spaces, and underscores";
    return "";
  };

  const handleEmailChange = (value) => {
    setSettingsState((prev) => ({
      ...prev,
      values: { ...prev.values, email: value },
    }));
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handleUsernameChange = (value) => {
    setSettingsState((prev) => ({
      ...prev,
      values: { ...prev.values, name: value },
    }));
    setErrors((prev) => ({ ...prev, name: validateUsername(value) }));
  };

  const handleSubmit = async (e) => {
    let updates = {};
    let hasErrors = false;

    try {
      if (!areValuesEqual.name) {
        const nameError = validateUsername(settingsState.values.name);
        setErrors((prev) => ({ ...prev, name: nameError }));
        if (nameError) hasErrors = true;
        else updates.username = settingsState.values.name || null;
      }

      if (!areValuesEqual.email) {
        const emailError = validateEmail(settingsState.values.email);
        setErrors((prev) => ({ ...prev, email: emailError }));
        if (emailError) hasErrors = true;
        else updates.email = settingsState.values.email || null;
      }

      if (hasErrors) {
        console.log("Validation errors found");
        return;
      }

      if (!areValuesEqual.bio && settingsState.values.bio !== "") {
        updates.bio = settingsState.values.bio;
      }

      if (!areValuesEqual.location && settingsState.values.location !== "") {
        updates.location = settingsState.values.location;
      }

      if (!areValuesEqual.visibility) {
        updates.visibility = settingsState.values.visibility;
      }

      if (Object.keys(updates).length > 0) {
        await dispatch(updateUser({ updates })).unwrap();
      }

      if (settingsState.values.file) {
        await handleFileUpload(settingsState.values.file);
      }

      setAllEditModesToFalse();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSettingsState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          img: URL.createObjectURL(file),
          file: file,
        },
        editMode: { ...prev.editMode, img: true },
      }));
    }
  };

  const onCancel = () => {
    if (hasChanges()) {
      const confirmCancel = window.confirm(
        "Are you sure you want to discard your changes?"
      );
      if (!confirmCancel) return;
    }
    setSettingsState((prev) => ({
      ...prev,
      values: { ...prev.initialValues },
      editMode: Object.keys(prev.editMode).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    }));
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordReset(currentUser.email);
      alert("Password reset email sent! Please check your inbox.");
      setSettingsState((prev) => ({
        ...prev,
        editMode: { ...prev.editMode, password: false },
      }));
    } catch (error) {
      alert("Failed to send password reset email: " + error);
    }
  };

  const hasChanges = () => {
    return (
      settingsState.values.img !== settingsState.initialValues.img ||
      settingsState.values.name !== settingsState.initialValues.name ||
      settingsState.values.bio !== settingsState.initialValues.bio ||
      settingsState.values.location !== settingsState.initialValues.location ||
      settingsState.values.visibility !==
        settingsState.initialValues.visibility ||
      settingsState.values.email !== settingsState.initialValues.email
    );
  };

  const handleEditClick = (field) => {
    setSettingsState((prev) => ({
      ...prev,
      editMode: {
        ...Object.keys(prev.editMode).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {}),
        [field]: true,
      },
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div
          className={styles.profilePic}
          onClick={() => {
            fileInputRef.current.click();
          }}
          role="button"
          aria-label="Change profile picture"
        >
          <Avatar
            imgSrc={settingsState.values.img}
            username={settingsState.values.name}
            size="xl"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onFileChange}
          hidden
          aria-hidden="true"
        />
      </div>

      <div className={styles.profileSection}>
        <div className={styles.label}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.labelIcon} />
          Email
        </div>
        <EditInput
          isEdit={!settingsState.editMode.email}
          name={settingsState.values.email}
          value={settingsState.values.email}
          handleClick={() => handleEditClick("email")}
          set={handleEmailChange}
          error={errors.email}
        />
        {settingsState.editMode.email && errors.email && (
          <div className={styles.errorMessage}>{errors.email}</div>
        )}
      </div>

      <div className={styles.profileSection}>
        <div className={styles.label}>
          <FontAwesomeIcon icon={faUser} className={styles.labelIcon} />
          Username
        </div>
        <EditInput
          isEdit={!settingsState.editMode.name}
          name={settingsState.values.name}
          value={settingsState.values.name}
          handleClick={() => handleEditClick("name")}
          set={handleUsernameChange}
          error={errors.name}
        />
        {settingsState.editMode.name && errors.name && (
          <div className={styles.errorMessage}>{errors.name}</div>
        )}
      </div>

      <div className={styles.profileSection}>
        <div className={styles.label}>
          <FontAwesomeIcon icon={faLock} className={styles.labelIcon} />
          Password
        </div>
        <Button onClick={handlePasswordReset} variant="secondary">
          Send Password Reset Email
        </Button>
      </div>

      <div className={styles.profileSection}>
        <h2>Profile Settings</h2>

        <div className={styles.profileSection}>
          <div className={styles.label}>
            <FontAwesomeIcon
              icon={faAddressCard}
              className={styles.labelIcon}
            />
            Bio
          </div>
          <EditInput
            isEdit={!settingsState.editMode.bio}
            name={settingsState.values.bio || "Add a bio"}
            value={settingsState.values.bio}
            handleClick={() => handleEditClick("bio")}
            set={(value) => {
              setSettingsState((prev) => ({
                ...prev,
                values: {
                  ...prev.values,
                  bio: value === "Add a bio" ? "" : value,
                },
              }));
            }}
            multiline={true}
          />
        </div>

        <div className={styles.profileSection}>
          <div className={styles.label}>
            <FontAwesomeIcon
              icon={faLocationDot}
              className={styles.labelIcon}
            />
            Location
          </div>
          <EditInput
            isEdit={!settingsState.editMode.location}
            name={settingsState.values.location || "Add location"}
            value={settingsState.values.location}
            handleClick={() => handleEditClick("location")}
            set={(value) => {
              setSettingsState((prev) => ({
                ...prev,
                values: {
                  ...prev.values,
                  location: value === "Add location" ? "" : value,
                },
              }));
              debouncedSearchLocation(value);
            }}
            dropdown={true}
            suggestions={locationSuggestions}
            isLoading={isLoadingLocations}
          />
        </div>

        <div className={styles.profileSection}>
          <div className={styles.label}>
            <FontAwesomeIcon icon={faEye} className={styles.labelIcon} />
            Profile Visibility
          </div>
          <select
            value={settingsState.values.visibility}
            onChange={(e) =>
              setSettingsState((prev) => ({
                ...prev,
                values: {
                  ...prev.values,
                  visibility: e.target.value,
                },
              }))
            }
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className={styles.editBtns}>
        {hasChanges() ? (
          <EditButtons
            onSubmit={handleSubmit}
            onClose={onCancel}
            isLoading={isLoading}
          />
        ) : isSuccess ? (
          <div className={styles.successMessage}>
            Your Settings have been updated <FontAwesomeIcon icon={faCheck} />
          </div>
        ) : (
          <div>No changes made</div>
        )}
      </div>
    </div>
  );
};

export default Settings;
