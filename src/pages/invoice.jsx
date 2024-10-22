import { Badge, Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { Header } from '../components';

export default function Invoice() {
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <Header className="mt-md-5">
              <Header.Body>
                <Row className="align-items-center">
                  <Col>
                    <Header.Pretitle>Payments</Header.Pretitle>
                    <Header.Title>Invoice #SDF9823KD</Header.Title>
                  </Col>
                  <Col xs="auto">
                    <Button variant="white" className="lift">
                      Download
                    </Button>
                    <Button className="lift ms-2">Pay</Button>
                  </Col>
                </Row>
              </Header.Body>
            </Header>
            <Card>
              <Card.Body className="p-5">
                <Row>
                  <Col className="text-end">
                    <Badge bg="danger">Overdue</Badge>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <img className="img-fluid mb-4" src="/img/logo.png" alt="..." style={{ maxWidth: 40 }} />
                    <h2 className="mb-2">Invoice from Dashkit</h2>
                    <p className="text-muted mb-6">Invoice #SDF9823KD</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <h6 className="text-uppercase text-muted">Invoiced from</h6>
                    <p className="text-muted mb-4">
                      <strong className="text-body">Kenny Blankenship</strong> <br />
                      CEO of Good Themes <br />
                      123 Happy Walk Way <br />
                      San Francisco, CA
                    </p>
                    <h6 className="text-uppercase text-muted">Invoiced ID</h6>
                    <p className="mb-4">#SDF9823KD</p>
                  </Col>
                  <Col xs={12} md={6} className="text-md-end">
                    <h6 className="text-uppercase text-muted">Invoiced to</h6>
                    <p className="text-muted mb-4">
                      <strong className="text-body">Jimmy LeBuyer</strong> <br />
                      Acquisitions at Themers <br />
                      236 Main St., #201 <br />
                      Los Angeles, CA
                    </p>
                    <h6 className="text-uppercase text-muted">Due date</h6>
                    <p className="mb-4">
                      <time dateTime="2018-04-23">Apr 23, 2018</time>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Table className="my-4" responsive>
                      <thead>
                        <tr>
                          <th className="px-0 bg-transparent border-top-0">
                            <span className="h6">Description</span>
                          </th>
                          <th className="px-0 bg-transparent border-top-0">
                            <span className="h6">Hours</span>
                          </th>
                          <th className="px-0 bg-transparent border-top-0 text-end">
                            <span className="h6">Cost</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-0">Custom theme development</td>
                          <td className="px-0">125</td>
                          <td className="px-0 text-end">$6,250</td>
                        </tr>
                        <tr>
                          <td className="px-0">Logo design</td>
                          <td className="px-0">15</td>
                          <td className="px-0 text-end">$750</td>
                        </tr>
                        <tr>
                          <td className="px-0 border-top border-top-2">
                            <strong>Total amount due</strong>
                          </td>
                          <td colSpan="2" className="px-0 text-end border-top border-top-2">
                            <span className="h3">$7,000</span>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <hr className="my-5" />
                    <h6 className="text-uppercase">Notes</h6>
                    <p className="text-muted mb-0">
                      We really appreciate your business and if there’s anything else we can do, please let us know!
                      Also, should you need us to add VAT or anything else to this order, it’s super easy since this is
                      a template, so just ask!
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
