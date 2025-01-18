import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Tesseract from "tesseract.js";
import styles from "./OCRButton.module.scss";
import { CameraCapture } from "../CameraCapture/CameraCapture";

const BASE_PATH =
  process.env.NODE_ENV === "production" ? process.env.PUBLIC_URL : "";

const OCRButton = ({ onTextExtracted, disabled }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef(null);

  const handleImageUpload = async (photoBlob) => {
    if (!photoBlob) return;

    setIsProcessing(true);

    try {
      // Create a new worker instance with direct paths
      workerRef.current = await Tesseract.createWorker({
        workerPath: `${BASE_PATH}/tesseract-core/worker.min.js`,
        langPath: `${BASE_PATH}/tesseract-core/lang-data`,
        corePath: `${BASE_PATH}/tesseract-core/tesseract-core.wasm.js`,
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(parseInt(m.progress * 100));
          }
        },
      });

      // Initialize worker with simpler settings
      await workerRef.current.loadLanguage("eng");
      await workerRef.current.initialize("eng");
      await workerRef.current.setParameters({
        tessedit_pageseg_mode: "3", // Fully automatic page segmentation, but no OSD
        textord_min_linesize: "3.0",
        classify_min_scale: "2.0",
      });

      const preprocessImage = async (blob) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const MAX_SIZE = 3072;
            const MIN_SIZE = 1536;
            let width = img.width;
            let height = img.height;

            console.log("Original dimensions:", { width, height });

            if (width < MIN_SIZE && height < MIN_SIZE) {
              if (width > height) {
                height *= MIN_SIZE / width;
                width = MIN_SIZE;
              } else {
                width *= MIN_SIZE / height;
                height = MIN_SIZE;
              }
            } else if (width > height && width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }

            width = Math.round(width);
            height = Math.round(height);
            console.log("Processed dimensions:", { width, height });

            canvas.width = width;
            canvas.height = height;

            // Enhanced settings for larger text
            ctx.filter = "contrast(1.3) brightness(1.05) saturate(0.9)";

            // Draw with slight blur to reduce noise
            ctx.drawImage(img, 0, 0, width, height);
            ctx.filter = "blur(1px)";
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);

            canvas.toBlob(
              (processedBlob) => {
                const imageUrl = URL.createObjectURL(processedBlob);
                console.log("Optimized image URL:", imageUrl);
                window.open(imageUrl, "_blank");
                resolve(processedBlob);
              },
              "image/jpeg",
              0.95
            );
          };
          img.src = URL.createObjectURL(blob);
        });
      };
      const optimizedImage = await preprocessImage(photoBlob);
      // Recognize text
      const result = await workerRef.current.recognize(optimizedImage);

      // Clean up the extracted text
      const extractedText = result.data.text
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, " ")
        .replace(/\b\w\b/g, "")
        .replace(/\s+/g, " ")
        .trim();

      onTextExtracted(extractedText);
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      // Properly terminate the worker
      if (workerRef.current) {
        await workerRef.current.terminate();
        workerRef.current = null;
      }
      setIsProcessing(false);
      setProgress(0);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Ensure worker is terminated when component unmounts
      const cleanup = async () => {
        if (workerRef.current) {
          try {
            await workerRef.current.terminate();
            workerRef.current = null;
          } catch (error) {
            console.error("Error cleaning up Tesseract worker:", error);
          }
        }
      };
      cleanup();
    };
  }, []);

  return (
    <>
      <CameraCapture
        onCapture={handleImageUpload}
        className={styles.cameraBtn}
        disabled={disabled || isProcessing}
      >
        <FontAwesomeIcon
          icon={faCamera}
          size="lg"
          className={isProcessing ? styles.spinning : ""}
        />
      </CameraCapture>
      {isProcessing && (
        <div className={styles.progressIndicator}>Processing: {progress}%</div>
      )}
    </>
  );
};

export default OCRButton;
