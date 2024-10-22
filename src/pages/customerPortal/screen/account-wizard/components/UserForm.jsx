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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
// import { FaEye } from 'react-icons/fa';
import Countries from "../../../../helpers/countries";
import { IdentityHeader } from "../../../../widgets";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getParticularFieldsApi,
  postIdentityAttatchWithFund,
  getParticularFieldsFromFundIdApi,
  postIdentityAPI,
  getParticularsDetailByIdentityIdAPI,
  updateIdentityStatusAPI,
  getEntityTypeAPI,
  postRegistrationProviderGetData,
} from "../../../../api/network/CustomerApi";
import axios, { CancelTokenSource } from "axios";
import SpinnerWithBackDrop from "../../..../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./darkMode.css";
import IdentityCrpAndOrganizationChart from "./IdentityCrpAndOrganizationChart";
import { formatDateRegionWise } from "./../../../../helpers";
import { Flatpickr } from "../../../../components/vendor";
import { format } from "date-fns";
import { getCountryData } from "countries-list";

const query = new URLSearchParams(location.search);
export default function Particular(props) {
  const registered_user_email = localStorage?.getItem("user_email") || "";
  console.log(props, "props particular particular particular");
  const params = useParams();
  const location = useLocation();
  // const isAccepted = props?.dataOfAccountSetup?.accountData?.status == "accepted" ? true : false;
  const isAccepted = false;
  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [particularAddedData, setParticularAddedData] = useState([]);
  const [particularEditMetaData, setParticularEditMetaData] = useState([]);
  const [identityDataFields, setIdentityDataFields] = useState(null);
  const [label, setLabel] = useState(null);
  const [isCrp, setIsCrp] = useState(props?.crpId ? props?.crpId : false);
  const [labelError, setLabelError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [message, setMessage] = useState(false);
  const [errorMessage, SetErrorMessage] = useState({
    error: false,
    message: "",
  });
  const [countryCode, setCountryCode] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isUpdate, setIsUpdate] = useState(true);
  const [fieldsError, setFieldsError] = useState(false);
  const [isUpdateRegisteredValue, setIsUpdateRegisteredValue] = useState(true);
  const [entityTypeList, setEntityTypeList] = useState(null);
  const [entityType, setEntityType] = useState(null);
  const [panData, setPanData] = useState(location?.state?.data);
  const [updateLabel, setUpdateLabel] = useState(false);
  const [dobError, setDobError] = useState(false);

  const [entityError, setEntityError] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [registrationProvider, setRegistrationProvider] = useState({
    code: query.get("code") == null ? "" : query.get("code"),
    state: query.get("state") == null ? "" : query.get("state"),
  });
  const [registrationProviderData, setRegistrationProviderData] = useState({});
  const navigate = useNavigate();
  const theme = localStorage.getItem("portal_theme");
  const identity_id = props?.dataOfAccountSetup?.identity_id;
  const fund_id = props?.dataOfAccountSetup?.fund_id;
  const account_id = props?.dataOfAccountSetup?.account_id;
  var allRequiredField = [];
  if (theme === "dark theme") {
    setDarkMode(true);
  }

  useEffect(() => {
    getParticularFields();

    getEntityType();
  }, []);
  useEffect(() => {
    if (identity_id) {
      setShowLabel(true);
    }
  }, [identity_id]);
  useEffect(() => {
    if (props.submitCall) {
      handleSubmit();
      props.handleUpdateSubmitCall(false);
    }
  }, [props.submitCall]);
  useEffect(() => {
    props.fillAllFields(handleValidate());
  }, [identityDataFields, label]);
  useEffect(() => {
    console.log("setParticularAddedData", particularAddedData);
    console.log("identityDataFields", identityDataFields);
    console.log("particularFields particularFields", particularFields);
    if (identityDataFields) {
      const isEmail = Object.keys(identityDataFields)?.filter((item) => {
        const keyLast = item.split(".")[2];
        console.log("keyLastkeyLast", keyLast);

        return keyLast === "email" ? item : false;
      });
      console.log("keyLastkeyLast isEmail", isEmail);

      if (isEmail && particularAddedData?.length === 0) {
        setParticularAddedData({ [isEmail]: { value: registered_user_email } });
      }
    }
  }, [particularFields, identityDataFields]);
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    console.log("abcdefghijkll", query.get("pan"));
    console.log("location", location?.state?.data);
    console.log("location awais", location);
    console.log("location pan", panData);

    if (props?.providerCkyc !== null && props?.providerCkyc !== undefined) {
      if (props?.dataOfAccountSetup?.isIndividual) {
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(props?.providerCkyc) &&
          isUpdateRegisteredValue
        ) {
          let identityDataFieldsValues = {};
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            console.log(key, "key key key keysdmfjsdnfjsdnf");
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };
            const fullName =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.fullName;
            const dob =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.dob;
            const gender =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.gender;
            const nationality =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permCountry;
            const nationalityResidence =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permCountry;
            // const mobileNumber = props?.providerCkyc?.download?.result?.kycResult?.personalIdentifiableData?.personalDetails?.mobNum;
            const mobileNumber = getValidPhoneNumber(
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.mobNum,
              nationality
            );

            const email =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.email;
            const state =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permState;
            const city =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permCity;
            const postalCode =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permPin;
            const taxPayerId =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.pan;
            const permLine1 =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permLine1;
            const permLine2 =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permLine2;
            const permLine3 =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permLine3;
            const locality =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permDist;

            const postalCodeCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresPin;
            const permLine1Corres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresLine1;
            const permLine2Corres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresLine2;
            const permLine3Corres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresLine3;
            const localityCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresDist;
            const stateCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresState;
            const cityCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresCity;

            const salutations = ["MR", "MRS", "MS", "MDM", "DR"];

            const convertToDateFormat = (inputDate) =>
              inputDate ? inputDate.split("-").reverse().join("-") : "";

            const getNameParts = (name) => {
              const nameParts = name.split(" ");
              const salutation = salutations.includes(
                nameParts[0]?.toUpperCase()
              )
                ? nameParts.shift().toUpperCase()
                : "";
              const firstName = nameParts[0] || "";
              const middleName = nameParts[1] || "";
              const lastName = nameParts.slice(2).join(" ");

              return { salutation, firstName, middleName, lastName };
            };

            switch (keyParts[2]) {
              case "country_of_residence_code":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: nationality,
                  isAdhar: !!nationality,
                };
                identityDataFieldsValues[key] = nationality;
                setCountryCode(nationality);

                break;
              case "nationality_code":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: nationalityResidence,
                  isAdhar: !!nationalityResidence,
                };
                identityDataFieldsValues[key] = nationalityResidence;
                break;
              case "phone":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: mobileNumber,
                  isAdhar: !!mobileNumber,
                };
                identityDataFieldsValues[key] = mobileNumber;
                break;
              case "email":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: email,
                  isAdhar: !!email,
                };
                identityDataFieldsValues[key] = email;
                break;
              case "tax_payer_ssn":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: taxPayerId,
                  isAdhar: !!taxPayerId,
                };
                identityDataFieldsValues[key] = taxPayerId;
                break;
              case "city":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: city,
                  isAdhar: !!city,
                };
                identityDataFieldsValues[key] = city;
                break;
              case "state":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: state,
                  isAdhar: !!state,
                };
                identityDataFieldsValues[key] = state;
                break;
              case "pincode":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: postalCode,
                  isAdhar: !!postalCode,
                };
                identityDataFieldsValues[key] = postalCode;
                break;
              case "cross_pincode":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: postalCodeCorres,
                  isAdhar: !!postalCodeCorres,
                };
                identityDataFieldsValues[key] = postalCodeCorres;
                break;
              case "cross_state":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: stateCorres,
                  isAdhar: !!stateCorres,
                };
                identityDataFieldsValues[key] = stateCorres;
                break;
              case "cross_city":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: cityCorres,
                  isAdhar: !!cityCorres,
                };
                identityDataFieldsValues[key] = cityCorres;
                break;
              case "cross_locality":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: localityCorres,
                  isAdhar: !!localityCorres,
                };
                identityDataFieldsValues[key] = localityCorres;
                break;
              case "cross_street_address":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value:
                    permLine1Corres +
                    " " +
                    permLine2Corres +
                    " " +
                    permLine3Corres,
                  isAdhar:
                    !!permLine1Corres +
                    " " +
                    permLine2Corres +
                    " " +
                    permLine3Corres,
                };
                identityDataFieldsValues[key] =
                  permLine1Corres +
                  " " +
                  permLine2Corres +
                  " " +
                  permLine3Corres;
                break;
              case "country_of_tax_residence":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: nationalityResidence,
                  isAdhar: !!nationalityResidence,
                };
                identityDataFieldsValues[key] = nationalityResidence;
                break;
              case "locality":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: locality,
                  isAdhar: !!locality,
                };
                identityDataFieldsValues[key] = locality;
                break;
              case "street_address":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: permLine1 + " " + permLine2 + " " + permLine3,
                  isAdhar: !!permLine1 + " " + permLine2 + " " + permLine3,
                };
                identityDataFieldsValues[key] =
                  permLine1 + " " + permLine2 + " " + permLine3;
                break;

              case "first_name":
                const { firstName } = getNameParts(fullName);
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: firstName,
                  isAdhar: !!firstName,
                };
                identityDataFieldsValues[key] = firstName;
                break;

              case "middle_name":
                const { middleName } = getNameParts(fullName);
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: middleName,
                  isAdhar: !!middleName,
                };
                identityDataFieldsValues[key] = middleName;
                break;

              case "last_name":
                const { lastName } = getNameParts(fullName);
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: lastName,
                  isAdhar: !!lastName,
                };
                identityDataFieldsValues[key] = lastName;
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
                identityDataFieldsValues[key] = salutation;
                break;

              case "dob":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: convertToDateFormat(dob),
                  isAdhar: !!dob,
                };
                identityDataFieldsValues[key] = convertToDateFormat(dob);
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
                  identityDataFieldsValues[key] = "MALE";
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
                  identityDataFieldsValues[key] = "FEMALE";
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
          setIdentityDataFields(identityDataFieldsValues);
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
        console.log("props?.providerCkyc", props?.providerCkyc);
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(props?.providerCkyc) &&
          isUpdateRegisteredValue
        ) {
          let identityDataFieldsValues = {};
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            console.log(key, "key key key keysdmfjsdnfjsdnf");
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };

            const fullName =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.fullName;
            const dob =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.dob;
            const gender =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.gender;
            const countryOfIncorporation =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails
                ?.countryOfIncorporation;
            const mobileNumber =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.mobNum1;
            const email =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.email;
            const state =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permState;
            const city =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permCity;
            const postalCode =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permPin;
            const taxPayerId =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.pan;
            const permLine1 =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permLine1;
            const permLine2 =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permLine2;
            const permLine3 =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permLine3;
            const locality =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.permDist;

            const postalCodeCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresPin;
            const permLine1Corres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresLine1;
            const permLine2Corres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresLine2;
            const permLine3Corres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresLine3;
            const localityCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresDist;
            const stateCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresState;
            const cityCorres =
              props?.providerCkyc?.download?.result?.kycResult
                ?.personalIdentifiableData?.personalDetails?.corresCity;

            const salutations = ["MR", "MRS", "MS", "MDM", "DR"];

            const convertToDateFormat = (inputDate) =>
              inputDate ? inputDate.split("-").reverse().join("-") : "";

            const getNameParts = (name) => {
              const nameParts = name.split(" ");
              const salutation = salutations.includes(
                nameParts[0]?.toUpperCase()
              )
                ? nameParts.shift().toUpperCase()
                : "";
              const firstName = nameParts[0] || "";
              const middleName = nameParts[1] || "";
              const lastName = nameParts.slice(2).join(" ");

              return { salutation, firstName, middleName, lastName };
            };

            switch (keyParts[2]) {
              case "incorporate_country_code":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: countryOfIncorporation,
                  isAdhar: !!countryOfIncorporation,
                };
                identityDataFieldsValues[key] = countryOfIncorporation;
                setCountryCode(countryOfIncorporation);
                break;
              case "country_of_major_operation_code":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: countryOfIncorporation,
                  isAdhar: !!countryOfIncorporation,
                };
                identityDataFieldsValues[key] = countryOfIncorporation;
                break;
              case "country_of_tax_residence":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: countryOfIncorporation,
                  isAdhar: !!countryOfIncorporation,
                };
                identityDataFieldsValues[key] = countryOfIncorporation;
                break;
              case "phone":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: mobileNumber,
                  isAdhar: !!mobileNumber,
                };
                identityDataFieldsValues[key] = mobileNumber;
                break;
              case "email":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: email,
                  isAdhar: !!email,
                };
                identityDataFieldsValues[key] = email;
                break;
              case "tax_payer_ssn":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: taxPayerId,
                  isAdhar: !!taxPayerId,
                };
                identityDataFieldsValues[key] = taxPayerId;
                break;
              case "city":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: city,
                  isAdhar: !!city,
                };
                identityDataFieldsValues[key] = city;
                break;
              case "state":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: state,
                  isAdhar: !!state,
                };
                identityDataFieldsValues[key] = state;
                break;
              case "pincode":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: postalCode,
                  isAdhar: !!postalCode,
                };
                identityDataFieldsValues[key] = postalCode;
                break;
              case "cross_pincode":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: postalCodeCorres,
                  isAdhar: !!postalCodeCorres,
                };
                identityDataFieldsValues[key] = postalCodeCorres;
                break;
              case "cross_state":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: stateCorres,
                  isAdhar: !!stateCorres,
                };
                identityDataFieldsValues[key] = stateCorres;
                break;
              case "cross_city":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: cityCorres,
                  isAdhar: !!cityCorres,
                };
                identityDataFieldsValues[key] = cityCorres;
                break;
              case "cross_locality":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: localityCorres,
                  isAdhar: !!localityCorres,
                };
                identityDataFieldsValues[key] = localityCorres;
                break;
              case "cross_street_address":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value:
                    permLine1Corres +
                    " " +
                    permLine2Corres +
                    " " +
                    permLine3Corres,
                  isAdhar:
                    !!permLine1Corres +
                    " " +
                    permLine2Corres +
                    " " +
                    permLine3Corres,
                };
                identityDataFieldsValues[key] =
                  permLine1Corres +
                  " " +
                  permLine2Corres +
                  " " +
                  permLine3Corres;
                break;
              case "country_of_tax_residence":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: nationalityResidence,
                  isAdhar: !!nationalityResidence,
                };
                identityDataFieldsValues[key] = nationalityResidence;
                break;
              case "locality":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: locality,
                  isAdhar: !!locality,
                };
                identityDataFieldsValues[key] = locality;
                break;
              case "street_address":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: permLine1 + " " + permLine2 + " " + permLine3,
                  isAdhar: !!permLine1 + " " + permLine2 + " " + permLine3,
                };
                identityDataFieldsValues[key] =
                  permLine1 + " " + permLine2 + " " + permLine3;
                break;

              case "name":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: fullName,
                  isAdhar: !!fullName,
                };
                identityDataFieldsValues[key] = fullName;
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
                identityDataFieldsValues[key] = salutation;
                break;

              case "dob":
                fieldObject[key] = {
                  ...fieldObject[key],
                  value: convertToDateFormat(dob),
                  isAdhar: !!dob,
                };
                identityDataFieldsValues[key] = convertToDateFormat(dob);
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
                  identityDataFieldsValues[key] = "MALE";
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
                  identityDataFieldsValues[key] = "FEMALE";
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
          console.log(identityDataFieldsValues, "identityDataFieldsValues");
          console.log("fieldsWithValue result", result);
          setIdentityDataFields(identityDataFieldsValues);
          setParticularAddedData(result);
          setParticularFields(fieldsWithValue);
          // getLabelFromDataForPan();

          setIsUpdateRegisteredValue(false);
        }
      }
    }
  }, [props?.providerCkyc, particularFields, particularAddedData, location]);

  // useEffect(() => {
  //     console.log("identityDataFields", identityDataFields);
  //     if (!props?.providerCkyc) {
  //         if (identityDataFields && isEmptyObject(props?.providerCkyc)) {
  //             getFullNameAndCountryLabel();
  //         }
  //     }
  // }, [identityDataFields, particularAddedData]);
  useEffect(() => {
    if (identity_id) {
      setIsLoading(true);
    }
    // Check your condition here, and update isLoading accordingly
    if (identity_id && particularEditMetaData?.data) {
      setIsLoading(false);
    }
  }, [identity_id, particularEditMetaData]);

  useEffect(() => {
    if (identityDataFields && particularAddedData && updateLabel) {
      getFullNameAndCountryLabel();
      setUpdateLabel(false);
    }
  }, [identityDataFields, particularAddedData, updateLabel]);
  useEffect(() => {
    // const query = new URLSearchParams(location.search);
    // setRegistrationProvider({ ...registrationProvider, code: query.get("code"), state: query.get("state") });
    //setAlertProps({ ...alertProps, show: false })}
  }, []);
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
    console.log(
      identityDataFields,
      "identityDataFields useEffectuseEffectuseEffectuseEffect"
    );
    if (particularFields.length > 0 && identityDataFields && isUpdate) {
      console.log(
        particularFields,
        "particularFields useEffectuseEffectuseEffectuseEffectuseEffect"
      );

      particularFields &&
        particularFields.map((item, index) => {
          let key = Object.keys(item);
          if (key) {
            if (item[key[0]]?.for == "all" || item[key[0]]?.for == "root") {
              let keyValues = key[0]?.split(".");
              let customerType = keyValues[0];
              let formType = keyValues[1];
              let fieldType = item[key[0]]?.type;
              let valueField = item[key[0]]?.DefaultValue;
              let editableField = "";
              if (item[key[0]]?.hasOwnProperty("DefaultValue")) {
                editableField = false;
              } else {
                editableField = true;
              }

              if (
                customerType == props?.dataOfAccountSetup?.isIndividual
                  ? "individual"
                  : "corporate" && formType != "crp"
              ) {
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

      // if(registrationProvider.code){
      //   if(email){
      //     identityDataFields['individual.extended.email'] = email,
      //   }

      // }
      setIsUpdate(false);
    }
  }, [identityDataFields, particularFields]);
  useEffect(() => {
    console.log("particularFieldsparticularFields", particularFields);
    if (particularFields.length > 0) {
      let arr = particularFields;
      const filteredArr = arr.filter(
        (obj) =>
          obj.hasOwnProperty(Object.keys(obj)[0]) &&
          (obj[Object.keys(obj)[0]]?.type === "check" ||
            Object.keys(obj)[0].split(".")[2] === "email")
      );
      console.log("filteredArrfilteredArr", filteredArr);
      const result = filteredArr.filter((obj) => {
        const keys = Object.keys(obj);
        const firstKey = keys[0];
        return firstKey.split(".")[1] !== "crp" &&
          firstKey.split(".")[0] === props?.dataOfAccountSetup?.isIndividual
          ? "individual"
          : "corporate";
      });

      if (result) {
        setIdentityDataFields((prevState) => {
          const newState = { ...prevState };
          result.forEach((item) => {
            console.log(
              " Object.keys(item) Object.keys(item)",
              Object.keys(item)
            );
            const key = Object.keys(item)[0];
            if (
              key.startsWith(
                `${
                  props?.dataOfAccountSetup?.isIndividual
                    ? "individual"
                    : "corporate"
                }.`
              ) &&
              Object.keys(item)[0].split(".")[2] !== "email"
            ) {
              newState[key] = false;
            } else {
              if (registered_user_email) {
                newState[key] = particularAddedData[
                  `${
                    props?.dataOfAccountSetup?.isIndividual
                      ? "individual"
                      : "corporate"
                  }.extended.email`
                ]
                  ? particularAddedData[
                      `${
                        props?.dataOfAccountSetup?.isIndividual
                          ? "individual"
                          : "corporate"
                      }.extended.email`
                    ].value
                  : registered_user_email;
              }
            }
          });
          console.log("newStatenewState", newState);

          return newState;
        });
      }
    }

    // }
  }, [particularFields]);
  const splitFullNameSingPass = (fullName) => {
    // Split the name by the first space to separate the last name
    let nameArray = fullName.split(" ");

    let lastName = "";
    let firstName = "";

    if (nameArray.length === 0) {
      return {
        firstName: "",
        lastName: "",
      };
    }

    // The first word is the last name
    lastName = nameArray[0];

    // The rest of the words become the first name
    firstName = nameArray.slice(1).join(" ");

    return {
      firstName: firstName,
      lastName: lastName,
    };
  };

  const setLabelForSignPass = (data) => {
    if (data) {
      let newLabel = "";
      if (!props?.dataOfAccountSetup?.isIndividual) {
        const name = data["corporate.basic.name"] || "";
        const country = data["corporate.basic.incorporate_country_code"] || "";
        newLabel = `${name}  ${country}`;
      } else {
        const firstName = data["individual.basic.first_name"] || "";
        const lastName = data["individual.basic.last_name"] || "";
        const country = data["individual.basic.nationality_code"] || "";

        // Construct the label using the first name, last name, and country
        newLabel = `${firstName} ${lastName} ${country}`;
      }
      setLabel(newLabel);
    }
  };
  useEffect(() => {
    if (registrationProvider.code !== "") {
      let identityDataFieldsValues = {};
      if (props?.dataOfAccountSetup?.isIndividual) {
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(registrationProviderData) &&
          isUpdateRegisteredValue
        ) {
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };
            console.log(key, "key key key key");

            let race = registrationProviderData?.race?.desc;
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
                    identityDataFieldsValues[key] = "";
                  } else {
                    const nameParts =
                      registrationProviderData.name.value.split(" ");
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value:
                        race == "CHINESE"
                          ? splitFullNameSingPass(
                              registrationProviderData.name.value
                            )?.firstName
                          : nameParts[0],
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      race == "CHINESE"
                        ? splitFullNameSingPass(
                            registrationProviderData.name.value
                          )?.firstName
                        : nameParts[0];
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
                    identityDataFieldsValues[key] = "";
                  } else {
                    const nameParts =
                      registrationProviderData.name.value.split(" ");
                    if (nameParts.length >= 3) {
                      fieldObject[key] = {
                        ...fieldObject[key],
                        value:
                          race == "CHINESE"
                            ? splitFullNameSingPass(
                                registrationProviderData.name.value
                              )?.middleName
                            : nameParts[1],

                        isSingpass: true,
                      };
                      identityDataFieldsValues[key] =
                        race == "CHINESE"
                          ? splitFullNameSingPass(
                              registrationProviderData.name.value
                            )?.middleName
                          : nameParts[1];
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
                    identityDataFieldsValues[key] = "";
                  } else {
                    if (nameParts.length >= 3) {
                      let last_end_name = "";
                      if (nameParts[3]) {
                        last_end_name = nameParts[3];
                      }
                      fieldObject[key] = {
                        ...fieldObject[key],
                        value:
                          race == "CHINESE"
                            ? splitFullNameSingPass(
                                registrationProviderData.name.value
                              )?.lastName
                            : nameParts[2] + " " + last_end_name,
                        isSingpass: true,
                      };

                      identityDataFieldsValues[key] =
                        race == "CHINESE"
                          ? splitFullNameSingPass(
                              registrationProviderData.name.value
                            )?.lastName
                          : nameParts[2] + " " + last_end_name;
                    } else if (nameParts.length == 2) {
                      fieldObject[key] = {
                        ...fieldObject[key],
                        value:
                          race == "CHINESE"
                            ? splitFullNameSingPass(
                                registrationProviderData.name.value
                              )?.lastName
                            : nameParts[1],
                        isSingpass: true,
                      };
                      identityDataFieldsValues[key] =
                        race == "CHINESE"
                          ? splitFullNameSingPass(
                              registrationProviderData.name.value
                            )?.lastName
                          : nameParts[1];
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
                    identityDataFieldsValues[key] =
                      registrationProviderData.aliasname.value;
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registrationProviderData.aliasname.value,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData.aliasname.value;
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
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue:
                        registrationProviderData.sex.desc.toUpperCase(),
                      value: registrationProviderData.sex.desc.toUpperCase(),
                      isEditable: false,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData.sex.desc.toUpperCase();
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
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue: registrationProviderData.nationality.code,
                      value: registrationProviderData.nationality.code,
                      isEditable: false,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData.nationality.code;
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
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue: registrationProviderData.birthcountry.code,
                      value: registrationProviderData.birthcountry.code,
                      isEditable: false,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData.birthcountry.code;
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
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registrationProviderData.dob.value,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData.dob.value;
                  }
                }

                break;

              case "email":
                if (registrationProviderData.email) {
                  if (registrationProviderData.email == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registered_user_email,
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registrationProviderData.email.value,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData.email.value;
                  }
                }

                break;
              case "tax_payer_ssn":
                if (registrationProviderData?.uinfin.value) {
                  if (registrationProviderData?.uinfin.value == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: registrationProviderData?.uinfin.value,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData?.uinfin.value;
                  }
                }

                break;
              case "address":
                // Extracting values
                const street = registrationProviderData?.regadd?.street?.value;
                const block = registrationProviderData?.regadd?.block?.value;
                const unit = registrationProviderData?.regadd?.unit?.value;
                const floor = registrationProviderData?.regadd?.floor?.value;
                const country = registrationProviderData?.regadd?.country?.desc;
                const postalCode =
                  registrationProviderData?.regadd?.postal?.value;

                // Helper function to concatenate values with proper punctuation
                function concatenateValues(values, separator) {
                  return values.filter((value) => value).join(separator);
                }

                // Collecting non-empty address parts
                const addressParts = [];

                if (block) addressParts.push(block);
                if (street) addressParts.push(street);
                if (unit || floor) addressParts.push(`#${floor}-${unit}`);
                const addressPart1 = addressParts.join(", ");
                const addressPart2 = concatenateValues(
                  [country, postalCode],
                  ", "
                );

                // Combining parts with proper punctuation
                let formattedAddress = `${addressPart1}, ${addressPart2}`;

                console.log(formattedAddress);

                // Street, Block, Unit, Floor, Country, Postal Code
                if (formattedAddress) {
                  if (formattedAddress === "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: formattedAddress,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] = formattedAddress;
                  }
                }

                break;

              case "phone":
                if (registrationProviderData.mobileno) {
                  if (registrationProviderData.mobileno == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value:
                        registrationProviderData.mobileno?.areacode?.value +
                        registrationProviderData.mobileno?.nbr?.value,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData.mobileno?.areacode?.value +
                      registrationProviderData.mobileno?.nbr?.value;
                  }
                }

                break;
            }

            return fieldObject;
          });

          console.log(
            identityDataFieldsValues,
            "identityDataFieldsValues identityDataFieldsValues"
          );
          setIdentityDataFields(identityDataFieldsValues);
          const result = fieldsWithValue.reduce((acc, cur) => {
            const [key, value] = Object.entries(cur)[0];
            return { ...acc, [key]: value };
          }, {});
          setLabelForSignPass(identityDataFieldsValues);
          console.log(
            result,
            "resultresultresultresultresult result resultresultresult"
          );
          console.log(
            fieldsWithValue,
            "fieldsWithValue fieldsWithValue fieldsWithValue"
          );
          setParticularAddedData(result);
          setParticularFields(fieldsWithValue);
          setIsUpdateRegisteredValue(false);
        }
      } else {
        if (
          particularFields !== undefined &&
          particularFields.length > 0 &&
          !isEmptyObject(registrationProviderData) &&
          isUpdateRegisteredValue
        ) {
          const fieldsWithValue = particularFields.map((field) => {
            const [key, value] = Object.entries(field)[0];
            const keyParts = key.split(".");
            const fieldObject = { [key]: value };

            switch (keyParts[2]) {
              case "name":
                if (
                  registrationProviderData?.entity["basic-profile"][
                    "entity-name"
                  ]
                ) {
                  if (
                    registrationProviderData?.entity["basic-profile"][
                      "entity-name"
                    ]?.value == ""
                  ) {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    const name =
                      registrationProviderData?.entity["basic-profile"][
                        "entity-name"
                      ]?.value;
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: name,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] = name;
                  }
                }
                break;
              case "tax_payer_ssn":
                if (registrationProviderData?.entity["basic-profile"]["uen"]) {
                  if (
                    registrationProviderData?.entity["basic-profile"]["uen"]
                      ?.value == ""
                  ) {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value:
                        registrationProviderData?.entity["basic-profile"]["uen"]
                          ?.value,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData?.entity["basic-profile"][
                        "uen"
                      ]?.value;
                  }
                }

                break;

              case "incorporate_country_code":
                if (
                  registrationProviderData?.entity["basic-profile"][
                    "country-of-incorporation"
                  ]
                ) {
                  if (
                    registrationProviderData?.entity["basic-profile"][
                      "country-of-incorporation"
                    ]?.code == ""
                  ) {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue:
                        registrationProviderData?.entity["basic-profile"][
                          "country-of-incorporation"
                        ]?.code,
                      value:
                        registrationProviderData?.entity["basic-profile"][
                          "country-of-incorporation"
                        ]?.code,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData?.entity["basic-profile"][
                        "country-of-incorporation"
                      ]?.code;
                    setCountryCode(
                      registrationProviderData?.entity["basic-profile"][
                        "country-of-incorporation"
                      ]?.code
                    );
                  }
                }
                break;
              case "primary_bussiness_actdivity":
                if (
                  registrationProviderData?.entity["basic-profile"][
                    "primary-activity"
                  ]
                ) {
                  if (
                    registrationProviderData?.entity["basic-profile"][
                      "primary-activity"
                    ]?.desc == ""
                  ) {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      DefaultValue:
                        registrationProviderData?.entity["basic-profile"][
                          "primary-activity"
                        ]?.desc,
                      value:
                        registrationProviderData?.entity["basic-profile"][
                          "primary-activity"
                        ]?.desc,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] =
                      registrationProviderData?.entity["basic-profile"][
                        "primary-activity"
                      ]?.desc;
                  }
                }
                break;

              case "former_registered_name":
                if (registrationProviderData["person"]["name"]) {
                  if (registrationProviderData["person"]["name"]?.value == "") {
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: "",
                      isSingpass: false,
                    };
                    identityDataFieldsValues[key] = "";
                  } else {
                    const name =
                      registrationProviderData["person"]["name"]?.value;
                    fieldObject[key] = {
                      ...fieldObject[key],
                      value: name,
                      isSingpass: true,
                    };
                    identityDataFieldsValues[key] = name;
                  }
                }
                break;
            }

            return fieldObject;
          });
          const result = fieldsWithValue.reduce((acc, cur) => {
            const [key, value] = Object.entries(cur)[0];
            return { ...acc, [key]: value };
          }, {});
          console.log(
            identityDataFieldsValues,
            "identityDataFieldsValues identityDataFieldsValues identityDataFieldsValues"
          );
          console.log(result, "result result result result");
          setLabelForSignPass(identityDataFieldsValues);
          setIdentityDataFields(identityDataFieldsValues);
          setParticularAddedData(result);

          setParticularFields(fieldsWithValue);
          setIsUpdateRegisteredValue(false);
        }
      }
    }
  }, [registrationProviderData, particularFields, particularAddedData]);

  const isEmptyObject = (obj) => {
    return (
      obj == null || (typeof obj === "object" && Object.keys(obj).length === 0)
    );
  };
  const getValidPhoneNumber = (phoneNumber, country) => {
    console.log(phoneNumber, "phoneNumber phoneNumber");
    console.log(country, "country country");
    if (!phoneNumber || phoneNumber === "") {
      return;
    }
    const phoneNumberFormatted = phoneNumber.replace(/\s/g, ""); // Remove any whitespace
    console.log(phoneNumberFormatted, "phoneNumberFormatted");
    try {
      let countryCode = getCountryData(country);
      const formattedPhoneNumber = `${countryCode?.phone[0]}${phoneNumberFormatted}`;
      console.log(
        formattedPhoneNumber,
        "formattedPhoneNumber formattedPhoneNumberformattedPhoneNumber"
      );
      console.log(
        countryCode,
        "countryCode countryCodecountryCode countryCodecountryCode"
      );
      return formattedPhoneNumber;
    } catch (error) {
      console.error("Error validating phone number:", error);
    }
  };
  const getLabelFromDataForPan = () => {
    //panData?.pan?.result?.validated_data?.full_name
    console.log("panData params?.identity_id", params?.identity_id);
    console.log(
      "panData params?.identity_id",
      panData?.pan?.result?.validated_data?.full_name
    );
    if (
      props?.providerCkyc?.download?.result?.kycResult?.personalIdentifiableData
        ?.personalDetails?.fullName
    ) {
      const fullNameParts =
        props?.providerCkyc?.download?.result?.kycResult?.personalIdentifiableData?.personalDetails?.fullName.split(
          " "
        );
      if (props?.isIndividual) {
        if (fullNameParts.length === 3) {
          setLabel(fullNameParts[0] + " " + fullNameParts[2]);
        } else if (fullNameParts.length === 2) {
          setLabel(fullNameParts[0] + " " + fullNameParts[1]);
        }
      } else if (!props?.isIndividual) {
        const name =
          props?.providerCkyc?.download?.result?.kycResult
            ?.personalIdentifiableData?.personalDetails?.fullName;
        setLabel(name);
      }
    }
  };

  const handlePostRegistrationProviderApi = async (registrationProvider) => {
    setIsLoader(true);

    const response = await postRegistrationProviderGetData(
      registrationProvider,
      cancelTokenSource.token
    );
    if (response.success) {
      setIsLoader(false);
      setRegistrationProviderData(response?.data);
    } else {
      setIsLoader(false);
    }
  };
  const getParticularFields = async () => {
    setIsLoader(true);
    if (identity_id) {
      getSpecificIdentity(identity_id);
    } else {
      setIsLoader(false);
    }

    const response = await getParticularFieldsFromFundIdApi(
      props?.dataOfAccountSetup?.fund_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    console.log(
      "propsprops",
      props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections
    );

    let array = [];

    if (response.success == true) {
      // Combine all fields into a single array
      if (
        props?.dataOfAccountSetup?.fund_data?.fund_setting?.sections
          ?.show_cf_to_customer
      ) {
        array = [
          ...response.data?.account_fields?.s_f,
          ...response.data?.account_fields?.e_f,
          ...response.data?.account_fields?.c_f,
        ];
      } else {
        array = [
          ...response.data?.account_fields?.s_f,
          ...response.data?.account_fields?.e_f,
        ];
      }

      // Filter and sort the fields based on the key
      let filteredObj = array
        .filter((item) => {
          const key = Object.keys(item)[0];
          return key.includes(
            props?.dataOfAccountSetup?.isIndividual ? "individual" : "corporate"
          );
        })
        .sort((a, b) => {
          const indexA = a[Object.keys(a)[0]]?.index;
          const indexB = b[Object.keys(b)[0]]?.index;
          return indexA - indexB;
        });

      // Separate compliance fields from non-compliance fields
      const complianceFields = [];
      const nonComplianceFields = [];

      filteredObj.forEach((item) => {
        const key = Object.keys(item)[0];
        if (key.includes("compliance")) {
          if (key.includes("is_investing_own_behal")) {
            complianceFields.push(item);
          }
        } else {
          nonComplianceFields.push(item);
        }
      });

      // Combine non-compliance fields and compliance fields
      filteredObj = [...nonComplianceFields, ...complianceFields];

      console.log("filteredObj", filteredObj);
      filteredObj.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key?.includes("compliance") && item[key]?.type === "check") {
            item[key].required = false;
          }
        });
      });
      console.log("filteredOconsole.log(data)", filteredObj);

      setParticularFields(filteredObj);
    } else {
      setIsLoader(false);
    }
  };
  const getParticularFieldsss = async () => {
    let arrayBasicFields = [];
    let arrayExtendedFields = [];
    let array = [];
    let fundFields = props?.dataOfAccountSetup?.fund_data.fund_fields;
    if (props?.dataOfAccountSetup?.fund_data) {
      arrayBasicFields = fundFields?.s_f;
      arrayExtendedFields = fundFields?.e_f;
    }
    const arrayBasicFieldsData = Object.entries(arrayBasicFields).map(
      ([key, value]) => {
        return { [key]: value };
      }
    );
    const arrayExtendedFieldsData = Object.entries(arrayExtendedFields).map(
      ([key, value]) => {
        return { [key]: value };
      }
    );
    array = [...arrayBasicFieldsData, ...arrayExtendedFieldsData];
    const filteredObjBasic = array
      .filter((item) => {
        const key = Object.keys(item)[0];
        return key.includes(
          props?.dataOfAccountSetup?.isIndividual ? "individual" : "corporate"
        );
      })
      .sort((a, b) => {
        const indexA = a[Object.keys(a)[0]]?.index;
        const indexB = b[Object.keys(b)[0]]?.index;
        return indexA - indexB;
      });

    setParticularFields(filteredObjBasic);
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

  const getSpecificIdentity = async (identity_id_val) => {
    console.log(
      identity_id_val,
      " identity_id identity_id getSpecificIdentity"
    );
    setIsLoader(true);
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id_val,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      if (props?.outDated == null) {
        props?.updateUpdatedData(response.data?.meta?.identity?.outDated);
      }
      setParticularAddedData(response.data?.meta?.data);
      setParticularEditMetaData(response.data?.meta);
      setEntityType(response.data?.entityTypeId);
      props?.handleEntityType(response.data?.entityTypeId);
      console.log(response.data?.label, "response.data?.label");
      setLabel(response.data?.label);
      // setIsCrp(response.data?.parentId == "0" ? false : true);
      if (response.data?.meta?.data) {
        // let keys = Object.keys(response.data?.meta?.data);
        // if (keys) {
        //     keys &&
        //         keys.map((items, index) => {
        //             if (response.data?.meta?.data[items]?.value) {
        //                 console.log({
        //                     ...identityDataFields,
        //                     [items]: response.data?.meta?.data[items]?.value,
        //                 }, 'hbj vg  f ycyfcfycgcf gcciyc ')
        //                 setIdentityDataFields({
        //                     ...identityDataFields,
        //                     [items]: response.data?.meta?.data[items]?.value,
        //                 });
        //             }
        //         });
        // }
        const transformedData = {};

        for (const key in response.data?.meta?.data) {
          const property = response.data?.meta?.data[key];
          transformedData[key] = property.value;
        }
        setIdentityDataFields(transformedData);
      }

      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };

  const handleChange = (e) => {
    setShowLabel(true);
    console.log(e.target.name, "e.target.name");
    console.log(
      identityDataFields,
      "identityDataFields identityDataFields handleChange"
    );
    if (e.target.name === "individual.basic.country_of_residence_code") {
      setCountryCode(e.target.value);
    }
    if (e.target.name === "Phone") {
      // If the input is the phone number field, update the phone number
      setIdentityDataFields({
        ...identityDataFields,
        phone: e,
      });
    } else {
      setIdentityDataFields({
        ...identityDataFields,
        [e.target.name]: e.target.value,
      });
    }
    if (
      e.target.name == "corporate.basic.name" ||
      e.target.name == "corporate.basic.incorporate_country_code" ||
      e.target.name == "individual.basic.first_name" ||
      e.target.name == "individual.basic.last_name" ||
      e.target.name == "individual.basic.nationality_code"
    ) {
      // setTimeout(function(){
      //   getFullNameAndCountryLabel()
      // },1000)
      setUpdateLabel(true);
    }
  };

  const handleChangeEntityKey = (e) => {
    setEntityType(e.target.value);
    props?.handleEntityType(e.target.value);
    setShowLabel(true);
  };

  const handlePhoneNumber = (phone, formKey, e) => {
    setIdentityDataFields({
      ...identityDataFields,
      [formKey]: phone,
    });
    setShowLabel(true);
  };
  const handleChangeCheckBox = (e, label) => {
    console.log("DAsdasd", label);

    setIdentityDataFields({
      ...identityDataFields,
      [e.target.name]:
        label === "Yes"
          ? e.target.checked
          : label === "No" || label === "Not Applicable"
          ? false
          : e.target.value,
      // [e.target.name]: label === "Yes" ?  e.target.checked : false,
      [`${e.target.name}.Label`]: label, // Add the label value
    });
    setShowLabel(true);
  };

  const handleChangeLabel = (e) => {
    setLabel(e.target.value);
  };
  const preparePayloadForSingPass = (data) => {
    const fieldObject = data;
    console.log(data, "data preparePayloadForSingPass");
    if (props?.dataOfAccountSetup?.isIndividual) {
      // if (
      //   registrationProviderData.name &&
      //   registrationProviderData.name.value
      // ) {
      //   const nameValue = registrationProviderData.name.value;
      //   const nameParts = nameValue.split(" ");

      //   fieldObject["individual.basic.first_name"] = splitFullNameSingPass(registrationProviderData.name.value)?.firstName
      //     // nameParts.length >= 1 ? nameParts[0] : "";
      //   fieldObject["individual.basic.middle_name"] =splitFullNameSingPass(registrationProviderData.name.value)?.middleName
      //     // nameParts.length >= 3 ? nameParts[1] : "";
      //   fieldObject["individual.basic.last_name"] =splitFullNameSingPass(registrationProviderData.name.value)?.lastName
      //     // nameParts.length >= 3
      //     //   ? nameParts[2]
      //     //   : nameParts.length === 2
      //     //     ? nameParts[1]
      //     //     : "";

      //   if (nameValue === "") {
      //     fieldObject["individual.basic.first_name"] = "";
      //     fieldObject["individual.basic.middle_name"] = "";
      //     fieldObject["individual.basic.last_name"] = "";
      //   }
      // }

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
        setCountryCode(registrationProviderData.nationality.code);
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
        setCountryCode(
          registrationProviderData?.entity["basic-profile"][
            "country-of-incorporation"
          ]?.code
        );
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
    if (props?.dataOfAccountSetup?.isIndividual) {
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

  const handleValidate = () => {
    let status = true;
    if (allRequiredField.length > 0) {
      console.log(identityDataFields, "dentityDataFields handleValidate");
      console.log("allRequiredField allRequiredField", allRequiredField);
      for (let item of allRequiredField) {
        if (identityDataFields && identityDataFields[item]) {
          if (
            (!identityDataFields[item] &&
              identityDataFields[item]?.value === null) ||
            identityDataFields[item]?.value == ""
          ) {
            status = false;
          }
        } else {
          status = false;
        }
      }
    }
    if (label != "" && label != null) {
    } else {
      status = false;
    }
    // if(!props?.dataOfAccountSetup?.isIndividual){

    //   if (entityType != "" && entityType != null) {
    //   } else {
    //     status = false;
    //   }
    // }
    console.log(status, "status handleValidate ");
    // if (identityType == 'CORPORATE' && (entityType == '' || entityType === null)) {
    //     setEntityError(true);
    //     status = false;
    // } else {
    //     setEntityError(false);
    // }
    return status;
  };

  const handleSubmit = () => {
    if (!handleValidate()) {
      setFieldsError(true);
      topFunction();
      return;
    } else {
      setFieldsError(false);
    }
    setSubmitLoader(true);
    if (label == "" || label === null) {
      setLabelError(true);
      topFunction();
      setSubmitLoader(false);
      return;
    }
    if (
      !props?.dataOfAccountSetup?.isIndividual &&
      (entityType == "" || entityType === null)
    ) {
      setEntityError(true);
      topFunction();
      return;
    } else {
      setEntityError(false);
    }
    setSubmitLoader(true);

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
    const dataToSend = {
      label: label,
      fund_id: fund_id,
      customer_type_key: props?.dataOfAccountSetup?.isIndividual
        ? "INDIVIDUAL"
        : "CORPORATE",
      data: identityDataFields
        ? !isEmptyObject(registrationProviderData)
          ? identityDataFieldsPayload
          : identityDataFields
        : {},
      entity_type_id: props?.dataOfAccountSetup?.isIndividual
        ? null
        : entityType.toString(),
    };

    if (!isEmptyObject(registrationProviderData)) {
      if (!dataToSend.providerInfo) {
        dataToSend.providerInfo = {};
      }

      if (props?.dataOfAccountSetup?.isIndividual) {
        dataToSend.providerInfo.data = registrationProviderData;
        dataToSend.providerInfo.provider = "SINGPASS";
      } else {
        dataToSend.providerInfo.data = registrationProviderData;
        dataToSend.providerInfo.provider = "CORPPASS";
      }
    }

    if (props?.providerCkyc?.download) {
      if (!dataToSend.providerInfo) {
        dataToSend.providerInfo = {};
        dataToSend.providerInfo["data"] = {};
      }
      if (props?.providerCkyc?.download) {
        dataToSend.providerInfo["data"]["cKYCData"] =
          props?.dataOfAccountSetup?.cKYCData;
      }
      if (props?.dataOfAccountSetup?.panData) {
        dataToSend.providerInfo["data"]["pan"] =
          props?.dataOfAccountSetup?.panData;
      }
      if (props?.dataOfAccountSetup?.adhaarData) {
        dataToSend.providerInfo["data"]["adhar"] =
          props?.dataOfAccountSetup?.adhaarData;
      }

      dataToSend.providerInfo.provider = "SIGNDESK";
      dataToSend.providerInfo.outDated =
        props?.outDated !== null ? props?.outDated : false;
    }

    if (identity_id) {
      dataToSend["identity_id"] = identity_id;
    }

    handleSubmitCall(dataToSend);
  };

  const handleSubmitCall = async (data) => {
    console.log(
      identity_id,
      "identity_ididentity_ididentity_ididentity_id handleSubmitCall"
    );
    console.log(data, "data data data data handleSubmitCall");
    // return;
    setSubmitLoader(true);
    const response = await postIdentityAPI(data, cancelTokenSource.token);
    if (response.success == true) {
      topFunction();
      if (account_id) {
        if (!data?.identity_id) {
          handleCreateAccount(
            response?.data?.id,
            props?.dataOfAccountSetup?.fund_data?.named_id,
            data,
            response?.data
          );
        } else {
          setIsCrp(true);
          props.handleNextButtonClick("", "", "", "", false);
          setSubmitLoader(false);
        }
      } else {
        handleCreateAccount(
          response?.data?.id,
          props?.dataOfAccountSetup?.fund_data?.named_id,
          data,
          response?.data
        );
      }
      setMessage(true);
    } else {
      setSubmitLoader(false);
      SetErrorMessage({ error: true, message: response?.user_message });
    }
  };

  const handleCreateAccount = async (
    identity_id,
    fund_named_id,
    identityData,
    addedIdentityData
  ) => {
    setIsLoader(true);
    const data = {
      joint_account: false,
      fund_id: fund_named_id,
      share_holder_count: 0,
      joint_account_emails: [],
      termAccepted: props?.isAcceptedTermsAndCondition,
    };

    const response = await postIdentityAttatchWithFund(
      identity_id,
      data,
      cancelTokenSource.token
    );
    console.log("checking response", response);
    if (response.success == true) {
      if (props?.isCrp) {
        props.handleNextButtonClick(
          identity_id,
          response?.data?.accountId,
          addedIdentityData,
          response?.data
        );
        if (!props?.dataOfAccountSetup?.isIndividual) {
          if (entityType === "" || entityType === null) {
          } else {
            setIsCrp(true);
          }
        } else {
          setIsCrp(true);
        }
      } else {
        props.handleNextButtonClick(
          identity_id,
          response?.data?.accountId,
          addedIdentityData,
          response?.data
        );
      }

      setSubmitLoader(false);
    } else {
      setSubmitLoader(false);
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
  const getUpdatedData = (key, mode = false) => {
    let keyValues = key.split(".");
    let customerType = keyValues[0];
    if (mode && key.includes("is_investing_own_behal")) {
      return particularAddedData[
        `${customerType}.compliance.is_investing_own_behalf.Label`
      ]?.value == null
        ? ""
        : particularAddedData[
            `${customerType}.compliance.is_investing_own_behalf.Label`
          ]?.value;
    } else {
      return particularAddedData[key]?.value == null
        ? ""
        : particularAddedData[key]?.value;
    }
  };

  function isEmpty(value) {
    return !value || value.trim() === "";
  }

  const handleProviderValueDisabled = (particularAddData, key) => {
    if (isAccepted) {
      return true;
    }
    console.log(particularEditMetaData, "particularEditMetaData?.identity");
    console.log(particularFields, "particularFields?.identity");
    if (particularEditMetaData && particularEditMetaData?.identity) {
      const keyParts = key[0]?.split(".");
      if (props?.dataOfAccountSetup?.isIndividual) {
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
                particularEditMetaData?.identity?.data?.nationality?.code == ""
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
                particularEditMetaData?.identity?.data?.birthcountry?.code == ""
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
      } else {
        switch (keyParts[2]) {
          case "name":
            if (particularEditMetaData?.identity?.data?.name) {
              if (particularEditMetaData?.identity?.data?.name?.value == "") {
                return false;
              } else {
                return true;
              }
            }
            break;
          case "country_of_major_operation_code":
            if (
              particularEditMetaData?.identity?.data[
                "country_of_major_operation_code"
              ]
            ) {
              if (
                particularEditMetaData?.identity?.data[
                  "country_of_major_operation_code"
                ]?.value == ""
              ) {
                return false;
              } else {
                return true;
              }
            }
            break;
          case "incorporate_country_code":
            if (
              particularEditMetaData?.identity?.data["incorporate_country_code"]
            ) {
              if (
                particularEditMetaData?.identity?.data[
                  "incorporate_country_code"
                ]?.value == ""
              ) {
                return false;
              } else {
                return true;
              }
            }
            break;
          case "city":
            if (particularEditMetaData?.identity?.data["city"]) {
              if (particularEditMetaData?.identity?.data["city"]?.value == "") {
                return false;
              } else {
                return true;
              }
            }
            break;
          case "country_of_tax_residence":
            if (
              particularEditMetaData?.identity?.data["country_of_tax_residence"]
            ) {
              if (
                particularEditMetaData?.identity?.data[
                  "country_of_tax_residence"
                ]?.value == ""
              ) {
                return false;
              } else {
                return true;
              }
            }
            break;
        }
      }
      //            const fullName = props?.providerCkyc?.download?.result?.kycResult?.personalIdentifiableData?.personalDetails?.fullName;

      if (particularEditMetaData?.identity?.provider == "SIGNDESK") {
        const type = Object.keys(particularEditMetaData?.data)[0]?.split(
          "."
        )[0];
        if (type === "corporate") {
          const fullName =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.fullName;
          const dob =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.dob;
          const gender =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.gender;
          const countryOfIncorporation =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.countryOfIncorporation;
          const mobileNumber =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.mobNum1;
          const email =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.email;
          const state =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permState;
          const city =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permCity;
          const postalCode =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permPin;
          const taxPayerId =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.pan;
          const permLine1 =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permLine1;
          const permLine2 =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permLine2;
          const permLine3 =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permLine3;
          const locality =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permDist;

          const postalCodeCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresPin;
          const permLine1Corres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresLine1;
          const permLine2Corres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresLine2;
          const permLine3Corres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresLine3;
          const localityCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresDist;
          const stateCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresState;
          const cityCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresCity;

          switch (keyParts[2]) {
            case "incorporate_country_code":
              if (countryOfIncorporation) {
                if (countryOfIncorporation == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "country_of_major_operation_code":
              if (countryOfIncorporation) {
                if (countryOfIncorporation == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "country_of_tax_residence":
              if (countryOfIncorporation) {
                if (countryOfIncorporation == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "phone":
              if (mobileNumber) {
                if (mobileNumber == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "email":
              if (email) {
                if (email == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "tax_payer_ssn":
              if (taxPayerId) {
                if (taxPayerId == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "city":
              if (city) {
                if (city == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "state":
              if (state) {
                if (state == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "pincode":
              if (postalCode) {
                if (postalCode == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_pincode":
              if (postalCodeCorres) {
                if (postalCodeCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_state":
              if (stateCorres) {
                if (stateCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_city":
              if (cityCorres) {
                if (cityCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_locality":
              if (localityCorres) {
                if (localityCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_street_address":
              const fullAddressCorres =
                permLine1Corres + " " + permLine2Corres + " " + permLine3Corres;
              if (!fullAddressCorres.trim()) {
                return false;
              } else {
                return true;
              }

              break;
            case "country_of_tax_residence":
              if (nationalityResidence) {
                if (nationalityResidence == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "locality":
              if (locality) {
                if (locality == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "street_address":
              const addreess = permLine1 + " " + permLine2 + " " + permLine3;
              if (!addreess.trim()) {
                return false;
              } else {
                return true;
              }
              break;

            case "name":
              if (fullName) {
                if (fullName == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;

            // Handle other cases here...
          }
        } else {
          const fullName =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.fullName;
          const dob =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.dob;
          const gender =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.gender;
          const nationality =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permCountry;
          const nationalityResidence =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permCountry;
          const mobileNumber =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.mobNum;
          const email =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.email;
          const state =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permState;
          const city =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permCity;
          const postalCode =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permPin;
          const taxPayerId =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.pan;
          const permLine1 =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permLine1;
          const permLine2 =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permLine2;
          const permLine3 =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permLine3;
          const locality =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.permDist;

          const postalCodeCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresPin;
          const permLine1Corres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresLine1;
          const permLine2Corres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresLine2;
          const permLine3Corres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresLine3;
          const localityCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresDist;
          const stateCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresState;
          const cityCorres =
            particularEditMetaData?.identity?.data?.cKYCData?.data?.download
              ?.result?.kycResult?.personalIdentifiableData?.personalDetails
              ?.corresCity;

          const salutations = ["MR", "MRS", "MS", "MDM", "DR"];

          const convertToDateFormat = (inputDate) =>
            inputDate ? inputDate.split("-").reverse().join("-") : "";

          const getNameParts = (name) => {
            const nameParts = name.split(" ");
            const salutation = salutations.includes(nameParts[0]?.toUpperCase())
              ? nameParts.shift().toUpperCase()
              : "";
            const firstName = nameParts[0] || "";
            const middleName = nameParts[1] || "";
            const lastName = nameParts.slice(2).join(" ");

            return { salutation, firstName, middleName, lastName };
          };

          switch (keyParts[2]) {
            case "country_of_residence_code":
              if (nationality) {
                if (nationality == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "nationality_code":
              if (nationalityResidence) {
                if (nationalityResidence == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "phone":
              if (mobileNumber) {
                if (mobileNumber == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "email":
              if (email) {
                if (email == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "tax_payer_ssn":
              if (taxPayerId) {
                if (taxPayerId == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;
            case "city":
              if (city) {
                if (city == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "state":
              if (state) {
                if (state == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "pincode":
              if (postalCode) {
                if (postalCode == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_pincode":
              if (postalCodeCorres) {
                if (postalCodeCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_state":
              if (stateCorres) {
                if (stateCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_city":
              if (cityCorres) {
                if (cityCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "cross_locality":
              if (localityCorres) {
                if (localityCorres == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;

            case "country_of_tax_residence":
              if (nationalityResidence) {
                if (nationalityResidence == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;
            case "locality":
              if (locality) {
                if (locality == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;

            case "first_name":
              const { firstName } = getNameParts(fullName);
              if (firstName) {
                if (firstName == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;

            case "middle_name":
              const { middleName } = getNameParts(fullName);
              if (middleName) {
                if (middleName == "") {
                  return false;
                } else {
                  return true;
                }
              }

              break;

            case "last_name":
              const { lastName } = getNameParts(fullName);
              if (lastName) {
                if (lastName == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;

            case "salutation_id":
              const { salutation } = getNameParts(fullName);
              if (salutation) {
                if (salutation == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;

            case "dob":
              if (dob) {
                if (dob == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;

            case "gender_key":
              if (gender) {
                if (gender == "") {
                  return false;
                } else {
                  return true;
                }
              }
              break;

            // Handle other cases here...
          }
        }
      }
    } else {
      return false;
    }
  };
  const getFullNameAndCountryLabel = (label) => {
    console.log(label, "labellabel label");
    console.log(
      registrationProviderData,
      "registrationProviderData registrationProviderData"
    );
    console.log(
      particularAddedData,
      "particularAddedData particularAddedDataparticularAddedDataparticularAddedDataparticularAddedData"
    );
    let newLabel;
    //identityDataFieldss
    if (!isEmptyObject(registrationProviderData)) {
      // Retrieve the first name, last name, and country from the state

      if (!props?.dataOfAccountSetup?.isIndividual) {
        console.log(
          identityDataFields["corporate.basic.name"],
          'particularAddedData["corporate.basic.name"]'
        );
        console.log(
          identityDataFields["corporate.basic.incorporate_country_code"],
          'particularAddedData["corporate.basic.incorporate_country_code"]'
        );
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
    } else {
      // Retrieve the first name, last name, and country from the state
      if (!props?.dataOfAccountSetup?.isIndividual) {
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
    setLabel(newLabel);
    // if (!params?.identity_id && !panData) {
    //     setLabel(newLabel);
    // }
  };
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
    if (!props?.dataOfAccountSetup?.isIndividual) {
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
  const handleChangeDate = (name, value) => {
    const resultedName = name.split(".");
    const lastKey = resultedName[resultedName.length - 1];

    console.log("namename", name);
    if (value && value.length > 0) {
      const selectedDate = new Date(value[0]);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 16); // Calculate date 18 years ago
      if (lastKey === "dob") {
        if (selectedDate >= minDate) {
          // If selected date is not at least 18 years ago
          // You can handle this case as per your requirement, such as displaying an error message
          // For now, I'm just logging a message to the console
          console.log("Date of birth must be at least 18 years ago.");
          setDobError(true);

          return; // Don't update state if validation fails
        }
      }

      setDobError(false);

      setIdentityDataFields({
        ...identityDataFields,
        [name]: format(selectedDate, "yyyy-MM-dd"),
      });
    } else {
      setIdentityDataFields({ ...identityDataFields, [name]: "" });
    }
    setShowLabel(true);
  };
  const checkIFDocumentExist = (EntityTypeValue) => {
    let fundRequiredDocuments =
      props?.dataOfAccountSetup?.fund_data?.requiredDocuments;
    const hasEntityTypeIdOne = fundRequiredDocuments.some(
      (document) => document.entityTypeId === EntityTypeValue
    );
    return hasEntityTypeIdOne;
  };
  const checkOutDatedForCKYC = () => {
    if (props?.providerCkyc) {
      if (props?.outDated) {
        return false;
      } else {
        return true;
      }
    } else if (
      props?.dataOfAccountSetup?.selectedIdentityData?.meta?.identity
        ?.outDated === true
    ) {
      return false;
    } else if (
      props?.dataOfAccountSetup?.selectedIdentityData?.meta?.identity
        ?.outDated === false ||
      props?.dataOfAccountSetup?.selectedIdentityData?.meta?.identity?.provider
    ) {
      return true;
    } else {
      return false;
    }
  };
  const checkIfDataFromCKYCAndOutDatedTrue = () => {
    if (props?.providerCkyc) {
      return props?.outDated;
    } else {
      return props?.dataOfAccountSetup?.selectedIdentityData?.meta?.identity
        ?.outDated
        ? props?.dataOfAccountSetup?.selectedIdentityData?.meta?.identity
            ?.outDated
        : false;
    }
  };
  const checkDataMatchedWithKYCData = (key) => {
    console.log(
      identityDataFields,
      "identityDataFields checkDataMatchedWithKYCData"
    );
    console.log(fetchDataFromCKYCByKey(key), "fetchDataFromCKYCByKey(key)");
    console.log(
      identityDataFields[key]?.value == null
        ? ""
        : identityDataFields[key]?.value,
      'particularAddedData[key]?.value == null ? "" : particularAddedData[key]?.value'
    );
    if (fetchDataFromCKYCByKey(key) != false) {
      if (fetchDataFromCKYCByKey(key) == identityDataFields[key]) {
        return {
          ckycData: fetchDataFromCKYCByKey(key),
          currentData: identityDataFields[key],
          updated: true,
        };
      } else {
        return {
          ckycData: fetchDataFromCKYCByKey(key),
          currentData: identityDataFields[key],
          updated: false,
        };
      }
    } else {
      return {
        ckycData: fetchDataFromCKYCByKey(key),
        currentData: identityDataFields[key],
        updated: false,
      };
    }
  };
  const fetchDataFromCKYCByKey = (key) => {
    console.log(key, "key");
    const keyParts = key.split(".");
    console.log(keyParts, "keyParts");
    if (particularEditMetaData?.identity?.provider == "SIGNDESK") {
      const type = props?.dataOfAccountSetup?.isIndividual
        ? "individual"
        : "corporate";
      if (type === "corporate") {
        const fullName =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.fullName;
        const dob =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails?.dob;
        const gender =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.gender;
        const countryOfIncorporation =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.countryOfIncorporation;
        const mobileNumber =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.mobNum1;
        const email =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.email;
        const state =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permState;
        const city =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permCity;
        const postalCode =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permPin;
        const taxPayerId =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails?.pan;
        const permLine1 =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permLine1;
        const permLine2 =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permLine2;
        const permLine3 =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permLine3;
        const locality =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permDist;

        const postalCodeCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresPin;
        const permLine1Corres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresLine1;
        const permLine2Corres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresLine2;
        const permLine3Corres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresLine3;
        const localityCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresDist;
        const stateCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresState;
        const cityCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresCity;

        switch (keyParts[2]) {
          case "incorporate_country_code":
            if (countryOfIncorporation) {
              if (countryOfIncorporation == "") {
                return false;
              } else {
                return countryOfIncorporation;
              }
            }

            break;
          case "country_of_major_operation_code":
            if (countryOfIncorporation) {
              if (countryOfIncorporation == "") {
                return false;
              } else {
                return countryOfIncorporation;
              }
            }

            break;
          case "country_of_tax_residence":
            if (countryOfIncorporation) {
              if (countryOfIncorporation == "") {
                return false;
              } else {
                return countryOfIncorporation;
              }
            }
            break;
          case "phone":
            if (mobileNumber) {
              if (mobileNumber == "") {
                return false;
              } else {
                return mobileNumber;
              }
            }

            break;
          case "email":
            if (email) {
              if (email == "") {
                return false;
              } else {
                return email;
              }
            }

            break;
          case "tax_payer_ssn":
            if (taxPayerId) {
              if (taxPayerId == "") {
                return false;
              } else {
                return taxPayerId;
              }
            }

            break;
          case "city":
            if (city) {
              if (city == "") {
                return false;
              } else {
                return city;
              }
            }

            break;
          case "state":
            if (state) {
              if (state == "") {
                return false;
              } else {
                return state;
              }
            }

            break;
          case "pincode":
            if (postalCode) {
              if (postalCode == "") {
                return false;
              } else {
                return postalCode;
              }
            }

            break;
          case "cross_pincode":
            if (postalCodeCorres) {
              if (postalCodeCorres == "") {
                return false;
              } else {
                return postalCodeCorres;
              }
            }

            break;
          case "cross_state":
            if (stateCorres) {
              if (stateCorres == "") {
                return false;
              } else {
                return stateCorres;
              }
            }

            break;
          case "cross_city":
            if (cityCorres) {
              if (cityCorres == "") {
                return false;
              } else {
                return cityCorres;
              }
            }

            break;
          case "cross_locality":
            if (localityCorres) {
              if (localityCorres == "") {
                return false;
              } else {
                return localityCorres;
              }
            }

            break;
          case "cross_street_address":
            const fullAddressCorres =
              permLine1Corres + " " + permLine2Corres + " " + permLine3Corres;
            console.log(fullAddressCorres, "fullAddressCorres");
            if (fullAddressCorres == "") {
              return false;
            } else {
              return fullAddressCorres;
            }

            break;
          case "country_of_tax_residence":
            if (nationalityResidence) {
              if (nationalityResidence == "") {
                return false;
              } else {
                return nationalityResidence;
              }
            }

            break;
          case "locality":
            if (locality) {
              if (locality == "") {
                return false;
              } else {
                return locality;
              }
            }

            break;
          case "street_address":
            const addreess = permLine1 + " " + permLine2 + " " + permLine3;
            console.log(addreess, "addreess");
            if (addreess == "") {
              return false;
            } else {
              return addreess;
            }
            break;

          case "name":
            if (fullName) {
              if (fullName == "") {
                return false;
              } else {
                return fullName;
              }
            }
            break;

          // Handle other cases here...
        }
      } else {
        const fullName =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.fullName;
        const dob =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails?.dob;
        const gender =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.gender;
        const nationality =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permCountry;
        const nationalityResidence =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permCountry;
        const mobileNumber =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.mobNum;
        const email =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.email;
        const state =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permState;
        const city =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permCity;
        const postalCode =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permPin;
        const taxPayerId =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails?.pan;
        const permLine1 =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permLine1;
        const permLine2 =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permLine2;
        const permLine3 =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permLine3;
        const locality =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.permDist;

        const postalCodeCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresPin;
        const permLine1Corres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresLine1;
        const permLine2Corres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresLine2;
        const permLine3Corres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresLine3;
        const localityCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresDist;
        const stateCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresState;
        const cityCorres =
          particularEditMetaData?.identity?.data?.cKYCData?.data?.download
            ?.result?.kycResult?.personalIdentifiableData?.personalDetails
            ?.corresCity;

        const salutations = ["MR", "MRS", "MS", "MDM", "DR"];

        const convertToDateFormat = (inputDate) =>
          inputDate ? inputDate.split("-").reverse().join("-") : "";

        const getNameParts = (name) => {
          const nameParts = name.split(" ");
          const salutation = salutations.includes(nameParts[0]?.toUpperCase())
            ? nameParts.shift().toUpperCase()
            : "";
          const firstName = nameParts[0] || "";
          const middleName = nameParts[1] || "";
          const lastName = nameParts.slice(2).join(" ");

          return { salutation, firstName, middleName, lastName };
        };

        switch (keyParts[2]) {
          case "country_of_residence_code":
            if (nationality) {
              if (nationality == "") {
                return false;
              } else {
                return nationality;
              }
            }

            break;
          case "nationality_code":
            if (nationalityResidence) {
              if (nationalityResidence == "") {
                return false;
              } else {
                return nationalityResidence;
              }
            }

            break;
          case "phone":
            if (mobileNumber) {
              if (mobileNumber == "") {
                return false;
              } else {
                return mobileNumber;
              }
            }

            break;
          case "email":
            if (email) {
              if (email == "") {
                return false;
              } else {
                return email;
              }
            }

            break;
          case "tax_payer_ssn":
            if (taxPayerId) {
              if (taxPayerId == "") {
                return false;
              } else {
                return taxPayerId;
              }
            }
            break;
          case "city":
            if (city) {
              if (city == "") {
                return false;
              } else {
                return city;
              }
            }

            break;
          case "state":
            if (state) {
              if (state == "") {
                return false;
              } else {
                return state;
              }
            }

            break;
          case "pincode":
            if (postalCode) {
              if (postalCode == "") {
                return false;
              } else {
                return postalCode;
              }
            }

            break;
          case "cross_pincode":
            if (postalCodeCorres) {
              if (postalCodeCorres == "") {
                return false;
              } else {
                return postalCodeCorres;
              }
            }

            break;
          case "cross_state":
            if (stateCorres) {
              if (stateCorres == "") {
                return false;
              } else {
                return stateCorres;
              }
            }

            break;
          case "cross_city":
            if (cityCorres) {
              if (cityCorres == "") {
                return false;
              } else {
                return cityCorres;
              }
            }

            break;
          case "cross_locality":
            if (localityCorres) {
              if (localityCorres == "") {
                return false;
              } else {
                return localityCorres;
              }
            }

            break;
          case "cross_street_address":
            const fullAddressCorres =
              permLine1Corres + " " + permLine2Corres + " " + permLine3Corres;
            console.log(fullAddressCorres, "fullAddressCorres");
            if (fullAddressCorres == "") {
              return false;
            } else {
              return fullAddressCorres;
            }

            break;
          case "street_address":
            const addreess = permLine1 + " " + permLine2 + " " + permLine3;
            console.log(addreess, "addreess");
            if (addreess == "") {
              return false;
            } else {
              return addreess;
            }
            break;
          case "country_of_tax_residence":
            if (nationalityResidence) {
              if (nationalityResidence == "") {
                return false;
              } else {
                return nationalityResidence;
              }
            }

            break;
          case "locality":
            if (locality) {
              if (locality == "") {
                return false;
              } else {
                return locality;
              }
            }

            break;

          case "first_name":
            const { firstName } = getNameParts(fullName);
            if (firstName) {
              if (firstName == "") {
                return false;
              } else {
                return firstName;
              }
            }

            break;

          case "middle_name":
            const { middleName } = getNameParts(fullName);
            if (middleName) {
              if (middleName == "") {
                return false;
              } else {
                return middleName;
              }
            }

            break;

          case "last_name":
            const { lastName } = getNameParts(fullName);
            if (lastName) {
              if (lastName == "") {
                return false;
              } else {
                return lastName;
              }
            }
            break;

          case "salutation_id":
            const { salutation } = getNameParts(fullName);
            if (salutation) {
              if (salutation == "") {
                return false;
              } else {
                return salutation;
              }
            }
            break;

          case "dob":
            if (dob) {
              if (dob == "") {
                return false;
              } else {
                let date = new Date(dob);
                let year = date.getFullYear();
                let month = (date.getMonth() + 1).toString().padStart(2, "0");
                let day = date.getDate().toString().padStart(2, "0");
                let newDateFormat = `${year}-${day}-${month}`;
                return newDateFormat;
              }
            }
            break;

          case "gender_key":
            if (gender) {
              if (gender == "") {
                return false;
              } else {
                return gender;
              }
            }
            break;

          // Handle other cases here...
        }
      }
    }
  };

  const handleImage = () => {
    const identity = particularFields?.meta?.identity;
    const provider = identity?.provider || "";
    const userType = params?.type || "";

    if (provider === "SIGNDESK") {
      if (userType === "individual") {
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <img
              style={{ width: "100px" }}
              alt=""
              src="/img/providers/adhhar.png"
            />
          </div>
        );
      } else if (userType === "corporate") {
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <img
              style={{ width: "100px" }}
              alt=""
              src="/img/providers/pan.png"
            />
          </div>
        );
      }
      return;
    } else if (provider === "SINGPASS") {
      return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <img
            style={{ width: "100px" }}
            alt=""
            src="/img/providers/signpass.png"
          />
        </div>
      );
    } else if (provider === "CORPPASS") {
      return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <img style={{ width: "100px" }} alt="" src="/img/corppassLogo.svg" />
        </div>
      );
    }
    return;
  };

  return (
    <div className="main-content">
      {console.log(
        identityDataFields,
        "identityDataFieldsidentityDataFieldsidentityDataFieldsidentityDataFields"
      )}
      {console.log(
        particularAddedData,
        "particularAddedDataparticularAddedDataparticularAddedDataparticularAddedData}"
      )}
      <Container fluid>
        <Row className="justify-content-center">
          {isCrp && (
            <IdentityCrpAndOrganizationChart
              dataOfAccountSetup={props?.dataOfAccountSetup}
              crpId={props?.crpId}
              crpType={props?.crpType}
            />
          )}
          {!isCrp && (
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
                    Identity {identity_id ? "Updated" : "Added"} Successfully
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
                    onClose={() =>
                      SetErrorMessage({ error: false, message: "" })
                    }
                  >
                    {errorMessage.message}
                  </Alert>
                </div>
              )}
              {fieldsError && (
                <div>
                  <Alert
                    closeLabel
                    dismissible={true}
                    key="danger"
                    variant="danger"
                    onClose={() => setFieldsError(null)}
                  >
                    Fill all the required fields to continue.
                  </Alert>
                </div>
              )}
              {isLoader || isLoading ? (
                <SpinnerWithBackDrop
                  animation="grow"
                  custom={true}
                  height="70vh"
                />
              ) : (
                <>
                  {handleImage()}
                  <Form className="identity-form">
                    {submitLoader && (
                      <SpinnerWithBackDrop
                        animation="grow"
                        custom={true}
                        height="70vh"
                      />
                    )}

                    {/* {((identity_id && particularEditMetaData.length > 0) || !identity_id) && */}

                    <div className="row">
                      {showLabel && (
                        <div className="col-12 col-md-12">
                          <div className="form-group">
                            <div className="d-flex flex-row justify-content-start align-items-baseline">
                              <span>
                                <label className="form-label">
                                  {" "}
                                  Identity Label{" "}
                                </label>
                              </span>
                              <span className="ms-2">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>
                                      You can name this identity profile for
                                      easier reference in future
                                    </Tooltip>
                                  }
                                >
                                  {/* <FaEye /> */}
                                  <FontAwesomeIcon icon={faEye} />
                                </OverlayTrigger>
                              </span>
                            </div>

                            <input
                              type="text"
                              className={
                                label ? "form-control" : "form-control"
                              }
                              name={"Identity Label"}
                              value={label}
                              placeholder="Label Of Identify"
                              onChange={(e) => {
                                handleChangeLabel(e);
                              }}
                              disabled={isAccepted}
                            />
                            {labelError && (
                              <span className="error-fields">
                                Enter Label To Continue
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {!props?.dataOfAccountSetup?.isIndividual && (
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
                              disabled={isAccepted}
                            >
                              <option value="">Select Entity Type</option>
                              {entityTypeList &&
                                Object.keys(entityTypeList).map(
                                  (item, index) => {
                                    if (
                                      item != "INDIVIDUAL" &&
                                      checkIFDocumentExist(
                                        entityTypeList[item]?.value
                                      )
                                    ) {
                                      return (
                                        <option
                                          value={entityTypeList[item]?.value}
                                          selected={
                                            entityTypeList[item]?.value ==
                                            entityType
                                          }
                                        >
                                          {entityTypeList[item]?.name}
                                        </option>
                                      );
                                    }
                                  }
                                )}
                            </select>
                            {entityError && (
                              <span className="error-fields">
                                Select Entity Type To Continue
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {!isEmptyObject(registrationProviderData) &&
                        props?.dataOfAccountSetup?.isIndividual && (
                          <div className="col-12 col-md-12">
                            <div className="form-group">
                              <label className="form-label">Full Name</label>
                              <input
                                type="text"
                                className={"form-control"}
                                name={"Full Name"}
                                value={registrationProviderData?.name?.value}
                                placeholder="Full Name"
                                disabled={true}
                              />
                            </div>
                          </div>
                        )}
                      {particularFields &&
                        particularFields.map((item, index) => {
                          let key = Object.keys(item);
                          let checkFieldsShow =
                            item[key[0]]?.hasOwnProperty("enabled");
                          if (checkFieldsShow && item[key[0]]?.enabled) {
                            if (
                              item[key[0]]?.for == "all" ||
                              item[key[0]]?.for == "root"
                            ) {
                              if (key) {
                                let keyValues = key[0]?.split(".");
                                let customerType = keyValues[0];
                                let formType = keyValues[1];
                                let fieldName = keyValues[2];
                                let label = fieldName.replaceAll("_", " ");
                                let formKeyVal = key[0];
                                const arr = label.split(" ");

                                for (var i = 0; i < arr.length; i++) {
                                  arr[i] =
                                    arr[i]?.charAt(0).toUpperCase() +
                                    arr[i]?.slice(1);
                                }
                                const str2 = arr.join(" ");

                                label = str2;
                                let labelFromApi = item[key[0]]?.label;
                                if (labelFromApi) {
                                  label = item[key[0]]?.label
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                    )
                                    .join(" ");
                                } else {
                                  label = label;
                                }
                                let fieldType = item[key[0]]?.type;
                                let sourceType = item[key[0]]?.source?.type;
                                let returnKey = item[key[0]]?.source?.returnKey;
                                let fieldData = item[key[0]]?.source?.data;
                                let requiredField = item[key[0]]?.required;
                                console.log(requiredField, "requiredField");
                                let valueField = item[key[0]]?.DefaultValue;

                                let editableField = "";
                                //individual.basic.date_signed => key
                                //item => key:value
                                if (
                                  item[key[0]]?.hasOwnProperty("DefaultValue")
                                ) {
                                  editableField = false;
                                } else {
                                  editableField = true;
                                }

                                // if (item[key[0]]?.isSingpass) {
                                //   editableField = false;
                                // } else {
                                //   editableField = true;
                                // }

                                if (
                                  customerType ==
                                  props?.dataOfAccountSetup?.isIndividual
                                    ? "individual"
                                    : "corporate" && formType != "crp"
                                ) {
                                  if (requiredField) {
                                    if (
                                      key[0] ===
                                        "individual.compliance.investor_type_key" ||
                                      key[0] ===
                                        "corporate.compliance.investor_type_key"
                                    ) {
                                    } else {
                                      allRequiredField.push(key[0]);
                                    }
                                    console.log(
                                      "individual.compliance.investor_type_key",
                                      key[0]
                                    );
                                  }
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
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <PhoneInput
                                                  value={getUpdatedData(
                                                    formKeyVal
                                                  )}
                                                  country={
                                                    countryCode.toLowerCase() ||
                                                    "sg"
                                                  }
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
                                                  // disabled={isAccepted}
                                                  disabled={
                                                    (!editableField ||
                                                      particularAddedData[
                                                        key[0]
                                                      ]?.isSingpass ||
                                                      particularAddedData[
                                                        key[0]
                                                      ]?.isAdhar ||
                                                      handleProviderValueDisabled(
                                                        particularAddedData,
                                                        key
                                                      )) &&
                                                    fieldName !=
                                                      "street_address" &&
                                                    fieldName !=
                                                      "cross_street_address" &&
                                                    checkOutDatedForCKYC()
                                                  }
                                                />
                                                {checkIfDataFromCKYCAndOutDatedTrue() ===
                                                  true && (
                                                  <span className="ms-2">
                                                    {checkDataMatchedWithKYCData(
                                                      formKeyVal
                                                    )?.updated === true ? (
                                                      <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                          <Tooltip>
                                                            No Change Found
                                                          </Tooltip>
                                                        }
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faCheck}
                                                          color="green"
                                                        />
                                                      </OverlayTrigger>
                                                    ) : (
                                                      <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                          <Tooltip>
                                                            <ul
                                                              style={{
                                                                marginLeft:
                                                                  "0px",
                                                              }}
                                                            >
                                                              <li
                                                                style={{
                                                                  fontSize:
                                                                    "10px",
                                                                  marginLeft:
                                                                    "0px",
                                                                }}
                                                              >
                                                                CKYC Data for{" "}
                                                                {label} is :
                                                                {
                                                                  checkDataMatchedWithKYCData(
                                                                    formKeyVal
                                                                  )?.ckycData
                                                                }
                                                              </li>
                                                              <li
                                                                style={{
                                                                  fontSize:
                                                                    "10px",
                                                                  marginLeft:
                                                                    "0px",
                                                                }}
                                                              >
                                                                Updated Data for{" "}
                                                                {label} is :
                                                                {
                                                                  checkDataMatchedWithKYCData(
                                                                    formKeyVal
                                                                  )?.currentData
                                                                }
                                                              </li>
                                                            </ul>{" "}
                                                          </Tooltip>
                                                        }
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={
                                                            faCircleExclamation
                                                          }
                                                          color="orange"
                                                        />
                                                      </OverlayTrigger>
                                                    )}
                                                  </span>
                                                )}
                                              </div>
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
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <input
                                                type={fieldType}
                                                className={
                                                  requiredField &&
                                                  !identityDataFields?.[
                                                    formKeyVal
                                                  ] &&
                                                  (getUpdatedData(formKeyVal) ==
                                                    "" ||
                                                    getUpdatedData(
                                                      formKeyVal
                                                    ) == null)
                                                    ? "form-control field_warning"
                                                    : "form-control"
                                                }
                                                defaultValue={
                                                  editableField == false
                                                    ? valueField
                                                    : getUpdatedData(formKeyVal)
                                                }
                                                disabled={
                                                  (!editableField ||
                                                    particularAddedData[key[0]]
                                                      ?.isSingpass ||
                                                    particularAddedData[key[0]]
                                                      ?.isAdhar ||
                                                    handleProviderValueDisabled(
                                                      particularAddedData,
                                                      key
                                                    )) &&
                                                  fieldName !=
                                                    "street_address" &&
                                                  fieldName !=
                                                    "cross_street_address" &&
                                                  checkOutDatedForCKYC()
                                                }
                                                // disabled={handleProviderValueDisabled(particularAddedData, key)}
                                                name={formKeyVal}
                                                placeholder={label}
                                                onChange={(e) => {
                                                  handleChange(e);
                                                }}
                                              />
                                              {checkIfDataFromCKYCAndOutDatedTrue() ===
                                                true && (
                                                <span className="ms-2">
                                                  {checkDataMatchedWithKYCData(
                                                    formKeyVal
                                                  )?.updated === true ? (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>
                                                          No Change Found
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faCheck}
                                                        color="green"
                                                      />
                                                    </OverlayTrigger>
                                                  ) : (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>
                                                          <ul
                                                            style={{
                                                              marginLeft: "0px",
                                                            }}
                                                          >
                                                            <li
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                                marginLeft:
                                                                  "0px",
                                                              }}
                                                            >
                                                              CKYC Data for{" "}
                                                              {label} is :
                                                              {
                                                                checkDataMatchedWithKYCData(
                                                                  formKeyVal
                                                                )?.ckycData
                                                              }
                                                            </li>
                                                            <li
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                                marginLeft:
                                                                  "0px",
                                                              }}
                                                            >
                                                              Updated Data for{" "}
                                                              {label} is :
                                                              {
                                                                checkDataMatchedWithKYCData(
                                                                  formKeyVal
                                                                )?.currentData
                                                              }
                                                            </li>
                                                          </ul>{" "}
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={
                                                          faCircleExclamation
                                                        }
                                                        color="orange"
                                                      />
                                                    </OverlayTrigger>
                                                  )}
                                                </span>
                                              )}
                                            </div>
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
                                          {/* <input
                                          type={fieldType}
                                          defaultValue={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                          disabled={!editableField || particularAddedData[key[0]]?.isSingpass || particularAddedData[key[0]]?.isAdhar || handleProviderValueDisabled(particularAddedData, key)}
                                          className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control" : "form-control"}
                                          name={formKeyVal}
                                          placeholder={label}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        /> */}
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "start",
                                            }}
                                            className="flatpickr-wrapper-width"
                                          >
                                            <Flatpickr
                                              placeholder={label}
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
                                              disabled={
                                                !editableField ||
                                                particularAddedData[key[0]]
                                                  ?.isSingpass ||
                                                particularAddedData[key[0]]
                                                  ?.isAdhar ||
                                                (handleProviderValueDisabled(
                                                  particularAddedData,
                                                  key
                                                ) &&
                                                  checkOutDatedForCKYC())
                                              }
                                              name={formKeyVal}
                                              options={{
                                                dateFormat:
                                                  formatDateRegionWise(
                                                    null,
                                                    null,
                                                    true
                                                  ),
                                                allowInput: true, // Enable manual input
                                                static: true,
                                                onClose: function (
                                                  selectedDates,
                                                  dateStr,
                                                  instance
                                                ) {
                                                  handleChangeDate(
                                                    formKeyVal,
                                                    selectedDates
                                                  );
                                                },
                                                onReady: function (
                                                  selectedDates,
                                                  dateStr,
                                                  instance
                                                ) {
                                                  // Add event listener to input field to handle manual date entry
                                                  const input = instance.input;
                                                  input.addEventListener(
                                                    "input",
                                                    function (event) {
                                                      const value = input.value;
                                                      if (
                                                        event.inputType ===
                                                        "deleteContentBackward"
                                                      ) {
                                                        // Remove the slash when backspace is pressed
                                                        if (
                                                          value.length === 3 ||
                                                          value.length === 6
                                                        ) {
                                                          input.value =
                                                            value.slice(0, -1);
                                                        }
                                                      } else {
                                                        // Insert slash after entering two digits for month and day
                                                        if (
                                                          value.length === 2 ||
                                                          value.length === 5
                                                        ) {
                                                          input.value += "/";
                                                        }
                                                      }
                                                    }
                                                  );
                                                },
                                              }}
                                              value={formatDateRegionWise(
                                                editableField == false
                                                  ? valueField
                                                  : getUpdatedData(formKeyVal)
                                              )}
                                              onChange={(e) => {
                                                handleChangeDate(formKeyVal, e);
                                              }}
                                            />
                                            {dobError && (
                                              <span
                                                style={{ marginTop: "1em" }}
                                                className="error-fields"
                                              >
                                                Date of birth must be at least
                                                16 years ago.
                                              </span>
                                            )}

                                            {checkIfDataFromCKYCAndOutDatedTrue() ===
                                              true && (
                                              <span className="ms-2">
                                                {checkDataMatchedWithKYCData(
                                                  formKeyVal
                                                )?.updated === true ? (
                                                  <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                      <Tooltip>
                                                        No Change Found
                                                      </Tooltip>
                                                    }
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faCheck}
                                                      color="green"
                                                    />
                                                  </OverlayTrigger>
                                                ) : (
                                                  <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                      <Tooltip>
                                                        <ul
                                                          style={{
                                                            marginLeft: "0px",
                                                          }}
                                                        >
                                                          <li
                                                            style={{
                                                              fontSize: "10px",
                                                              marginLeft: "0px",
                                                            }}
                                                          >
                                                            CKYC Data for{" "}
                                                            {label} is :
                                                            {
                                                              checkDataMatchedWithKYCData(
                                                                formKeyVal
                                                              )?.ckycData
                                                            }
                                                          </li>
                                                          <li
                                                            style={{
                                                              fontSize: "10px",
                                                              marginLeft: "0px",
                                                            }}
                                                          >
                                                            Updated Data for{" "}
                                                            {label} is :
                                                            {
                                                              checkDataMatchedWithKYCData(
                                                                formKeyVal
                                                              )?.currentData
                                                            }
                                                          </li>
                                                        </ul>{" "}
                                                      </Tooltip>
                                                    }
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faCircleExclamation}
                                                      color="orange"
                                                    />
                                                  </OverlayTrigger>
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </div>
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
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <select
                                                className={
                                                  requiredField &&
                                                  !identityDataFields?.[
                                                    formKeyVal
                                                  ] &&
                                                  (getUpdatedData(formKeyVal) ==
                                                    "" ||
                                                    getUpdatedData(
                                                      formKeyVal
                                                    ) == null)
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
                                                  (handleProviderValueDisabled(
                                                    particularAddedData,
                                                    key
                                                  ) &&
                                                    checkOutDatedForCKYC())
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
                                                  fieldData.map(
                                                    (dat, index) => (
                                                      <option
                                                        value={dat[returnKey]}
                                                        selected={
                                                          editableField ==
                                                            false &&
                                                          valueField ==
                                                            dat[returnKey]
                                                            ? true
                                                            : getUpdatedData(
                                                                formKeyVal
                                                              ) ==
                                                              dat[returnKey]
                                                            ? true
                                                            : false
                                                        }
                                                      >
                                                        {dat?.name}
                                                      </option>
                                                    )
                                                  )}
                                              </select>
                                              {checkIfDataFromCKYCAndOutDatedTrue() ===
                                                true && (
                                                <span className="ms-2">
                                                  {checkDataMatchedWithKYCData(
                                                    formKeyVal
                                                  )?.updated === true ? (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>
                                                          No Change Found
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faCheck}
                                                        color="green"
                                                      />
                                                    </OverlayTrigger>
                                                  ) : (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>
                                                          <ul
                                                            style={{
                                                              marginLeft: "0px",
                                                            }}
                                                          >
                                                            <li
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                                marginLeft:
                                                                  "0px",
                                                              }}
                                                            >
                                                              CKYC Data for{" "}
                                                              {label} is :
                                                              {
                                                                checkDataMatchedWithKYCData(
                                                                  formKeyVal
                                                                )?.ckycData
                                                              }
                                                            </li>
                                                            <li
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                                marginLeft:
                                                                  "0px",
                                                              }}
                                                            >
                                                              Updated Data for{" "}
                                                              {label} is :
                                                              {
                                                                checkDataMatchedWithKYCData(
                                                                  formKeyVal
                                                                )?.currentData
                                                              }
                                                            </li>
                                                          </ul>{" "}
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={
                                                          faCircleExclamation
                                                        }
                                                        color="orange"
                                                      />
                                                    </OverlayTrigger>
                                                  )}
                                                </span>
                                              )}
                                            </div>
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
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <select
                                                className={
                                                  requiredField &&
                                                  !identityDataFields?.[
                                                    formKeyVal
                                                  ] &&
                                                  (getUpdatedData(formKeyVal) ==
                                                    "" ||
                                                    getUpdatedData(
                                                      formKeyVal
                                                    ) == null)
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
                                                  (handleProviderValueDisabled(
                                                    particularAddedData,
                                                    key
                                                  ) &&
                                                    checkOutDatedForCKYC())
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
                                                          fieldData[dat][
                                                            returnKey
                                                          ]
                                                        }
                                                        selected={
                                                          editableField ==
                                                            false &&
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
                                                        {fieldData[dat]?.name
                                                          .split(" ")
                                                          .map(
                                                            (word) =>
                                                              word
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                              word
                                                                .slice(1)
                                                                .toLowerCase()
                                                          )
                                                          .join(" ")}
                                                      </option>
                                                    )
                                                  )}
                                              </select>
                                              {checkIfDataFromCKYCAndOutDatedTrue() ===
                                                true && (
                                                <span className="ms-2">
                                                  {checkDataMatchedWithKYCData(
                                                    formKeyVal
                                                  )?.updated === true ? (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>
                                                          No Change Found
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faCheck}
                                                        color="green"
                                                      />
                                                    </OverlayTrigger>
                                                  ) : (
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip>
                                                          <ul
                                                            style={{
                                                              marginLeft: "0px",
                                                            }}
                                                          >
                                                            <li
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                                marginLeft:
                                                                  "0px",
                                                              }}
                                                            >
                                                              CKYC Data for{" "}
                                                              {label} is :
                                                              {
                                                                checkDataMatchedWithKYCData(
                                                                  formKeyVal
                                                                )?.ckycData
                                                              }
                                                            </li>
                                                            <li
                                                              style={{
                                                                fontSize:
                                                                  "10px",
                                                                marginLeft:
                                                                  "0px",
                                                              }}
                                                            >
                                                              Updated Data for{" "}
                                                              {label} is :
                                                              {
                                                                checkDataMatchedWithKYCData(
                                                                  formKeyVal
                                                                )?.currentData
                                                              }
                                                            </li>
                                                          </ul>{" "}
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={
                                                          faCircleExclamation
                                                        }
                                                        color="orange"
                                                      />
                                                    </OverlayTrigger>
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  }

                                  // if (fieldType == "dd") {
                                  //   if (sourceType == "table" || sourceType == "custom") {
                                  //     return (
                                  //       <div className="col-6 col-md-6">
                                  //         <div className="form-group">
                                  //           <label className="form-label">
                                  //             {label}
                                  //             {requiredField && <span className="text-danger">*</span>}
                                  //           </label>
                                  //           <div
                                  //             style={{
                                  //               display: "flex",
                                  //               alignItems: "center",
                                  //             }}
                                  //           >
                                  //             <select
                                  //               className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                  //               defaultValue={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                  //               disabled={!editableField || particularAddedData[key[0]]?.isSingpass || particularAddedData[key[0]]?.isAdhar || (handleProviderValueDisabled(particularAddedData, key) && checkOutDatedForCKYC())}
                                  //               name={formKeyVal}
                                  //               onChange={(e) => {
                                  //                 handleChange(e);
                                  //               }}
                                  //             >
                                  //               <option value="">Select {label}</option>
                                  //               {fieldData &&
                                  //                 fieldData.map((dat, index) => (
                                  //                   <option value={dat[returnKey]} selected={editableField == false && valueField == dat[returnKey] ? true : getUpdatedData(formKeyVal) == dat[returnKey] ? true : false}>
                                  //                     {dat?.name}
                                  //                   </option>
                                  //                 ))}
                                  //             </select>
                                  //             {checkIfDataFromCKYCAndOutDatedTrue() === true && (
                                  //               <span className="ms-2">
                                  //                 {checkDataMatchedWithKYCData(formKeyVal)?.updated === true ? (
                                  //                   <OverlayTrigger placement="top" overlay={<Tooltip>No Change Found</Tooltip>}>
                                  //                     <FontAwesomeIcon icon={faCheck} color="green" />
                                  //                   </OverlayTrigger>
                                  //                 ) : (
                                  //                   <OverlayTrigger
                                  //                     placement="top"
                                  //                     overlay={
                                  //                       <Tooltip>
                                  //                         <ul
                                  //                           style={{
                                  //                             marginLeft: "0px",
                                  //                           }}
                                  //                         >
                                  //                           <li
                                  //                             style={{
                                  //                               fontSize: "10px",
                                  //                               marginLeft: "0px",
                                  //                             }}
                                  //                           >
                                  //                             CKYC Data for {label} is :{checkDataMatchedWithKYCData(formKeyVal)?.ckycData}
                                  //                           </li>
                                  //                           <li
                                  //                             style={{
                                  //                               fontSize: "10px",
                                  //                               marginLeft: "0px",
                                  //                             }}
                                  //                           >
                                  //                             Updated Data for {label} is :{checkDataMatchedWithKYCData(formKeyVal)?.currentData}
                                  //                           </li>
                                  //                         </ul>{" "}
                                  //                       </Tooltip>
                                  //                     }
                                  //                   >
                                  //                     <FontAwesomeIcon icon={faCircleExclamation} color="orange" />
                                  //                   </OverlayTrigger>
                                  //                 )}
                                  //               </span>
                                  //             )}
                                  //           </div>
                                  //         </div>
                                  //       </div>
                                  //     );
                                  //   }
                                  // }
                                  if (
                                    fieldType === "check" &&
                                    label ===
                                      "Are You The Ultimate Beneficial Owner?"
                                  ) {
                                    const investingValue =
                                      props?.dataOfAccountSetup
                                        ?.selectedIdentityData?.meta?.data?.[
                                        `${customerType}.compliance.is_investing_own_behalf.Label`
                                      ]?.value;
                                    console.log(
                                      "dasjldkasnkdjalsd",
                                      investingValue
                                    );

                                    return (
                                      <div
                                        className="col-6 col-md-6"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginBottom: "25px",
                                        }}
                                      >
                                        <Form.Group className="mb-3">
                                          <Form.Label>{label}</Form.Label>
                                          <div className="d-flex align-items-center">
                                            <Form.Check
                                              className="radio-field me-3"
                                              inline
                                              type="radio"
                                              id={`${formKeyVal}-yes`}
                                              name={formKeyVal}
                                              label="Yes"
                                              defaultChecked={
                                                getUpdatedData(
                                                  formKeyVal,
                                                  true
                                                ) === "Yes"
                                              }
                                              // defaultChecked={editableField === false ? valueField === "Yes" : getUpdatedData(formKeyVal) === "Yes"}
                                              disabled={
                                                (editableField === false ||
                                                  isAccepted) &&
                                                checkOutDatedForCKYC()
                                              }
                                              onChange={(e) =>
                                                handleChangeCheckBox(e, "Yes")
                                              }
                                            />
                                            <Form.Check
                                              className="radio-field"
                                              inline
                                              type="radio"
                                              id={`${formKeyVal}-no`}
                                              name={formKeyVal}
                                              label="No"
                                              defaultChecked={
                                                getUpdatedData(
                                                  formKeyVal,
                                                  true
                                                ) === "No"
                                              }
                                              // defaultChecked={
                                              //   editableField === false ? valueField !== "Yes" && key === "individual.compliance.is_investing_own_behalf.Label" && particularFields[key]?.value !== "Not Applicable" : (getUpdatedData(formKeyVal) !== "Yes" && getUpdatedData(formKeyVal,true) !== "Not Applicable")
                                              // }
                                              disabled={
                                                (editableField === false ||
                                                  isAccepted) &&
                                                checkOutDatedForCKYC()
                                              }
                                              onChange={(e) =>
                                                handleChangeCheckBox(e, "No")
                                              }
                                            />
                                            <Form.Check
                                              className="radio-field"
                                              inline
                                              type="radio"
                                              id={`${formKeyVal}-no`}
                                              name={formKeyVal}
                                              label="Not Applicable"
                                              defaultChecked={
                                                getUpdatedData(
                                                  formKeyVal,
                                                  true
                                                ) === "Not Applicable"
                                              }
                                              // defaultChecked={
                                              //   editableField === false ? valueField !== "Yes" && key === "individual.compliance.is_investing_own_behalf.Label" && particularFields[key]?.value !== "No" : (getUpdatedData(formKeyVal) !== "Yes" && getUpdatedData(formKeyVal,true) !== "No")
                                              // }
                                              disabled={
                                                (editableField === false ||
                                                  isAccepted) &&
                                                checkOutDatedForCKYC()
                                              }
                                              onChange={(e) =>
                                                handleChangeCheckBox(
                                                  e,
                                                  "Not Applicable"
                                                )
                                              }
                                            />
                                          </div>
                                          {checkIfDataFromCKYCAndOutDatedTrue() && (
                                            <span className="ms-2">
                                              {checkDataMatchedWithKYCData(
                                                formKeyVal
                                              )?.updated === true ? (
                                                <OverlayTrigger
                                                  placement="top"
                                                  overlay={
                                                    <Tooltip>
                                                      No Change Found
                                                    </Tooltip>
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faCheck}
                                                    color="green"
                                                  />
                                                </OverlayTrigger>
                                              ) : (
                                                <OverlayTrigger
                                                  placement="top"
                                                  overlay={
                                                    <Tooltip>
                                                      <ul
                                                        style={{
                                                          marginLeft: "0px",
                                                        }}
                                                      >
                                                        <li
                                                          style={{
                                                            fontSize: "10px",
                                                            marginLeft: "0px",
                                                          }}
                                                        >
                                                          CKYC Data for {label}{" "}
                                                          is:{" "}
                                                          {
                                                            checkDataMatchedWithKYCData(
                                                              formKeyVal
                                                            )?.ckycData
                                                          }
                                                        </li>
                                                        <li
                                                          style={{
                                                            fontSize: "10px",
                                                            marginLeft: "0px",
                                                          }}
                                                        >
                                                          Updated Data for{" "}
                                                          {label} is:{" "}
                                                          {
                                                            checkDataMatchedWithKYCData(
                                                              formKeyVal
                                                            )?.currentData
                                                          }
                                                        </li>
                                                      </ul>{" "}
                                                    </Tooltip>
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faCircleExclamation}
                                                    color="orange"
                                                  />
                                                </OverlayTrigger>
                                              )}
                                            </span>
                                          )}
                                        </Form.Group>
                                      </div>
                                    );
                                  }

                                  // if (fieldType == "check" && label == "Are You The Ultimate Beneficial Owner?") {
                                  //   return (
                                  //     <div
                                  //       className="col-6 col-md-6"
                                  //       style={{
                                  //         display: "flex",
                                  //         alignItems: "center",
                                  //         marginBottom: "25px",
                                  //       }}
                                  //     >
                                  //       <div
                                  //         style={{
                                  //           display: "flex",
                                  //           alignItems: "center",
                                  //         }}
                                  //       >
                                  //         <Form.Check
                                  //           // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                  //           className={"radio-field"}
                                  //           type={"radio"}
                                  //           id={formKeyVal}
                                  //           name={formKeyVal}
                                  //           label={label}
                                  //           defaultChecked={
                                  //             editableField == false
                                  //               ? valueField
                                  //               : getUpdatedData(formKeyVal)
                                  //           }
                                  //           disabled={
                                  //             (editableField == false ||
                                  //               isAccepted) &&
                                  //             checkOutDatedForCKYC()
                                  //           }
                                  //           onChange={(e) => {
                                  //             handleChangeCheckBox(e);
                                  //           }}
                                  //         />
                                  //         {checkIfDataFromCKYCAndOutDatedTrue() ===
                                  //           true && (
                                  //             <span className="ms-2">
                                  //               {checkDataMatchedWithKYCData(
                                  //                 formKeyVal
                                  //               )?.updated === true ? (
                                  //                 <OverlayTrigger
                                  //                   placement="top"
                                  //                   overlay={
                                  //                     <Tooltip>
                                  //                       No Change Found
                                  //                     </Tooltip>
                                  //                   }
                                  //                 >
                                  //                   <FontAwesomeIcon
                                  //                     icon={faCheck}
                                  //                     color="green"
                                  //                   />
                                  //                 </OverlayTrigger>
                                  //               ) : (
                                  //                 <OverlayTrigger
                                  //                   placement="top"
                                  //                   overlay={
                                  //                     <Tooltip>
                                  //                       <ul
                                  //                         style={{
                                  //                           marginLeft: "0px",
                                  //                         }}
                                  //                       >
                                  //                         <li
                                  //                           style={{
                                  //                             fontSize: "10px",
                                  //                             marginLeft: "0px",
                                  //                           }}
                                  //                         >
                                  //                           CKYC Data for {label}{" "}
                                  //                           is :
                                  //                           {
                                  //                             checkDataMatchedWithKYCData(
                                  //                               formKeyVal
                                  //                             )?.ckycData
                                  //                           }
                                  //                         </li>
                                  //                         <li
                                  //                           style={{
                                  //                             fontSize: "10px",
                                  //                             marginLeft: "0px",
                                  //                           }}
                                  //                         >
                                  //                           Updated Data for{" "}
                                  //                           {label} is :
                                  //                           {
                                  //                             checkDataMatchedWithKYCData(
                                  //                               formKeyVal
                                  //                             )?.currentData
                                  //                           }
                                  //                         </li>
                                  //                       </ul>{" "}
                                  //                     </Tooltip>
                                  //                   }
                                  //                 >
                                  //                   <FontAwesomeIcon
                                  //                     icon={faCircleExclamation}
                                  //                     color="orange"
                                  //                   />
                                  //                 </OverlayTrigger>
                                  //               )}
                                  //             </span>
                                  //           )}
                                  //       </div>
                                  //     </div>
                                  //   );
                                  // }
                                  // if (fieldType == "check") {
                                  //   return (
                                  //     <div
                                  //       className="col-6 col-md-6"
                                  //       style={{
                                  //         display: "flex",
                                  //         alignItems: "center",
                                  //         marginBottom: "25px",
                                  //       }}
                                  //     >
                                  //       <div
                                  //         style={{
                                  //           display: "flex",
                                  //           alignItems: "center",
                                  //         }}
                                  //       >
                                  //         <Form.Check
                                  //           // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                  //           className={"checkbox-field"}
                                  //           type={"checkbox"}
                                  //           id={formKeyVal}
                                  //           name={formKeyVal}
                                  //           label={label}
                                  //           defaultChecked={
                                  //             editableField == false
                                  //               ? valueField
                                  //               : getUpdatedData(formKeyVal)
                                  //           }
                                  //           disabled={
                                  //             (editableField == false ||
                                  //               isAccepted) &&
                                  //             checkOutDatedForCKYC()
                                  //           }
                                  //           onChange={(e) => {
                                  //             handleChangeCheckBox(e);
                                  //           }}
                                  //         />
                                  //         {checkIfDataFromCKYCAndOutDatedTrue() ===
                                  //           true && (
                                  //             <span className="ms-2">
                                  //               {checkDataMatchedWithKYCData(
                                  //                 formKeyVal
                                  //               )?.updated === true ? (
                                  //                 <OverlayTrigger
                                  //                   placement="top"
                                  //                   overlay={
                                  //                     <Tooltip>
                                  //                       No Change Found
                                  //                     </Tooltip>
                                  //                   }
                                  //                 >
                                  //                   <FontAwesomeIcon
                                  //                     icon={faCheck}
                                  //                     color="green"
                                  //                   />
                                  //                 </OverlayTrigger>
                                  //               ) : (
                                  //                 <OverlayTrigger
                                  //                   placement="top"
                                  //                   overlay={
                                  //                     <Tooltip>
                                  //                       <ul
                                  //                         style={{
                                  //                           marginLeft: "0px",
                                  //                         }}
                                  //                       >
                                  //                         <li
                                  //                           style={{
                                  //                             fontSize: "10px",
                                  //                             marginLeft: "0px",
                                  //                           }}
                                  //                         >
                                  //                           CKYC Data for {label}{" "}
                                  //                           is :
                                  //                           {
                                  //                             checkDataMatchedWithKYCData(
                                  //                               formKeyVal
                                  //                             )?.ckycData
                                  //                           }
                                  //                         </li>
                                  //                         <li
                                  //                           style={{
                                  //                             fontSize: "10px",
                                  //                             marginLeft: "0px",
                                  //                           }}
                                  //                         >
                                  //                           Updated Data for{" "}
                                  //                           {label} is :
                                  //                           {
                                  //                             checkDataMatchedWithKYCData(
                                  //                               formKeyVal
                                  //                             )?.currentData
                                  //                           }
                                  //                         </li>
                                  //                       </ul>{" "}
                                  //                     </Tooltip>
                                  //                   }
                                  //                 >
                                  //                   <FontAwesomeIcon
                                  //                     icon={faCircleExclamation}
                                  //                     color="orange"
                                  //                   />
                                  //                 </OverlayTrigger>
                                  //               )}
                                  //             </span>
                                  //           )}
                                  //       </div>
                                  //     </div>
                                  //   );
                                  // }
                                }
                              }
                            }
                          }
                        })}
                    </div>
                    {/* } */}
                  </Form>
                </>
              )}
              <br />
              <br />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
