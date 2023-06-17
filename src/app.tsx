import React from 'react';
import PropTypes from 'prop-types';
//import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
//import { Card, CardBody, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";

type ApplicationProps = { 
}

type ApplicationState = { 
    response: string
}

export class Application extends React.Component<ApplicationProps, ApplicationState> {
    state: ApplicationState = {
        response: ""
    }
    constructor(props: ApplicationProps) {
	super(props);

        cockpit.spawn(['tailscale', 'status']).done(content => {
		this.setState(state => ({response: content.trim()}));        
        });
    }

    render() {
        return (
		<pre>
		{ this.state.response }
		</pre>
        );
    }
}
