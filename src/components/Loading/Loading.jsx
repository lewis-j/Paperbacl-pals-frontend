import styles from "./Loading.module.scss";
import whiteLogo from "../../Assets/imgs/pppals_white.png";
import blackLogo from "../../Assets/imgs/pppals.png";
import { _s } from "../../style";

const Loading = ({ isLight = false }) => {
  const { logo, spinner: theme } = isLight
    ? { logo: whiteLogo, spinner: "light" }
    : { logo: blackLogo, spinner: "dark" };

  return (
    <div className={styles.container}>
      <div className={_s(styles.spinner, styles[theme])}> </div>
      <img
        className={_s(styles.img, styles.logo)}
        src={logo}
        alt="paperback pals"
      />
    </div>
  );
};

export default Loading;
