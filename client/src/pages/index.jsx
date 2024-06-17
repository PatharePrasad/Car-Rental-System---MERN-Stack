import React from "react";
// Authentication Screens
export const Auth = React.lazy(() => import("./auth/index.jsx"));
export const VerifyEmail = React.lazy(() => import("./auth/VerifyEmail.jsx"));
// Other Screens
export const Home = React.lazy(() => import("./Home.jsx"));
export const Payments = React.lazy(() => import("./Payments.jsx"));
// Miscellaneous Screens
export const ServiceUnavailable = React.lazy(() => import("./misc/ServiceUnavailable.jsx"));
export { default as Loader } from "./misc/Loader.jsx";
