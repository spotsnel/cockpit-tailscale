import "cockpit-dark-theme";
//import "@patternfly/patternfly/patternfly-base.scss";
import '@patternfly/react-core/dist/styles/base.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './app';

//import "patternfly/patternfly-5-overrides.scss";

document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    <Application />,
    document.getElementById("app"),
  )
});

