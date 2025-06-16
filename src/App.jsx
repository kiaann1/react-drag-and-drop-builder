import React from "react";
import FormBuilder from "./components/FormBuilder";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <FormBuilder />
    </ErrorBoundary>
  );
}

export default App;