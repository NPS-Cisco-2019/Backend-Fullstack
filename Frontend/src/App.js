import React from "react";
import { BrowserRouter } from "react-router-dom";

import CompApp from "compWebsite";
import MobileApp from "mobileApp";
import ErrorBoundary from "shared/Error";

/* ANCHOR  Main app, renders all components and is attached to the DOM
 *
 * Suggestion: Add the Comment Anchors Extension (for VS Code at least)
 * VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors
 */

// TEMPORARY, If its true the website shows mobile app on desktop also, just for developement
// TODO remove this
let dev = true;

function App() {
  return (
    <BrowserRouter basename="Frontend">
      <ErrorBoundary>
        {typeof window.orientation !== "undefined" || dev ? <MobileApp /> : <CompApp />}
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
