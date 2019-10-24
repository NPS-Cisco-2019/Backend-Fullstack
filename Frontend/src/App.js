import React from 'react';
import CompApp from './appComponents/compWebsite';
import MobileApp from './appComponents/mobileApp';
import { BrowserRouter } from 'react-router-dom';


/* ANCHOR  Main app, renders all components and is attached to the DOM
 *
 * Suggestion: Add the Name: Comment Anchors Extension (for VS Code atleast)
 * VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors 
 */


// TEMPORARY, If its true the website shows mobile app on desktop also, just for developement
let dev = true;

function App(){
  //checks whether user is on mobile
  if (typeof window.orientation !== "undefined" || dev){
    return <BrowserRouter basename="/Frontend"><MobileApp /></BrowserRouter>;
  } else {
    return <CompApp />;
  }
}

export default App;
