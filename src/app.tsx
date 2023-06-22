import React, { ReactComponentElement, ReactNode } from 'react';

import { TailscaleBackendState, TailscalePeer, TailscaleStatus, TailscaleUp } from './types';
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
                {
                    this.state.Status != null
                        ? <>
                            <Peer { ...this.state.Status.Self } />
                            <hr />
                            {
                                Object.entries(this.state.Status.Peer).map(peer =>
                                    {
                                        return <Peer {...peer[1]} />
                                    }
                                )    
                            }
                          </>
                        : <p>Loading...</p>
                }
            </CardBody>
		</Card>
        );
    }
}


class Peer extends React.Component<TailscalePeer> {
    render() {
         return (<div>
                <p>
                    <pre>{ this.props.TailscaleIPs[0] } { ' '.repeat(15 - this.props.TailscaleIPs[0].length) } { this.props.HostName }</pre>
                </p>
            </div>);
    }
}
