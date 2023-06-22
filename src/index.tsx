import "cockpit-dark-theme";
//import "patternfly/patternfly-5-cockpit.scss";

import '@patternfly/react-core/dist/styles/base.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './app';


document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    <Application />,
    document.getElementById("app"),
  )
});

