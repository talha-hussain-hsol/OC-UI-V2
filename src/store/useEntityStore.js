// import { create } from "zustand";

// const useEntityStore = create((set) => ({
//   entityId: "",
//   setEntityId: (id) => set(() => ({ entityId: id })),
//   entityList: [],
//   setEntityList: (data) => set(() => ({ entityList: data })),
//   singleAccount: {},
//   setSingleAccount: (data) => set(() => ({ singleAccount: data })),
//   loading: false,
//   error: null,
// }));

// export default useEntityStore;



//Best Code
// import { create } from "zustand";

// const useEntityStore = create(
//   (set) => ({
//     entityId: "",
//     setEntityId: (id) => set(() => ({ entityId: id })),
    
//     entityList: [],
//     setEntityList: (data) => set(() => ({ entityList: data })),

//     singleAccount: {},
//     setSingleAccount: (data) => set(() => ({ singleAccount: data })),

//     loading: false,
//     error: null,

//     // Add baseURL state with initial value "CAPI"
//     baseURL: "CAPI",

//     // Function to set baseURL dynamically
//     setBaseURL: (url) => set(() => ({ baseURL: url })),
//   })
// );

// export default useEntityStore;


import { create } from "zustand";

const useEntityStore = create(
  (set) => ({
    // Initialize the entityId from localStorage, or fallback to an empty string
    entityId: localStorage.getItem("entityId") || "",
    
    // Function to set entityId and save it to localStorage
    setEntityId: (id) => {
      set(() => ({ entityId: id }));
      localStorage.setItem("entityId", id); // Save entityId to localStorage
    },
    
    entityList: [],
    setEntityList: (data) => set(() => ({ entityList: data })),

    singleAccount: {},
    setSingleAccount: (data) => set(() => ({ singleAccount: data })),

    loading: false,
    error: null,
  })
);

export default useEntityStore;

