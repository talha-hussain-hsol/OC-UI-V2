import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useTheme } from "../../contexts/themeContext";

function CameraCapture({
  handleChangeLocation,
  onImageCapture,
  faceSnapkey,
  index,
  isIdCard,
  resetData,
  cameraCloseBrowser,
  handleSetFaceImages,
  faceImages,
  dataOfAccountSetups,
}) {

  console.log("dataOfAccountSetups1231",dataOfAccountSetups)
  console.log(faceSnapkey, "faceSnapkey");
  const { theme } = useTheme();
  const [showCamera, setShowCamera] = useState(true);
  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let stream;
  useEffect(() => {
    const initializeCameraAndLocation = async () => {
      await startCamera();
      getLocation();
    };

    initializeCameraAndLocation();

    return () => {
      // Clean up by stopping the camera stream when unmounting
      stopCamera();
    };
  }, []);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleChangeLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to retrieve your location. Please check your browser settings."
          );
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      alert("Geolocation is not supported by your browser.");
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera access is not supported by your browser.");
      alert("Your browser does not support camera access.");
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Camera started", videoRef);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Unable to access the camera. Please check your browser settings or permissions."
      );
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedImageData = canvas.toDataURL("image/png");
    setImageData(capturedImageData);
    setShowCamera(false);

    let data = {
      capturedImageData: capturedImageData,
      faceSnapkey: faceSnapkey,
      index: index,
    };
    onImageCapture(data);
    cameraCloseBrowser(stream, videoRef);
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log("Stopping camera track", track);
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    console.log("Camera stopped");
  };

  const retakeImage = () => {
    setImageData(null);
    setShowCamera(true);
    startCamera();
    onImageCapture(null);
    resetData(faceSnapkey);
    console.log("faceSnapkeyabcvs", faceSnapkey);
    console.log("faceSnapkeyabcvs faceImages", faceImages);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div>
      {showCamera && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              filter:  dataOfAccountSetups?.[0]?.fundData?.fund_data?.fund_setting?.account?.applicant
              ?.identity?.indivisual?.provider?.verify?.face?.isBlured
                ? "blur(5px)"
                : "",
            }}
          >
            {console.log(
              dataOfAccountSetups?.[0]?.fundData?.fund_data?.fund_setting?.account?.applicant
                ?.identity?.indivisual?.provider?.verify?.face?.isBlured,
              "check"
            )}
            <img
              src={isIdCard ? "/img/idcardscanner.png" : "/img/face.png"}
              style={{
                height: "340px",
                paddingTop: "30px",
                position: "absolute",
                opacity: "1",
                paddingBottom: "30px",
              }}
              alt=""
            />
            <video
              ref={videoRef}
              autoPlay
              style={{ width: "100%", height: "330px" }}
            />
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
            }}
          >
            <Button
              variant="primary"
              className={`bg-color-button1-SC text-white py-4 lg:py-[10px] px-4 rounded-lg mx-auto block mt-10`}
              onClick={async () => {
                const imageData = await captureImage();
                const base64Data = await convertToBase64(imageData);
                setImageData(base64Data);
                cameraCloseBrowser(stream, videoRef);
                captureImage()
              }}
            >
              Capture Image
            </Button>
          </div>
        </>
      )}
      {console.log(imageData, "img data")}

      {imageData && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={imageData}
            alt="Captured"
            style={{
              height: "340px",
              filter: dataOfAccountSetups?.[0]?.fundData?.fund_data?.fund_setting?.account?.applicant
              ?.identity?.indivisual?.provider?.verify?.face?.isBlured
                ? "blur(8px)"
                : "",
            }}
          />
          <Button
            variant="secondary"
            className={`bg-color-button2-SC  text-white py-4 lg:py-[10px] px-4 rounded-lg mx-auto block mt-10`}
            onClick={retakeImage}
          >
            Retake
          </Button>
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
