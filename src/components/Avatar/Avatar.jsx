import { useState, useMemo } from "react";
import { _s } from "../../style";
import { getDefaultUserImg } from "../../utilities/getDefaultUserImg";
import styles from "./Avatar.module.scss";

const Avatar = ({ imgSrc, username, size = "md" }) => {
  const [isError, setIsError] = useState(false);
  const _src = useMemo(() => {
    return !isError ? imgSrc : getDefaultUserImg(username);
  }, [isError, imgSrc, username]);
  return (
    <img
      src={_src}
      rel="noopener noreferrer"
      alt="profile"
      className={_s(styles.img, styles[size])}
      onError={() => setIsError(true)}
    />
  );
};
export default Avatar;
