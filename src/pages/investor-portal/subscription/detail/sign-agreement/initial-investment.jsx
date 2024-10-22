import { Col, Container, Row, Nav } from 'react-bootstrap';
import React from 'react';
import InitialInvestment from './initial-investment';

export default function index() {
    function headerButtonCallBack() {

    }
    return (
        <>
            <div class="card">
                <div class="card-header">
                    <h4 class="card-header-title">
                        Initial Investment
                    </h4>
                </div>
                <div class="card-body">
                    <div class="form-floating form-group">
                        <input type="email" class="form-control" id="floatingInput" placeholder="Enter Additoional Ammount" />
                        <label for="floatingInput">Initial Investment Amount</label>
                    </div>
                    <a class="btn btn-info" href="https://storage.googleapis.com/ascentfs-media-dev/customer_fund_documents/customerUser_995/fund_191/documentType_SUBSCRIPTION_AGREEMENT_%25E6nKouIbVPNZ3M%24yPL8?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=app-access%40fund-leads-dev.iam.gserviceaccount.com%2F20220926%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20220926T044939Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=4eb9c78abb021e8452438581a6f88ae809547666d672729439590aae3f5f2ccc1e48902f1e6c3a91b39a0cf49b42e830f2d62d6b35aa33fc2da1f871983d9d04a86c4662d37493e1a1d5b2052dbf9452428796645c70cfe93a180e3ec9ac640792c708b9abdb6c45b1a59c3109ea7ec4d5057f3d0ae701f8bc43d1c56243810ed0ab5e1b015cacebe7a985bb495ebfeedf4fb8ac5c8c7600380c70d243ccf91a5178bb3f0e4771c37b5173fe420fa3c529c9e73a5546c446d8313f77f11b6bfc97e3667c9fb1656218eb8170aedff7bde9f556e86cbc21a0a8e30be54be2055442e2779008152bf5d8765c7ea6e1f22c69657dea835d945360cf54191e4b33a4">Submit & Sign</a>
                </div>
            </div>
        </>
    );
}
