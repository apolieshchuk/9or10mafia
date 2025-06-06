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
import Dashboard from "./dashboard/Dashboard";
import DashboardHome from "./dashboard/DashboardHome";
import DashboardUsers from "./dashboard/DashboardUsers";
import DashboardClubs from "./dashboard/DashboardClubs";
import DashboardRatingPeriods from "./dashboard/DashboardRatingPeriods";
import NewGame from "./NewGame";
import DashboardGames from "./dashboard/DashboardGames";
import Rating from "./Rating";
import {BudgetRedirect} from "./Budget";
import {CalendarRedirect} from "./Calendar";

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
          <Route path="$" element={<BudgetRedirect />} />
          <Route path="calendar" element={<CalendarRedirect />} />
          <Route path="clubs-rating" element={<Rating />} />
          <Route path="clubs" element={<ClubsList />} />
          <Route path="new-game" element={<NewGame />} />
          <Route path="profile" element={<PrivateRoute Component={DashboardHome}/>} />
          <Route path="profile/users" element={<PrivateRoute Component={DashboardUsers}/>} />
          <Route path="profile/clubs" element={<PrivateRoute Component={DashboardClubs}/>} />
          <Route path="profile/games" element={<PrivateRoute Component={DashboardGames}/>} />
          <Route path="profile/rating-periods" element={<PrivateRoute Component={DashboardRatingPeriods}/>} />
          <Route path="new-game-rating" element={<PrivateRoute Component={NewGame}/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;