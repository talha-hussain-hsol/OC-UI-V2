export default {
  base: {
    children: [
      "configuration",
      "kycConfiguration",
      "thirdPartyApi",
      "modules",
      "formsDocuments",
      "ParticularFields",
      "bankwallet",
      "saveButton",
    ],
    id: "base",
  },
  configuration: {
    children: [
      "domainSetting",
      // 'fundFields',
      "riskMatrix",
      "referenceDocument",
      "termsDocument",
      "kyb",
    ],
    icon: "settings",
    id: "configuration",
    title: "Configuration",
  },
  domainSetting: {
    icon: "settings",
    id: "domainSetting",
    title: "Domain Setting",
    url: "/domainSetting",
  },
  // fundFields: {
  //     icon: 'briefcase',
  //     id: 'fundFields',
  //     title: 'Fund Fields',
  //     url: '/fundFields',
  // },
  riskMatrix: {
    icon: "file-text",
    id: "riskMatrix",
    title: "Risk Matrix",
    url: "/riskMatrix",
  },
  referenceDocument: {
    icon: "file-text",
    id: "referenceDocument",
    title: "Reference Document",
    url: "/referenceDocument",
  },
  termsDocument: {
    icon: "file-text",
    id: "termsDocument",
    title: "Terms And Conditions Document",
    url: "/termsDocument",
  },
  kyb: {
    icon: "file-text",
    id: "kyb",
    title: "KYB",
    url: "/kyb",
  },

  //kycConfiguration
  kycConfiguration: {
    children: ["periodicReview", "onGoingDueDiligence", "expiringDocument"],
    icon: "settings",
    id: "kycConfiguration",
    title: "Kyc Configuration",
  },

  periodicReview: {
    icon: "file-text",
    id: "periodicReview",
    title: "Periodic Review",
    url: "/periodicReview",
  },
  onGoingDueDiligence: {
    icon: "sliders",
    id: "onGoingDueDiligence",
    title: "On Going Due Diligence",
    url: "/onGoingDueDiligence",
  },
  expiringDocument: {
    icon: "file-text",
    id: "expiringDocument",
    title: "Expiring Document",
    url: "/expiringDocument",
  },

  //thirdPartyApi

  thirdPartyApi: {
    children: [
      // 'faceVerification',
      "dowJones",
      "worldCheck",
      "internetSearch",
      "restrictedList",
      "upsalla",
    ],
    icon: "settings",
    id: "thirdPartyApi",
    title: "Third Party API",
  },
  // faceVerification: {
  //     icon: 'smile',
  //     id: 'faceVerification',
  //     title: 'Face Verification',
  //     url: '/faceVerification',
  // },
  dowJones: {
    icon: "user-check",
    id: "dowJones",
    title: "Dow Jones",
    url: "/dowJones",
  },
  worldCheck: {
    icon: "user-check",
    id: "worldCheck",
    title: "World Check",
    url: "/worldCheck",
  },
  internetSearch: {
    icon: "sliders",
    id: "internetSearch",
    title: "Internet Search",
    url: "/internetSearch",
  },
  restrictedList: {
    icon: "file-text",
    id: "restrictedList",
    title: "Restricted List",
    url: "/restrictedList",
  },
  // factiva: {
  //     icon: 'smile',
  //     id: 'factiva',
  //     title: 'Factiva',
  //     url: '/factiva',
  // },
  upsalla: {
    icon: "sliders",
    id: "upsalla",
    title: "Upsalla",
    url: "/upsalla",
  },

  //modules
  modules: {
    children: [
      "sections",
      "kyc",
      "kyw",
      "transfer",
      "switch",
      "transactionMonitoring",
    ],
    icon: "settings",
    id: "modules",
    title: "Modules",
  },

  kyc: {
    icon: "user-check",
    id: "kyc",
    title: "KYC",
    url: "/kyc",
  },

  sections: {
    icon: "user-check",
    id: "sections",
    title: "Sections Configuration",
    url: "/sections",
  },
  kyw: {
    icon: "user-check",
    id: "kyw",
    title: "KYW",
    url: "/kyw",
  },
  transfer: {
    icon: "user-check",
    id: "transfer",
    title: "Transfer",
    url: "/transfer",
  },
  switch: {
    icon: "user-check",
    id: "switch",
    title: "Switch",
    url: "/switch",
  },
  transactionMonitoring: {
    icon: "user-check",
    id: "transactionMonitoring",
    title: "Transaction",
    url: "/transactionMonitoring",
  },
  formsDocuments: {
    icon: "file-text",
    id: "formsDocuments",
    title: "Forms & Documents",
    url: "/formsDocuments",
  },
  bankwallet: {
    icon: "file-text",
    id: "bankwallet",
    title: "Bank & Wallet",
    url: "/bankwallet",
  },
  ParticularFields: {
    icon: "file-text",
    id: "ParticularFields",
    title: "Particulars Fields",
    url: "/ParticularFields",
  },

  // singPassCorpPass: {
  //     icon: 'grid',
  //     id: 'singPassCorpPass',
  //     title: 'Sing Pass & Corp Pass',
  //     url: '/singPassCorpPass',
  // },
  // fundType: {
  //     icon: 'type',
  //     id: 'fundType',
  //     title: 'Fund Type',
  //     url: '/fundType',
  // },
  // customerAcceptanceForm: {
  //     icon: 'file-text',
  //     id: 'customerAcceptanceForm',
  //     title: 'Customer Acceptance Form',
  //     url: '/customerAcceptanceForm',
  // },
  // faceVerification: {
  //     icon: 'smile',
  //     id: 'faceVerification',
  //     title: 'Face Verification',
  //     url: '/faceVerification',
  // },
  // additionRedemption: {
  //     icon: 'file-text',
  //     id: 'additionRedemption',
  //     title: 'Addition Redemption',
  //     url: '/additionRedemption',
  // },
  // domainSettings: {
  //     icon: 'settings',
  //     id: 'domainSettings',
  //     title: 'Domain Settings',
  //     url: '/domainSettings',
  // },
  // onGoingDueDiligence: {
  //     icon: 'sliders',
  //     id: 'onGoingDueDiligence',
  //     title: 'On Going Due Diligence',
  //     url: '/onGoingDueDiligence',
  // },
  // contactDetail: {
  //     icon: 'user-check',
  //     id: 'contactDetail',
  //     title: 'Contact Detail',
  //     url: '/contactDetail',
  // },
  // periodicReview: {
  //     icon: 'file-text',
  //     id: 'periodicReview',
  //     title: 'Periodic Review',
  //     url: '/periodicReview',
  // },
  // expiringDocument: {
  //     icon: 'file-text',
  //     id: 'expiringDocument',
  //     title: 'Expiring Document',
  //     url: '/expiringDocument',
  // },
  // supportEmail: {
  //     icon: 'user',
  //     id: 'supportEmail',
  //     title: 'Support Email',
  //     url: '/supportEmail',
  // },
  // organizationName: {
  //     icon: 'type',
  //     id: 'organizationName',
  //     title: 'Organization Name',
  //     url: '/organizationName',
  // },

  saveButton: {
    icon: "grid",
    id: "saveButton",
    title: "Update",
    url: "/saveButton",
  },
  // riskMatrix: {
  //     icon: 'activity',
  //     id: 'riskMatrix',
  //     title: 'Risk Matrix',
  //     url: '/riskMatrix',
  // },
  // apps: {
  //     icon: 'git-branch',
  //     id: 'apps',
  //     title: 'Apps',
  //     url: '/apps',
  // },
};
