import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketingPage from "./MarketingPage";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingPage />}/>
        <Route path="register" element={<SignUp />} />
        <Route path="login" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;