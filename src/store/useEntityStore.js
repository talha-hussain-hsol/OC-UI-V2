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


// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const useEntityStore = create(
//   persist(
//     (set) => ({
//       entityId: "",
//       setEntityId: (id) => set(() => ({ entityId: id })),
//       entityList: [],
//       setEntityList: (data) => set(() => ({ entityList: data })),
//       singleAccount: {},
//       setSingleAccount: (data) => set(() => ({ singleAccount: data })),
//       loading: false,
//       error: null,
//     }),
//     {
//       name: 'entity-store', 
//       partialize: (state) => ({ entityId: state.entityId }) 
//     }
//   )
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