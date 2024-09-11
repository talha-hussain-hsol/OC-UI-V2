import React from 'react'
import { ThemeProvider } from '../contexts/themeContext'
import Dashboard from '../OurComponents/Screens/Dashboard'
import UserForm from '../OurComponents/Screens/UserForm'
import Accounts from '../OurComponents/Screens/Accounts'
import Identities from '../OurComponents/Screens/Identities'
import MainDocuments from '../OurComponents/Screens/MainDocuments'
import FundCode from '../OurComponents/Screens/FundCode'
import Stepper from '../OurComponents/Screens/Stepper'

const customerRoutes = () => {
  return (
    <div>
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThemeProvider> <Dashboard /> </ThemeProvider> } />
        <Route path="/user-form" element={<ThemeProvider> <UserForm /> </ThemeProvider> } />
        <Route path="/accounts" element={<ThemeProvider> <Accounts /> </ThemeProvider> } />
        <Route path="/identities" element={<ThemeProvider> <Identities /> </ThemeProvider> } />
        <Route path="/documents" element={<ThemeProvider> <MainDocuments /> </ThemeProvider> } />
        <Route path="/fund-code"  element={<ThemeProvider> <FundCode /> </ThemeProvider> } />
        <Route path="/stepper"  element={<ThemeProvider> <Stepper /> </ThemeProvider> } />
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default customerRoutes
