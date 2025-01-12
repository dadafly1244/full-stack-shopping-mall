import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client";
import "./index.css";
import client from "./apollo/client.ts";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@material-tailwind/react";
import CssBaseline from "@mui/material/CssBaseline";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RecoilRoot>
        <ThemeProvider>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </RecoilRoot>
    </ApolloProvider>
  </React.StrictMode>
);
