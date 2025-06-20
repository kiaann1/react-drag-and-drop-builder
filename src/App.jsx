import React from "react";
import FormBuilder from "./components/FormBuilder";
import ErrorBoundary from "./components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <ErrorBoundary>
      <FormBuilder />
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}

export default App;