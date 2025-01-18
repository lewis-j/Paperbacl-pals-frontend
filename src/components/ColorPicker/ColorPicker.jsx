import styles from "./ColorPicker.module.scss";
import { SliderPicker } from "react-color";
import { useState } from "react";

const ColorPicker = () => {
  const [value, setValue] = useState("");
  return (
    <div className={styles.container}>
      <SliderPicker
        color={value}
        onChangeComplete={(_value) => {
          setValue(_value);
        }}
      />
    </div>
  );
};
export default ColorPicker;
