import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import AdminHomePage from "./pages/AdminHomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import reportWebVitals from "./reportWebVitals";
import MyFavouritePage from "./pages/MyFavouritePage";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* All public routes */}
      <Route index element={<LandingPage />} />
      <Route path="/adminHomePage" element={<AdminHomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* private routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/myFavourite" element={<MyFavouritePage />} />
      </Route>
    </Route>,
  ),
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
