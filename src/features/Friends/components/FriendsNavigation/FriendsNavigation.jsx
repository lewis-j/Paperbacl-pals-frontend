import { faCircleChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { _s } from "../../../../style";
import { upperFirst } from "../../../../utilities/stringUtil";
import styles from "./FriendsNavigation.module.scss";
import { openChatWithFriend } from "../../../Chat/chatSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const navItems = ["library", "message"];

const FriendsNavigation = ({ isOpen, toggleList, _style }) => {
  const dispatch = useDispatch();
  const currentFriend = useSelector((state) => state.friends.currentFriend);
  const { pathname } = useLocation();
  const [active, set] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    //fetch user data with user_id
    const name = pathname.split("/")[2];
    set(name);
  }, [pathname]);

  const handleClick = (name) => {
    navigate(name);
  };

  const getNavProps = (item) => {
    const { click, classStyle } =
      active !== item
        ? {
            click: () => {
              handleClick(item);
            },
            classStyle: styles.nav_item,
          }
        : {
            click: () => null,
            classStyle: _s(styles.nav_item, styles.active),
          };

    return { click, classStyle };
  };

  return (
    <div className={styles.nav} style={_style}>
      <span onClick={() => toggleList()} className={styles.nav_item}>
        <FontAwesomeIcon
          icon={faCircleChevronDown}
          className={
            isOpen ? styles.icon : `${styles.icon} ${styles.iconRotate}`
          }
        />
      </span>

      {navItems.map((item, i) => {
        let navProps;
        if (item === "message") {
          navProps = {
            click: () => {
              if (currentFriend) {
                dispatch(openChatWithFriend(currentFriend._id));
              }
            },
            classStyle: styles.nav_item,
          };
        } else {
          navProps = getNavProps(item);
        }

        return (
          <span
            key={`friendsNav${i}`}
            onClick={navProps.click}
            className={navProps.classStyle}
          >
            {upperFirst(item)}
          </span>
        );
      })}
    </div>
  );
};

export default FriendsNavigation;
