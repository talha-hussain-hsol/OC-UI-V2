import FeatherIcon from "feather-icons-react";
import React from "react";
export default function FundBox({ fundData, isStepForm }) {
  console.log("fundData", fundData);

  return (
    <div className="main-content">
      <>
        <div className="row">
          <div className="col-sm-12">
            {fundData && (
              <div className="card">
                <div className="card-body text-center ">
                  <a
                    href={fundData?.logoBucketKey}
                    className=" avatar avatar-lg mx-auto display-flex-center"
                  >
                    <img
                      style={{ height: "70px" }}
                      src={
                        fundData?.logoBucketKey
                          ? fundData?.logoBucketKey
                          : fundData?.fund_logo_url
                      }
                    />
                    {/* <img style={{ height: "70px" }} src={"https://storage.googleapis.com/ascentfs-media-staging2-public/funds/7/logo.png"} /> */}
                  </a>

                  <h2 className="mb-3">{fundData?.name}</h2>

                  <p className="card-text text-muted">
                    {fundData?.description}
                  </p>
                </div>
                {fundData?.fund_setting?.display?.fund_info === true ||
                  (fundData?.fund_setting?.display?.fund_info == "true" && (
                    <div className="card-footer card-footer-boxed">
                      <div className="row align-items-center">
                        <div className="col">
                          <small>
                            {/* <FeatherIcon className={`text-success`} icon="clock" color="green" size="15" /> Dealing Cycle: Open */}
                            <FeatherIcon
                              className={`text-success`}
                              icon="clock"
                              color="green"
                              size="15"
                            />
                            Dealing Cycle:{" "}
                            {fundData?.fund_setting?.dealing?.type?.end
                              ? fundData?.fund_setting?.dealing?.type?.end
                              : fundData?.fund_setting?.dealing?.type?.end}
                            {/* every {fundData?.fund_setting?.dealing?.period ? fundData?.fund_setting?.dealing?.period : fundData?.meta?.config?.settings?.dealing?.period} */}
                          </small>
                        </div>
                        {/* <div className="col-auto">
                      <small>
                        KYC status:
                        <span
                          class={
                            fundData?.fund_setting?.kyb?.status === "accepted"
                              ? "text-success"
                              : fundData?.fund_setting?.kyb?.status === "pending"
                              ? "text-warning"
                              : fundData?.fund_setting?.kyb?.status === "rejected"
                              ? "text-danger"
                              : fundData?.fund_setting?.kyb?.status === "draft"
                              ? "text-info"
                              : ""
                          }
                        >
                          {" "}
                          {fundData?.fund_setting?.kyb?.status ? fundData?.fund_setting?.kyb?.status : fundData?.meta?.config?.kyb?.status}
                        </span>{" "}
                      </small>{" "}
                      <span
                        class={
                          fundData?.fund_setting?.kyb?.status === "accepted"
                            ? "text-success"
                            : fundData?.fund_setting?.kyb?.status === "pending"
                            ? "text-warning"
                            : fundData?.fund_setting?.kyb?.status === "rejected"
                            ? "text-danger"
                            : fundData?.fund_setting?.kyb?.status === "draft"
                            ? "text-info"
                            : ""
                        }
                      >
                        {" "}
                        <FeatherIcon icon="check-circle" size="15" />
                      </span>
                    </div> */}
                        <div className="col-auto">
                          <small className="text-muted">
                            <span class="text-success">
                              <FeatherIcon
                                className={`text-success`}
                                icon="check-circle"
                                color="green"
                                size="15"
                              />
                            </span>{" "}
                            Digital Fund:
                            {fundData?.fund_setting?.account?.applicant?.asset
                              ?.digital?.status
                              ? fundData?.fund_setting?.account?.applicant
                                  ?.asset?.digital?.status
                                ? "Active"
                                : "Not Active"
                              : fundData?.meta?.config?.settings?.account
                                  ?.applicant?.asset?.digital?.status
                              ? "Active"
                              : "Not Active"}
                          </small>
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col">
                          <small>
                            <span class="text-success">
                              <FeatherIcon
                                className={`text-success`}
                                icon="check-circle"
                                color="green"
                                size="15"
                              />
                            </span>{" "}
                            Fund's KYC:{" "}
                            {fundData?.fund_setting?.kyb?.status
                              ? fundData?.fund_setting?.kyb?.status
                              : fundData?.meta?.config?.kyb?.status}
                          </small>
                        </div>
                        <div className="col-auto">
                          <small className="text-muted">
                            <span class="text-success">
                              <FeatherIcon
                                className={`text-success`}
                                icon="check-circle"
                                color="green"
                                size="15"
                              />
                            </span>{" "}
                            Fund Domicile:
                            {fundData?.fund_setting?.region
                              ? fundData?.fund_setting?.region
                              : fundData?.meta?.config?.settings?.region}
                          </small>
                          {/* <small>
                        Dealing Date{" "}
                        {fundData?.fund_setting?.dealing?.date?.opening || fundData?.meta?.config?.settings?.dealing?.date?.opening || fundData?.fund_setting?.dealing?.date?.closing || fundData?.meta?.config?.settings?.dealing?.date?.closing
                          ? ` (opening : ${fundData?.fund_setting?.dealing?.date?.opening ? fundData?.fund_setting?.dealing?.date?.opening : fundData?.meta?.config?.settings?.dealing?.date?.opening} , closing : ${
                              fundData?.fund_setting?.dealing?.date?.closing ? fundData?.fund_setting?.dealing?.date?.closing : fundData?.meta?.config?.settings?.dealing?.date?.closing
                            } ) `
                          : null}
                      </small> */}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
