import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import browser from "functions/browserDetection";

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: true };
    }
  
    static getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
  
    render() {
        let isMobile = typeof window.orientation !== "undefined";

        let width = isMobile ? window.innerWidth/2 : window.innerWidth/6;

        console.log({isMobile})

        let home = '/' + (isMobile ? 'Picture' : browser[0].toUpperCase() + browser.slice(1));
        
        if (this.state.hasError) {
            return (
                <div className="error-wrapper">
                    <img src={require("pictures/calvin-error.png")} alt="calvin" />
                    <div className="error-text">
                        <h1>Something went wrong.</h1>
                    </div>
                    <div>
                        <Link
                            to={home}
                            onClick={() => this.setState({ hasError: false })}
                            className="button404"
                            style={{
                                width: width,
                                height: window.innerHeight/20,
                                borderRadius: window.innerHeight/75
                                }}
                            >
                            Back To Home
                        </Link>
                    </div>
                </div>
            );
      }
  
      return this.props.children; 
    }
}

export default withRouter(ErrorBoundary)