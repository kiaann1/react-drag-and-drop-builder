import React from "react";
import FormBuilder from "./components/FormBuilder";
import ErrorBoundary from "./components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next";

function App() {
  return (
    <ErrorBoundary>
      <FormBuilder />
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;