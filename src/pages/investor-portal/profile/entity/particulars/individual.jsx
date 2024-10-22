import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Nav,
  Spinner,
  Image,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Countries from "../../../../../helpers/countries";
import { IdentityHeader } from "../../../../../widgets";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getParticularFieldsApi,
  postIdentityAPI,
  getParticularsDetailByIdentityIdAPI,
  updateIdentityStatusAPI,
  getEntityTypeAPI,
  postRegistrationProviderGetData,
} from "../../../../../api/network/customerApi";
import axios from "axios";
// import SpinnerWithBackDrop from "../../..../../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../../../../components/ui/loader";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./darkMode.css";
import { BsChevronRight } from "react-icons/bs";

// const dataaa = true
//   ? {
//       name: {
//         lastupdated: "2023-04-26",
//         source: "1",
//         classification: "C",
//         value: "ANDY LAU",
//       },
//       sex: {
//         lastupdated: "2023-04-26",
//         code: "M",
//         source: "1",
//         classification: "C",
//         desc: "MALE",
//       },
//       dob: {
//         lastupdated: "2023-04-26",
//         source: "1",
//         classification: "C",
//         value: "1988-10-06",
//       },
//       nationality: {
//         lastupdated: "2023-04-26",
//         code: "SG",
//         source: "1",
//         classification: "C",
//         desc: "SINGAPORE CITIZEN",
//       },
//       mobileno: {
//         lastupdated: "2023-04-26",
//         source: "4",
//         classification: "C",
//         areacode: {
//           value: "",
//         },
//         prefix: {
//           value: "",
//         },
//         nbr: {
//           value: "",
//         },
//       },
//       uinfin: {
//         lastupdated: "2023-04-26",
//         source: "1",
//         classification: "C",
//         value: "S6005048A",
//       },
//       aliasname: {
//         lastupdated: "2023-04-26",
//         source: "1",
//         classification: "C",
//         value: "das",
//       },
//       hanyupinyinname: {
//         lastupdated: "2023-04-26",
//         source: "1",
//         classification: "C",
//         value: "LIU TE HUA",
//       },
//       hanyupinyinaliasname: {
//         lastupdated: "2023-04-26",
//         source: "1",
//         classification: "C",
//         value: "",
//       },
//       race: {
//         lastupdated: "2023-04-26",
//         code: "CN",
//         source: "1",
//         classification: "C",
//         desc: "CHINESE",
//       },
//       residentialstatus: {
//         lastupdated: "2023-04-26",
//         code: "C",
//         source: "1",
//         classification: "C",
//         desc: "CITIZEN",
//       },
//       birthcountry: {
//         lastupdated: "2023-04-26",
//         code: "SG",
//         source: "1",
//         classification: "C",
//         desc: "SINGAPORE",
//       },
//       email: {
//         lastupdated: "2023-04-26",
//         source: "4",
//         classification: "C",
//         value: "",
//       },
//       regadd: {
//         country: {
//           code: "SG",
//           desc: "SINGAPORE",
//         },
//         unit: {
//           value: "10",
//         },
//         street: {
//           value: "ANCHORVALE DRIVE",
//         },
//         lastupdated: "2023-04-26",
//         block: {
//           value: "319",
//         },
//         source: "1",
//         postal: {
//           value: "542319",
//         },
//         classification: "C",
//         floor: {
//           value: "38",
//         },
//         type: "SG",
//         building: {
//           value: "",
//         },
//       },
//     }
//   : {
//       entity: {
//         "basic-profile": {
//           uen: {
//             value: "198102460H",
//           },
//           "entity-name": {
//             value: "Exclude Co Ltd",
//           },
//           "entity-type": {
//             code: "LC",
//             desc: "Local Company",
//           },
//           "entity-status": {
//             value: "LIVE",
//           },
//           "primary-activity": {
//             code: "71122",
//             desc: "PROCESS AND INDUSTRIAL PLANT ENGINEERING DESIGN AND CONSULTANCY SERVICES ",
//           },
//           "secondary-activity": {
//             code: "71129",
//             desc: "ENGINEERING DESIGN AND CONSULTANCY ACTIVITIES N.E.C.",
//           },
//           "registration-date": {
//             value: "1992-12-20",
//           },
//           "company-type": {
//             code: "B2",
//             desc: "Exempt Private Company Limited by Shares",
//           },
//           ownership: {
//             code: "1",
//             desc: "Individual Shareholders only",
//           },
//           "country-of-incorporation": {
//             code: "SG",
//             desc: "SINGAPORE",
//           },
//         },
//       },
//       person: {
//         name: {
//           lastupdated: "2023-05-10",
//           source: "1",
//           classification: "C",
//           value: "ANDY LAU",
//         },
//         aliasname: {
//           lastupdated: "2023-05-10",
//           source: "1",
//           classification: "C",
//           value: "",
//         },
//         sex: {
//           lastupdated: "2023-05-10",
//           code: "M",
//           source: "1",
//           classification: "C",
//           desc: "MALE",
//         },
//         nationality: {
//           lastupdated: "2023-05-10",
//           code: "SG",
//           source: "1",
//           classification: "C",
//           desc: "SINGAPORE CITIZEN",
//         },
//         dob: {
//           lastupdated: "2023-05-10",
//           source: "1",
//           classification: "C",
//           value: "1988-10-06",
//         },
//         birthcountry: {
//           lastupdated: "2023-05-10",
//           code: "SG",
//           source: "1",
//           classification: "C",
//           desc: "SINGAPORE",
//         },
//         mobileno: {
//           lastupdated: "2023-05-10",
//           source: "4",
//           classification: "C",
//           areacode: {
//             value: "",
//           },
//           prefix: {
//             value: "",
//           },
//           nbr: {
//             value: "",
//           },
//         },
//       },
//     };
const query = new URLSearchParams(location.search);
export default function Particular(props) {
  const params = useParams();
  const location = useLocation();

  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [particularAddedData, setParticularAddedData] = useState([]);
  const [particularEditMetaData, setParticularEditMetaData] = useState([]);
  const [identityDataFields, setIdentityDataFields] = useState(null);
  const [label, setLabel] = useState(null);
  const [isCrp, setIsCrp] = useState(false);
  const [labelError, setLabelError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [message, setMessage] = useState(false);
  const [errorMessage, SetErrorMessage] = useState({
    error: false,
    message: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isUpdate, setIsUpdate] = useState(true);
  const [isUpdateRegisteredValue, setIsUpdateRegisteredValue] = useState(true);
  const [entityTypeList, setEntityTypeList] = useState(null);
  const [entityType, setEntityType] = useState(null);
  const [panData, setPanData] = useState(location?.state?.data);
  console.log("query parameter 'pan':", query.get("pan"));
  console.log("location state data:", location?.state?.data);
  const [isLabelCorrect, setIsLabelCorrect] = useState({
    error: false,
    message: "",
  });
  const [entityError, setEntityError] = useState(false);
  const [errorDob, setErrorDob] = useState(false);
  const [registrationProvider, setRegistrationProvider] = useState({
    code: query.get("code") == null ? "" : query.get("code"),
    state: query.get("state") == null ? "" : query.get("state"),
  });
  const [registrationProviderData, setRegistrationProviderData] = useState({});
  const navigate = useNavigate();
  const theme = localStorage.getItem("portal_theme");
  console.log(theme, "theme");
  if (theme === "dark theme") {
    setDarkMode(true);
  }

  useEffect(() => {
    getParticularFields();

    getEntityType();
  }, []);

  useEffect(() => {
    console.log("isLabelCorrect", isLabelCorrect);
  }, [isLabelCorrect]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    console.log("abcdefghijkll", query.get("pan"));
    console.log("location", location?.state?.data);
    console.log("location awais", location);
    console.log("location pan", panData);

    if (query.get("pan")) {
      if (params?.type == "individual") {
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(panData) &&
          isUpdateRegisteredValue
        ) {
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            console.log(key, "key key key keysdmfjsdnfjsdnf");
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };
            const fullName =
              panData?.dataCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.fullName;
            const dob =
              panData?.dataCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.dob;
            const gender =
              panData?.dataCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.gender;

            const salutations = ["MR", "MRS", "MS", "MDM", "DR"];

            const convertToDateFormat = (inputDate) =>
              inputDate ? inputDate.split("-").reverse().join("-") : "";

            const getNameParts = (name) => {
              const nameParts = name.split(" ");
              const salutation = salutations.includes(
                nameParts[0].toUpperCase()
              )
                ? nameParts.shift().toUpperCase()
                : "";
              const firstName = nameParts[0] || "";
              const middleName = nameParts[1] || "";
              const lastName = nameParts.slice(2).join(" ");

              return { salutation, firstName, middleName, lastName };
            };

            switch (keyParts[2]) {
              case "first_name":
                const { firstName } = getNameParts(fullName);
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: firstName,
                  isAdhar: !!firstName,
                };
                break;

              case "middle_name":
                const { middleName } = getNameParts(fullName);
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: middleName,
                  isAdhar: !!middleName,
                };
                break;

              case "last_name":
                const { lastName } = getNameParts(fullName);
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: lastName,
                  isAdhar: !!lastName,
                };
                break;

              case "salutation_id":
                const { salutation } = getNameParts(fullName);
                fieldObject[key] = {
                  ...fieldObject[key],
                  DefaultValue: salutation,
                  value: salutation,
                  isEditable: false,
                  isAdhar: salutations.includes(salutation),
                };
                break;

              case "dob":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: convertToDateFormat(dob),
                  isAdhar: !!dob,
                };
                break;

              case "gender_key":
                const upperCaseGender = gender?.toUpperCase();
                if (upperCaseGender === "M" || upperCaseGender === "MALE") {
                  fieldObject[key] = {
                    ...fieldObject[key],
                    DefaultValue: "MALE",
                    value: "MALE",
                    isEditable: false,
                    isAdhar: !!gender,
                  };
                } else if (
                  upperCaseGender === "FM" ||
                  upperCaseGender === "FEMALE"
                ) {
                  fieldObject[key] = {
                    ...fieldObject[key],
                    DefaultValue: "FEMALE",
                    value: "FEMALE",
                    isEditable: false,
                    isAdhar: !!gender,
                  };
                } else {
                  fieldObject[key] = {
                    ...fieldObject[key],
                    value: "",
                    isAdhar: false,
                  };
                }
                break;

              // Handle other cases here...
            }

            return fieldObject;
          });
          console.log("fieldsWithValue");

          console.log("fieldsWithValue", fieldsWithValue);
          const result = fieldsWithValue.reduce((acc, cur) => {
            const [key, value] = Object.entries(cur)[0];
            return { ...acc, [key]: value };
          }, {});

          console.log("fieldsWithValue result", result);
          console.log(
            "fieldsWithValue result fieldsWithValue",
            fieldsWithValue
          );

          setParticularAddedData(result);
          setParticularFields(fieldsWithValue);

          getLabelFromDataForPan();

          setIsUpdateRegisteredValue(false);
        }
      } else {
        console.log("panData", panData);
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(panData?.pan) &&
          isUpdateRegisteredValue
        ) {
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            console.log(key, "key key key keysdmfjsdnfjsdnf");
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };

            switch (keyParts[2]) {
              case "name":
                if (panData?.pan?.result?.validated_data?.full_name) {
                  if (panData?.pan?.result?.validated_data?.full_name == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isAdhar: false,
                    };
                  } else {
                    const name =
                      panData?.pan?.result?.validated_data?.full_name;
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: name,
                      isAdhar: true,
                    };
                  }
                }
                break;
            }

            return fieldObject;
          });
          console.log("fieldsWithValue");

          console.log("fieldsWithValue", fieldsWithValue);
          const result = fieldsWithValue.reduce((acc, cur) => {
            const [key, value] = Object.entries(cur)[0];
            return { ...acc, [key]: value };
          }, {});

          console.log("fieldsWithValue result", result);

          setParticularAddedData(result);
          setParticularFields(fieldsWithValue);
          getLabelFromDataForPan();

          setIsUpdateRegisteredValue(false);
        }
      }
    }
  }, [panData, particularFields, particularAddedData, location]);
  useEffect(() => {
    console.log("location", location);
  }, [location]);
  useEffect(() => {
    console.log("particularAddedData", particularAddedData);
  }, [particularAddedData]);
  useEffect(() => {
    console.log("identityDataFields", identityDataFields);
    if (identityDataFields && isEmptyObject(registrationProviderData)) {
      getFullNameAndCountryLabel();
    }
  }, [identityDataFields, particularAddedData]);
  // useEffect(() => {
  //   const query = new URLSearchParams(location.search);
  //   console.log("abcdefghijkll", query.get("code"));
  //   setRegistrationProvider({ ...registrationProvider, code: query.get("code"), state: query.get("state") });
  //   //setAlertProps({ ...alertProps, show: false })}
  // }, []);
  useEffect(() => {
    if (registrationProvider.code && registrationProvider.state) {
      getParticularFields();
      // Implement your logic here
      handlePostRegistrationProviderApi(registrationProvider);
    } else {
    }
  }, [registrationProvider]);
  useEffect(() => {
    setIsLoader(true);
    // Execute all three API calls
    Promise.all([getParticularFields(), getEntityType()])
      .then(() => setIsLoader(false))
      .catch(() => setIsLoader(false));
  }, []);
  useEffect(() => {
    console.log(particularFields, "particularFields");
    console.log(
      `it is ${particularFields} and ${identityDataFields} and ${isUpdate}`
    );
    console.log(`${params?.type}`);
    if (particularFields && identityDataFields && isUpdate) {
      particularFields &&
        particularFields.map((item, index) => {
          let key = Object.keys(item);
          console.log("it is keys", key);

          console.log("it is keys item", item);
          if (key) {
            if (item[key[0]]?.for == "all" || item[key[0]]?.for == "root") {
              let keyValues = key[0].split(".");
              let customerType = keyValues[0];
              let formType = keyValues[1];
              let fieldType = item[key[0]]?.type;
              let valueField = item[key[0]]?.DefaultValue;
              let editableField = "";
              if (item[key[0]].hasOwnProperty("DefaultValue")) {
                editableField = false;
              } else {
                editableField = true;
              }

              if (customerType == params.type && formType != "crp") {
                if (fieldType == "check") {
                  if (identityDataFields.hasOwnProperty(key)) {
                  } else {
                    identityDataFields[key] = false;
                  }
                }
                if (editableField == false) {
                  identityDataFields[key] = valueField;
                }
              }
            }
          }
        });
      setIdentityDataFields(identityDataFields);
      console.log("identityDataFields", identityDataFields);

      // if(registrationProvider.code){
      //   if(email){
      //     identityDataFields['individual.extended.email'] = email,
      //   }

      // }
      setIsUpdate(false);
    }
  }, [identityDataFields, particularFields]);
  useEffect(() => {
    // console.log(
    //   "identityDataFields particularFields",
    //   particularFields.filter((item) => item.type == "check")
    // );
    // console.log(
    //   "identityDataFields particularFields",
    //   particularFields.map((item) => console.log("particularFields", item))
    // );
    console.log("identityDataFieldsparticularFields d", particularFields);
    let arr = particularFields;
    const filteredArr = arr.filter(
      (obj) =>
        obj.hasOwnProperty(Object.keys(obj)[0]) &&
        obj[Object.keys(obj)[0]].type === "check"
    );
    console.log(
      "identityDataFields particularFields filteredArr d",
      filteredArr
    );
    const result = filteredArr.filter((obj) => {
      const keys = Object.keys(obj);
      const firstKey = keys[0];
      return (
        firstKey.split(".")[1] !== "crp" &&
        firstKey.split(".")[0] === params?.type
      );
    });
    if (result) {
      console.log(
        "identityDataFields particularFields result d",
        result.map((item) => console.log("item", Object.keys(item)))
      );
      setIdentityDataFields((prevState) => {
        const newState = { ...prevState };
        console.log(newState, "newState");
        result.forEach((item) => {
          const key = Object.keys(item)[0];
          if (key.startsWith(`${params?.type}.`)) {
            newState[key] = false;
          }
        });
        return newState;
      });
    }

    console.log("result", result);

    // }
  }, [particularFields]);

  useEffect(() => {
    console.log(particularFields, "particularFields useefe=fect data");
    console.log(registrationProviderData, "particularFields useefe=fect data ");
    console.log("particularAddedData", particularAddedData);
    if (registrationProvider.code !== "") {
      if (params?.type == "individual") {
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(registrationProviderData) &&
          isUpdateRegisteredValue
        ) {
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            console.log(key, "key key key keysdmfjsdnfjsdnf");
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };

            switch (keyParts[2]) {
              case "first_name":
                if (registrationProviderData.name) {
                  if (registrationProviderData.name.value == "") {
                    // fieldObject[key] = { ...fieldObject[key], value: registrationProviderData.aliasname.value , isEditable: true };
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                  } else {
                    const nameParts =
                      registrationProviderData.name.value.split(" ");
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: nameParts[0],
                      isSingpass: true,
                    };
                  }
                }
                break;
              case "middle_name":
                if (registrationProviderData.name) {
                  if (registrationProviderData.name.value == "") {
                    // fieldObject[key] = { ...fieldObject[key], value: registrationProviderData.aliasname.value , isEditable: true };
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                  } else {
                    const nameParts =
                      registrationProviderData.name.value.split(" ");
                    if (nameParts.length >= 3) {
                      fieldObject[key] = {
                        ...fieldObject[key],
                        value: nameParts[1],
                        isSingpass: true,
                      };
                    }
                  }
                }
                break;
              case "last_name":
                if (registrationProviderData.name) {
                  const nameParts =
                    registrationProviderData.name.value.split(" ");

                  if (registrationProviderData.name.value == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                  } else {
                    if (nameParts.length >= 3) {
                      fieldObject[key] = {
                        ...fieldObject[key],
                        value: nameParts[2],
                        isSingpass: true,
                      };
                    } else if (nameParts.length == 2) {
                      fieldObject[key] = {
                        ...fieldObject[key],
                        value: nameParts[1],
                        isSingpass: true,
                      };
                    }
                  }
                }
                break;
              case "alias_name":
                if (registrationProviderData.aliasname) {
                  if (registrationProviderData.aliasname.value == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registrationProviderData.aliasname.value,
                      isSingpass: false,
                    };
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registrationProviderData.aliasname.value,
                      isSingpass: true,
                    };
                  }
                }
                break;
              case "gender_key":
                if (registrationProviderData.sex) {
                  if (registrationProviderData.sex.desc == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue:
                        registrationProviderData.sex.desc.toUpperCase(),
                      value: registrationProviderData.sex.desc.toUpperCase(),
                      isEditable: false,
                      isSingpass: true,
                    };
                  }
                }
                break;
              case "nationality_code":
                if (registrationProviderData.nationality) {
                  if (registrationProviderData.nationality?.code == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue: registrationProviderData.nationality.code,
                      value: registrationProviderData.nationality.code,
                      isEditable: false,
                      isSingpass: true,
                    };
                  }
                }
                break;
              case "country_of_residence_code":
                if (registrationProviderData.birthcountry) {
                  if (registrationProviderData.birthcountry?.code == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue: registrationProviderData.birthcountry.code,
                      value: registrationProviderData.birthcountry.code,
                      isEditable: false,
                      isSingpass: true,
                    };
                  }
                }
                break;

              case "dob":
                if (registrationProviderData.dob) {
                  if (registrationProviderData.birthcountry?.dob == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registrationProviderData.dob.value,
                      isSingpass: true,
                    };
                  }
                }

                break;
            }

            return fieldObject;
          });
          console.log("fieldsWithValue");

          console.log("fieldsWithValue", fieldsWithValue);
          const result = fieldsWithValue.reduce((acc, cur) => {
            const [key, value] = Object.entries(cur)[0];
            return { ...acc, [key]: value };
          }, {});

          console.log("fieldsWithValue result", result);

          setParticularAddedData(result);
          getLabelFromData(fieldsWithValue);
          setParticularFields(fieldsWithValue);
          setIsUpdateRegisteredValue(false);
        }
      } else {
        console.log("registrationProviderData", registrationProviderData);
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(registrationProviderData) &&
          isUpdateRegisteredValue
        ) {
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            console.log(key, "key key key keysdmfjsdnfjsdnf");
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };

            // switch (keyParts[2]) {
            //   case "name":
            //     if (registrationProviderData?.entity["basic-profile"]["entity-name"]) {
            //       if (registrationProviderData?.entity["basic-profile"]["entity-name"]?.value == "") {
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           value: "",
            //           isSingpass: false,
            //         };
            //       } else {
            //         const name = registrationProviderData?.entity["basic-profile"]["entity-name"]?.value;
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           value: name,
            //           isSingpass: true,
            //         };
            //       }
            //     }
            //     break;

            //   case "incorporate_country_code":
            //     if (registrationProviderData?.entity["basic-profile"]["country-of-incorporation"]) {
            //       if (registrationProviderData?.entity["basic-profile"]["country-of-incorporation"]?.code == "") {
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           value: "",
            //           isSingpass: false,
            //         };
            //       } else {
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           DefaultValue: registrationProviderData?.entity["basic-profile"]["country-of-incorporation"].code,
            //           value: registrationProviderData?.entity["basic-profile"]["country-of-incorporation"].code,
            //           isSingpass: true,
            //         };
            //       }
            //     }
            //     break;
            //   case "primary_bussiness_actdivity":
            //     if (registrationProviderData?.entity["basic-profile"]["primary-activity"]) {
            //       if (registrationProviderData?.entity["basic-profile"]["primary-activity"]?.desc == "") {
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           value: "",
            //           isSingpass: false,
            //         };
            //       } else {
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           DefaultValue: registrationProviderData?.entity["basic-profile"]["primary-activity"].desc,
            //           value: registrationProviderData?.entity["basic-profile"]["primary-activity"].desc,
            //           isSingpass: true,
            //         };
            //       }
            //     }
            //     break;

            //   case "former_registered_name":
            //     if (registrationProviderData["person"]["name"]) {
            //       if (registrationProviderData["person"]["name"]?.value == "") {
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           value: "",
            //           isSingpass: false,
            //         };
            //       } else {
            //         const name = registrationProviderData["person"]["name"]?.value;
            //         fieldObject[key] = {
            //           ...fieldObject[key],
            //           value: name,
            //           isSingpass: true,
            //         };
            //       }
            //     }
            //     break;
            // }

            return fieldObject;
          });
          console.log("fieldsWithValue");

          console.log("fieldsWithValue", fieldsWithValue);
          const result = fieldsWithValue.reduce((acc, cur) => {
            const [key, value] = Object.entries(cur)[0];
            return { ...acc, [key]: value };
          }, {});

          console.log("fieldsWithValue result", result);

          setParticularAddedData(result);
          getLabelFromData(fieldsWithValue);
          setParticularFields(fieldsWithValue);
          setIsUpdateRegisteredValue(false);
        }
      }
    }
  }, [registrationProviderData, particularFields, particularAddedData]);

  const getLabelFromData = (res) => {
    const result = res.reduce((acc, field) => {
      const [key, value] = Object.entries(field)[0];
      return { ...acc, [key]: value };
    }, {});

    // Retrieve the necessary data from particularAddedData
    const firstName = result["individual.basic.first_name"]?.value || "";
    const lastName = result["individual.basic.last_name"]?.value || "";
    const country = result["individual.basic.nationality_code"]?.value || "";
    let newLabel = `${firstName} ${lastName} ${country}`;
    if (params?.type === "corporate") {
      const name = result["corporate.basic.name"]?.value || "";
      const country =
        result["corporate.basic.incorporate_country_code"]?.value || "";
      newLabel = `${name}  ${country}`;
    }
    // Construct the label using the retrieved data
    if (!params?.identity_id) {
      if (particularAddedData) {
        getFullNameAndCountryLabel(newLabel);
      }
    }

    //  setLabel(newLabel);
  };
  const getLabelFromDataForPan = () => {
    //panData?.pan?.result?.validated_data?.full_name
    console.log("panData params?.identity_id", params?.identity_id);
    console.log(
      "panData params?.identity_id",
      panData?.pan?.result?.validated_data?.full_name
    );
    if (
      !params?.identity_id &&
      panData?.pan?.result?.validated_data?.full_name
    ) {
      const fullNameParts =
        panData.pan.result.validated_data.full_name.split(" ");
      if (params?.type === "individual") {
        if (fullNameParts.length === 3) {
          setLabel(fullNameParts[0] + " " + fullNameParts[2]);
        } else if (fullNameParts.length === 2) {
          setLabel(fullNameParts[0] + " " + fullNameParts[1]);
        }
      } else if (params?.type === "corporate") {
        const name = panData.pan.result.validated_data.full_name;
        setLabel(name);
      }
    }
  };

  const isEmptyObject = (obj) => {
    return (
      obj == null || (typeof obj === "object" && Object.keys(obj).length === 0)
    );
  };

  const handlePostRegistrationProviderApi = async (registrationProvider) => {
    setIsLoader(true);

    const response = await postRegistrationProviderGetData(
      registrationProvider,
      cancelTokenSource.token
    );
    console.log("response", response);
    if (response.success) {
      setIsLoader(false);
      console.log("response", response?.data);
      setRegistrationProviderData(response?.data);
    } else {
      setIsLoader(false);
    }
  };

  const getParticularFields = async () => {
    setIsLoader(true);
    let account_id = null;
    if (params?.account_id) {
      account_id = params?.account_id;
    }
    const response = await getParticularFieldsApi(
      account_id,
      cancelTokenSource.token
    );
    let array = [];
    if (response.success == true) {
      console.log("sdasdasdasdasdsa", response);
      if (params?.account_id) {
        array = [
          ...response.data?.account_fields?.s_f,
          ...response.data?.account_fields?.e_f,
        ];
      } else {
        array = response.data?.fields;
      }
      console.log(array, "array array array array array");
      const filteredObj = array
        .filter((item) => {
          const key = Object.keys(item)[0];
          return key.includes(params?.type);
        })
        .sort((a, b) => {
          const indexA = a[Object.keys(a)[0]].index;
          const indexB = b[Object.keys(b)[0]].index;
          return indexA - indexB;
        });
      console.log(filteredObj, "filteredObj");
      setParticularFields(filteredObj);

      if (params?.identity_id) {
        getSpecificIdentity(params?.identity_id);
      } else {
        setIsLoader(false);
      }
    } else {
      setIsLoader(false);
    }
  };
  const getEntityType = async () => {
    setIsLoader(true);

    const response = await getEntityTypeAPI(cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      setEntityTypeList(response?.data);
    } else {
      setIsLoader(false);
    }
  };

  const getSpecificIdentity = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      console.log("getParticularsDetailByIdentityIdAPI success");
      setParticularAddedData(response.data?.meta?.data);
      setParticularEditMetaData(response.data?.meta);
      setEntityType(response.data?.entityTypeId);

      setLabel(response.data?.label);
      setIsCrp(response.data?.parentId == "0" ? false : true);
      console.log(
        response.data?.parentId == "0" ? false : true,
        "asdbjhasbdjahsbdjahsb djabs djhas"
      );
      if (response.data?.meta?.data) {
        let keys = Object.keys(response.data?.meta?.data);
        if (keys) {
          keys &&
            keys.map((items, index) => {
              if (response.data?.meta?.data[items]?.value) {
                setIdentityDataFields({
                  ...identityDataFields,
                  [items]: response.data?.meta?.data[items]?.value,
                });
                console.log(
                  "response.data?.meta?.data[items],setIdentityDataFields",
                  response.data?.meta?.data[items]
                );
              }
            });
        }
      }
      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };
  const getFullNameAndCountryLabel = (label) => {
    let newLabel;
    //identityDataFields
    if (!isEmptyObject(registrationProviderData)) {
      if (label) {
        newLabel = label;
      } else {
        // Retrieve the first name, last name, and country from the state

        if (params?.type === "corporate") {
          const name = particularAddedData["corporate.basic.name"] || "";
          const country =
            particularAddedData["corporate.basic.incorporate_country_code"] ||
            "";
          newLabel = `${name}  ${country}`;
        } else {
          const firstName =
            particularAddedData["individual.basic.first_name"] || "";
          const lastName =
            particularAddedData["individual.basic.last_name"] || "";
          const country =
            particularAddedData["individual.basic.nationality_code"] || "";

          // Construct the label using the first name, last name, and country
          newLabel = `${firstName} ${lastName} ${country}`;
        }
      }
    } else {
      // Retrieve the first name, last name, and country from the state
      if (params?.type === "corporate") {
        const name = identityDataFields["corporate.basic.name"] || "";
        const country =
          identityDataFields["corporate.basic.incorporate_country_code"] || "";
        newLabel = `${name}  ${country}`;
      } else {
        const firstName =
          identityDataFields["individual.basic.first_name"] || "";
        const lastName = identityDataFields["individual.basic.last_name"] || "";
        const country =
          identityDataFields["individual.basic.nationality_code"] || "";

        // Construct the label using the first name, last name, and country
        newLabel = `${firstName} ${lastName} ${country}`;
      }
    }
    if (!params?.identity_id && !panData) {
      setLabel(newLabel);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Phone") {
      // If the input is the phone number field, update the phone number
      setIdentityDataFields({
        ...identityDataFields,
        phone: e,
      });
    } else {
      console.log(name, "name name");
      if (name === "individual.basic.dob") {
        const currentYear = new Date().getFullYear();
        const selectedYear = new Date(value).getFullYear();
        if (selectedYear >= currentYear) {
          setErrorDob(true);
        } else {
          setErrorDob(false);
        }
      }
      setIdentityDataFields({
        ...identityDataFields,
        [name]: value,
      });
    }
  };
  const handleChangeEntityKey = (e) => {
    setEntityType(e.target.value);
  };

  const handlePhoneNumber = (phone, formKey, e) => {
    console.log(phone, formKey);
    setIdentityDataFields({
      ...identityDataFields,
      [formKey]: phone,
    });
  };
  const handleChangeCheckBox = (e) => {
    console.log("e.target.name", e.target.name);
    setIdentityDataFields({
      ...identityDataFields,
      [e.target.name]: e.target.checked,
    });
  };
  const handleChangeLabel = (e) => {
    setLabel(e.target.value);
  };
  const preparePayloadForSingPass = (data) => {
    const fieldObject = data;
    if (params?.type == "individual") {
      if (
        registrationProviderData.name &&
        registrationProviderData.name.value
      ) {
        const nameValue = registrationProviderData.name.value;
        const nameParts = nameValue.split(" ");

        fieldObject["individual.basic.first_name"] =
          nameParts.length >= 1 ? nameParts[0] : "";
        fieldObject["individual.basic.middle_name"] =
          nameParts.length >= 3 ? nameParts[1] : "";
        fieldObject["individual.basic.last_name"] =
          nameParts.length >= 3
            ? nameParts[2]
            : nameParts.length === 2
            ? nameParts[1]
            : "";

        if (nameValue === "") {
          fieldObject["individual.basic.first_name"] = "";
          fieldObject["individual.basic.middle_name"] = "";
          fieldObject["individual.basic.last_name"] = "";
        }
      }

      if (
        registrationProviderData.aliasname &&
        registrationProviderData.aliasname.value
      ) {
        fieldObject["individual.basic.alias_name"] =
          registrationProviderData.aliasname.value;
      }

      if (registrationProviderData.sex && registrationProviderData.sex.desc) {
        fieldObject["individual.basic.gender_key"] =
          registrationProviderData.sex.desc;
      }

      if (
        registrationProviderData.nationality &&
        registrationProviderData.nationality.code
      ) {
        fieldObject["individual.basic.nationality_code"] =
          registrationProviderData.nationality.code;
      }

      if (
        registrationProviderData.birthcountry &&
        registrationProviderData.birthcountry.code
      ) {
        fieldObject["individual.basic.country_of_residence_code"] =
          registrationProviderData.birthcountry.code;
      }

      if (registrationProviderData.dob && registrationProviderData.dob.value) {
        fieldObject["individual.basic.dob"] =
          registrationProviderData.dob.value;
      }
      if (
        registrationProviderData.email &&
        registrationProviderData.email.value !== ""
      ) {
        fieldObject["individual.extended.email"] =
          registrationProviderData.email.value;
      }
    } else {
      if (
        registrationProviderData?.entity["basic-profile"]["entity-name"] &&
        !registrationProviderData?.entity["basic-profile"]["entity-name"]
          ?.value == ""
      ) {
        fieldObject["corporate.basic.name"] =
          registrationProviderData?.entity["basic-profile"][
            "entity-name"
          ]?.value;
      }
      if (
        registrationProviderData?.entity["basic-profile"][
          "country-of-incorporation"
        ] &&
        !registrationProviderData?.entity["basic-profile"][
          "country-of-incorporation"
        ]?.code == ""
      ) {
        fieldObject["corporate.basic.incorporate_country_code"] =
          registrationProviderData?.entity["basic-profile"][
            "country-of-incorporation"
          ]?.code;
      }
      if (
        registrationProviderData["person"]["name"] &&
        !registrationProviderData["person"]["name"]?.value == ""
      ) {
        fieldObject["corporate.basic.former_registered_name"] =
          registrationProviderData["person"]["name"]?.value;
      }
    }

    // Other property checks...

    return fieldObject;
  };
  const preparePayloadForPanCard = (data) => {
    const fieldObject = data;
    if (params?.type == "individual") {
      if (panData?.pan?.result?.validated_data?.full_name) {
        const nameValue = panData?.pan?.result?.validated_data?.full_name;
        const nameParts = nameValue.split(" ");

        fieldObject["individual.basic.first_name"] =
          nameParts.length >= 1 ? nameParts[0] : "";
        fieldObject["individual.basic.middle_name"] =
          nameParts.length >= 3 ? nameParts[1] : "";
        fieldObject["individual.basic.last_name"] =
          nameParts.length >= 3
            ? nameParts[2]
            : nameParts.length === 2
            ? nameParts[1]
            : "";

        if (nameValue === "") {
          fieldObject["individual.basic.first_name"] = "";
          fieldObject["individual.basic.middle_name"] = "";
          fieldObject["individual.basic.last_name"] = "";
        }
      }
    } else {
      if (panData?.pan?.result?.validated_data?.full_name) {
        fieldObject["corporate.basic.name"] =
          panData?.pan?.result?.validated_data?.full_name;
      }
    }

    // Other property checks...

    return fieldObject;
  };

  const checkLabelCorrectness = (firstName, lastName, country) => {
    let firstNameError = "";
    let lastNameError = "";
    let countryError = "";

    if (firstName === "") {
      firstNameError = "First name must have some value.";
    }

    if (lastName === "") {
      lastNameError = "Last name must have some value.";
    }

    if (country === "") {
      countryError = "Country must have some value.";
    }

    return {
      firstNameError: firstNameError,
      lastNameError: lastNameError,
      countryError: countryError,
    };
  };

  const handleSubmit = (type) => {
    // const firstName = identityDataFields["individual.basic.first_name"] || "";
    // const lastName = identityDataFields["individual.basic.last_name"] || "";
    // const country = identityDataFields["individual.basic.nationality_code"] || "";

    // const labelErrors = checkLabelCorrectness(firstName, lastName, country);

    // setIsLabelCorrect({
    //   firstNameError: labelErrors.firstNameError,
    //   lastNameError: labelErrors.lastNameError,
    //   countryError: labelErrors.countryError,
    // });

    // if (labelErrors.firstNameError || labelErrors.lastNameError || labelErrors.countryError) {

    // } else {

    if (label == "" || label === null) {
      setLabelError(true);
      topFunction();
      setSubmitLoader(false);
      return;
    }
    if (
      params?.type == "corporate" &&
      (entityType == "" || entityType === null)
    ) {
      setEntityError(true);
      topFunction();
      return;
    } else {
      setEntityError(false);
    }
    setSubmitLoader(true);
    console.log(identityDataFields, "identityDataFields");

    let identityDataFieldsPayload;
    if (panData == null || panData == undefined) {
      identityDataFieldsPayload = !isEmptyObject(registrationProviderData)
        ? preparePayloadForSingPass(identityDataFields)
        : {};
    } else {
      identityDataFieldsPayload = !isEmptyObject(panData?.pan)
        ? preparePayloadForPanCard(identityDataFields)
        : {};
    }
    console.log("identityDataFieldsPayload", identityDataFieldsPayload);
    const dataToSend = {
      label: label,
      customer_type_key: params?.type.toUpperCase(),
      data: identityDataFields
        ? !isEmptyObject(registrationProviderData)
          ? identityDataFieldsPayload
          : identityDataFields
        : {},
      entity_type_id:
        params?.type == "individual" ? null : entityType.toString(),
    };

    if (!isEmptyObject(registrationProviderData)) {
      if (!dataToSend.providerInfo) {
        dataToSend.providerInfo = {};
      }

      if (params?.type === "individual") {
        dataToSend.providerInfo.data = registrationProviderData;
        dataToSend.providerInfo.provider = "SINGPASS";
      } else {
        dataToSend.providerInfo.data = registrationProviderData;
        dataToSend.providerInfo.provider = "CORPPASS";
      }
    }

    if (panData !== null && panData !== undefined) {
      if (!dataToSend.providerInfo) {
        dataToSend.providerInfo = {};
      }

      dataToSend.providerInfo.data = panData?.pan?.result;
      dataToSend.providerInfo.provider = "PAN";
    }

    if (params?.identity_id) {
      dataToSend["identity_id"] = params?.identity_id;
    }

    handleSubmitCall(dataToSend, type);
  };
  const handleSubmitCall = async (data, type) => {
    setSubmitLoader(true);
    const response = await postIdentityAPI(data, cancelTokenSource.token);
    if (response.success == true) {
      setSubmitLoader(false);
      topFunction();
      setMessage(true);
      if (type == "join_fund") {
        handleActiveStatus(response?.data?.id);
        return;
      }
      if (!params.identity_id) {
        navigate("/profile/identities");
      }
    } else {
      setSubmitLoader(false);
      SetErrorMessage({
        ...errorMessage,
        error: "true",
        message: response?.user_message,
      });
    }
  };

  const handleActiveStatus = async (identityId) => {
    setSubmitLoader(true);
    let dataToSend = {
      status: "activate",
    };
    const response = await updateIdentityStatusAPI(
      dataToSend,
      identityId,
      cancelTokenSource.token
    );
    setSubmitLoader(false);
    if (response.success == true) {
      navigate(`/subscription/request/${identityId}`);
    } else {
      setSubmitLoader(false);
    }
  };
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  const getUpdatedData = (key) => {
    console.log("checking", particularAddedData);
    console.log("checking key", particularAddedData[key]?.value);
    console.log("first key", key);
    return particularAddedData[key]?.value == null
      ? ""
      : particularAddedData[key]?.value;
  };

  const handleProviderValueDisabled = (particularAddData, key) => {
    if (particularEditMetaData && particularEditMetaData?.identity) {
      const keyParts = key[0].split(".");
      if (params?.type == "individual") {
        console.log("1 particularAddData particularAddData", particularAddData);
        console.log("1 particularAddData key", key);
        console.log(
          "1 particularAddData particularEditMetaData",
          particularEditMetaData
        );
        if (particularEditMetaData.identity.provider === "PAN") {
        } else {
          switch (keyParts[2]) {
            case "first_name":
              if (particularEditMetaData?.identity?.data?.name) {
                if (particularEditMetaData?.identity?.data?.name?.value == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "middle_name":
              if (particularEditMetaData?.identity?.data?.name) {
                if (particularEditMetaData?.identity?.data?.name?.value == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "last_name":
              if (particularEditMetaData?.identity?.data?.name) {
                if (particularEditMetaData?.identity?.data?.name?.value == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "alias_name":
              if (particularEditMetaData?.identity?.data?.aliasname) {
                if (
                  particularEditMetaData?.identity?.data?.aliasname?.value == ""
                ) {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "gender_key":
              if (particularEditMetaData?.identity?.data?.sex?.desc) {
                if (particularEditMetaData?.identity?.data?.sex?.desc == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "nationality_code":
              if (particularEditMetaData?.identity?.data?.nationality) {
                if (
                  particularEditMetaData?.identity?.data?.nationality?.code ==
                  ""
                ) {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "country_of_residence_code":
              if (particularEditMetaData?.identity?.data?.birthcountry) {
                if (
                  particularEditMetaData?.identity?.data?.birthcountry?.code ==
                  ""
                ) {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "dob":
              if (particularEditMetaData?.identity?.data?.dob) {
                if (particularEditMetaData?.identity?.data?.dob?.value == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;
          }
        }

        console.log("1 particularAddData keyParts", keyParts[2]);
      } else {
        // switch (keyParts[2]) {
        //   case "name":
        //     if (particularEditMetaData.identity.data?.entity["basic-profile"]["entity-name"]) {
        //       if (particularEditMetaData.identity.data?.entity["basic-profile"]["entity-name"]?.value == "") {
        //         return false;
        //       } else {
        //         return true;
        //       }
        //     }
        //     break;
        //   case "incorporate_country_code":
        //     if (particularEditMetaData.identity.data?.entity["basic-profile"]["country-of-incorporation"]) {
        //       if (particularEditMetaData.identity.data?.entity["basic-profile"]["country-of-incorporation"]?.value == "") {
        //         return false;
        //       } else {
        //         return true;
        //       }
        //     }
        //     break;
        //   case "primary_bussiness_actdivity":
        //     if (particularEditMetaData.identity.data?.entity["basic-profile"]["primary-activity"]) {
        //       if (particularEditMetaData.identity.data?.entity["basic-profile"]["primary-activity"]?.value == "") {
        //         return false;
        //       } else {
        //         return true;
        //       }
        //     }
        //     break;
        //   case "former_registered_name":
        //     if (particularEditMetaData.identity.data["person"]["name"]) {
        //       if (particularEditMetaData.identity.data["person"]["name"]?.value == "") {
        //         return false;
        //       } else {
        //         return true;
        //       }
        //     }
        //     break;
        // }
      }
    } else {
      return false;
    }
  };
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={12} xl={12}>
            {message && (
              <div>
                <Alert
                  closeLabel
                  dismissible={true}
                  key="success"
                  variant="success"
                  onClose={() => setMessage(null)}
                >
                  Identity {params?.identity_id ? "Updated" : "Added"}{" "}
                  Successfully
                </Alert>
              </div>
            )}
            {errorMessage.error && (
              <div>
                <Alert
                  closeLabel
                  dismissible={true}
                  key="danger"
                  variant="danger"
                >
                  {errorMessage?.message}
                </Alert>
              </div>
            )}

            {isLabelCorrect.firstNameError && (
              <div>
                <Alert
                  closeLabel
                  dismissible={true}
                  key="danger"
                  variant="danger"
                >
                  {isLabelCorrect.firstNameError}
                </Alert>
              </div>
            )}
            {isLabelCorrect.lastNameError && (
              <div>
                <Alert
                  closeLabel
                  dismissible={true}
                  key="danger"
                  variant="danger"
                >
                  {isLabelCorrect.lastNameError}
                </Alert>
              </div>
            )}
            {isLabelCorrect.countryError && (
              <div>
                <Alert
                  closeLabel
                  dismissible={true}
                  key="danger"
                  variant="danger"
                >
                  {isLabelCorrect.countryError}
                </Alert>
              </div>
            )}

            {isLoader ? (
              // <SpinnerWithBackDrop animation="grow" custom={true} height="70vh" />
              <Loader />
            ) : (
              <Form className="identity-form">
                {submitLoader && (
                  // <SpinnerWithBackDrop animation="grow" custom={true} height="70vh" />
                  <Loader />
                )}
                <div className="row">
                  <div className="col-12 col-md-12">
                    <div className="form-group">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>
                            You can name this identity profile for easier
                            reference in future
                          </Tooltip>
                        }
                      >
                        <label className="form-label"> Identity Label</label>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="left"
                        overlay={
                          <Tooltip>
                            You can name this identity profile for easier
                            reference in future
                          </Tooltip>
                        }
                      >
                        <input
                          type="text"
                          className={
                            label
                              ? "form-control"
                              : "form-control field_warning"
                          }
                          name={"Identity Label"}
                          value={label}
                          placeholder="Label Of Identify"
                          onChange={(e) => {
                            handleChangeLabel(e);
                          }}
                        />
                      </OverlayTrigger>

                      {labelError && (
                        <span className="error-fields">
                          Enter Label To Continue
                        </span>
                      )}
                    </div>
                  </div>
                  {params?.type == "corporate" && (
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label">
                          {" "}
                          Entity Type{" "}
                          {!entityType && (
                            <span className="text-danger">*</span>
                          )}
                        </label>
                        <select
                          type="text"
                          className={
                            entityType
                              ? "form-control"
                              : "form-control field_warning"
                          }
                          value={entityType}
                          onChange={(e) => {
                            handleChangeEntityKey(e);
                          }}
                        >
                          <option value="">Select Entity Type</option>
                          {entityTypeList &&
                            Object.keys(entityTypeList).map((item, index) => {
                              if (item != "INDIVIDUAL") {
                                return (
                                  <option
                                    value={entityTypeList[item]?.value}
                                    selected={
                                      entityTypeList[item]?.value == entityType
                                    }
                                  >
                                    {entityTypeList[item]?.name}
                                  </option>
                                );
                              }
                            })}
                        </select>
                        {entityError && (
                          <span className="error-fields">
                            Select Entity Type To Continue
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {particularFields &&
                    particularFields.map((item, index) => {
                      console.log("ffffff", particularFields);
                      console.log("ffffff item", item);

                      let key = Object.keys(item);
                      let checkFieldsShow =
                        item[key[0]].hasOwnProperty("enabled");
                      if (checkFieldsShow && item[key[0]]?.enabled) {
                        if (isCrp) {
                          if (
                            item[key[0]]?.for == "all" ||
                            item[key[0]]?.for == "crp"
                            // item[key[0]]?.for == "root"
                          ) {
                            if (key) {
                              let keyValues = key[0].split(".");
                              console.log("keyValues", keyValues);

                              let customerType = keyValues[0];
                              console.log(
                                "keyValues customerType",
                                customerType
                              );
                              let formType = keyValues[1];
                              console.log("keyValues formType", formType);
                              let fieldName = keyValues[2];
                              console.log("keyValues fieldName", fieldName);
                              let label = fieldName.replaceAll("_", " ");
                              console.log("keyValues label", label);
                              let formKeyVal = key[0];
                              console.log("keyValues formKeyVal", formKeyVal);
                              const arr = label.split(" ");
                              console.log("keyValues arr", arr);
                              for (var i = 0; i < arr.length; i++) {
                                arr[i] =
                                  arr[i].charAt(0).toUpperCase() +
                                  arr[i].slice(1);
                              }
                              console.log("keyValues arr after", arr);
                              const str2 = arr.join(" ");
                              console.log("keyValues str2 after", str2);

                              label = str2;
                              let labelFromApi = item[key[0]]?.label;
                              if (labelFromApi) {
                                label = item[key[0]]?.label;
                              } else {
                                label = label;
                              }
                              let fieldType = item[key[0]]?.type;
                              let sourceType = item[key[0]]?.source?.type;
                              let returnKey = item[key[0]]?.source?.returnKey;
                              let fieldData = item[key[0]]?.source?.data;
                              let requiredField = item[key[0]]?.required;
                              let valueField = item[key[0]]?.DefaultValue;
                              let editableField = "";
                              if (item[key[0]].hasOwnProperty("DefaultValue")) {
                                editableField = false;
                              } else {
                                editableField = true;
                              }
                              if (
                                customerType == params.type &&
                                formType != "crp"
                              ) {
                                if (fieldType == "text") {
                                  if (fieldName == "phone") {
                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <div
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control" && darkMode
                                                ? "darkMode"
                                                : ""
                                            }
                                          >
                                            <PhoneInput
                                              value={getUpdatedData(formKeyVal)}
                                              country={"sg"}
                                              name={fieldName}
                                              onChange={(e) => {
                                                handlePhoneNumber(
                                                  e,
                                                  formKeyVal
                                                );
                                              }}
                                              inputProps={{
                                                name: "phone",
                                                required: true,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <input
                                            type={fieldType}
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control"
                                            }
                                            defaultValue={
                                              editableField == false
                                                ? valueField
                                                : getUpdatedData(formKeyVal)
                                            }
                                            disabled={!editableField}
                                            name={formKeyVal}
                                            placeholder={label}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                                if (fieldType == "date") {
                                  return (
                                    <div className="col-6 col-md-6">
                                      <div className="form-group">
                                        <label className="form-label">
                                          {label}
                                          {requiredField && (
                                            <span className="text-danger">
                                              *
                                            </span>
                                          )}
                                        </label>
                                        <input
                                          type={fieldType}
                                          defaultValue={
                                            editableField == false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          disabled={!editableField}
                                          className={
                                            requiredField &&
                                            !identityDataFields?.[formKeyVal] &&
                                            (getUpdatedData(formKeyVal) == "" ||
                                              getUpdatedData(formKeyVal) ==
                                                null)
                                              ? "form-control field_warning"
                                              : "form-control"
                                          }
                                          name={formKeyVal}
                                          placeholder={label}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        />
                                      </div>
                                      {errorDob ? (
                                        <div>
                                          <h2 style={{ color: "red" }}>
                                            Date of Birth cannot be the current
                                            year or later
                                          </h2>
                                        </div>
                                      ) : null}
                                    </div>
                                  );
                                }

                                if (fieldType == "dd") {
                                  if (
                                    sourceType == "table" ||
                                    sourceType == "custom"
                                  ) {
                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <select
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control"
                                            }
                                            defaultValue={
                                              editableField == false
                                                ? valueField
                                                : getUpdatedData(formKeyVal)
                                            }
                                            disabled={!editableField}
                                            name={formKeyVal}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                          >
                                            <option value="">
                                              Select {label}
                                            </option>

                                            {fieldData &&
                                              fieldData.map((dat, index) => (
                                                <option
                                                  value={dat[returnKey]}
                                                  selected={
                                                    editableField == false &&
                                                    valueField == dat[returnKey]
                                                      ? true
                                                      : getUpdatedData(
                                                          formKeyVal
                                                        ) == dat[returnKey]
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  {dat?.name}
                                                </option>
                                              ))}
                                          </select>
                                        </div>
                                      </div>
                                    );
                                  }
                                  if (sourceType == "enum") {
                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <select
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control"
                                            }
                                            defaultValue={
                                              editableField == false
                                                ? valueField
                                                : getUpdatedData(formKeyVal)
                                            }
                                            disabled={!editableField}
                                            name={formKeyVal}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                          >
                                            <option value="">
                                              Select {label}
                                            </option>
                                            {fieldData &&
                                              Object.keys(fieldData).map(
                                                (dat, index) => (
                                                  <option
                                                    value={
                                                      fieldData[dat][returnKey]
                                                    }
                                                    selected={
                                                      editableField == false &&
                                                      valueField ==
                                                        fieldData[dat][
                                                          returnKey
                                                        ]
                                                        ? true
                                                        : getUpdatedData(
                                                            formKeyVal
                                                          ) ==
                                                          fieldData[dat][
                                                            returnKey
                                                          ]
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    {fieldData[dat]?.name}
                                                  </option>
                                                )
                                              )}
                                          </select>
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                                if (fieldType == "check") {
                                  return (
                                    <div
                                      className="col-6 col-md-6"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <Form.Check
                                        // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                        className={"checkbox-field"}
                                        type={"checkbox"}
                                        id={formKeyVal}
                                        name={formKeyVal}
                                        label={label}
                                        defaultChecked={
                                          editableField == false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        disabled={!editableField}
                                        onChange={(e) => {
                                          handleChangeCheckBox(e);
                                        }}
                                      />
                                    </div>
                                  );
                                }
                              }
                            }
                          }
                        } else {
                          if (
                            item[key[0]]?.for == "all" ||
                            item[key[0]]?.for == "root"
                          ) {
                            if (key) {
                              console.log("checcccccccccccccccccc", key);
                              let keyValues = key[0].split(".");
                              console.log("keyValues", keyValues);
                              let customerType = keyValues[0];
                              console.log(
                                "keyValues customerType",
                                customerType
                              );
                              let formType = keyValues[1];
                              console.log("keyValues formType", formType);
                              let fieldName = keyValues[2];
                              console.log("keyValues fieldName", fieldName);
                              let label = fieldName.replaceAll("_", " ");
                              console.log("keyValues label", label);
                              let formKeyVal = key[0];
                              console.log("keyValues formKeyVal", formKeyVal);
                              const arr = label.split(" ");
                              console.log("keyValues arr", arr);

                              for (var i = 0; i < arr.length; i++) {
                                arr[i] =
                                  arr[i].charAt(0).toUpperCase() +
                                  arr[i].slice(1);
                              }
                              console.log("keyValues arr after", arr);
                              const str2 = arr.join(" ");
                              console.log("keyValues str2 after", str2);

                              label = str2;
                              let labelFromApi = item[key[0]]?.label;
                              if (labelFromApi) {
                                label = item[key[0]]?.label;
                              } else {
                                label = label;
                              }
                              let fieldType = item[key[0]]?.type;
                              let sourceType = item[key[0]]?.source?.type;
                              let returnKey = item[key[0]]?.source?.returnKey;
                              let fieldData = item[key[0]]?.source?.data;
                              let requiredField = item[key[0]]?.required;
                              let valueField = item[key[0]]?.DefaultValue;
                              let editableField = "";
                              console.log("ffffff itemkey,", item[key[0]]);
                              console.log("ffffff itemkey,", key[0]);
                              console.log("ffffff itemkey 0,", key);
                              console.log("ffffff itemkey 0,", item);
                              //individual.basic.date_signed => key
                              //item => key:value
                              if (item[key[0]].hasOwnProperty("DefaultValue")) {
                                editableField = false;
                              } else {
                                editableField = true;
                              }

                              // if (item[key[0]]?.isSingpass) {
                              //   editableField = false;
                              // } else {
                              //   editableField = true;
                              // }

                              console.log(
                                "ffffff itemkey 0 iseditable,",
                                editableField
                              );

                              if (
                                customerType == params.type &&
                                formType != "crp"
                              ) {
                                if (fieldType == "text") {
                                  if (fieldName == "phone") {
                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <div
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control" && darkMode
                                                ? "darkMode"
                                                : ""
                                            }
                                          >
                                            <PhoneInput
                                              value={getUpdatedData(formKeyVal)}
                                              country={"sg"}
                                              name={fieldName}
                                              onChange={(e) => {
                                                handlePhoneNumber(
                                                  e,
                                                  formKeyVal
                                                );
                                              }}
                                              inputProps={{
                                                name: "phone",
                                                required: true,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <input
                                            type={fieldType}
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control"
                                            }
                                            defaultValue={
                                              editableField == false
                                                ? valueField
                                                : getUpdatedData(formKeyVal)
                                            }
                                            disabled={
                                              !editableField ||
                                              particularAddedData[key[0]]
                                                ?.isSingpass ||
                                              particularAddedData[key[0]]
                                                ?.isAdhar ||
                                              handleProviderValueDisabled(
                                                particularAddedData,
                                                key
                                              )
                                            }
                                            // disabled={handleProviderValueDisabled(particularAddedData, key)}
                                            name={formKeyVal}
                                            placeholder={label}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                                if (fieldType == "date") {
                                  return (
                                    <div className="col-6 col-md-6">
                                      <div className="form-group">
                                        <label className="form-label">
                                          {label}
                                          {requiredField && (
                                            <span className="text-danger">
                                              *
                                            </span>
                                          )}
                                        </label>
                                        <input
                                          type={fieldType}
                                          defaultValue={
                                            editableField == false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          disabled={
                                            !editableField ||
                                            particularAddedData[key[0]]
                                              ?.isSingpass ||
                                            particularAddedData[key[0]]
                                              ?.isAdhar ||
                                            handleProviderValueDisabled(
                                              particularAddedData,
                                              key
                                            )
                                          }
                                          className={
                                            requiredField &&
                                            !identityDataFields?.[formKeyVal] &&
                                            (getUpdatedData(formKeyVal) == "" ||
                                              getUpdatedData(formKeyVal) ==
                                                null)
                                              ? "form-control field_warning"
                                              : "form-control"
                                          }
                                          name={formKeyVal}
                                          placeholder={label}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        />
                                      </div>
                                      {errorDob ? (
                                        <div>
                                          <h2 style={{ color: "red" }}>
                                            Date of Birth cannot be the current
                                            year
                                          </h2>
                                        </div>
                                      ) : null}
                                    </div>
                                  );
                                }

                                if (fieldType == "dd") {
                                  if (
                                    sourceType == "table" ||
                                    sourceType == "custom"
                                  ) {
                                    console.log("label", label);
                                    console.log(
                                      "label editableField",
                                      editableField
                                    );
                                    console.log(
                                      "label editableField  getUpdatedData(formKeyVal)",
                                      getUpdatedData(formKeyVal)
                                    );
                                    console.log(
                                      "label editableField   particularAddedData[key[0]]?.isSingpass(formKeyVal)",
                                      particularAddedData[key[0]]?.isSingpass
                                    );

                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <select
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control"
                                            }
                                            defaultValue={
                                              editableField == false
                                                ? valueField
                                                : getUpdatedData(formKeyVal)
                                            }
                                            disabled={
                                              !editableField ||
                                              particularAddedData[key[0]]
                                                ?.isSingpass ||
                                              particularAddedData[key[0]]
                                                ?.isAdhar ||
                                              handleProviderValueDisabled(
                                                particularAddedData,
                                                key
                                              )
                                            }
                                            name={formKeyVal}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                          >
                                            <option value="">
                                              Select {label}
                                            </option>
                                            {fieldData &&
                                              fieldData.map((dat, index) => (
                                                <option
                                                  value={dat[returnKey]}
                                                  selected={
                                                    editableField == false &&
                                                    valueField == dat[returnKey]
                                                      ? true
                                                      : getUpdatedData(
                                                          formKeyVal
                                                        ) == dat[returnKey]
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  {dat?.name}
                                                </option>
                                              ))}
                                          </select>
                                        </div>
                                      </div>
                                    );
                                  }
                                  if (sourceType == "enum") {
                                    console.log("fieldData", fieldData);
                                    console.log(
                                      "fieldData returnKey",
                                      returnKey
                                    );
                                    console.log(
                                      "fieldData returnKey valueField",
                                      valueField
                                    );
                                    console.log(
                                      "label editableField   particularAddedData[key[0]]?.isSingpass(formKeyVal)",
                                      particularAddedData[key[0]]?.isSingpass
                                    );

                                    return (
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <label className="form-label">
                                            {label}
                                            {requiredField && (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            )}
                                          </label>

                                          <select
                                            className={
                                              requiredField &&
                                              !identityDataFields?.[
                                                formKeyVal
                                              ] &&
                                              (getUpdatedData(formKeyVal) ==
                                                "" ||
                                                getUpdatedData(formKeyVal) ==
                                                  null)
                                                ? "form-control field_warning"
                                                : "form-control"
                                            }
                                            defaultValue={
                                              editableField == false
                                                ? valueField
                                                : getUpdatedData(formKeyVal)
                                            }
                                            disabled={
                                              !editableField ||
                                              particularAddedData[key[0]]
                                                ?.isSingpass ||
                                              particularAddedData[key[0]]
                                                ?.isAdhar ||
                                              handleProviderValueDisabled(
                                                particularAddedData,
                                                key
                                              )
                                            }
                                            name={formKeyVal}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                          >
                                            <option value="">
                                              Select {label}
                                            </option>
                                            {fieldData &&
                                              Object.keys(fieldData).map(
                                                (dat, index) => (
                                                  <option
                                                    value={
                                                      fieldData[dat][returnKey]
                                                    }
                                                    selected={
                                                      editableField == false &&
                                                      valueField ==
                                                        fieldData[dat][
                                                          returnKey
                                                        ]
                                                        ? true
                                                        : getUpdatedData(
                                                            formKeyVal
                                                          ) ==
                                                          fieldData[dat][
                                                            returnKey
                                                          ]
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    {fieldData[dat]?.name}
                                                  </option>
                                                )
                                              )}
                                          </select>
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                                if (fieldType == "check") {
                                  return (
                                    <div
                                      className="col-6 col-md-6"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <Form.Check
                                        // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                        className={"checkbox-field"}
                                        type={"checkbox"}
                                        id={formKeyVal}
                                        name={formKeyVal}
                                        label={label}
                                        defaultChecked={
                                          editableField == false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        disabled={!editableField}
                                        onChange={(e) => {
                                          handleChangeCheckBox(e);
                                        }}
                                      />
                                    </div>
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    })}
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    className="btn btn-primary"
                    onClick={() => {
                      handleSubmit("simple");
                    }}
                  >
                    Save Changes
                  </Button>
                  {!params?.account_id && (
                    <Button
                      className="btn btn-primary"
                      onClick={() => {
                        handleSubmit("join_fund");
                      }}
                    >
                      Save Changes and Continue to Join an Investment Product
                    </Button>
                  )}
                </div>
              </Form>
            )}
            {params.identity_id && params.account_id && (
              <div
                style={{ display: "flex", justifyContent: "end" }}
                xs={12}
                lg={10}
                xl={10}
              >
                <Button onClick={props?.handleNextStep}>
                  Next <BsChevronRight />
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
