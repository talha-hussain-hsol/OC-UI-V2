import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/themeContext';

function TermsCondition({ show, onHide, handleClickADeclinedCustomize, handleClickAgreeCustomize }) {
    const {theme} = useTheme()

    // Disable scrolling on the body when the modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';  // Disable background scrolling
        } else {
            document.body.style.overflow = '';        // Enable scrolling again
        }

        // Cleanup on component unmount
        return () => {
            document.body.style.overflow = '';        // Ensure scrolling is enabled after modal closes
        };
    }, [show]);

    return (
      <>
        {show && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto`}>
            <div className={`bg-color-modal-${theme} mt-80 mb-6 rounded-lg shadow-lg max-w-screen-sm w-full mx-auto `}>
              <div className={`border-b border-[#1c3859] p-6 top-0 bg-color-modal-${theme}`}>
                <div className="">
                  <h1 className="text-2xl font-light">Disclaimer Notice</h1>
                </div>
              </div>
              <div className="p-6 space-y-5 text-sm font-light">
                <p>
                  Please review the following Disclaimer and click "I Accept" to continue.
                </p>
                <p className='leading-5'>
                  First Degree Global Asset Management Pte Ltd (
                  <strong className='font-bold'>First Degree</strong>) is regulated as a Capital Markets Services License-holder for Fund Management (LFMC) by the Monetary Authority of Singapore ("MAS). The material on this website is provided for your general information only and does not constitute the giving of investment advice or an offer to sell or the solicitation of an offer to buy any investment(s) managed or advised on by First Degree.
                </p>
                <p className='leading-5'>
                  By clicking "I accept", this means you accept the following terms and conditions of use of this website:
                </p>
                <ol className="list-decimal pl-10 leading-5">
                  <li className='leading-5'>
                    You agree that you <strong>are an</strong>{" "}
                    <a
                      target="_blank"
                      href="https://storage.googleapis.com/one-constellation-bucket-public/first_degree/terms_and_conditions.pdf"
                      className="text-[#2a75da] leading-5"
                      rel="noopener noreferrer"
                    >
                      Accredited Investor or Institutional Investor as defined under section 4A of the Securities and Futures Act (Cap. 289) of Singapore
                    </a>
                    , and that you are aware of the reduced protections being accorded to you by being treated as an Accredited or Institutional Investor
                  </li>
                  <li className='leading-6'>
                    No person receiving a copy of the offering documents including any application forms and subscription agreements used herein to subscribe for Participating Shares (the "Subscription Form") in any jurisdiction may treat the same as constituting an invitation to him or her, unless in the relevant jurisdiction such an invitation could lawfully be made to him without compliance with any registration or other legal requirements or where such requirements have been complied with.
                  </li>
                  <li className='leading-6'>
                    First Degree makes no representations or warranties whatsoever about any of the content of this website or about content of any other website which you may access by hypertext link through this website. When you access any other website by means of a link from this website, you should understand that your access to that other website is independent of First Degree and First Degree has no control over the content of the website, nor does First Degree in any way endorse or approve the content of that website.
                  </li>
                  <li className='leading-6'>
                    You agree with our{" "}
                    <a
                      target="_blank"
                      href="https://storage.googleapis.com/one-constellation-bucket-public/first_degree/privacy_policy.pdf"
                      className="text-[#2a75da] leading-5"
                      rel="noopener noreferrer"
                    >
                      data protection policy.
                    </a>
                  </li>
                </ol>
                <p className='leading-6'>
                  If you are in any doubt about the information contained on this website please contact us or consult your professional{" "}
                  <strong className='font-bold'>financial adviser, lawyer or accountant</strong>.
                </p>
                <div className="flex justify-between">
                  <button
                    className="bg-[#e63757] text-white px-5 py-3 rounded hover:bg-[#c4304a]"
                    onClick={handleClickADeclinedCustomize}
                  >
                    I Decline
                  </button>
                  <button
                    className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600"
                    onClick={handleClickAgreeCustomize}
                  >
                    I Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
}

export default TermsCondition;
