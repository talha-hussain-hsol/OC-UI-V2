export function checkSubscriptionAllow(data) {
  console.log("checking data for configuration", data);
  return data?.meta?.config?.settings?.account?.subscription?.status;
}
export function getMaxSubscriptionAmount(data) {
  return data?.account?.subscription?.max?data?.account?.subscription?.max:data?.meta?.config?.settings?.account?.subscription?.max;
}
export function getMinSubscriptionAmount(data) {
  return data?.account?.subscription?.min?data?.account?.subscription?.min:data?.meta?.config?.settings?.account?.subscription?.min;
}
export function getMaxAdditionalSubscriptionAmount(data) {
  return data?.account?.addition?.max?data?.account?.addition?.max:data?.meta?.config?.settings?.account?.addition?.max;
}
export function getMinAdditionalSubscriptionAmount(data) {
  return data?.account?.addition?.min?data?.account?.addition?.min:data?.meta?.config?.settings?.account?.addition?.min;
}
export function getMaxRedemptionSubscriptionAmount(data) {
  return data?.account?.redemption?.max?data?.account?.redemption?.max:data?.meta?.config?.settings?.account?.redemption?.max;
}
export function getMinRedemptionSubscriptionAmount(data) {
  return data?.account?.redemption?.min?data?.account?.redemption?.min: data?.meta?.config?.settings?.account?.redemption?.min;
 
}

export function isFaceEnabled(data, identityType) {
  console.log("checking data for configuration awais", data);

  let faceConfig;

  if (identityType === "corporate") {
    faceConfig = data?.meta?.config?.settings?.account?.applicant?.identity?.corporate?.provider?.verify?.face;
  } else if (identityType === "individual") {
    faceConfig = data?.meta?.config?.settings?.account?.applicant?.identity?.indivisual?.provider?.verify?.face;
  }

  return !!faceConfig?.enabled;
}

export function isVCIPEnabled(data, identityType) {
  let vcipConfig;

  if (identityType === "corporate") {
    vcipConfig = data?.meta?.config?.settings?.account?.applicant?.identity?.corporate?.provider?.verify?.vcip;
  } else if (identityType === "individual") {
    vcipConfig = data?.meta?.config?.settings?.account?.applicant?.identity?.indivisual?.provider?.verify?.vcip;
  }

  return !!vcipConfig?.enabled;
}

export function isRequiredDocumentEnabled(data, identityType) {
  let documentConfig;

  if (identityType === "corporate") {
    documentConfig = data?.meta?.config?.settings?.account?.applicant?.identity?.corporate?.provider?.verify?.document;
  } else if (identityType === "individual") {
    documentConfig = data?.meta?.config?.settings?.account?.applicant?.identity?.indivisual?.provider?.verify?.document;
  }
  console.log("checkisdlasndasdocumentConfig ", documentConfig);

  return !!documentConfig?.ctc;
}

export function isKYCEnabled(config) {
  console.log("checking config", config);

  const kycSubProperties = [
      "Accounts",
      "Quick_Scan",
      "Due_Diligence",
      "Periodic_Review",
      "Expiring_Documents"
  ];

  console.log("kycSubProperties.some(property => config?.modules?.kyc?.[property] === true)",kycSubProperties.some(property => config?.modules?.kyc?.[property] === true))
  return kycSubProperties.some(property => config?.modules?.kyc?.[property] === true);
}

export function isAccountKycChildEnabled(config) {
  return config?.modules?.kyc?.Accounts === true;
}


export function isKYWEnabled(config) {
  return (config?.modules?.kyw === true || config?.modules?.kyw === "true");
}

export function isTransactionMonitoringEnabled(config) {
  return (config?.modules?.tmon?.status === true || config?.modules?.tmon?.status === "true" ||config?.modules?.tmon?.rules?.length > 0 );
}

export function isRestrictedListEnabled(config) {
    return (config?.tp?.restricted_list?.status === true || config?.tp?.restricted_list?.status === "true" );
  }
  
export function isUpsalaEnable(config) {
    return (config?.tp?.uppsala?.status === true || config?.tp?.uppsala?.status === "true");
  }
  
