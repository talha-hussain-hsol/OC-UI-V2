import React, { useState, useRef, useEffect } from "react";
// import MicrosoftWord from "../../../../../icons/microsoft-word.svg";
import PdfIcon from "../../icons/pdf.svg";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { Button, Card, Col, Form, Nav, Row, Spinner, Alert, Modal, Container } from "react-bootstrap";
import { postIdentityDocument, postVerifyUploadDocument, updateIdentityDocument } from "../../api/network/CustomerApi";
import axios from "axios";
import mergeImages from "merge-images";
import "flatpickr/dist/themes/dark.css"; // You can choose a different theme if needed
import { useTheme } from "../../contexts/themeContext";
import { FaCamera, FaCloudUploadAlt } from "react-icons/fa";
import formatDateRegionWise from "../../helpers/formatDateRegionWise";
import { Flatpickr } from "../../components/vendor";
import { parse, format } from "date-fns";
import Loader from "../ui/loader";

export default function DocumentModal(props) {
  const {theme} = useTheme();
  let expiryDateEnteredManually = false;
  let issueDateEnteredManually = true;

  const region = localStorage.getItem("fundRegion");
  const placeHolderForDate = region === "united-states-of-america-(USA)" ? "MM/DD/YYYY" : "DD/MM/YYYY";
  const cancelTokenSource = axios.CancelToken.source();

  let identity_id = "";
  let type = "";
  if (props.CRPIdForUpload) {
    identity_id = props.CRPIdForUpload;
  } else {
    if (props?.accountData?.identity_id) {
      identity_id = props.accountData?.identity_id;
      type = props.accountData?.isIndividual ? "individual" : "corporate";
    } else {
      //  { identity_id, type } = useParams()
    }
  }
  const [fileDrop, setFileDrop] = useState(null);

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
  const [documentTypeSelectedName, setDocumentTypeSelectedName] = useState(null);
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
  const [selectedDocumentData, setSelectedDocumentData] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const [passportDateValidity, setPassportDateValidity] = useState(true);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAlertSuccess(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAlertSuccess]);

  let docImage = React.useRef();
  let docImage1 = React.useRef();
  let docImage2 = React.useRef();
  useEffect(() => {
    if (!props.show) {
      clearFormData();
    }
  }, [props.show]);

  useEffect(() => {
    if (props?.selectedTypeId) {
      setDocumentTypeSelected(props?.selectedTypeId)
    } else {
      setDocumentTypeSelected(props?.requiredDocumentSelected?.id)
    }
  }, [props?.requiredDocumentSelected?.id, props?.selectedTypeId])

  useEffect(() => {
    if (contentTypeData?.search("pdf") != -1 || contentTypeData?.search("jpg") != -1 || contentTypeData?.search("png") != -1 || contentTypeData?.search("jpeg") != -1) {
      setFormatFileError(false);
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
  }, [contentTypeData]);
  useEffect(() => {
  }, [contentTypeData]);
  useEffect(() => {
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

    if (props.requiredDocumentSelected?.children.length > 0) {
      setDocumentTypes(props.requiredDocumentSelected?.children);
    } else {
      setDocumentTypes([props.requiredDocumentSelected]);
    }
    props.requiredDocumentSelected && setDocumentParentId(props.requiredDocumentSelected?.id);
  }, [props, documentTypeSelected]);
  useEffect(() => {
    if (documentTypeSelected == nationalId) {
      setNationalIdMessage("Select 2 Images, Front & Back");
    } else {
      setNationalIdMessage("");
    }
  }, [documentTypeSelected]);

  const isPassportDateValid = () => {
    const selectedDocumentType = documentTypes.find((item) => item.id == documentTypeSelected);
    if (selectedDocumentType?.name === "PASSPORT") {
      const registrationDate = new Date();
      const minValidityPeriod = new Date(registrationDate);
      minValidityPeriod.setMonth(minValidityPeriod.getMonth() + 3);
      if (Date.parse(expiryDate) > minValidityPeriod) {
        setPassportDateValidity(true);
      } else {
        setPassportDateValidity(false);
      }
    }
  };
  useEffect(() => {
    isPassportDateValid();
  }, [expiryDate]);
  useEffect(() => {
    if (expiryDate === null) {
      setErrorExpiryDate(false);
    }
  }, [expiryDate]);

  useEffect(() => {
    if (image1 && image2) {
      if (docImage1?.current && docImage2?.current) {
        if (documentTypeSelected == nationalId) {
          let img1 = URL.createObjectURL(docImage1.current?.files?.item(0));
          let img2 = URL.createObjectURL(docImage2.current?.files?.item(0));

          let image11 = document.getElementById("img1");
          image11.src = img1;

          setTimeout(function () {
            // setViewLoader(false)
            let img1Height = document.getElementById("img1").height;
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

                // toggleAllImageTags('none');

                fetch(b64)
                  .then((res) => res.blob())
                  .then((blob) => {

                    setContentTypeData(blob?.type); // blob object
                    // continue with your code
                  })
                  .catch((error) => setContentTypeData("image/png"));
              });
          }, 1000);
        }
      }
    }

  }, [image1, image2]);

  useEffect(() => {
   
    
    if (documentTypes[0] !== null) {
      const selectedItem = documentTypes.find((item) => item.id === parseInt(documentTypeSelected));
      const selectedItemName = selectedItem ? selectedItem.name.toLowerCase() : "";
      setDocumentTypeSelectedName(selectedItemName);
    }
  }, [documentTypeSelected, contentTypeData]);

  const isFormValid = () => {
    const selectedDocumentType = documentTypes.find((item) => item.id == documentTypeSelected);
    const isContentTypeValid = contentTypeData == "" ? false : contentTypeData?.search("pdf") != -1 || contentTypeData?.search("jpg") != -1 || contentTypeData?.search("png") != -1 || contentTypeData?.search("jpeg") != -1 ? true : false;
    const isIssueDateValid = selectedDocumentType?.has_issued_date ? !selectedDocumentType?.has_issued_date || issueDate !== null : true;
    const isExpiryDateValid = selectedDocumentType?.has_expiry_date ? !selectedDocumentType?.has_expiry_date || expiryDate !== null : true;

    const registrationDate = new Date();
    const minValidityPeriod = new Date(registrationDate);
    minValidityPeriod.setMonth(minValidityPeriod.getMonth() + 3);

    const isPassportValid = selectedDocumentType?.name === "PASSPORT" && Date.parse(expiryDate) > minValidityPeriod;


    // return !(isContentTypeValid && isIssueDateValid && isExpiryDateValid && (selectedDocumentType?.name !== "PASSPORT" || isPassportValid));

    return !(isContentTypeValid && isIssueDateValid && isExpiryDateValid );
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  function handleImageClickDrop(e) {
    if (documentTypeSelected == "") {
      setDocumentErr(true);
      setDocumentErrMessage("Select Document Type to Continue");
      // setErrorMessage('Select Document Type to Continue')

      return;
    }
    e.preventDefault();
    // setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    let file;
    let image = document.getElementById("imagePreview");
    if (files.length === 1) {
      file = files[0];
      setFileDrop(file);
      // setSelectedFile(file);
      // You can handle the file here or initiate an upload.
    } else {
      console.log("Please drop only one file.");
    }
    if (docImage.current?.files.length > 2) {
      setImageLengthErr(true);
      return;
    } else {
      setImageLengthErr(false);
      if (documentTypeSelected == nationalId && docImage.current?.files?.length == 2) {
        let img1 = URL.createObjectURL(docImage.current?.files?.item(0));
        let img2 = URL.createObjectURL(docImage.current?.files?.item(1));

        let image11 = document.getElementById("img1");
        image11.src = img1;

        setTimeout(function () {
          // setViewLoader(false)
          let img1Height = document.getElementById("img1").height;
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
        // let file = docImage.current?.files?.item(0)
        setContentTypeData(file.type);
        if (!formatFileError) {
          image.style.display = "block";

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

        if (docImage.current?.files.length > 2) {
          setImageLengthErr(true);
          return;
        } else {
          setImageLengthErr(false);
          if (documentTypeSelected == nationalId && docImage.current?.files?.length == 2) {
            let img1 = URL.createObjectURL(docImage.current?.files?.item(0));
            let img2 = URL.createObjectURL(docImage.current?.files?.item(1));

            let image11 = document.getElementById("img1");
            image11.src = img1;

            setTimeout(function () {
              // setViewLoader(false)
              let img1Height = document.getElementById("img1").height;
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
            setContentTypeData(file?.type);
            if (!formatFileError) {
              image.style.display = "block";

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
      if (image) {

        image.style.display = "block";

        // return;
        let file = docImage1.current?.files?.item(0);
        setContentTypeData1(file?.type);
        // contentTypeData?.search("jpg")
        if (file.type.search("jpg") != -1 || file.type.search("jpeg") != -1 || file.type.search("png") != -1 || file.type.search("pdf") != -1) {
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
      return;
    }
    let elem = document.getElementById("inputImageElement2");
    elem?.click();

    elem?.addEventListener("change", function () {
      let image = document.getElementById("imagePreview2");
      // setViewLoader(true)

      if (image) {

        image.style.display = "block";

        let file = docImage2.current?.files?.item(0);
        setContentTypeData2(file.type);
        if (file.type.search("jpg") != -1 || file.type.search("jpeg") != -1 || file.type.search("png") != -1 || file.type.search("pdf") != -1) {
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
    setContentTypeData(blob.type);
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
    let icon = document.getElementById("imageUploadIcon1");
    let text1 = document.getElementById("imageUploadText11");
    let text2 = document.getElementById("imageUploadText21");
    let text3 = document.getElementById("imageUploadText31");
    // let text4 = document.getElementById('imageUploadText41');
    let image = document.getElementById("imagePreview1");
    // console.log(icon, "icon");

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
    setShowDescriptionModal(false);
    for (let a of documentTypes) {
      if (a?.id == event.target.value) {
        if (a?.bucket_key) {
          setSelectedDocumentData(a);
          setShowDescriptionModal(true);
        }
      }
    }

  };

  const handleClickUploadDocument = async () => {
    setIsLoader(true);
    let file = "";
    if (isCameraMode) {
      file = imageBlob;
    } else if (fileDrop == null) {
      if (documentTypeSelected == nationalId) {
        file = imageBlob;
      } else {
        file = docImage.current?.files?.item(0);
      }
    } else {
      file = fileDrop;
    }
    // setExpiryDate(format(new Date(date[0]), "yyyy-MM-dd"));
    let issueDateToSend;
    const dateFormat = region === "united-states-of-america-(USA)" ? true : false;
    if (dateFormat) {
      if (issueDate !== null) {
        issueDateToSend = format(new Date(issueDate), "yyyy-MM-dd");
      }
    } else {
      if (issueDate !== null) {
        const parsedDate = parse(issueDate, "dd/MM/yyyy", new Date());
        issueDateToSend = format(parsedDate, "yyyy-MM-dd");
      }
    }

    let data = props.updatedDocId ? {
      // sub_document_type_id: documentParentId == parseInt(documentTypeSelected) ? null : parseInt(documentTypeSelected),
      issued_date: issueDate ? issueDateToSend : issueDate,
      expiry_date: expiryDate ? format(new Date(expiryDate), "yyyy-MM-dd") : expiryDate,
      document_number: documentNumber,
      content_type: contentTypeData,
      identity_id,
      id: props.updatedDocId

    } : {
      document_type_id: documentParentId ? documentParentId : documentTypeSelected,
      sub_document_type_id: documentParentId == parseInt(documentTypeSelected) ? null : parseInt(documentTypeSelected),
      issued_date: issueDate ? issueDateToSend : issueDate,
      expiry_date: expiryDate ? format(new Date(expiryDate), "yyyy-MM-dd") : expiryDate,
      document_number: documentNumber,
      content_type: contentTypeData,
      identity_id,
    };

    const respond = props.updatedDocId ? await updateIdentityDocument(data,  cancelTokenSource.token) : await postIdentityDocument(data, cancelTokenSource.token);
    if (respond.success == true) {
      let url = respond.data.url;
      //Removing and Adding Token
      let token = axios.defaults.headers["x-auth-token"];

      delete axios.defaults.headers["x-auth-token"];

      axios
        .put(url, file, {
          headers: {
            "Content-Type": file?.type,
          },
        })
        .then(async (response) => {

          axios.defaults.headers["x-auth-token"] = token;

          const res = await postVerifyUploadDocument(respond.data.identity_document_id, cancelTokenSource.token);
          if (res.success == true) {
            props.setAlertSucessDocumentAdd(true);
            setIsLoader(false);
            clearFormData();
            setImage1(false);
            setImage2(false);
            props.onHide();
            props?.handleIsItemSelected && props?.handleIsItemSelected();
            props.list();
          } else {
          }
        })
        .catch((err) => {
          axios.defaults.headers["x-auth-token"] = token;
          // setErrorMessage(response.system_message);
          setIsLoader(false);
        });
    } else {
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

  const handleChangeIssueDate = (date) => {
    if (!(date?.length > 0)) {
      return;
    }
    const dateFormat = region === "united-states-of-america-(USA)" ? "MM/dd/yyyy" : "dd/MM/yyyy";
    const dateValue = Array.isArray(date) ? date[0] : date;
    const newDate = new Date(dateValue);
    const formattedDate = format(newDate, dateFormat);

    setIssueDate(formattedDate);
    // setIssueDate(format(new Date(formattedDate), "yyyy-MM-dd"));
  };

  const handleExpiryDateChange = (date, dateStr, instance) => {
    if (!(date?.length > 0)) {
      return;
    }
    const dateFormat = region === "united-states-of-america-(USA)" ? true : false;
    let enteredDate;
 

    if (!expiryDateEnteredManually) {
      // Only execute this block of code if the date was not entered manually
      if (date?.length > 0) {
        enteredDate = format(new Date(date[0]), "yyyy-MM-dd");
      }
    } else {
      // If date was entered manually, use it directly
      enteredDate = date[0];
    }

    // const formattedDate = format(new Date(date[0]), dateFormat);
    const currentDate = new Date().toISOString().slice(0, 10);
    let formattedIssueDate;
    if (dateFormat) {
      formattedIssueDate = format(new Date(issueDate), "yyyy-MM-dd");
    } else {
      if (issueDate !== null) {
        const parsedDate = parse(issueDate, "dd/MM/yyyy", new Date());
        formattedIssueDate = format(parsedDate, "yyyy-MM-dd");
      }
    }


    //format(new Date(issueDate), "yyyy-MM-dd"),
    const isDateValid = enteredDate > currentDate
    // const isDateValid = enteredDate > currentDate && enteredDate >= formattedIssueDate && enteredDate !== formattedIssueDate;

    setExpiryDate(date[0]);
    if (isDateValid) {
      // setExpiryDate(format(new Date(date[0]), "yyyy-MM-dd"));
      setErrorExpiryDate(false);
    } else {
      setErrorExpiryDate(true);
    }

    // Reset the flag after processing
    expiryDateEnteredManually = false;
  };

  function handleCloseExpiryModal(selectedDates, dateStr, instance) {

    // Your onClose logic here, if needed
    if (!selectedDates || selectedDates.length === 0) {
      setExpiryDate(null);
      // setErrorExpiryDate(true);
      return;
    }

    const dateFormat = region === "united-states-of-america-(USA)" ? true : false;
    let enteredDate;

    if (!expiryDateEnteredManually) {
      enteredDate = format(new Date(selectedDates[0]), "yyyy-MM-dd");
    } else {
      enteredDate = selectedDates[0];
    }

    // Ensure issueDate is not null before proceeding
    if (!issueDate) {
      setExpiryDate(null);
      setErrorExpiryDate(true);
      return;
    }

    const parsedIssueDate = dateFormat ? new Date(issueDate) : parse(issueDate, "dd/MM/yyyy", new Date());
    const formattedIssueDate = format(parsedIssueDate, "yyyy-MM-dd");

    const currentDate = new Date().toISOString().slice(0, 10);

    const isDateValid = enteredDate > currentDate 
    // const isDateValid = enteredDate > currentDate && enteredDate >= formattedIssueDate && enteredDate !== formattedIssueDate;

    if (isDateValid) {
      setExpiryDate(selectedDates[0]);
      setErrorExpiryDate(false);
    } else {
      setErrorExpiryDate(true);
      setExpiryDate(null);
    }

    expiryDateEnteredManually = true;
  }

  function handleCloseIssueDateModal(date, dateStr, instance) {
    if (!date || date.length === 0) {
      setIssueDate(null);
      return;
    }

    const dateFormat = region === "united-states-of-america-(USA)" ? "MM/dd/yyyy" : "dd/MM/yyyy";
    const dateValue = Array.isArray(date) ? date[0] : date;
    const newDate = new Date(dateValue);

    if (!newDate || isNaN(newDate.getTime())) {
      setIssueDate(null);
      return;
    }

    const formattedDate = format(newDate, dateFormat);

    // Ensure formattedDate is not null before setting issueDate
    if (!formattedDate) {
      setIssueDate(null);
      return;
    }

    setIssueDate(formattedDate);
  }

  const handleCloseDescriptionModal = () => {
    setShowDescriptionModal(!showDescriptionModal);
  };

  let streams;
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia not supported on your browser!");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streams = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };
  // useEffect(() => {

  //   startCamera();
  // }, []);

  const cameraClose = (stream, videoRef) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null; // Clear the video source
    }
  };

  const captureImage = async () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedImageData = canvas.toDataURL("image/png");
    setImageData(capturedImageData);
    getBlob(capturedImageData);
    cameraClose(streams, videoRef);
  };

  const retakeImage = () => {
    setImageData("");
    startCamera();
    setContentTypeData("");
  };

  const handleOpenCamera = () => {
    if (documentTypeSelected === "") {
      setDocumentErr(true);
      setDocumentErrMessage("Select Document Type to Continue");
      return;
    }
    setIsCameraMode(true);
    startCamera();
  };

  const handleBackFromCamera = () => {
    setIsCameraMode(false);
    setImageData("");
    setImageBlob(null);
    setContentTypeData("");
  };

  return (
    <>
      <img className="hidden" src="" id="img1"></img>
      <div {...props} aria-labelledby="contained-modal-title-vcenter" className={`rounded-lg fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-scroll scrollbar-thin max-h-[100%] `}>
      
       <div className={`relative bg-color-modal-${theme} mt-20 rounded-lg shadow-lg w-full max-w-6xl mx-4 md:mx-6 lg:mx-8`}>
       <div className={`pt-4 pb-6 px-8 border-b border-b-[#2d435f]  flex items-center justify-between`}>
              <h3 className="text-lg font-light text-white ">Upload New Document</h3>
              
            </div>
       <div className={`bg-color-modal-${theme}  w-full flex items-center justify-between px-8 border-b border-color-modal-${theme} rounded-lg`}
      >
       
        {isLoader ? (
          <div className="flex justify-center items-center h-[20rem] w-full"
           
          >
            <Loader theme={theme} />
          </div>
        ) : (
          <>
            <div className={` flex w-full h-[65vh] overflow-y-auto`} >
           
                <div className={`flex gap-8 items-center justify-between w-full mt-10 mb-10`}>
                  <div className={`w-full `} >
                    <div className="border-[4px] border-[#063c5e] rounded-[30px] py-10">
                      {!(documentTypeSelectedName == "national id") ? (
                        <div className={`flex h-[100%] w-[100%] items-center justify-center `}
                         
                        >
                          <div className={`flex h-[100%] w-[100%] items-center justify-center `}
                            
                          >
                            {isCameraMode ? (
                              <div className="flex flex-col"
                               
                              >
                                {!imageData ? (
                                  <>
                                    <video ref={videoRef} autoPlay className="w-[100%] h-auto" />
                                    <canvas ref={canvasRef} style={{ display: "none" }} />
                                  </>
                                ) : (
                                  <img width="350px" height="auto" alt="" src={imageData} />
                                )}
                                <div style={{ padding: "10px" }} className="flex justify-between">
                                  <button onClick={handleBackFromCamera}>Back</button>
                                  {!imageData ? (
                                    <button  onClick={captureImage}>
                                      Capture
                                    </button>
                                  ) : (
                                    <button onClick={retakeImage}>
                                      Retake
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <img id="imagePreview" className={`h-full max-w-[304px] max-h-[44vh]`} src="" alt="Upload" style={{ display: "none" }}></img>
                                  {contentTypeData?.search("pdf") != -1 ? <PdfIcon style={{ fill: "black" }} fontSize={"medium"} color={"action"}></PdfIcon> : null}

                                  {contentTypeData != "" ? (
                                    contentTypeData?.search("pdf") != -1 || contentTypeData?.search("jpg") != -1 || contentTypeData?.search("png") != -1 || contentTypeData?.search("jpeg") != -1 ? null : (
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "12px",
                                        }}
                                      >
                                        Please Select The Following Formats PNG, JPG and PDF{" "}
                                      </span>
                                    )
                                  ) : null}

                                  <FaCloudUploadAlt id="imageUploadIcon" color="#63c6d2" fontSize="50px" />
                                  <div
                                    id="imageUploadText1"
                                    className={`flex flex-col items-center text-[20px]`}
                                   
                                  >
                                    Please click on 'Browse File' to upload.
                                  </div>
                                  <div
                                    id="imageUploadText2"
                                    className={`flex flex-col items-center`}
                                    
                                  >
                                    <button
                                     
                                      onClick={handleImageClick}
                                      style={{
                                        border: documentTypeSelected !== "" ? "2px solid rgb(107 137 81)" : "2px solid #fff",
                                        borderRadius: "100px",
                                        padding: "10px 30px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginTop: "2rem",
                                      }}
                                    >
                                      <FaCloudUploadAlt style={{ marginRight: "10px" }} />
                                      <span>Browse Files</span>
                                    </button>
                                    <button
                                      variant="outlined"
                                      onClick={handleOpenCamera}
                                      style={{
                                        border: documentTypeSelected !== "" ? "2px solid #ff6347" : "2px solid #fff",
                                        borderRadius: "100px",
                                        padding: "10px 30px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <FaCamera style={{ marginRight: "10px" }} />
                                      <span>Capture Image</span>
                                    </button>
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
                                    {nationalIdMessage != "" ? nationalIdMessage : ""}
                                  </div>
                                  <div
                                    id="imageUploadText3"
                                    className={"text2"}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      marginTop: "30px",
                                    }}
                                  >
                                    <h5 className="text-[0.8125rem] tracking-[-0.02em] font-light">
                                      Max file size: <strong>5MB</strong>
                                    </h5>
                                    <h5 className="text-[0.8125rem] tracking-[-0.02em] font-light">
                                      Supported files types: <strong>PNG,JPG,PDF,DOCS</strong>
                                    </h5>
                                  </div>
                                </div>
                                <input
                                  style={{
                                    opacity: "0",
                                    position: "absolute",
                                    top: "10px",
                                  }}
                                  className={"imageInput"}
                                  // inputProps={{ multiple: true }}
                                  // inputProps={{ multiple: documentTypeSelected == nationalId ? true : false }}
                                  type="file"
                                  id="inputImageElement"
                                  // onDrop={handleImageClickDrop}
                                  ref={docImage}
                                ></input>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ height: "100%" }}>
                          <div className="imageUploadMultiple" style={{ minWidth: "30rem" }} onClick={handleImageClick1}>

                            <img id="imagePreview1" className={"imageUploadPreview"} src="" alt="Upload" style={{ display: "none" }}></img>

                            {contentTypeData1 != "" ? (
                              contentTypeData1?.search("jpg") != -1 || contentTypeData1?.search("png") != -1 || contentTypeData1?.search("jpeg") != -1 ? null : (
                                <span style={{ color: "red", fontSize: "12px" }}>Please Select The Following Formats PNG, JPG </span>
                              )
                            ) : null}
                            {/* <canvas class="result"></canvas> */}
                            {/* <MdOutlineAddAPhoto id="imageUploadIcon1"></MdOutlineAddAPhoto> */}
                            <FaCloudUploadAlt id="imageUploadIcon1" color="#63c6d2" fontSize="50px" />
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
                          <div className="imageUploadMultiple" style={{ marginTop: "10px", minWidth: "30rem" }} onClick={handleImageClick2}>

                            <img id="imagePreview2" className={"imageUploadPreview"} src="" alt="Upload" style={{ display: "none" }}></img>

                            {contentTypeData2 != "" ? (
                              contentTypeData2?.search("jpg") != -1 || contentTypeData2?.search("png") != -1 || contentTypeData2?.search("jpeg") != -1 ? null : (
                                <span style={{ color: "red", fontSize: "12px" }}>Please Select The Following Formats PNG, JPG </span>
                              )
                            ) : null}
                            {/* <canvas class="result"></canvas> */}
                            {/* <MdOutlineAddAPhoto id="imageUploadIcon2"></MdOutlineAddAPhoto> */}
                            <FaCloudUploadAlt id="imageUploadIcon2" color="#63c6d2" fontSize="50px" />
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
                  </div>
                  <div className={`w-full`}>
                    <div className="flex flex-col">
                    <div className="w-full sm:w-10/12">
                        <div className={`flex justify-between`}
                         
                        >
                          <div className="w-full" >
                            <label className={`font-light text-[15px]`}>Document Type </label> <span className="text-red-500">*</span>
                            <select
                            className={`bg-color-textfield-dropdown-${theme} text-color-text-${theme} mt-[8px] mb-[18px] pl-[12px] pr-[28px] py-[8px] w-full outline-none shadow-${theme} rounded-lg placeholder:font-light font-light text-[15px]`}
                              aria-label="Default select example"
                              style={{
                                border: documentTypeSelected !== "" ? "none" : "2px solid orange",
                              }}
                              value={documentTypeSelected}
                              onChange={(event) => handleChangeDocumentType(event)}
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
                            </select>
                            <div>
                              <span style={{ color: "red" }}>{documentErrMessage}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {showDescriptionModal && selectedDocumentData?.bucket_key?.doc_note && selectedDocumentData?.bucket_key?.doc_note != "" && (
                        <div className="w-full">
                          <div className="flex justify-between"
                           
                          >
                            <div className="w-full" style={{ width: "100%" }}>
                            <label className={`font-light text-[15px]`}>Document Description</label>
                              {/* <Form.Control as="textarea" rows={3} value={selectedDocumentData?.bucket_key?.doc_note} readOnly /> */}
                              <textarea rows={3} value={selectedDocumentData?.bucket_key?.doc_note} readOnly className={`text-color-text-${theme}`}/>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="w-full sm:w-10/12">
                        <div className="flex justify-between"
                          
                        >
                          {documentTypeSelected === "10" ? (
                            <div className="w-full" >
                              <label className={`font-light text-[15px]`}>Document Number (Optional)</label>
                              <input  className={`bg-color-textfield-dropdown-${theme} mt-[8px] mb-[18px] pl-[12px] pr-[28px] py-[8px] w-full outline-none shadow-${theme} rounded-lg placeholder:font-light font-light text-color-text-${theme} text-[15px]`}
                             placeholder="Enter Document Number" type="text" value={documentNumber} onChange={(event) => setDocumentNumber(event.target.value)} />
                            </div>
                          ) : (
                            <div className="w-full">
                              <label className={`font-light text-[15px]`}>Document Number</label>
                              <input  className={`bg-color-textfield-dropdown-${theme} mt-[8px] mb-[18px] pl-[12px] pr-[28px] py-[8px] w-full outline-none shadow-${theme} rounded-lg placeholder:font-light font-light text-color-text-${theme} text-[15px]`}
                             placeholder="Enter Document Number" type="text" value={documentNumber} onChange={(event) => setDocumentNumber(event.target.value)} />
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
                            <div className="sm:w-10/12 w-full" style={{ width: "100%" }}>
                            <label className={`font-light text-[15px]`}>Document Date (Optional)</label>
                              <div
                                className="flatpickr-container"
                                style={{
                                  with: "100%",
                                  height: "40px",
                                  color: "white",
                                }}
                              >
                                <Flatpickr
                                  placeholder={placeHolderForDate}
                                  className={`flatpickr-custom text-color-text-${theme} bg-color-textfield-dropdown-${theme} mt-[8px] mb-[18px] pl-[12px] pr-[28px] py-[8px] w-full outline-none shadow-${theme} rounded-lg placeholder:font-light font-light text-[15px]`}
                             
                                  options={{
                                    dateFormat: formatDateRegionWise(null, null, true),
                                    allowInput: true, // Enable manual input
                                    static: true,
                                    onClose: function (selectedDates, dateStr, instance) {
                                      handleCloseIssueDateModal(selectedDates, dateStr, instance);
                                      // Your onClose logic here, if needed

                                      if (dateStr !== "") {
                                        // Set the flag to true when the date is entered manually
                                        issueDateEnteredManually = true;
                                      }
                                    },
                                    onReady: function (selectedDates, dateStr, instance) {
                                      // Add event listener to input field to handle manual date entry
                                      const input = instance.input;
                                      input.addEventListener("input", function (event) {
                                        const value = input.value;
                                        if (event.inputType === "deleteContentBackward") {
                                          // Remove the slash when backspace is pressed
                                          if (value.length === 3 || value.length === 6) {
                                            input.value = value.slice(0, -1);
                                          }
                                        } else {
                                          // Insert slash after entering two digits for month and day
                                          if (value.length === 2 || value.length === 5) {
                                            input.value += "/";
                                          }
                                        }
                                      });
                                    },
                                  }}
                                  value={issueDate}
                                  onChange={(date, dateStr, instance) => {
                                    // Set the flag to true when a date is selected from the calendar modal
                                    issueDateEnteredManually = false;
                                    handleChangeIssueDate(date, dateStr, instance);
                                  }}
                                />
                              </div>

                              {/* <Flatpickr
                                placeholder={"Document Date (Optional)"}
                                className={"form-control"}
                                options={{
                                  dateFormat: formatDateRegionWise(null, null, true),
                                }}
                                value={formatDateRegionWise(issueDate)}
                                onChange={(e) => {
                                  setIssueDate(format(new Date(e[0]), "yyyy-MM-dd"));
                                }}
                              /> */}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-full">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div className="w-full sm:w-10/12">
                              <label className={`font-light text-[15px]`}>
                                  Issue Date
                                  {documentTypeSelected == "" ? null : documentTypes.filter((item) => item?.id == documentTypeSelected)[0]?.has_issued_date ? "(Required)" : "(Optional)"}
                                </label>
                                <div
                                  className="flatpickr-container w-full  text-white"
                                 
                                >
                                  <Flatpickr
                                    placeholder={placeHolderForDate}
                                    className={`flatpickr-custom text-color-text-${theme} w-full bg-color-textfield-dropdown-${theme} mt-[8px] mb-[18px] pl-[12px] pr-[28px] py-[8px] w-full outline-none shadow-${theme} rounded-lg placeholder:font-light font-light text-[15px]`}
                             
                                    options={{
                                      dateFormat: formatDateRegionWise(null, null, true),
                                      allowInput: true, // Enable manual input
                                      static: true,
                                      onClose: function (selectedDates, dateStr, instance) {
                                        handleCloseIssueDateModal(selectedDates, dateStr, instance);
                                        // Your onClose logic here, if needed

                                        if (dateStr !== "") {
                                          // Set the flag to true when the date is entered manually
                                          issueDateEnteredManually = true;
                                        }
                                      },
                                      onReady: function (selectedDates, dateStr, instance) {
                                        // Add event listener to input field to handle manual date entry
                                        const input = instance.input;
                                        input.addEventListener("input", function (event) {
                                          const value = input.value;
                                          if (event.inputType === "deleteContentBackward") {
                                            // Remove the slash when backspace is pressed
                                            if (value.length === 3 || value.length === 6) {
                                              input.value = value.slice(0, -1);
                                            }
                                          } else {
                                            // Insert slash after entering two digits for month and day
                                            if (value.length === 2 || value.length === 5) {
                                              input.value += "/";
                                            }
                                          }
                                        });
                                      },
                                    }}
                                    value={issueDate}
                                    onChange={(date, dateStr, instance) => {
                                      // Set the flag to true when a date is selected from the calendar modal
                                      issueDateEnteredManually = false;
                                      handleChangeIssueDate(date, dateStr, instance);
                                    }}
                                    style={{ border: (imageData !== "" || contentTypeData !== "") && documentTypes.filter((item) => item?.id == documentTypeSelected)[0]?.has_issued_date ? "2px solid orange" : "none" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div className="w-full sm:w-10/12" >
                              <label className={`font-light text-[15px]`}>
                                  Expiry Date
                                  {documentTypeSelected == "" ? null : documentTypes.filter((item) => item?.id == documentTypeSelected)[0]?.has_expiry_date ? "(Required)" : "(Optional)"}
                                </label>

                                {/* <Form.Control
                                  type="date"
                                  value={expiryDate}
                                  disabled={!issueDate}
                                  min={issueDate}
                                  onChange={(event) => {
                                    const enteredDate = event.target.value
                                    const currentDate = new Date()
                                      .toISOString()
                                      .slice(0, 10)
                                    const isDateValid =
                                      enteredDate > currentDate &&
                                      enteredDate >= issueDate &&
                                      enteredDate !== issueDate

                                    if (isDateValid) {
                                      setExpiryDate(enteredDate)
                                      setErrorExpiryDate(false)
                                    } else {
                                      setErrorExpiryDate(true)
                                      setExpiryDate(null)
                                    }
                                  }}
                                /> */}
                                <div
                                  className="flatpickr-container w-full text-white"
                                  
                                >
                                  <Flatpickr
                                    placeholder={placeHolderForDate}
                                    className={`flatpickr-custom text-color-text-${theme} w-full bg-color-textfield-dropdown-${theme} mt-[8px] mb-[30px] pl-[12px] pr-[28px] py-[8px] w-full outline-none shadow-${theme} rounded-lg placeholder:font-light font-light text-[15px]`}
                             
                                    value={expiryDate}
                                    style={{ border: (imageData !== "" || contentTypeData !== "") && documentTypes.filter((item) => item?.id == documentTypeSelected)[0]?.has_expiry_date ? "2px solid orange" : "none" }}
                                    onChange={(date, dateStr, instance) => {
                                      // Set the flag to true when a date is selected from the calendar modal
                                      expiryDateEnteredManually = false;
                                      handleExpiryDateChange(date, dateStr, instance);
                                    }}
                                    options={{
                                      static: true,
                                      dateFormat: formatDateRegionWise(null, null, true),
                                      allowInput: true, // Enable manual input
                                      minDate: issueDate, // Set the minimum date as issue date
                                      disabled: !issueDate, // Disable the Flatpickr if issue date is not set
                                      conjunction: "/", // Allow users to separate date parts with slashes

                                      onClose: function (selectedDates, dateStr, instance) {
                                        // Your onClose logic here, if needed
                                        handleCloseExpiryModal(selectedDates, dateStr, instance);
                                      },
                                      onReady: function (selectedDates, dateStr, instance) {
                                        // Add event listener to input field to handle manual date entry
                                        const input = instance.input;
                                        input.addEventListener("keyup", function (event) {
                                          const key = event.key;
                                          if (!isNaN(key) && key !== "Tab" && key !== "Shift") {
                                            // Insert slash after entering two digits for month and day
                                            if (input.value.length === 2 || input.value.length === 5) {
                                              input.value += "/";
                                            }
                                          }
                                        });
                                      },
                                    }}
                                  />
                                </div>
                                {/* <Flatpickr
                                  placeholder={"Expiry Date"}
                                  className={"form-control"}
                                  options={{
                                    dateFormat: formatDateRegionWise(null, null, true),
                                  }}
                                  value={formatDateRegionWise(expiryDate)}
                                  onChange={(value) => {
                                    let enteredDate = value[0]
                                    console.log(enteredDate,'enteredDate')
                                    enteredDate =  format(new Date(enteredDate), "yyyy-MM-dd")
                                    const currentDate = new Date()
                                      .toISOString()
                                      .slice(0, 10)
                                    const isDateValid =
                                      enteredDate > currentDate &&
                                      enteredDate >= issueDate &&
                                      enteredDate !== issueDate

                                    if (isDateValid) {
                                      setExpiryDate(enteredDate)
                                      setErrorExpiryDate(false)
                                    } else {
                                      setErrorExpiryDate(true)
                                      setExpiryDate(null)
                                    }
                                  }}
                                /> */}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {errorExpiryDate && alertProps && (
                        <div>
                          <h2 style={{ color: "red" }}>The document you're uploading has expired. </h2>
                        </div>
                      )}
                      {passportDateValidity === false ? (
                        <div>
                          <h2 style={{ color: "red" }}>The expiry date should be greater than 3 months from the current date </h2>
                        </div>
                      ) : null}
                      <div className="col-sm-6">
                        <div className="form-group">
                          <button onClick={() => handleClickUploadDocument()} className={`bg-color-button3-${theme} text-[15px] font-light py-[10px] px-[30px] rounded-lg hover:bg-color-button3-hover-${theme} transition-all duration-300 ease-in-out`} size="lg" disabled={isFormValid()}>
                            Upload Document
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            {/* <Modal.Footer>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer> */}
          </>
        )}
        </div>
        </div>
      </div>

      {/* <Modal size="md" show={showDescriptionModal} onHide={handleCloseDescriptionModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Document's Description ({selectedDocumentData?.name})</h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: selectedDocumentData?.bucket_key?.doc_note }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDescriptionModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}
