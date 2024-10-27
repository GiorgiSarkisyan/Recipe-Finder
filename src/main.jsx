import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BookmarksProvider } from "./context/BookmarksContext.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BookmarksProvider>
      <App />
      <Toaster />
    </BookmarksProvider>
  </React.StrictMode>
);
