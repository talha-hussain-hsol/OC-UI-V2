import React, { useState, useRef, useEffect } from "react";
import MicrosoftWord from "../../../../../icons/microsoft-word.svg";
import PdfIcon from "../../../../../icons/pdf.svg";
import { MdOutlineAddAPhoto } from "react-icons/md";
import {
  Button,
  Card,
  Col,
  Form,
  Nav,
  Row,
  Spinner,
  Alert,
  Modal,
  Container,
} from "react-bootstrap";
import {
  postIdentityDocument,
  postVerifyUploadDocument,
} from "../../../../../api/network/customerApi";
import axios from "axios";
import mergeImages from "merge-images";
import { useParams, useLocation } from "react-router-dom";

export default function DocumentModal(props) {
  console.log(props, "props");
  const cancelTokenSource = axios.CancelToken.source();
  let { identity_id, type } = useParams();
  const [issueDate, setIssueDate] = useState(null);
  const [documentNumber, setDocumentNumber] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [errorExpiryDate, setErrorExpiryDate] = useState(false);
  const [contentTypeData1, setContentTypeData1] = useState("");
  const [contentTypeData2, setContentTypeData2] = useState("");
  const [contentTypeData, setContentTypeData] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentParentId, setDocumentParentId] = useState(null);
  const [documentTypeSelected, setDocumentTypeSelected] = useState("");
  const [documentTypeSelectedName, setDocumentTypeSelectedName] =
    useState(null);
  const nationalId = 4;
  const [isLoader, setIsLoader] = useState(false);
  const [isDocumentTypeSelected, setIsDocumentTypeSelected] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);
  const [documentErrMessage, setDocumentErrMessage] = useState("");
  const [documentErr, setDocumentErr] = useState("");
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image1Click, setImage1Click] = useState(false);
  const [image2Click, setImage2Click] = useState(false);
  const [nationalIdMessage, setNationalIdMessage] = useState("");
  const [imageLengthErr, setImageLengthErr] = useState(false);
  const [formatFileError, setFormatFileError] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAlertSuccess(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAlertSuccess]);

  let docImage = React.useRef();
  let docImage1 = React.useRef();
  let docImage2 = React.useRef();
  console.log("aaaaaaaaaaa props", props);
  useEffect(() => {
    console.log("modalShow", props.show);
    if (!props.show) {
      clearFormData();
    }
  }, [props.show]);
  useEffect(() => {
    if (
      contentTypeData?.search("pdf") != -1 ||
      contentTypeData?.search("jpg") != -1 ||
      contentTypeData?.search("png") != -1 ||
      contentTypeData?.search("jpeg") != -1
    ) {
      setFormatFileError(false);
      console.log("dasdasdsadasdasdad");
    } else {
      if (contentTypeData != "") {
        setFormatFileError(true);
        setContentTypeData("");
      }
    }

    // {contentTypeData?.search("pdf") != -1 ? (
    //   <PdfIcon style={{ fill: "black" }} fontSize={"medium"} color={"action"}></PdfIcon>
    // ) : contentTypeData?.search("word") != -1 ? (
    //   <MicrosoftWord style={{ fill: "black" }} fontSize={"medium"} color={"action"}></MicrosoftWord>
    // ) : null}
    console.log("setFormatFileError setFormatFileError", contentTypeData);
  }, [contentTypeData]);
  useEffect(() => {
    console.log("formatFileError contentTypeData", contentTypeData);
  }, [contentTypeData]);
  useEffect(() => {
    console.log("formatFileError formatFileError", formatFileError);
  }, [formatFileError]);

  const clearFormData = () => {
    setDocumentParentId(null);
    setDocumentTypeSelected("");
    setIssueDate(null);
    setExpiryDate(null);
    setDocumentNumber(null);
    setContentTypeData("");
    setFormatFileError(false);
  };

  useEffect(() => {
    console.log("types modal", props.requiredDocumentSelected?.children);

    if (props.requiredDocumentSelected?.children.length > 0) {
      setDocumentTypes(props.requiredDocumentSelected?.children);
    } else {
      setDocumentTypes([props.requiredDocumentSelected]);
    }
    setDocumentParentId(props.requiredDocumentSelected?.id);
  }, [props, documentTypeSelected]);
  useEffect(() => {
    if (documentTypeSelected == nationalId) {
      setNationalIdMessage("Select 2 Images, Front & Back");
    } else {
      setNationalIdMessage("");
    }
  }, [documentTypeSelected]);

  useEffect(() => {
    console.log(docImage1, "docImage1");
    console.log(docImage2, "docImage2");
    if (image1 && image2) {
      if (docImage1?.current && docImage2?.current) {
        console.log(docImage1, "docImage1 innner");
        console.log(docImage2, "docImage2 inner");
        if (documentTypeSelected == nationalId) {
          console.log("i am in");
          let img1 = URL.createObjectURL(docImage1.current?.files?.item(0));
          let img2 = URL.createObjectURL(docImage2.current?.files?.item(0));

          let image11 = document.getElementById("img1");
          image11.src = img1;

          setTimeout(function () {
            // setViewLoader(false)
            let img1Height = document.getElementById("img1").height;
            console.log(img1Height, "img1Height");
            mergeImages(
              [
                { src: img1, x: 0, y: 0 },
                { src: img2, x: 0, y: img1Height + 50 },
              ],
              {
                height: 2500,
              }
            )
              // .then(b64 => document.querySelector('img').src = b64);
              .then((b64) => {
                // image.style.display = 'block';
                // document.getElementById('imagePreview').src = b64;
                // // document.querySelector('img').src = b64
                console.log(b64, "b6464646464gbjjchbcsd  j k");
                // toggleAllImageTags('none');
                console.log("dasdasdasdas", getBlob(b64));
                fetch(b64)
                  .then((res) => res.blob())
                  .then((blob) => {
                    console.log("dsda", blob);
                    setContentTypeData(blob?.type); // blob object
                    // continue with your code
                  })
                  .catch((error) => setContentTypeData("image/png"));
              });
          }, 1000);
        }
      }
    }
    console.log(`iamsnd ${image1} and ${image2}`);
  }, [image1, image2]);

  useEffect(() => {
    console.log("types modal documentTypes", documentTypes);
    console.log("types modal documentTypeSelected", documentTypeSelected);
    console.log("types modal documentParentId", documentParentId);

    if (documentTypes[0] !== null) {
      const selectedItem = documentTypes.find(
        (item) => item.id === parseInt(documentTypeSelected)
      );
      const selectedItemName = selectedItem
        ? selectedItem.name.toLowerCase()
        : "";
      console.log("contentTypeData", contentTypeData);
      setDocumentTypeSelectedName(selectedItemName);
    }
  }, [documentTypeSelected, contentTypeData]);

  // const isFormValid = () => {
  //   const selectedDocumentType = documentTypes.find(
  //     (item) => item.id == documentTypeSelected
  //   )
  //   const isContentTypeValid =
  //     contentTypeData == ""
  //       ? false
  //       : contentTypeData?.search("pdf") != -1 ||
  //         contentTypeData?.search("jpg") != -1 ||
  //         contentTypeData?.search("png") != -1 ||
  //         contentTypeData?.search("jpeg") != -1
  //       ? true
  //       : false
  //   const isIssueDateValid = selectedDocumentType?.has_issued_date
  //     ? !selectedDocumentType?.has_issued_date || issueDate !== null
  //     : true
  //   const isExpiryDateValid = selectedDocumentType?.has_expiry_date
  //     ? !selectedDocumentType?.has_expiry_date || expiryDate !== null
  //     : true

  //   const registrationDate = new Date()
  //   const minValidityPeriod = new Date(registrationDate)
  //   minValidityPeriod.setMonth(minValidityPeriod.getMonth() + 3)
  //   // console.log(minValidityPeriod, "minValidityPeriod")
  //   // console.log(expiryDate, "expiryDate")
  //   // console.log(selectedDocumentType, "selectedDocumentType")

  //   const isPassportValid =
  //     selectedDocumentType?.name == "PASSPORT" &&
  //     Date.parse(expiryDate) > minValidityPeriod
  //       ? true
  //       : false
  //   if (selectedDocumentType.name === "PASSPORT") {
  //     return !(
  //       isContentTypeValid &&
  //       isIssueDateValid &&
  //       isExpiryDateValid &&
  //       isPassportValid
  //     )
  //   } else {
  //     return !(isContentTypeValid && isIssueDateValid && isExpiryDateValid)
  //   }
  // }
  // const isFormValid = () => {
  //   const selectedDocumentType = documentTypes.find(
  //     (item) => item.id == documentTypeSelected
  //   )
  //   const isContentTypeValid =
  //     contentTypeData == ""
  //       ? false
  //       : contentTypeData?.search("pdf") != -1 ||
  //         contentTypeData?.search("jpg") != -1 ||
  //         contentTypeData?.search("png") != -1 ||
  //         contentTypeData?.search("jpeg") != -1
  //       ? true
  //       : false
  //   const isIssueDateValid = selectedDocumentType?.has_issued_date
  //     ? !selectedDocumentType?.has_issued_date || issueDate !== null
  //     : true
  //   const isExpiryDateValid = selectedDocumentType?.has_expiry_date
  //     ? !selectedDocumentType?.has_expiry_date || expiryDate !== null
  //     : true

  //   const registrationDate = new Date()
  //   const minValidityPeriod = new Date(registrationDate)
  //   minValidityPeriod.setMonth(minValidityPeriod.getMonth() + 3)
  //   // console.log(minValidityPeriod, "minValidityPeriod")
  //   // console.log(expiryDate, "expiryDate")
  //   // console.log(selectedDocumentType, "selectedDocumentType")
  //   const isPassportValid =
  //     selectedDocumentType?.name === "PASSPORT" &&
  //     Date.parse(expiryDate) > minValidityPeriod

  //   console.log(isPassportValid, "isPassportValid")

  //   return !(
  //     isContentTypeValid &&
  //     isIssueDateValid &&
  //     isExpiryDateValid &&
  //     (selectedDocumentType?.name !== "PASSPORT" || isPassportValid)
  //   )
  // }
  const isFormValid = () => {
    const selectedDocumentType = documentTypes.find(
      (item) => item.id == documentTypeSelected
    );
    const isContentTypeValid =
      contentTypeData == ""
        ? false
        : contentTypeData?.search("pdf") != -1 ||
          contentTypeData?.search("jpg") != -1 ||
          contentTypeData?.search("png") != -1 ||
          contentTypeData?.search("jpeg") != -1
        ? true
        : false;
    const isIssueDateValid = selectedDocumentType?.has_issued_date
      ? !selectedDocumentType?.has_issued_date || issueDate !== null
      : true;
    const isExpiryDateValid = selectedDocumentType?.has_expiry_date
      ? !selectedDocumentType?.has_expiry_date || expiryDate !== null
      : true;

    const registrationDate = new Date();
    const minValidityPeriod = new Date(registrationDate);
    minValidityPeriod.setMonth(minValidityPeriod.getMonth() + 3);
    // console.log(minValidityPeriod, "minValidityPeriod")
    // console.log(expiryDate, "expiryDate")
    // console.log(selectedDocumentType, "selectedDocumentType")
    const isPassportValid =
      selectedDocumentType?.name === "PASSPORT" &&
      Date.parse(expiryDate) > minValidityPeriod;

    console.log(isPassportValid, "isPassportValid");

    return !(
      isContentTypeValid &&
      isIssueDateValid &&
      isExpiryDateValid &&
      (selectedDocumentType?.name !== "PASSPORT" || isPassportValid)
    );
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  function handleImageClick() {
    if (documentTypeSelected == "") {
      setDocumentErr(true);
      setDocumentErrMessage("Select Document Type to Continue");
      // setErrorMessage('Select Document Type to Continue')

      return;
    }
    let elem = document.getElementById("inputImageElement");
    elem?.click();

    elem?.addEventListener("change", function () {
      let image = document.getElementById("imagePreview");

      // setViewLoader(true)

      if (image) {
        console.log(docImage, "docImage.current?.files");

        if (docImage.current?.files.length > 2) {
          setImageLengthErr(true);
          return;
        } else {
          setImageLengthErr(false);
          if (
            documentTypeSelected == nationalId &&
            docImage.current?.files?.length == 2
          ) {
            let img1 = URL.createObjectURL(docImage.current?.files?.item(0));
            let img2 = URL.createObjectURL(docImage.current?.files?.item(1));

            let image11 = document.getElementById("img1");
            image11.src = img1;

            setTimeout(function () {
              // setViewLoader(false)
              let img1Height = document.getElementById("img1").height;
              console.log(img1Height, "img1Height");
              mergeImages(
                [
                  { src: img1, x: 0, y: 0 },
                  { src: img2, x: 0, y: img1Height + 50 },
                ],
                {
                  height: 2500,
                }
              )
                // .then(b64 => document.querySelector('img').src = b64);
                .then((b64) => {
                  image.style.display = "block";
                  document.getElementById("imagePreview").src = b64;
                  // document.querySelector('img').src = b64
                  // console.log(b64, 'b6464646464gbjjchbcsd  j k')
                  toggleAllImageTags("none");
                  getBlob(b64);
                });
            }, 1000);
          } else {
            // setViewLoader(false)
            let file = docImage.current?.files?.item(0);
            setContentTypeData(file.type);
            if (!formatFileError) {
              image.style.display = "block";

              console.log(file, "file");
              if (file) {
                toggleAllImageTags("none");
                let data = URL.createObjectURL(file);
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
            }
          }
        }
      }
    });
  }
  function handleImageClick1() {
    if (documentTypeSelected == "") {
      setDocumentErr(true);
      setDocumentErrMessage("Select Document Type to Continue");
      // setErrorMessage('Select Document Type to Continue')

      return;
    }

    let elem = document.getElementById("inputImageElement1");
    elem?.click();

    elem?.addEventListener("change", function () {
      let image = document.getElementById("imagePreview1");
      // setViewLoader(true)
      console.log(image, "image");
      if (image) {
        console.log(docImage, "docImage.current?.files");

        image.style.display = "block";

        // return;
        let file = docImage1.current?.files?.item(0);
        console.log(docImage1, "docImage1");
        setContentTypeData1(file?.type);
        console.log(file, "file");
        // contentTypeData?.search("jpg")
        if (
          file.type.search("jpg") != -1 ||
          file.type.search("jpeg") != -1 ||
          file.type.search("png") != -1 ||
          file.type.search("pdf") != -1
        ) {
          setImage1(true);
        } else {
          setImage1(false);
        }

        if (file) {
          toggleAllImageTags1("none");
          let data = URL.createObjectURL(file);
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
      }
    });
  }
  function handleImageClick2() {
    if (documentTypeSelected == "") {
      setDocumentErr(true);
      setDocumentErrMessage("Select Document Type to Continue");
      // setErrorMessage('Select Document Type to Continue')
      console.log(documentTypeSelected, "documentTypeSelected");
      return;
    }
    let elem = document.getElementById("inputImageElement2");
    elem?.click();

    elem?.addEventListener("change", function () {
      let image = document.getElementById("imagePreview2");
      // setViewLoader(true)

      if (image) {
        console.log(docImage, "docImage.current?.files");

        image.style.display = "block";

        let file = docImage2.current?.files?.item(0);
        setContentTypeData2(file.type);
        console.log(file, "file");
        if (
          file.type.search("jpg") != -1 ||
          file.type.search("jpeg") != -1 ||
          file.type.search("png") != -1 ||
          file.type.search("pdf") != -1
        ) {
          setImage2(true);
        } else {
          setImage2(false);
        }
        if (file) {
          toggleAllImageTags2("none");
          let data = URL.createObjectURL(file);
          if (file.type.search("image") != -1) {
            image.src = data;
          } else {
            // toggleAllImageTags('none');
            let image = document.getElementById("imagePreview2");
            if (image) {
              image.style.display = "none";
            }
          }
        }
      }
    });
  }
  function getBlob(ImageURL) {
    var block = ImageURL.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1]; // In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    var blob = b64toBlob(realData, contentType, 512);
    console.log(blob, "blob");
    setImageBlob(blob);
  }
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  function toggleAllImageTags(input) {
    let icon = document.getElementById("imageUploadIcon");
    let text1 = document.getElementById("imageUploadText1");
    let text2 = document.getElementById("imageUploadText2");
    let text3 = document.getElementById("imageUploadText3");
    // let text4 = document.getElementById('imageUploadText4');
    let image = document.getElementById("imagePreview");

    if (icon && text1 && text2 && text3) {
      icon.style.display = input;
      text1.style.display = input;
      text2.style.display = input;
      text3.style.display = input;
      // text4.style.display = input;
    }

    if (input == "block" && image) {
      image.style.display = input;
    }
  }
  function toggleAllImageTags1(input) {
    console.log(input, "imput");
    let icon = document.getElementById("imageUploadIcon1");
    let text1 = document.getElementById("imageUploadText11");
    let text2 = document.getElementById("imageUploadText21");
    let text3 = document.getElementById("imageUploadText31");
    // let text4 = document.getElementById('imageUploadText41');
    let image = document.getElementById("imagePreview1");
    // console.log(icon, "icon");
    console.log(text1, "text1");
    console.log(text2, "text2");
    console.log(text3, "text3");
    if (icon && text1 && text2 && text3) {
      icon.style.display = input;
      text1.style.display = input;
      text2.style.display = input;
      text3.style.display = input;
      // text4.style.display = input;
    }

    if (input == "block" && image) {
      image.style.display = "none";
    }
  }
  function toggleAllImageTags2(input) {
    let icon = document.getElementById("imageUploadIcon2");
    let text1 = document.getElementById("imageUploadText12");
    let text2 = document.getElementById("imageUploadText22");
    let text3 = document.getElementById("imageUploadText32");
    // let text4 = document.getElementById('imageUploadText42');
    let image = document.getElementById("imagePreview2");

    if (icon && text1 && text2 && text3) {
      icon.style.display = input;
      text1.style.display = input;
      text2.style.display = input;
      text3.style.display = input;
      // text4.style.display = input;
    }

    if (input == "block" && image) {
      image.style.display = "none";
    }
  }

  const handleChangeDocumentType = (event) => {
    setDocumentTypeSelected(event.target.value);
    setDocumentErrMessage("");
    console.log("event.target.value", event.target.value);
  };

  const handleClickUploadDocument = async () => {
    setIsLoader(true);
    let file = "";
    console.log(`${documentTypeSelected} and ${nationalId} here`);
    if (documentTypeSelected == nationalId) {
      console.log(imageBlob, "imageBlob");
      file = imageBlob;
    } else {
      file = docImage.current?.files?.item(0);
      console.log(
        docImage.current?.files?.item(0),
        "docImage.current?.files?.item(0)"
      );
    }

    let data = {
      document_type_id: documentParentId
        ? documentParentId
        : documentTypeSelected,
      sub_document_type_id:
        documentParentId == parseInt(documentTypeSelected)
          ? null
          : parseInt(documentTypeSelected),
      issued_date: issueDate,
      expiry_date: expiryDate,
      document_number: documentNumber,
      content_type: contentTypeData,
      identity_id,
    };

    const respond = await postIdentityDocument(data, cancelTokenSource.token);
    if (respond.success == true) {
      let url = respond.data.url;
      console.log(file, "imageBlob file");
      //Removing and Adding Token
      let token = axios.defaults.headers["x-auth-token"];

      delete axios.defaults.headers["x-auth-token"];
      console.log(file, "imageBlob file");

      axios
        .put(url, file, {
          headers: {
            "Content-Type": file?.type,
          },
        })
        .then(async (response) => {
          console.log("Image Upload Success ", response);

          axios.defaults.headers["x-auth-token"] = token;

          const res = await postVerifyUploadDocument(
            respond.data.identity_document_id,
            cancelTokenSource.token
          );
          if (res.success == true) {
            console.log("awais 111 documentUploadedSelected respond", res);
            props.setAlertSucessDocumentAdd(true);
            setIsLoader(false);
            clearFormData();
            setImage1(false);
            setImage2(false);
            props.onHide();
            props.list();
          } else {
          }
        })
        .catch((err) => {
          console.log("Image Upload Failed Response", err);
          axios.defaults.headers["x-auth-token"] = token;
          // setErrorMessage(response.system_message);
          setIsLoader(false);
        });
    } else {
      console.log("data data response", respond);
      props?.setAlertFailedDocumentAdd(true);
      props?.setErrorMessage(respond?.user_message);
      clearFormData();
      props.onHide();
      setIsLoader(false);
    }
  };
  const handleFileSelect = (e, index) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    const selectedFile = e.target.files[0];

    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      alert("Please select a JPG or PNG file.");
      e.target.value = null;
    } else {
      // do something with the selected file
    }
  };

  return (
    <>
      <img style={{ display: "none" }} src="" id="img1"></img>
      <Modal
        size="xl"
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Upload New Document</h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        {isLoader ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "20rem",
            }}
          >
            <Spinner animation="grow" variant="primary" />
          </div>
        ) : (
          <>
            {" "}
            <Modal.Body className="show-grid">
              <Container>
                <Row>
                  <Col xs={12} md={6}>
                    <div className="leftPanelForImage">
                      {!(documentTypeSelectedName == "national id") ? (
                        <div
                          style={{
                            display: "flex",
                            height: "100%",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          className="imageUpload"
                        >
                          <div
                            style={{
                              display: "flex",
                              height: "100%",
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={handleImageClick}
                          >
                            {/* {console.log(documentTypeSelected, 'documentTypeSelected')} */}

                            <div>
                              <img
                                id="imagePreview"
                                className={"imageUploadPreview"}
                                src=""
                                alt="Upload image"
                                style={{ display: "none" }}
                              ></img>
                              {contentTypeData?.search("pdf") != -1 ? (
                                <PdfIcon
                                  style={{ fill: "black" }}
                                  fontSize={"medium"}
                                  color={"action"}
                                ></PdfIcon>
                              ) : null}

                              {contentTypeData != "" ? (
                                contentTypeData?.search("pdf") != -1 ||
                                contentTypeData?.search("jpg") != -1 ||
                                contentTypeData?.search("png") != -1 ||
                                contentTypeData?.search("jpeg") != -1 ? null : (
                                  <span
                                    style={{ color: "red", fontSize: "12px" }}
                                  >
                                    Please Select The Following Formats PNG, JPG
                                    and PDF{" "}
                                  </span>
                                )
                              ) : null}

                              {/* <canvas class="result"></canvas> */}
                              {/* <p id="imageUploadIcon">image</p> */}
                              <MdOutlineAddAPhoto id="imageUploadIcon"></MdOutlineAddAPhoto>
                              <div id="imageUploadText1" className={"text1"}>
                                Upload Document
                              </div>
                              <div
                                id="imageUploadText4"
                                style={{
                                  color: "red",
                                  fontSize: "14px",
                                  marginBottom: "10px",
                                }}
                                className={"text2"}
                              >
                                {nationalIdMessage != ""
                                  ? nationalIdMessage
                                  : ""}
                              </div>
                              <div id="imageUploadText2" className={"text2"}>
                                Formats PNG, JPG, PDF
                              </div>
                              <div id="imageUploadText3" className={"text2"}>
                                Max Size 5 MB
                              </div>
                            </div>
                            <input
                              style={{ display: "none" }}
                              className={"imageInput"}
                              // inputProps={{ multiple: true }}
                              // inputProps={{ multiple: documentTypeSelected == nationalId ? true : false }}
                              type="file"
                              id="inputImageElement"
                              ref={docImage}
                            ></input>
                          </div>
                        </div>
                      ) : (
                        <div style={{ height: "100%" }}>
                          <div
                            className="imageUploadMultiple"
                            style={{ minWidth: "30rem" }}
                            onClick={handleImageClick1}
                          >
                            {/* {console.log(documentTypeSelected, 'documentTypeSelected')} */}

                            <img
                              id="imagePreview1"
                              className={"imageUploadPreview"}
                              src=""
                              alt="Upload image"
                              style={{ display: "none" }}
                            ></img>

                            {contentTypeData1 != "" ? (
                              contentTypeData1?.search("jpg") != -1 ||
                              contentTypeData1?.search("png") != -1 ||
                              contentTypeData1?.search("jpeg") != -1 ? null : (
                                <span
                                  style={{ color: "red", fontSize: "12px" }}
                                >
                                  Please Select The Following Formats PNG, JPG{" "}
                                </span>
                              )
                            ) : null}
                            {/* <canvas class="result"></canvas> */}
                            <MdOutlineAddAPhoto id="imageUploadIcon1"></MdOutlineAddAPhoto>
                            <div id="imageUploadText11" className={"text1"}>
                              Upload Document
                            </div>
                            {/* <div id="imageUploadText4" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }} className={styles.text2}>{nationalIdMessage != "" ? nationalIdMessage : ""}</div> */}
                            <div id="imageUploadText21" className={"text2"}>
                              Formats PNG, JPG, PDF
                            </div>
                            <div id="imageUploadText31" className={"text2"}>
                              Max Size 5 MB
                            </div>
                            <input
                              style={{ display: "none" }}
                              className={"imageInput"}
                              // inputProps={{ multiple: true }}
                              // inputProps={{ multiple: documentTypeSelected == nationalId ? true : false }}
                              type="file"
                              // onChange={(e) => handleFileSelect(e, 1)}
                              id="inputImageElement1"
                              ref={docImage1}
                            ></input>
                          </div>
                          <div
                            className="imageUploadMultiple"
                            style={{ marginTop: "10px", minWidth: "30rem" }}
                            onClick={handleImageClick2}
                          >
                            {/* {console.log(documentTypeSelected, 'documentTypeSelected')} */}

                            <img
                              id="imagePreview2"
                              className={"imageUploadPreview"}
                              src=""
                              alt="Upload image"
                              style={{ display: "none" }}
                            ></img>

                            {contentTypeData2 != "" ? (
                              contentTypeData2?.search("jpg") != -1 ||
                              contentTypeData2?.search("png") != -1 ||
                              contentTypeData2?.search("jpeg") != -1 ? null : (
                                <span
                                  style={{ color: "red", fontSize: "12px" }}
                                >
                                  Please Select The Following Formats PNG, JPG{" "}
                                </span>
                              )
                            ) : null}
                            {/* <canvas class="result"></canvas> */}
                            <MdOutlineAddAPhoto id="imageUploadIcon2"></MdOutlineAddAPhoto>
                            <div id="imageUploadText12" className={"text1"}>
                              {"upload document back"}
                            </div>
                            {/* <div id="imageUploadText4" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }} className={styles.text2}>{nationalIdMessage != "" ? nationalIdMessage : ""}</div> */}
                            <div id="imageUploadText22" className={"text2"}>
                              Formats PNG, JPG, PDF
                            </div>
                            <div id="imageUploadText32" className={"text2"}>
                              Max Size 5 MB
                            </div>
                            <input
                              style={{ display: "none" }}
                              className={"imageInput"}
                              // inputProps={{ multiple: true }}
                              // inputProps={{ multiple: documentTypeSelected == nationalId ? true : false }}
                              type="file"
                              id="inputImageElement2"
                              // onChange={(e) => handleFileSelect(e, 2)}
                              ref={docImage2}
                            ></input>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="row" style={{ flexDirection: "column" }}>
                      <div className="col-sm-10">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="form-group" style={{ width: "100%" }}>
                            <Form.Label>Document Type </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={documentTypeSelected}
                              onChange={(event) =>
                                handleChangeDocumentType(event)
                              }
                            >
                              <option key="blankChoice" hidden value>
                                Select Document Type
                              </option>
                              {documentTypes[0] !== null &&
                                documentTypes.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                            <div>
                              <span style={{ color: "red" }}>
                                {documentErrMessage}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-10">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {documentTypeSelected === "10" ? (
                            <div
                              className="form-group"
                              style={{ width: "100%" }}
                            >
                              <Form.Label>
                                Document Number (Optional)
                              </Form.Label>
                              <Form.Control
                                placeholder="Enter Document Number"
                                type="text"
                                value={documentNumber}
                                onChange={(event) =>
                                  setDocumentNumber(event.target.value)
                                }
                              />
                            </div>
                          ) : (
                            <div
                              className="form-group"
                              style={{ width: "100%" }}
                            >
                              <Form.Label>Document Number</Form.Label>
                              <Form.Control
                                placeholder="Enter Document Number"
                                type="text"
                                value={documentNumber}
                                onChange={(event) =>
                                  setDocumentNumber(event.target.value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {documentTypeSelected === "10" ? (
                        <div className="col-sm-10">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              className="form-group"
                              style={{ width: "100%" }}
                            >
                              <Form.Label>Document Date (Optional)</Form.Label>
                              <Form.Control
                                type="date"
                                value={issueDate}
                                onChange={(event) =>
                                  setIssueDate(event.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="col-sm-10">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="form-group"
                                style={{ width: "100%" }}
                              >
                                <Form.Label>
                                  Issue Date
                                  {documentTypeSelected == ""
                                    ? null
                                    : documentTypes.filter(
                                        (item) =>
                                          item?.id == documentTypeSelected
                                      )[0]?.has_issued_date
                                    ? "(Required)"
                                    : "(Optional)"}
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  value={issueDate}
                                  onChange={(event) =>
                                    setIssueDate(event.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-10">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="form-group"
                                style={{ width: "100%" }}
                              >
                                <Form.Label>
                                  Expiry Date
                                  {documentTypeSelected == ""
                                    ? null
                                    : documentTypes.filter(
                                        (item) =>
                                          item?.id == documentTypeSelected
                                      )[0]?.has_expiry_date
                                    ? "(Required)"
                                    : "(Optional)"}
                                </Form.Label>

                                <Form.Control
                                  type="date"
                                  value={expiryDate}
                                  disabled={!issueDate}
                                  min={issueDate}
                                  onChange={(event) => {
                                    const enteredDate = event.target.value;
                                    const currentDate = new Date()
                                      .toISOString()
                                      .slice(0, 10);
                                    const isDateValid =
                                      enteredDate > currentDate &&
                                      enteredDate >= issueDate &&
                                      enteredDate !== issueDate;

                                    if (isDateValid) {
                                      setExpiryDate(enteredDate);
                                      setErrorExpiryDate(false);
                                    } else {
                                      setErrorExpiryDate(true);
                                      setExpiryDate(null);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {errorExpiryDate && alertProps && (
                        <div>
                          <h2 style={{ color: "red" }}>
                            The expiry date should be greater than current date{" "}
                          </h2>
                        </div>
                      )}
                      <div className="col-sm-6">
                        <div className="form-group">
                          <Button
                            onClick={() => handleClickUploadDocument()}
                            variant="primary"
                            size="lg"
                            disabled={isFormValid()}
                          >
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
