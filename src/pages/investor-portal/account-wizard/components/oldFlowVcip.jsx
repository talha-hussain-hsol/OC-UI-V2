import {
  Col,
  Container,
  Row,
  Nav,
  Spinner,
  Card,
  Button,
} from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { getMissingDataOfIdentity } from "../../../../helpers";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import {
  getIdentityDocument,
  getRequiredDocumentCRP,
  getVcipSignedUrl,
  postVerifyUploadVideo,
} from "../../../../api/network/customerApi";
import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
import { AiOutlineConsoleSql } from "react-icons/ai";
import countries from "../../../../helpers/countries";
// import SpinnerWithBackDrop from "../../..../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../../../components/ui/loader";
// import VideoRecorder from "./video-recorder/VideoRecorder";

const refrence_Document = [
  {
    step: "1",
    title: "PAN card",
    description: "PAN card",
    document_key: "PAN_CARD",
  },
  {
    step: "2",
    title: "PAN card",
    description: "PAN card",
    document_key: "PAN_CARD",
  },
];

export default function FaceVerification(props) {
  const identity_id = "e1c80fb0-0e09-4b5b-918f-81a2d6a51fb2";
  // const identity_id = props?.dataOfAccountSetup?.identity_id
  const fund_id = props?.dataOfAccountSetup?.fund_id;
  const account_id = props?.dataOfAccountSetup?.account_id;
  console.log("sdasjkdhljahsd", props);
  const shareholder_id = "90bc4969-f635-4bd5-9f92-e3eb604d0504";
  // const shareholder_id = props?.dataOfAccountSetup?.accountData?.id
  //d58736d6-237e-4c50-87a5-41a864fa5b69
  //shareholder
  //identties id 704f9694-ea1c-4f1a-98b9-767f1986460a

  const [contentTypeData, setContentTypeData] = useState("");
  const docImage = useRef();
  const docImageAdhar = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [panCardFile, setPanCardFile] = useState(null);
  const [adharCardFile, setAdharCardFile] = useState(null);
  const [identityUploadDocList, setIdentityUploadDocList] = useState([]);
  const [refrenceDocument, setRefrenceDocument] = useState(refrence_Document);

  const [isLoader, setIsLoader] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [videoBlob, setVideoBlob] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    console.log("refrencrefrenceDocument", refrenceDocument);
  }, [refrenceDocument]);

  useEffect(() => {
    handleGetIdentityDocumentApi();
  }, []);

  useEffect(() => {
    if (recordedVideoUrl) {
      setShowCamera(false);
      videoRef.current.srcObject = null; // Stop the camera stream when showing the recorded video
    }
  }, [recordedVideoUrl]);
  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error);
        });
    }
  }, [showCamera]);
  const handleGetIdentityDocumentApi = async () => {
    console.log(`checking`);
    setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token
    );
    console.log("object 1", response);
    if (response.success == true) {
      setIsLoader(false);
      setIdentityUploadDocList(response?.data?.IdentityDocuments);
      const resulted_refrence_document = refrenceDocument.map((refDoc) => {
        const matchingDocumentType = Object.values(
          response?.data?.IdentityDocuments
        )
          .flat()
          .find(
            (doc) =>
              doc.documentName.toLowerCase() === refDoc.title.toLowerCase()
          );

        if (matchingDocumentType) {
          const updatedDoc = {
            ...refDoc,
            meta: matchingDocumentType.meta || {},
            isUploaded: matchingDocumentType.meta?.bucket_key?.value
              ? true
              : false,
          };
          return updatedDoc;
        } else {
          return refDoc;
        }
      });

      console.log("resulted_refrence_document", resulted_refrence_document);
      setRefrenceDocument(resulted_refrence_document);
    } else {
      setIsLoader(false);
    }
  };

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

      mediaRecorderRef.current.onstop = async () => {
        setRecording(false);
        setCountdown(30);

        const videoBlob = new Blob(chunksRef.current, { type: "video/mp4" });
        chunksRef.current = [];

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Video = reader.result;
          console.log("Base64 video:", base64Video);

          // Convert Base64 to Blob
          const binaryData = atob(base64Video.split(",")[1]);
          const length = binaryData.length;
          const uint8Array = new Uint8Array(length);
          for (let i = 0; i < length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }
          const videoBlobFromBase64 = new Blob([uint8Array], {
            type: "video/mp4",
          });
          console.log("Blob from Base64:", videoBlobFromBase64);
          setVideoBlob(videoBlobFromBase64);

          // Set the Blob as the video source
          setRecordedVideoUrl(URL.createObjectURL(videoBlobFromBase64));
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
      console.error("Error accessing the camera:", error);
    }
  };

  const handleReRecord = () => {
    setShowCamera(true);
    setRecordedVideoUrl(null);
  };

  function toggleAllImageTags(input) {
    console.log(input, "input");
    let icon = document.getElementById("imageUploadIcon");
    let text1 = document.getElementById("imageUploadText1");
    let text2 = document.getElementById("imageUploadText2");
    let text3 = document.getElementById("imageUploadText3");
    let image = document.getElementById("imagePreview");

    if (icon && text1 && text2 && text3) {
      icon.style.display = input;
      text1.style.display = input;
      text2.style.display = input;
      text3.style.display = input;
    }

    if (input == "block" && image) {
      image.style.display = input;
    }
  }

  function toggleAllImageTagsAdhar(input) {
    console.log(input, "input");
    let icon = document.getElementById("imageUploadIconAd");
    let text1 = document.getElementById("imageUploadText1Ad");
    let text2 = document.getElementById("imageUploadText2Ad");
    let text3 = document.getElementById("imageUploadText3Ad");
    let image = document.getElementById("imagePreview1");

    if (icon && text1 && text2 && text3) {
      icon.style.display = input;
      text1.style.display = input;
      text2.style.display = input;
      text3.style.display = input;
    }

    if (input == "block" && image) {
      image.style.display = input;
    }
  }
  function handleImageClick(e) {
    let elem = document.getElementById("inputImageElement");
    elem?.click();

    elem?.addEventListener("change", function () {
      let image = document.getElementById("imagePreview");
      if (image) {
        image.style.display = "block";
        let file = docImage.current?.files?.item(0);
        console.log(file, "file");
        setContentTypeData(file.type);
        console.log(docImage, "docImage handleImageClick");
        if (file) {
          setPanCardFile({ file, base64Data: URL.createObjectURL(file) });

          let data = URL.createObjectURL(file);
          // image.src = data;
          toggleAllImageTags("none");

          if (file.type.search("image") != -1) {
            image.src = data;
          } else {
            // toggleAllImageTags('none');
            let image = document.getElementById("imagePreview");
            if (image) {
              image.style.display = "none";
            }
          }
        }
        // }
      }
    });
  }
  function handleImageClickAdhar(e) {
    let elem = document.getElementById("inputImageElementAd");
    elem?.click();

    elem?.addEventListener("change", function () {
      let image = document.getElementById("imagePreview1");
      if (image) {
        image.style.display = "block";
        let file = docImageAdhar.current?.files?.item(0);
        console.log(file, "file");
        setContentTypeData(file.type);
        console.log(docImageAdhar, "docImageAdhar handleImageClick");
        if (file) {
          let data = URL.createObjectURL(file);
          setAdharCardFile({ file, base64Data: URL.createObjectURL(file) });

          // image.src = data;
          toggleAllImageTagsAdhar("none");

          if (file.type.search("image") != -1) {
            image.src = data;
          } else {
            // toggleAllImageTags('none');
            let image = document.getElementById("imagePreview1");
            if (image) {
              image.style.display = "none";
            }
          }
        }
        // }
      }
    });
  }

  const handleSubmitVideo = async () => {
    setIsLoader(true);
    const response = await getVcipSignedUrl(
      identity_id,
      shareholder_id,
      cancelTokenSource.token
    );
    console.log("firsct checking respdjaslkdj.nas", response);
    if (response.success) {
      let url = response.data.video_signed_url;
      console.log(videoBlob, "imageBlob file");
      //Removing and Adding Token
      let token = axios.defaults.headers["x-auth-token"];

      delete axios.defaults.headers["x-auth-token"];
      console.log(videoBlob, "imageBlob file");

      axios
        .put(url, videoBlob, {
          headers: {
            "Content-Type": videoBlob?.type,
          },
        })
        .then(async (respond) => {
          console.log("Image Upload Success awais ", res);

          axios.defaults.headers["x-auth-token"] = token;
          const dataToSend = {
            upload: true,
          };

          const res = await postVerifyUploadVideo(
            identity_id,
            shareholder_id,
            dataToSend,
            cancelTokenSource.token
          );
          if (res.success) {
            setIsLoader(false);
          }
        })
        .catch((err) => {
          console.log("Image Upload Failed Response", err);
          axios.defaults.headers["x-auth-token"] = token;
          // setErrorMessage(response.system_message);
          setIsLoader(false);
        });
    }
  };

  return (
    <div className="main-content">
      {isLoader && (
        // <SpinnerWithBackDrop animation="grow" custom={true} height="70vh" />
        <Loader />
      )}
      <Container fluid>
        <Row>
          <Col xs={12} md={12}>
            <Card style={{ color: "white", background: "#3f5a7b" }}>
              <Card.Header>Instructions</Card.Header>
              <Card.Body style={{ overflow: "scroll" }}>
                <ul>
                  <li>The file must be in CSV format.</li>
                  <li>Only one file can be uploaded at a time.</li>
                  <li>The file can only contain alphanumeric characters.</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          {/* Upload PAN Card */}
          <Col xs={12} md={4}>
            <Card className="mb-4">
              <Card.Body>
                <h5>Upload PAN Card</h5>
                <div
                  style={{
                    border: "dotted",
                    height: "200px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => {
                    handleImageClick(e);
                  }}
                >
                  <img
                    id="imagePreview"
                    src=""
                    alt="Upload image"
                    style={{
                      display: "none",
                      height: "190px",
                      width: "260px",
                      padding: "20px",
                    }}
                  ></img>
                  {contentTypeData.search("pdf") != -1 ? (
                    <FeatherIcon icon="file" />
                  ) : // <PdfIcon style={{ fill: "white" }} fontSize={"medium"} color={"action"}></PdfIcon>
                  contentTypeData.search("word") != -1 ? (
                    <FeatherIcon icon="file-text" />
                  ) : null}
                  {/* <canvas class="result"></canvas> */}
                  <div id="imageUploadIcon">
                    <FeatherIcon icon="camera" />
                  </div>
                  <div id="imageUploadText1">
                    <h3>Upload Document</h3>
                  </div>
                  <div id="imageUploadText2">
                    <p>Formats PNG, JPG</p>
                  </div>
                  <div id="imageUploadText3">
                    <p>Max Size 5 MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="inputImageElement"
                  ref={docImage}
                  style={{ display: "none" }}
                />
              </Card.Body>
            </Card>

            {/* Upload Aadhar Card */}
            <Card>
              <Card.Body>
                <h5>Upload Adhaar Card</h5>
                <div
                  style={{
                    border: "dotted",
                    height: "200px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => {
                    handleImageClickAdhar(e);
                  }}
                >
                  <img
                    id="imagePreview1"
                    src=""
                    alt="Upload image"
                    style={{
                      display: "none",
                      height: "190px",
                      width: "260px",
                      padding: "20px",
                    }}
                  ></img>

                  {/* <canvas class="result"></canvas> */}
                  <div id="imageUploadIconAd">
                    <FeatherIcon icon="camera" />
                  </div>
                  <div id="imageUploadText1Ad">
                    <h3>Upload Document</h3>
                  </div>
                  <div id="imageUploadText2Ad">
                    <p>Formats PNG, JPG</p>
                  </div>
                  <div id="imageUploadText3Ad">
                    <p>Max Size 5 MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="inputImageElementAd"
                  ref={docImageAdhar}
                  style={{ display: "none" }}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Video Recording */}
          <Col xs={12} md={8}>
            <Card className="mb-4" style={{ height: "100%" }}>
              <Card.Body>
                <Row>
                  <Col>
                    {showCamera && (
                      <div>
                        <video
                          style={{ height: "24em", width: "50em" }}
                          ref={videoRef}
                          autoPlay
                          muted
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {recording ? (
                            <p>Recording... {countdown} seconds left</p>
                          ) : (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Button
                                  variant="primary"
                                  onClick={handleStartRecording}
                                >
                                  Start Recording
                                </Button>
                                <p>
                                  Click the "Start Recording" button to begin
                                  recording.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row className="justify-content-center" style={{ marginTop: "5px" }}>
          <Col
            xs={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="success" block onClick={handleSubmitVideo}>
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
