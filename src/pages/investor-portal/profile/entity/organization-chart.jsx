import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Nav,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { Tree, TreeNode } from "react-organizational-chart";
import OrganizationChartNode from "./organization-chart/organization-chart-node";
import OrganizationChartAddNodePopup from "./organization-chart/organization-chart-add-node-popup";
import { BsChevronRight } from "react-icons/bs";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import axios from "axios";
import {
  getCRPsByIdentityIdAPI,
  getCrpRoleMetaAPI,
} from "../../../../api/network/customerApi";
import "./organization-chart.scss";
var nodes = {};
export default function documents() {
  const history = useLocation();

  const params = useParams();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const [graphData, setGraphData] = useState({});
  const [verifyData, setVerifyData] = useState(false);
  const [addRoot, setAddRoot] = useState(false);
  const [showAddCompanyPopup, setShowAddCompanyPopup] = useState(undefined);
  const [refreshPage, setRefreshPage] = useState(false);

  // const [crpRolesMeta, setCrpRolesMeta] = useState([]);
  const [crpList, setCrpList] = useState(null);
  const [crpRolesMeta, setCrpRolesMeta] = useState([]);
  const [renderInit, setRenderInit] = useState(true);
  const [graphZoom, setGraphZoom] = useState(80);
  const [showAddNewCrpButton, setShowAddNewCrpButton] = useState(false);
  useEffect(() => {
    if (params?.identity_id) {
      getCRPData(params?.identity_id);
      getCRPRoleMeta();
    }
  }, []);
  const getCRPData = async (identity_id) => {
    // setIsLoader(true);
    setVerifyData(true);
    const response = await getCRPsByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    // setIsLoader(false);

    if (response.success == true) {
      console.log(response?.data[0], "response?.data");
      setCrpList(response?.data[0]);
      if (response?.data.length == 0) {
        setShowAddNewCrpButton(true);
      }
    } else {
    }
  };
  const getCRPRoleMeta = async () => {
    // setIsLoader(true);
    const response = await getCrpRoleMetaAPI(cancelTokenSource.token);
    // setIsLoader(false);
    if (response.success == true) {
      setCrpRolesMeta(response?.data?.crp_roles_meta);
    } else {
    }
  };
  useEffect(() => {
    console.log("CRPLIST2->", crpList);
    if (crpList && renderInit) {
      console.log(crpList, "crpList useEffect");
      _init(crpList);
      nodes["rootId"] = crpList?.id;
      setRenderInit(false);
    } else {
    }
  }, [crpList]);
  useEffect(() => {
    if (verifyData) {
      setVerifyData(false);
      verifyAllOwnership();
    }
  }, [graphData]);

  function verifyAllOwnership() {
    console.log(graphData.rootId, "graphData.rootId");
    if (graphData.rootId) {
      var isCorrect = true;
      const newNodes = { ...graphData.nodes };
      var nodesToVerify = [graphData.rootId];
      while (nodesToVerify.length > 0) {
        const tempNodeId = nodesToVerify.pop();
        var totalOwnership = 0;
        (newNodes[tempNodeId].children ?? []).forEach((childId) => {
          console.log(newNodes[childId], "newNodes[childId]");
          totalOwnership += parseInt(newNodes[childId].ownership) ?? 0;
          nodesToVerify.push(childId);
        });
        console.log(totalOwnership, "totalOwnership totalOwnership");
        console.log("verifyAllOwnership Node data is ", newNodes[tempNodeId]);
        if (
          newNodes[tempNodeId].attributes?.rootNode &&
          newNodes[tempNodeId].children.length === 0
        ) {
          if (
            newNodes[tempNodeId].entityType !== "Corporate" &&
            newNodes[tempNodeId].ownership !== 100
          ) {
            newNodes[tempNodeId].attributes = {
              ...newNodes[tempNodeId].attributes,
              ownershipError: "low",
              childOwnershipSum: newNodes[tempNodeId].ownership,
            };
            isCorrect = false;
          }
        } else if (
          shouldVerifyPercentage(newNodes[tempNodeId]) &&
          totalOwnership !== 100
        ) {
          newNodes[tempNodeId].attributes = {
            ...newNodes[tempNodeId].attributes,
            ownershipError: totalOwnership < 100 ? "low" : "high",
            childOwnershipSum: totalOwnership,
          };
          isCorrect = false;
        } else {
          const newAttributes = { ...newNodes[tempNodeId].attributes };
          delete newAttributes["ownershipError"];
          newNodes[tempNodeId].attributes = newAttributes;
        }
      }
      setGraphData({ ...graphData, nodes: newNodes });
      return isCorrect;
    }
    return true;
  }
  function shouldVerifyPercentage(node) {
    if (
      node.type === "director" ||
      node.type === "AUTHORISED_PERSONNEL" ||
      node.type === "individual" ||
      node.attributes?.entityType === "trust"
    ) {
      return false;
    }
    return true;
  }
  function _init(crpList) {
    console.log(crpList, "crpList crpList crpList crpList");
    let name = "";
    let f_name = "";
    let m_name = "";
    let l_name = "";
    if (crpList.type == "INDIVIDUAL") {
      if (crpList?.meta?.data) {
        if (crpList?.meta?.data.hasOwnProperty("individual.basic.first_name")) {
          f_name = crpList?.meta?.data["individual.basic.first_name"]?.value
            ? crpList?.meta?.data["individual.basic.first_name"]?.value
            : "";
        }
        if (
          crpList?.meta?.data.hasOwnProperty("individual.basic.middle_name")
        ) {
          m_name = crpList?.meta?.data["individual.basic.middle_name"]?.value
            ? crpList?.meta?.data["individual.basic.middle_name"]?.value
            : "";
        }
        if (crpList?.meta?.data.hasOwnProperty("individual.basic.last_name")) {
          l_name = crpList?.meta?.data["individual.basic.last_name"]?.value
            ? crpList?.meta?.data["individual.basic.last_name"]?.value
            : "";
        }
        name = f_name + " " + m_name + " " + l_name;
        if (crpList?.meta?.data.hasOwnProperty("individual.basic.first_name")) {
          if (
            crpList?.meta?.data["individual.basic.first_name"]?.value ===
              null ||
            crpList?.meta?.data["individual.basic.first_name"]?.value == ""
          ) {
            name = crpList?.label;
          }
        } else {
          name = crpList?.label;
        }
      } else {
        name = crpList?.label;
      }
    }
    if (crpList.type == "CORPORATE") {
      if (crpList?.meta?.data) {
        if (crpList?.meta?.data.hasOwnProperty("corporate.basic.name")) {
          name = crpList?.meta?.data["corporate.basic.name"]?.value
            ? crpList?.meta?.data["corporate.basic.name"]?.value
            : "";
        }
        if (crpList?.meta?.data.hasOwnProperty("corporate.basic.name")) {
          if (
            crpList?.meta?.data["corporate.basic.name"]?.value === null ||
            crpList?.meta?.data["corporate.basic.name"]?.value == ""
          ) {
            name = crpList?.label;
          }
        }
      } else {
        name = crpList?.label;
      }
    }
    let node = crpList;
    nodes[node.id] = {
      id: node.id,
      name: name,
      type: "SHAREHOLDER",
      entityType: node.type === "CORPORATE" ? "Corporate" : "Individual",
      attributes: {
        isRegulated: true,
        entityType: node.type === "CORPORATE" ? "Corporate" : "Individual",
        rootNode: node.parentId === "0",
      },
      ownership:
        node.parentId == 0
          ? "100"
          : node?.meta?.data[node?.type.toLowerCase() + ".basic.ownership"]
              ?.value
          ? node?.meta?.data[node?.type.toLowerCase() + ".basic.ownership"]
              ?.value
          : "0",
      isDocumentUploaded: true,
      children: node.children.map((child) => child.id),
      parentId: node?.parentId,
      roles: crpList?.roles,
    };
    console.log(nodes, "nodes _init");
    // return;
    node.children.forEach(_init);
    const _obj = { nodes: nodes, rootId: crpList?.id };
    setGraphData(_obj);
  }

  function mapCRPToNode(crp) {
    return {
      id: crp.id,
      parentId: crp.parent_id,
      name: crp.name,
      type: !!crp.roles
        ? getCRPEntityTypeByRoleKey(
            crp.roles[0]?.crp_role_meta_id,
            crp.crp_type_key
          )
        : "",
      attributes: {
        isRegulated: crp.is_regulated,
        entityType: crp.entity_type_key ?? "",
        rootNode: !!!crp.parent_id,
      },
      ownership: crp.ownership,
      isDocumentUploaded: crp.is_all_documents_uploaded ?? false,
      children: [],
    };
  }
  function getCRPEntityTypeByRoleKey(id, type) {
    const key = getCRPRoleById(id, type);
    if (type == "INDIVIDUAL") {
      switch (key) {
        case "SHAREHOLDER":
          return "individual";
        case "DIRECTOR":
          return "director";
        case "AUTHORISED_PERSONNEL":
          return "AUTHORISED_PERSONNEL";
        default:
          break;
      }
    } else if (type == "CORPORATE") {
      {
        switch (key) {
          case "SHAREHOLDER":
            return "entity";
          default:
            break;
        }
      }
    }
  }
  function getCRPRoleById(roleId, type) {
    var _role = null;
    crpRolesMeta?.forEach((element) => {
      if (element.id == roleId && type == element.crp_type) {
        _role = element.key;
      }
    });
    return _role;
  }
  function deleteNode(node) {
    console.log("deleteNode", node);
    // deleteCRP(reqParams.companyId, reqParams.fundId, node.id);
  }

  function addIntoNode(node, type) {
    console.log(type, "type");
    console.log("addIntoNode ", node);
    let customerType = type.toLowerCase();
    // return;
    navigate(`/profile/identity/${customerType}/particular/crp/${node?.id}`);
  }
  function editNode(node) {
    console.log("editNode ", node);
    let customerType = node?.entityType.toLowerCase();
    navigate(
      `/profile/identity/${customerType}/particular/crp/${node?.parentId}/${node?.id}`
    );
    setShowAddCompanyPopup({ type: 2, id: node.id });
  }
  function _renderNode(node) {
    return (
      <OrganizationChartNode
        node={node}
        onCrossClicked={() => deleteNode(node)}
        onEditClicked={() => editNode(node)}
        onPlusClicked={addIntoNode}
      />
    );
  }
  function _renderTree(children) {
    return (children || []).map((nodeId) => {
      if (nodeId) {
        try {
          return (
            <TreeNode key={nodeId} label={_renderNode(graphData.nodes[nodeId])}>
              {_renderTree(graphData.nodes[nodeId].children)}
            </TreeNode>
          );
        } catch (e) {
          console.log("exxxxxx", nodeId, children);
        }
      }
    });
  }

  const onAddUpdateOrganization = async (
    graphNodes,
    popupType,
    nodeId,
    data
  ) => {
    setShowAddCompanyPopup(undefined);
    console.log("onAddUpdateOrganization called ", popupType, data, nodeId);
    if (popupType === 1) {
      const _crp = await addUpdateCRP(nodeId, data);
      const newNodes = { ...graphNodes };

      console.log("add crp response =>", _crp);
      setRefreshPage(true);
    } else if (popupType === 2) {
      const nodeToUpdate = graphData.nodes[nodeId];
      if (nodeToUpdate?.parentId) {
        const _crp = await addUpdateCRP(nodeToUpdate?.parentId, data, nodeId);
        setRefreshPage(true);
      }
    }
  };

  function _renderAddUpdatePopup() {
    if (
      !addRoot &&
      showAddCompanyPopup &&
      graphData.nodes[showAddCompanyPopup.id]
    ) {
      console.log("_renderAddUpdatePopup ", showAddCompanyPopup.type);
      return (
        <div className={"addCompanyContainer"}>
          <div className={"addCompanyContainerBg"} />
          {showAddCompanyPopup && (
            <OrganizationChartAddNodePopup
              popupType={showAddCompanyPopup.type}
              nodeData={
                showAddCompanyPopup.type === 1
                  ? { id: showAddCompanyPopup.id }
                  : graphData.nodes[showAddCompanyPopup.id]
              }
              onExit={onExitAddPopup}
              onAddUpdateOrganization={(popupType) => {
                onAddUpdateOrganization(
                  graphData.nodes,
                  popupType,
                  nodeId,
                  data
                );
              }}
            />
          )}
        </div>
      );
    }
  }
  function onExitAddPopup() {
    setShowAddCompanyPopup(undefined);
  }

  const zoomStep = 10;
  function zoomInCallback() {
    if (graphZoom < 120) {
      setGraphZoom(graphZoom + zoomStep);
    }
  }

  function zoomIOutCallback() {
    if (graphZoom > 40) {
      setGraphZoom(graphZoom - zoomStep);
    }
  }
  const handleAddNewCrp = (type) => {
    navigate(`/profile/identity/${type}/particular/crp/${params?.identity_id}`);
  };
  const handleNextStep = () => {
    const isCrp = history?.state?.isCrp;

    let state = {};

    let nextStepRoute;

    if (isCrp) {
      nextStepRoute = `/profile/identity/${params?.type}/documents/${params?.identity_id}/${params?.account_id}`;
      state = { isCrp: true };
    } else {
      nextStepRoute = `/profile/identity/${params?.type}/documents/${params?.identity_id}/${params?.account_id}`;
      state = { isCrp: false };
    }

    navigate(nextStepRoute, { state: state });
  };
  return (
    <div className="main-content">
      <Container fluid>
        {params?.identity_id && params?.account_id && (
          <Col
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "1em",
            }}
            xs={12}
            lg={11}
            xl={11}
          >
            <Button onClick={handleNextStep}>
              Next <BsChevronRight />
            </Button>
          </Col>
        )}
        <div className="organizationChartParent">
          <Row className="justify-content-center">
            {console.log(graphData, "graphData graphData graphDatarender")}
            <Col xs={12} lg={10} xl={10}>
              {!showAddNewCrpButton ? (
                <div className="organizationChartTreeContainerAbove">
                  {!graphData.rootId ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "20rem",
                      }}
                    >
                      <Spinner animation="grow" />
                    </div>
                  ) : (
                    <>
                      {graphData.rootId && (
                        <div
                          className="organizationChartContainer"
                          style={{ zoom: `${graphZoom}%` }}
                        >
                          {console.log(
                            graphData,
                            ":::::::",
                            graphData.rootId,
                            ":::::::",
                            "graphData graphData graphData"
                          )}
                          <Tree
                            lineWidth={"1px"}
                            lineColor={"#009dff"}
                            nodePadding={"5px"}
                            lineBorderRadius={"1px"}
                            label={_renderNode(
                              graphData.nodes[graphData.rootId]
                            )}
                          >
                            {_renderTree(
                              graphData.nodes[graphData.rootId].children
                            )}
                          </Tree>
                        </div>
                      )}
                      {_renderAddUpdatePopup()}
                      <div className={"zoomBox"}>
                        <FeatherIcon
                          icon="zoom-out"
                          size="2em"
                          onClick={zoomIOutCallback}
                        />
                        <FeatherIcon
                          icon="zoom-in"
                          size="2em"
                          onClick={zoomInCallback}
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="addNewCrpContainer">
                  <Col xs="auto">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="span"
                        className="dropdown-ellipses"
                        role="button"
                      >
                        <Button className="lift">Add New CRP</Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="javascript:void(0);"
                          onClick={() => {
                            handleAddNewCrp("individual");
                          }}
                        >
                          Individual
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="javascript:void(0);"
                          onClick={() => {
                            handleAddNewCrp("corporate");
                          }}
                        >
                          Corporate
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
