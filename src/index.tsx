import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import {Component} from "react";

class AppWithTitle extends Component{
  componentDidMount(){
    document.title = "Nine or Ten"
  }

  render(){
    return(<App />)
  }
}

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <AppWithTitle />
    </StyledEngineProvider>
  </React.StrictMode>
);