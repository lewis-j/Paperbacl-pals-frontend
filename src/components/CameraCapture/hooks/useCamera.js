export const useCamera = () => {
  const takePicture = () => {
    return new Promise((resolve, reject) => {
      // Create file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment"; // Use back camera when possible

      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          resolve(file);
        } else {
          reject(new Error("No image selected"));
        }
      };

      // Trigger file input
      input.click();
    });
  };

  return { takePicture };
};
