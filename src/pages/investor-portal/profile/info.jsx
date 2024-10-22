import { Button, Col, Container, Form, Row, Nav } from "react-bootstrap";
import { ProfileHeader } from "../../../widgets";
import React from "react";
import { Avatar } from "../../../components";
import { Flatpickr } from "../../../components/vendor";

export default function info() {
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={8}>
            <ProfileHeader />
            <form>
              <Row className="justify-content-between align-items-center">
                <Col>
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <Avatar>
                        <Avatar.Image
                          src="/img/avatars/profiles/avatar-1.jpg"
                          alt="Dianna Smiley"
                          className="rounded-circle"
                        />
                      </Avatar>
                    </Col>
                    <Col className="ms-n2">
                      <h4 className="mb-1">Your avatar</h4>
                      <small className="text-muted">
                        PNG or JPG no bigger than 1000px wide and tall.
                      </small>
                    </Col>
                  </Row>
                </Col>
                <Col xs="auto">
                  <Button size="sm">Upload</Button>
                </Col>
              </Row>
              <hr className="my-5" />
              <Row>
                <Col xs={12} md={6}>
                  <div className="form-group">
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-group">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="form-group">
                    <Form.Label className="mb-1">Email address</Form.Label>
                    <Form.Text className="small text-muted">
                      This contact will be shown to others publicly, so choose
                      it carefully.
                    </Form.Text>
                    <Form.Control type="email" />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-group">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      // as={NumberFormat}
                      format="(###)###-####"
                      mask="_"
                      placeholder="(___)___-____"
                      type="text"
                    />
                  </div>
                </Col>
                <Col xs={12} md={6} className="col-12 col-md-6">
                  <div className="form-group">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control as={Flatpickr} type="text" />
                  </div>
                </Col>
              </Row>

              <Button onClick="Record Success">Save changes</Button>

              {/* <hr className="my-5" />
              <Row>
                <Col xs={12} md={6}>
                  <div className="form-group">
                    <Form.Label className="mb-1">Public profile</Form.Label>
                    <Form.Text className="small text-muted">
                      Making your profile public means that anyone on the Dashkit network will be able to find you.
                    </Form.Text>
                    <Row>
                      <Col xs="auto">
                        <Form.Switch />
                      </Col>
                      <Col className="ms-n2">
                        <small className="text-muted">You're currently invisible</small>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-group">
                    <Form.Label className="mb-1">Allow for additional Bookings</Form.Label>
                    <Form.Text className="small text-muted">
                      If you are available for hire outside of the current situation, you can encourage others to hire
                      you.
                    </Form.Text>
                    <Row>
                      <Col xs="auto">
                        <Form.Switch defaultChecked />
                      </Col>
                      <Col className="ms-n2">
                        <small className="text-muted">You're currently available</small>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <hr className="mt-4 mb-5" />
              <Row className="justify-content-between">
                <Col xs={12} md={6} className="col-12 col-md-6">
                  <h4>Delete your account</h4>
                  <p className="small text-muted mb-md-0">
                    Please note, deleting your account is a permanent action and will no be recoverable once completed.
                  </p>
                </Col>
                <Col xs="auto">
                  <Button variant="danger">Delete</Button>
                </Col>
              </Row> */}
            </form>
            <br />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
