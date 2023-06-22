import React from 'react';

import { TailscaleBackendState, TailscaleStatus, TailscaleUp } from './types';
import { Card, CardTitle, CardBody } from '@patternfly/react-core';

type ApplicationProps = { 
}

type ApplicationState = { 
    Status: TailscaleStatus
}


export class Application extends React.Component<ApplicationProps, ApplicationState> {
    state: ApplicationState = {
        Status: null
    }

    constructor(props: ApplicationProps) {
	super(props);

        cockpit.spawn(['tailscale', 'status', '--json']).done(content => {
            const status: TailscaleStatus = JSON.parse(content)
		    this.setState(state => ({Status: status}));        
        });
    }

    render() {
        return (
		<Card>
            <CardTitle>Tailscale</CardTitle>
            <CardBody>
                <pre>
                {
                    this.state.Status != null
                        ? this.state.Status.Self.HostName + " " + this.state.Status.Self.TailscaleIPs[0]
                        : <p>Loading...</p>
                }
                </pre>
            </CardBody>
		</Card>
        );
    }
}
