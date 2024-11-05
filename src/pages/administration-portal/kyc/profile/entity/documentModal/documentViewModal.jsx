import React from "react";
import { Button, Spinner, Modal, Container } from "react-bootstrap";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { zoomPlugin } from '@react-pdf-viewer/zoom';
// import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

// Set up the worker script
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
// Set up the worker script
if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
} else {
  console.error("GlobalWorkerOptions is not defined");
}

export default function DocumentViewModal({
  isLoader,
  onHide,
  contentType,
  url,
  show,
}) {
  const zoomPluginInstance = zoomPlugin();

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            <h3>Document</h3>
          </div>
        </Modal.Title>
      </Modal.Header>
      {isLoader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          <Spinner animation="grow" variant="primary" />
        </div>
      ) : (
        <>
        <Modal.Body className="show-grid">
          <Container>
            {contentType.includes("pdf") && url ? (
              <Worker workerUrl={pdfjsLib.GlobalWorkerOptions.workerSrc}>
                <div style={{ height: 700 }}>
                  <Viewer
                    fileUrl={url}
                    plugins={[zoomPluginInstance]}
                  />
                </div>
              </Worker>
            ) : (
              <img
                style={{ width: "100%", height: "100%" }}
                src={url}
                alt=""
              />
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
