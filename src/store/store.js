import {configureStore} from "@reduxjs/toolkit";
import permissionSlice from './slices/permissionSlice';
import fundConfigSlice from './slices/FundConfigSlice';
import accountDetailSlice from "./slices/accountDetailSlice";
import identityDetailSlice from "./slices/identityDetailSlice";
import customerAccountSlice from './slices/customerAccountSlice';
// import {addTheme} from './slices/themeSlice';

const store = configureStore({
    reducer:{
        permissions: permissionSlice,
        fundConfig: fundConfigSlice,
        accountDetail: accountDetailSlice,
        identityDetail: identityDetailSlice,

        customerAccount: customerAccountSlice,
    }
})

export default store;