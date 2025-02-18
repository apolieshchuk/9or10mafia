import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import MarketingPage from "./MarketingPage";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import ClubsList from "./Clubs";
import MembersList from "./Members";
import SignUpClub from "./SignUpClub";
import {AuthProvider} from "./AuthProvider";
import {PrivateRoute} from "./PrivateRoute";
import Dashboard from "./Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MarketingPage />}/>
          <Route path="register" element={<SignUp />} />
          <Route path="register-club" element={<SignUpClub />} />
          <Route path="login" element={<SignIn />} />
          <Route path="members" element={<MembersList />} />
          <Route path="clubs" element={<ClubsList />} />
          <Route path="profile" element={<PrivateRoute Component={Dashboard}/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;