import React from 'react';

import { TailscaleBackendState, TailscalePeer, TailscaleStatus, TailscaleUp } from './types';
import { Icon } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';


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
            this.setState(state => ({ Status: status }));
        });
    }

    render() {

        return (
            <>
                {
                    this.state.Status != null
                        ? <table>
                            <tr>
                                <th>Online</th>
                                <th>IP</th>
                                <th>Host name</th>
                            </tr>

                            <Peer {...this.state.Status.Self} />
                            {
                                Object.entries(this.state.Status.Peer).map(peer => {
                                    return <Peer {...peer[1]} />
                                }
                                )
                            }

                        </table>
                        : <p>Loading...</p>
                }
            </>
        );
    }
}


class Peer extends React.Component<TailscalePeer> {
    render() {
        return (
            <tr>
                <td>
                    {this.props.Online
                        ? <Icon status="success"><CheckCircleIcon /></Icon>
                        : <Icon status="danger"><ExclamationCircleIcon /></Icon>
                    }</td>
                <td>{this.props.TailscaleIPs[0]}</td>
                <td>{this.props.HostName}</td>
            </tr>);
    }
}
