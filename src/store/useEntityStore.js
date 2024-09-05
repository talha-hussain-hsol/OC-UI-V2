import { create } from "zustand";

const useEntityStore = create((set) => ({
  entityId: "",
  setEntityId: (id) => set(() => ({ entityId: id })),
  entityList: [],
  setEntityList: (data) => set(() => ({ entityList: data })),
  singleAccount: {},
  setSingleAccount: (data) => set(() => ({ singleAccount: data })),
  loading: false,
  error: null,
}));

export default useEntityStore;
