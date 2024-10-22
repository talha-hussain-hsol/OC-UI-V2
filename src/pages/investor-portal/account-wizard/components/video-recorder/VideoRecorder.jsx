import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

const VideoRecorder = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [videoBase64, setVideoBase64] = useState(null);


  useEffect(() => {
    if (recordedVideoUrl) {
      setShowCamera(false);
      videoRef.current.srcObject = null; // Stop the camera stream when showing the recorded video
    }
  }, [recordedVideoUrl]);
  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
        });
    }
  }, [showCamera]);


  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        setRecording(false);
        setCountdown(30);

        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        chunksRef.current = [];
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(videoUrl);
        const reader = new FileReader();
        reader.onload = () => {
          const base64Video = reader.result;
          console.log('Base64 video:', base64Video);
          setVideoBase64(base64Video); // Save the base64 in the state
        };
        reader.readAsDataURL(videoBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setCountdown(30);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        mediaRecorderRef.current.stop();
      }, 30000);
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const handleReRecord = () => {
    setShowCamera(true);
    setRecordedVideoUrl(null);
  };

  return (
    <Container>
      <Row>
        <Col>
          {showCamera && (
            <div>
              <video ref={videoRef} autoPlay muted />
              {recording ? (
                <p>Recording... {countdown} seconds left</p>
              ) : (
                <>
                  <Button variant="primary" onClick={handleStartRecording}>
                    Start Recording
                  </Button>
                  <p>Click the "Start Recording" button to begin recording.</p>
                </>
              )}
            </div>
          )}
        </Col>
      </Row>

      {!showCamera && (
        <Row>
          <Col>
            <div>
              <h4>Recorded Video:</h4>
              <video ref={videoRef} src={recordedVideoUrl} controls />
              <Button variant="primary" onClick={handleReRecord}>
                Re-Record
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default VideoRecorder;
