import React, { useState, useEffect } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [alertDanger, setAlertDanger] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPassword, setErrPassword] = useState(false);
  const [signedInDisabled, setsignedInDisabled] = useState(true);

  useEffect(() => {
    handleDisableSignedInButton();
  }, [email, password]);
  useEffect(() => {
    deleteAllCookies();
    localStorage.clear();
    delete axios.defaults.headers["x-auth-token"];
  }, []);

  const handleDisableSignedInButton = () => {
    console.log(`${email.length} and pass len: ${password.length}`);
    if (email.length > 4 && password.length > 0) {
      setsignedInDisabled(false);
    } else {
      setsignedInDisabled(true);
    }
  };

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");
    const url = new URL(window.location.href);
    const domain = url.hostname.split(".").slice(-2).join(".");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name +
        `=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain};`;
    }
  }
  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }
  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  //validate email with regex and comment each line

  function errorHandling() {
    let errorEmail = false;
    let errorPassword = false;

    let regEmail =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    if (!regEmail.test(email)) {
      console.log("testing");
      setErrEmail(true);
      errorEmail = false;
    } else {
      console.log("testing else");
      setErrEmail(false);
      errorEmail = true;
    }
    if (!(password.length > 1)) {
      setErrPassword(true);
      errorPassword = false;
    } else {
      setErrPassword(false);
      errorPassword = true;
    }

    return errorPassword && errorEmail;
  }
  function generateRandomString() {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 40; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleSignIn = async () => {
    let state = generateRandomString();
    let url = `${process.env.AUTH_API_URL}/oauth/authorize?client_id=${process.env.INVESTOR_CLIENT_ID}&redirect_uri=${process.env.INVESTOR_REDIRECT_URL}&scope=*&staet=${state}&response_type=${process.env.INVESTOR_RESPONSE_TYPE}`;
    window.location.href = url;
    // window.open(url, "_blank");
    // console.log(`this is errEmail ${errEmail} err pass ${errPassword} and fun ${errorHandling()}`);
    // if (errorHandling()) {
    //   setIsLoader(true);

    //   console.log("object 0");
    //   const response = await loginCustomer(email, password, cancelTokenSource.token);
    //   console.log("object 1", response);
    //   if (response.success == true) {
    //     setIsLoader(false);
    //     setAlertSuccess(true);
    //     console.log("object 2");
    //     navigate("/profile/identities");
    //   } else {
    //     setIsLoader(false);
    //     setAlertDanger(true);
    //   }
    // }
  };

  return (
    <>
      {/* <h1 className="display-4 text-center mb-3">Sign in</h1> */}
      {/* <p className="text-muted text-center mb-5">Free access to our dashboard.</p> */}
      <form>
        {/* <div className="form-group">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter Email" onChange={(e) => handleChangeEmail(e)} />
          <Form.Text className="text-danger">{errEmail ? "Please enter a valid email address." : null}</Form.Text>
        </div> */}
        {/* <div className="form-group">
          <Row>
            <Col>
              <Form.Label>Password</Form.Label>
            </Col>
            <Col xs="auto">
              <Link to="/password-reset" passHref>
                <Form.Text as="a" className="small text-muted">
                  Forgot password?
                </Form.Text>
              </Link>
            </Col>
          </Row>
          <InputGroup className="input-group-merge">
            <Form.Control type="password" placeholder="Enter Password" onChange={(e) => handleChangePassword(e)} />

            <InputGroup.Text>
              <FeatherIcon icon="eye" size="1em" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Text className="text-danger">{errPassword ? "Please enter a valid password." : null}</Form.Text>
        </div> */}
        <Button
          size="lg"
          className="w-100 mb-3"
          // disabled={signedInDisabled}
          onClick={() => {
            handleSignIn();
          }}
        >
          {isLoader ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Sign in"
          )}
        </Button>
        {/* <p className="text-center">
          <small className="text-muted text-center">
            Don't have an account yet?{" "}
            <Link to="/sign-up">
              <a>Sign up</a>
            </Link>
            .
          </small>
        </p> */}
      </form>
      {alertDanger ? (
        <Alert
          closeLabel
          dismissible={true}
          onClose={() => setAlertDanger(false)}
          key="danger"
          variant="danger"
        >
          Invalid Credentials
        </Alert>
      ) : null}
      {alertSuccess ? (
        <Alert
          closeLabel
          dismissible={true}
          onClose={() => setAlertSuccess(false)}
          key="success"
          variant="success"
        >
          Logged In Successfully
        </Alert>
      ) : null}
    </>
  );
}
