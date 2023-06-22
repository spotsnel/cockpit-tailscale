import React from 'react';
import { Card, CardTitle, CardBody } from '@patternfly/react-core';

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
		<Card>
            <CardTitle>Tailscale</CardTitle>
            <CardBody>
                <pre>
		        { this.state.response }
                </pre>
            </CardBody>
		</Card>
        );
    }
}
