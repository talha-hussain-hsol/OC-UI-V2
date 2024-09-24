import { useCallback, useEffect, useState } from "react";
import { getEntities, getEntityPermission } from "../api/userApi";
import { toast } from "react-toastify";
import axios from "axios";
import { setLocalStorage } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import useEntityStore from "../../src/store/useEntityStore"; // Import Zustand store

const portals = [
  { label: "Customer Portal", type: "customer" },
  { label: "Compliance Portal", type: "compliance" },
  { label: "Manager Portal", type: "management" },
];

const useSpashHook = () => {
  const navigate = useNavigate();
  const [entites, setEntites] = useState([]);
  const [activePortal, setActivePortal] = useState(portals[0].type);
  const [isLoader, setIsLoader] = useState(false);

  const [selectedEntity, setSelectedEntity] = useState(null); // For tracking the selected entity

  const cancelTokenSource = axios.CancelToken.source();

  // Get the Zustand store functions
  const { setEntityId, setEntityList } = useEntityStore();

  const handleEntitiesAPI = useCallback(async () => {
    const listOfEntites = await getEntities();
    if (listOfEntites.error || listOfEntites.response.error) {
      toast.error(
        listOfEntites.error.message ||
          listOfEntites.response.message ||
          "Something went wrong!"
      );
    } else {
      const entityRows = listOfEntites?.response?.data?.rows || [];
      setEntites(entityRows);

      // Update Zustand store with entity list
      setEntityList(entityRows);

      // If a user has previously selected an entity, set that entityId
      const savedEntity = JSON.parse(localStorage.getItem("selected_entity"));
      if (savedEntity) {
        console.log(savedEntity, "saved entity");
        setSelectedEntity(savedEntity);
        setEntityId(savedEntity.entityId); // Set the previously selected entityId in Zustand
      } else if (entityRows.length > 0) {
        // Default to the first entity if no previous selection is found
        setSelectedEntity(entityRows[0]);
        setEntityId(entityRows[0]?.entityId || "");
      }
    }
  }, [setEntityId, setEntityList]);

  //     if (entityRows.length > 0) {
  //       setEntityId(entityRows[0]?.entityId || ""); // Set the first entityId in Zustand
  //       setEntityList(entityRows); // Set the full entity list in Zustand
  //       console.log("Entity ID mein yeh hai: ", entityRows[0].entityId);
  //     }
  //   }
  // }, [setEntityId, setEntityList]);

  useEffect(() => {
    handleEntitiesAPI();
  }, [handleEntitiesAPI]);

  const handleActivePortal = useCallback((portalType) => {
    setActivePortal(portalType);
  }, []);

  const handlePermission = async (data) => {
    // return
    setIsLoader(true);
    const permission = await getEntityPermission(
      data?.id || data?.entityId,
      cancelTokenSource.token
    );

    if (permission.error || permission?.response?.error) {
      toast.error(
        permission.error.message ||
          permission.response.message ||
          "You do not have a permission"
      );
    } else {
      const permissionList = permission?.response;
      if (!(permissionList?.data || []).length) {
        toast.error("You do not have a permission");
      } else {
        debugger;
        setLocalStorage("entity_permissions", permissionList?.data);
        setLocalStorage("selected_entity", data);
        setLocalStorage("entityid", data?.entityId);
        if (data?.type === "compliance") {
          navigate("/compliance", { replace: true });
        } else if (data?.type === "customer") {
          debugger;
          navigate("/customer", { replace: true });
        } else {
          navigate("/managment", { replace: true });
        }
      }
    }
  };

  return {
    entites,
    activePortal,
    portals,
    handleActivePortal,
    handlePermission,
    isLoader,
  };
};

export default useSpashHook;
