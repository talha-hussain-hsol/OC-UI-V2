export default function getMissingDataOfIdentity(identityData, fundData, allFieldsData, isCrp, crpDocument, crpRequiredDocument) {
  console.log(identityData, "identityData getMissingDataOfIdentity");
  console.log(fundData, "fundData getMissingDataOfIdentity");
  console.log(allFieldsData, "allFieldsData allFieldsData allFieldsData allFieldsData");
  console.log(isCrp, "isCrp isCrp isCrp isCrp isCrp isCrp");
  console.log(crpDocument, "crpDocument crpDocument crpDocument crpDocument crpDocument");
  console.log(crpRequiredDocument, "crpRequiredDocument crpRequiredDocument crpRequiredDocument crpRequiredDocument");
  crpRequiredDocument = crpRequiredDocument?.filter((item) => item.isRequired === true);
  console.log(crpRequiredDocument, "crpRequiredDocument crpRequiredDocument crpRequiredDocument crpRequiredDocument");
  let fundDataFields = null;
  if (fundData?.fund_fields) {
    fundDataFields = fundData?.fund_fields;
  } else {
    fundDataFields = fundData?.meta?.data;
  }
  console.log(fundDataFields, "fundDataFields fundDataFields ");
  let allIdentityFields = identityData?.meta?.data ? identityData?.meta?.data : identityData;
  let customerTypeIdentity = identityData?.type;
  let missingFields = [];
  let missingDocuments = [];

  console.log(allIdentityFields, "allIdentityFields allIdentityFields ");
  console.log(allFieldsData, "allFieldsData allFieldsData ");
  if (allIdentityFields) {
    if (allFieldsData) {
      allFieldsData &&
        allFieldsData.map((items, index) => {
          let item = Object.keys(items);
          item = item[0];
          console.log(item, "item item item itemsdasdasd");
          let splitKeys = item.split(".");
          let customerType = splitKeys[0];
          let formType = splitKeys[1];
          let inputFieldName = splitKeys[2];
          if (isCrp) {
            if (customerType == identityData?.type?.toLowerCase()) {
              if ((allIdentityFields[item]?.value === null || allIdentityFields[item]?.value == "") && items[item]?.required && items[item]?.for != "root" && (items[item]?.enabled === true || items[item]?.enabled === "true")) {
                missingFields.push(inputFieldName.replaceAll("_", " "));
              }
              if (!allIdentityFields[item] && items[item]?.required && items[item]?.for != "root" && (items[item]?.enabled === true || items[item]?.enabled === "true")) {
                missingFields.push(inputFieldName.replaceAll("_", " "));
              }
            }
          } else {
            if (customerType == identityData?.type?.toLowerCase()) {
              if ((allIdentityFields[item]?.value === null || allIdentityFields[item]?.value == "") && items[item]?.required && items[item]?.for != "crp" && formType != "crp" && (items[item]?.enabled === true || items[item]?.enabled === "true")) {
                missingFields.push(inputFieldName.replaceAll("_", " "));
              }
              if (!allIdentityFields[item] && allIdentityFields[item] != false && items[item]?.required && items[item]?.for != "crp" && formType != "crp" && (items[item]?.enabled === true || items[item]?.enabled === "true")) {
                missingFields.push(inputFieldName.replaceAll("_", " "));
              }
            }
          }
        });
    }
    console.log(missingFields, "missingFields");

    // if (allIdentityFields && fundDataFields) {
    //     let keysAllIdentityFields = Object.keys(allIdentityFields);

    //     if (keysAllIdentityFields) {
    //         keysAllIdentityFields && keysAllIdentityFields.map((item, index) => {
    //             let splitKeys = item.split('.')
    //             let customerType = splitKeys[0]
    //             let formType = splitKeys[1]
    //             let inputFieldName = splitKeys[2]
    //             if (customerType == identityData?.type.toLowerCase() && formType!= 'crp') {
    //                 if (allIdentityFields[item]?.value === null && allFieldsData[item]?.required) {
    //                     missingFields.push(inputFieldName.replaceAll('_', ' '))
    //                 }
    //             }
    //         })

    //     }
    //     // if (keysAllIdentityFields) {
    //     //     keysAllIdentityFields && keysAllIdentityFields.map((item, index) => {
    //     //         let splitKeys = item.split('.')
    //     //         let customerType = splitKeys[0]
    //     //         let formType = splitKeys[1]
    //     //         let inputFieldName = splitKeys[2]
    //     //         if (customerType == identityData?.type.toLowerCase() && formType!= 'crp') {
    //     //             if (allIdentityFields[item]?.value === null && allFieldsData[item]?.required) {
    //     //                 missingFields.push(inputFieldName.replaceAll('_', ' '))
    //     //             }
    //     //         }
    //     //     })

    //     // }

    //     // let keysFundDataFields = Object.keys(fundDataFields);
    //     // if (keysFundDataFields) {
    //     //     keysFundDataFields && keysFundDataFields.map((item, index) => {
    //     //         let splitKeys = item.split('.')
    //     //         let customerType = splitKeys[0]
    //     //         let formType = splitKeys[1]
    //     //         let inputFieldName = splitKeys[2]
    //     //         if (customerTypeIdentity.toLowerCase() == customerType) {
    //     //             missingFields.push(inputFieldName.replaceAll('_', ' '))
    //     //         }
    //     //     })

    //     // }

    //get documents
    let identityDocuments = identityData?.documents;
    let identityType = identityData?.type;
    let identityTypeId = identityData?.entityTypeId;
    if (identityTypeId === null) {
      identityTypeId = 1;
    }
    console.log(identityTypeId, "identityTypeId identityTypeId identityTypeId");
    // if (identityType == "INDIVIDUAL") {
    //     identityTypeId = 1
    // } else {
    //     identityTypeId = 2
    // }
    let fundRequiredDocuments = fundData?.requiredDocuments?.filter((item) => item.isRequired === true);
    console.log(fundRequiredDocuments, "fundRequiredDocuments");
    let filteredDocumentsByIdentityTypeId = [];
    if (isCrp) {
      if (crpRequiredDocument?.length > 0) {
        for (let a of crpRequiredDocument) {
          if (a?.documentType?.categoryId) {
            if (a?.documentType?.categoryId == 1) {
              filteredDocumentsByIdentityTypeId.push(a?.id);
            }
          } else {
            if (a?.categoryId == 1) {
              filteredDocumentsByIdentityTypeId.push(a?.id);
            }
          }
        }
      }
    } else {
      if (fundRequiredDocuments) {
        fundRequiredDocuments.map((item, index) => {
          if (item?.documentType?.categoryId == 1 && item?.documentType?.key != "OTHER" && item?.documentType?.key != "FACE_VERIFICATION" && item?.for != "crp" && item?.entityTypeId == identityTypeId) {
            filteredDocumentsByIdentityTypeId.push(item?.documentTypeId);
          }
        });
      }
    }
    console.log(identityDocuments, "identityDocuments identityDocuments identityDocuments");
    console.log(filteredDocumentsByIdentityTypeId, "filteredDocumentsByIdentityTypeId");

    let identityDocumentsAdded = [];
    if (isCrp) {
      const strArray = crpDocument;
      if (strArray) {
        if (strArray.length > 0) {
          for (let doc of strArray) {
            identityDocumentsAdded.push(doc.documentTypeId)
          }
        }
      }
      //   identityDocumentsAdded = strArray?.map(Number);
    } else {
      if (identityDocuments?.length > 0) {
        for (let a of identityDocuments) {
          identityDocumentsAdded.push(a?.documentTypeId);
        }
      }
    }
    console.log(identityDocumentsAdded, "identityDocumentsAdded identityDocumentsAdded identityDocumentsAdded ");
    console.log(filteredDocumentsByIdentityTypeId, "filteredDocumentsByIdentityTypeId filteredDocumentsByIdentityTypeId filteredDocumentsByIdentityTypeId ");

    missingDocuments = filteredDocumentsByIdentityTypeId.filter((x) => !identityDocumentsAdded.includes(x));
  }
  console.log(missingDocuments, "missingDocuments missingDocuments");
  let data = {
    missingIdentityFields: missingFields,
    missingDocuments: missingDocuments,
  };

  return data;
}
