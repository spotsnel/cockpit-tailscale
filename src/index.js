import "cockpit-dark-theme";
import "patternfly/patternfly-5-cockpit.scss";

import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './app.jsx';
import './app.scss';

document.addEventListener("DOMContentLoaded", function () {
    ReactDOM.render(React.createElement(Application, {}), document.getElementById('app'));
});
