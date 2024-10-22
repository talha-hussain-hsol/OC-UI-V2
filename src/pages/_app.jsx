import '../styles/theme.scss';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { Sidenav } from '../components';
export const myAppContext = React.createContext({});
function MyApp({ children }) {
  console.log(children,'children')
  const history = useLocation();
  const [isSignInPage, setIsSignInPage] = useState(false);
  useEffect(() => {
    if (history.pathname == '/sign-in') {
      console.log('in sign in')
      setIsSignInPage(true)

    } else {
      setIsSignInPage(false)

    }
  }, [history.pathname])

  const authPages = [
    '/error-illustration',
    '/error',
    '/password-reset-cover',
    '/password-reset-illustration',
    '/password-reset',
    '/sign-in-cover',
    '/sign-in-illustration',
    '/sign-in',
    '/sign-up-cover',
    '/sign-up-illustration',
    '/sign-up',
  ];
  return (
    <>
      {!authPages.includes(history.pathname) && <Sidenav />}
      <div className={!isSignInPage ? "parent-container-root" : " "}>
        <myAppContext.Provider value={{}}>
          {children}
        </myAppContext.Provider>
      </div>
    </>
  );
}

export default MyApp;
