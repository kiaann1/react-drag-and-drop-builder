import React from "react";
import FormBuilder from "./components/FormBuilder";
import ErrorBoundary from "./components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <ErrorBoundary>
      <FormBuilder />
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;