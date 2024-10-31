// import React, { useMemo, useState, useEffect } from "react"
// import {
//   Col,
//   Row,
//   Container,
//   Pagination,
//   Card,
//   OverlayTrigger,
//   ProgressBar,
//   Button,
//   Spinner,
//   Modal,
// } from "react-bootstrap"
// import axios, { CancelTokenSource } from "axios";
// import { Link, useParams } from "react-router-dom";
// import LoadingSpinner from "../../../../components/ui/loader/Spinner";
// import { deleteTransaction } from "../../../../api/network/CustomerApi";

// const DeleteTransactionModal = ({
//   openDeleteModal,
//   handleClose,
//   selectedRow,
//   getTransactionList,
//   handleAlert,
//   getuserDetail,
//   account_id
// }) => {
//   console.log("selectedRow", selectedRow)
//   const [isLoaderModal, setIsLoaderModal] = useState(false)
//   const params = useParams()
//   const cancelTokenSource = axios.CancelToken.source()
//   const handleClickContinue = async () => {
//     setIsLoaderModal(true)
//     const response = await deleteTransaction( account_id ,selectedRow.id  ,cancelTokenSource.token )
//     console.log("response", response)
//     if (response.success == true) {
//       setIsLoaderModal(false)
//       getTransactionList()
//       getuserDetail()
//       handleAlert({
//         variant: "success",
//         message: "Transaction Deleted Successfully",
//         show: true,
//         hideAuto: true,
//       })

//       handleClose()
//     } else {
//       handleClose()
//       handleAlert({
//         variant: "danger",
//         message: "Transaction not Deleted",
//         show: true,
//         hideAuto: true,
//       })

//       setIsLoaderModal(false)
//     }
//   }



//   return (
//     <>
//       <Modal
//         size="md"
//         show={openDeleteModal}
//         onHide={handleClose}
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <div>
//               <h3>Delete Account</h3>
//             </div>
//           </Modal.Title>
//         </Modal.Header>

//         <>
//           {" "}
//           <Modal.Body className="show-grid">
//             <Container>
//               {isLoaderModal ? (
//                 <LoadingSpinner height="10em" custom={true} />
//               ) : (
//                 <Row>
//                   <Col xs={12} md={12}>
//                     <Row>
//                       <Col xs={12} md={12}>
//                         <h3>
//                           To confirm deletion of this{" "}
//                           Transaction, click 'Proceed'. To cancel, click 'Cancel'.
//                         </h3>
//                       </Col>
//                     </Row>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-around",
//                         alignItems: "center",
//                         marginTop: "1em",
//                       }}
//                     >
//                       <div
//                         style={{ display: "flex", justifyContent: "center" }}
//                       >
//                         <Button
//                           onClick={handleClickContinue}
//                           variant="success"
//                           size="lg"
//                         >
//                           Proceed
//                         </Button>
//                       </div>
//                       <div
//                         style={{ display: "flex", justifyContent: "center" }}
//                       >
//                         <Button
//                           onClick={handleClose}
//                           variant="danger"
//                           size="lg"
//                         >
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               )}
//             </Container>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button onClick={handleClose}>Close</Button>
//           </Modal.Footer>
//         </>
//       </Modal>
//     </>
//   )
// }

// export default DeleteTransactionModal

import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../../components/ui/loader/Spinner";
import { deleteTransaction } from "../../../../api/network/CustomerApi";

const DeleteTransactionModal = ({
  openDeleteModal,
  handleClose,
  selectedRow,
  getTransactionList,
  handleAlert,
  getuserDetail,
  account_id,
}) => {
  const [isLoaderModal, setIsLoaderModal] = useState(false);
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();

  const handleClickContinue = async () => {
    setIsLoaderModal(true);
    const response = await deleteTransaction(account_id, selectedRow.id, cancelTokenSource.token);
    if (response.success) {
      setIsLoaderModal(false);
      getTransactionList();
      getuserDetail();
      handleAlert({
        variant: "success",
        message: "Transaction Deleted Successfully",
        show: true,
        hideAuto: true,
      });
      handleClose();
    } else {
      handleClose();
      handleAlert({
        variant: "danger",
        message: "Transaction not Deleted",
        show: true,
        hideAuto: true,
      });
      setIsLoaderModal(false);
    }
  };

  if (!openDeleteModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Delete Account</h3>
          <Button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </Button>
        </div>
        <div className="mb-4">
          {isLoaderModal ? (
            <LoadingSpinner height="10em" custom={true} />
          ) : (
            <p className="text-center text-gray-700">
              To confirm deletion of this transaction, click 'Proceed'. To cancel, click 'Cancel'.
            </p>
          )}
        </div>
        <div className="flex justify-around mt-6">
          <Button
            onClick={handleClickContinue}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Proceed
          </Button>
          <Button
            onClick={handleClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTransactionModal;

