import React, {ReactElement} from 'react';
import { Route, Navigate } from 'react-router-dom'
import {useAuth} from "./AuthProvider";
export const PrivateRoute = ({Component} : { Component: any }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />
  }
  return(<Component />)
}