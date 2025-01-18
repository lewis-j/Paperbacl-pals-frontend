import React from "react";
import { useCamera } from "./hooks/useCamera";

export const CameraCapture = ({ onCapture, className, children, disabled }) => {
  const { takePicture } = useCamera();

  const handleCapture = async () => {
    try {
      const photo = await takePicture();
      console.log("Photo taken:", photo);
      onCapture(photo);
    } catch (error) {
      console.error("Failed to take photo:", error);
    }
  };

  return (
    <button onClick={handleCapture} className={className} disabled={disabled}>
      {children}
    </button>
  );
};
