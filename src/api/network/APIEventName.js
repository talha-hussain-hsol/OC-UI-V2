export const APIEventName={
    "/auth/user/logout":'LOGOUT',
    "/Account/list":'GET_ACCOUNT_LIST',
    "organizations/ascent-fs/funds/demo/document-types":'GET_ORGANIZATION_DOCUMENT_TYPES',
    "/fund/get":'GET_FUND_DETAIL',
    "/Identity/:id/documents":'GET_IDENTITY_DOCUMENTS',
    "/Identity/:id/attach":'POST_IDENTITY_ATTACH',
    "/Identity/fields":'GET_ACCOUNT_IDENTITY_FIELDS',
    "/Identity/fields":'GET_FUND_IDENTITY_FIELDS',
    "/document":'GET_SINGLE_DOCUMENT',
    "/Identity/create":'POST_CREATE_IDENTITY',
    "/Identity/:id/get":'GET_IDENTITY_DETAIL',
    "/Account/detail":'GET_ACCOUNT_DETAIL',
    "/Identity/:id/Crp/list":'GET_IDENTITY_CRP_LIST',
    "/IdentityDocument/add":'POST_IDENTITY_DOCUMENT',
    "/IdentityDocument/:id/verifyUpload":'POST_IDENTITY_DOCUMENT_VERIFY',
    "/crp-roles-meta":'GET_CRP_ROLES',
    "/auth/getToken":'GET_TOKEN',
    "/auth/userDetails":'GET_USER_DETAIL',
    "/Identity/:id/account/:id/Crp/flatlist":'GET_ACCOUNT_CRP_LIST',
    "/Account/requiredDocuments":'GET_REQUIRED_DOCUMENT',
    "/identity-document/:id/sign":'POST_DOCUMENT_SIGN',
    "/:id/:id/application/submit":'POST_SCREENING',
    "/:id/getIdentityWalletAddress":'GET_WALLET_ADDRESS',
    "/:id/addWalletAddress":'POST_WALLET_ADDRESS',
    "/upsala/getSuppotedNetworks":'GET_CRYPTO_CHAIN_LIST',
    "/Identity/:id/updateStatus":'UPDATE_IDENTITY_STATUS',
    "/:id/download-signing-document":'GET_DOWNLOAD_SIGNED_DOCUMENT',
    "/identity-document/:id/docusign-draft-sign":'UPDATE_DRAFT_DOCUSIGN',
    "/transaction/:id/download-sign-document":'GET_DOWNLOAD_TRANSACTION_SIGN_DOCUMENT',
    "/registrationProvider/configuration":'GET_REGISTRATION_PROVIDER_DATA',
    "/entity-types-list":'GET_ENTITY_TYPE_LIST',
    "/registrationProvider/get-data":'POST_REGISTRATION_PROVIDER_DATA',
    "/getAccountSubscriptionDocs":'GET_TRANSACTION_HISTORY',
    "/document/:id/delete":'DELETE_DOCUMENT',
    "/Identity/:id/AccountShareHolder/:id/FaceVerification":'POST_FACEVERIFICATION_DATA',
    "/Identity/:id/AccountShareHolder/:id/Vcip":'POST_VCIP_DATA',
    "/Identity/:id/AccountShareHolder/:id/Vcip/verifyUpload":'POST_VERIFY_VCIP_VIDEO',
    "/getDataSignedUrl":'GET_SIGNED_URL',
    "/:id/addBankAddress":'POST_BANK_DATA',
    "/Identity/:id/AccountShareHolder/:id/DocumentDigitalStamping":'POST_DOCUMENT_DIGITAL_STAMP',
    "/:id/getIdentityBankList":'GET_BANK_LIST',
    "/Identity/:id/AccountShareHolder/:id/DocumentAadhaarSigning":'POST_ESIGN_DATA',
    "/user/entities":'GET_USER_ENTITIES',
    "/user/entity/:id/permissions":'GET_USER_ENTITY_PERMISSION',
    "/identityCount":'GET_IDENTITY_COUNT',
    "/account/:id/delete":'GET_ACCOUNT_DELETE',
    "/:id/addAccountTransaction":'ADD_TRANSACTION_DATA',
    "/Account/transactions":'GET_CUSTOM_TRANSACTION',
    "/:id/deleteAccountTransaction":'DELETE_TRANSACTION',
    "/domain/summary":'GET_DOMAIN_LIST',
    "/Account/list":'GET_ACCOUNT_LIST',
    "/documents-expiring":'GET_EXPIRY_DOCUMENT',
    "/getPeriodicReviewList":'GET_PERIODIC_REVIEW',
    "/:id/on-going-due-diligence":'GET_DUE_DILIGENCE',
    "/restricted-list":'GET_RESTRICTED_LIST',
    "/:id/fund-transactions-alert-update":'POST_TRANASCTION_ALERT',
    "/:id/ScreeningSummaryReport":'GET_SCREENING_SUMMARY',
    "/entity/Identity/list":'GET_IDENTITY_LIST',
    "/restricted-list":'UPDATE_RESTRICTED_LIST',
    "/restricted-list/:id/customers":'UPATE_CUSTOMERS_IN_RESTRICTED_LIST',
    "/fund/:id/doQuickScan":'POST_QUICK_SCAN',
    "/:id/WCdocumentTypes":'GET_WORLD_CHECK',
    "/:id/screening/identity/screening":'GET_SCREENING_DATA',
    "/fund/:id/identity/:id/screening-history":'GET_SCREENING_HISTORY',
    "/getQueueStatusPulling":'GET_SCREENING_QUEUE_POLLING',
    "/:id/screening/identity/rescreening":'UPDATE_RESCREENING',
    "/:id/screening/detail":'GET_SCREENING_DETAIL',
    "/:id/screening/document/updateStatus":'UPDATE_SCREENING_STATUS',
    "/:id/screening/customer/conclusion":'UPDATE_SCREENING_CONCLUSION',
    "/:id/identityRiskReport":'GET_RISK_REPORT',
    "/:id/OverAllRisk":'GET_OVERALL_RISK_REPORT',
    "/:id/addRiskStatus":'POST_RISK_DATA',
    "/domain/list":'GET_DOMAIN_LIST',
    "/restricted-list":'POST_RESTRICTED_LIST',
    "/:id/previousRiskAssessments":'GET_PREVIOUS_RISK_ASSESSMENTS',
    "/get/entity/notifications":'GET_ENTITY_NOTIFICATIONS',
    "/:id/create-entity":'POST_ENTITY',
    "/:id/getFundWalletAddress":'GET_FUND_WALLET_ADDRESS_LIST',
    "/:id/addAccountsCSV":'POST_TRANSACTION_CSV_DATA',
    "/import-customer-From-V1":'GET_CUSTOMER_FROM_V1',
    "/Wallet/:id/screening":'GET_WALLET_SCREENING',
    "/Wallet/:id/rescreening":'GET_WALLET_RE_SCREENING',
    "/fund/:id/quickScanList":'GET_QUICK_SCAN_LIST',
    "/:id/Account-transactions-count":'GET_TRANSACTION_COUNTS',
    "/:id/fund-transaction":'GET_TRANASACTIONS',
    "/:id/fund-transactions-summary":'GET_TRANASACTIONS_SUMMARY',
    "/:id/fund-transactions-alerts":'GET_TRANASACTIONS_ALERTS',
    "/:id/deleteFundCsvAccounts":'DELETE_CSV_ACCOUNT',
    "/Wallet/:id/screening/history":'GET_SCREENING_HISTORY',
    "/Wallet/:id/downloadWalletReport":'GET_DOWNLOAD_WALLET_REPORT',
    "/:id/getEntityFundConfig":'GET_ENTITY_FUND_CONFIG',
    "/:id/updateOrganizationFundConfig":'UPDATE_FUND_CONFIG',
    "/:id/getIdentityPdfReport":'GET_IDENTITY_PDF_REPORT',
    "/fund/:id/account/:id/application-history":'GET_APPLICATION_DOWNLOAD_HISTORY',
    "/:id/getIdentityPdfReportPolling":'GET_IDENTITY_PDF_REPORT_POLLING',
    "/:id/documents-list":'GET_DOCUMENT_LIST_FOR_CONFIGURATION',
    "/:id/getRiskFactorsList":'GET_RISK_MATRIX',
    "/:id/updateRiskFactor":'UPATE_RISK_MATRIX',
    "/:id/setDefaultRiskMatrix":'UPATE_DEFAULT_RISK_MATRIX',
    "/:id/DjProfile":'GET_DOWJONES_PROFILE',
    "/:id/Identity/RiskTabStatus":'GET_RISK_TAB_STATUS',
    "/:id/document-remove":'DELETE_DOCUMENT_CONFIGURATION',
    "/Account":'DELETE_ACCOUNT',
    "/restricted-list":'DELETE_RESTRICTED_LIST',
    "/Account/:id/IdentityId/:id/getCompilance":'GET_COMPLIANCE_DATA',
    "/:id/document-types":'GET_DOCUMENT_TYPES',
    "/:id/document-add":'POST_DOCUMENT',
    "/Account/:id/IdentityId/:id/saveCompilance":'POST_COMPLIANCE_DATA',
    "/getAccountSubscriptionDocs":'GET_SUBSCSRIPTIONS',
    "/Entity/CustomerList":'GET_CUSTOMER_LIST_FOR_CREATE_CUSTOMER',
    "/:id/reference-Document-Upload-SignedURL":'POST_REFERENCE_OCUMENT',
    "/entity-fund-sync":'GET_FUND_SYNC',
    "/:id/getEntityPermissions":'GET_ENTITY_PERMISSION',
    "/:id/search/identity":'GET_IEDNTITY_SEARCH',
    "/entity/Identity/list":'GET_ENTITY_IDENTITY_LISST',
    "/customers/Identity/create":'POST_IDENITTY_CREATE',
    "/:id/face/AccountShareHolder":'UPDATE_FACE_VERIFICATION_STATUS',
    "/:id/vcip/AccountShareHolder":'UPDATE_VCIP_VERIFICATION_STATUS',
    "/ageing-report":'GET_AGEING_REPORT',
    "/:id/WCRecord":'GET_WORLD_CHECK_DATA',
    "/getCountryList":'GET_COUNTRY_LIST',
    "/updateCountryRiskRatingScore":'UPDATE_COUNTRY_RISK_RATING_SCORE',
    "/getStockTmRulesList":'GET_STOCK_TRANSASCTION_MONITORING_RULES',
    "/:id/fundStatus":'GET_FUND_STATUS_COUNT',
    "/:id/fund-transactions-alerts-report":'GET_TRANASCTIONS_ALERTS_REPORT',
    "/:id/QuickScanRecord":'GET_QUICK_SCAN_RECORD',
    "/consumptionDetails":'GET_CONSUMPTION_DETAIL',
    "/:id/getSignatoryListForFund":'GET_SIGNATORY_LIST',
    "/:id/getTrustyListForFund":'GET_TRUSTY_LIST',
    "/generateAdharSign":'GET_ESIGN_COMPLIANCE',
    "/generateProceedAadharSignUrl":'GET_ESIGN_GENERATE',
    "/:id/updateAccountTransactionStatus":'UPDATE_TRANSASACTION_STATUS',
    "/:id/getAccountTransactionStatusHistory":'GET_TRANSACTION_HISTORY_STATUS',
    "/data-export":'GET_DATA_FOR_FUND_ENTITY_IDENTITY',
    "/:id/identity/:id/customer-info-report":'GET_CUSTOMER_INFO_REPORT',
}