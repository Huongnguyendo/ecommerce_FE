import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";
import App from "App";
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById("root")
);


