import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketingPage from "./MarketingPage";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import ClubsList from "./Clubs";
import MembersList from "./Members";
import SignUpClub from "./SignUpClub";
import {AuthProvider} from "./AuthProvider";

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;