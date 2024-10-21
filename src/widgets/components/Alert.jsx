import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

function CustomAlert(props) {
  const { variant, message, onClose, hideAuto, handleCloseAlert } = props;
  console.log('(//pppppppppppppppppppppppppppppppppppppppp',props)
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (hideAuto) {
      const timer = setTimeout(() => {
        setShow(false);
        handleCloseAlert();
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [hideAuto]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  return (
    <Alert className={!(props?.top) ?`list-alert alert-dismissible border`:` alert-dismissible border fixed-top`} variant={variant} onClose={handleClose} dismissible={hideAuto} show={show}>
      {message}
    </Alert>
  );
}

export default CustomAlert;
