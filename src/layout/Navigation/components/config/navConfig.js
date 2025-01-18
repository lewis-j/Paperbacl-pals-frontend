import {
  faHome,
  faBookOpenReader,
  faBook,
  faBell,
  faMessage,
  faUsers,
  faCircleUser,
  faCog,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

export const navItems = {
  primary: [
    { id: "home", label: "Home", icon: faHome, path: "/app" },
    {
      id: "borrowed",
      label: "Borrowed",
      icon: faBookOpenReader,
      path: "borrowed",
    },
    { id: "library", label: "Library", icon: faBook, path: "library" },
  ],
  secondary: [
    {
      id: "notifications",
      label: "Notifications",
      icon: faBell,
      action: "toggleNotifications",
    },
    {
      id: "messages",
      label: "Messages",
      icon: faMessage,
      action: "toggleChat",
    },
    { id: "friends", label: "Friends", icon: faUsers, path: "friends" },
    {
      id: "profile",
      label: "Profile",
      icon: faCircleUser,
      action: "openProfileMenu",
    },
  ],
  accountMenu: [
    {
      id: "profile",
      label: "Profile",
      icon: faCircleUser,
      path: "profile",
    },
    { id: "settings", label: "Settings", icon: faCog, path: "settings" },
    { id: "logout", label: "Logout", icon: faSignOut, action: "logout" },
  ],
};
