import React from 'react';

import { TailscaleBackendState, TailscalePeer, TailscaleStatus, TailscaleUp } from './types';
import { Icon } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import {
    ExpandableRowContent,
    Table, Caption, Thead, Tbody, Tr, Th, Td,
    SortByDirection,
} from '@patternfly/react-table';

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


        const columns: TableProps['cols'] = ['', 'IP', 'Hostname'];
  

        
        return (
            <>
                {
                    this.state.Status != null
                        ? <Table
                                aria-label="Tailscale peers"
                                variant='compact' borders={false}>
                            <Caption>Tailscale peers</Caption>
                            <Tbody>
                                <Peer {...this.state.Status.Self} />
                                {
                                    Object.entries(this.state.Status.Peer).map(peer => {
                                        return <Peer {...peer[1]} />
                                    }
                                    )
                                }
                            </Tbody>
                        </Table>
                        : <p>Loading...</p>
                }
            </>
        );
    }
}


class Peer extends React.Component<TailscalePeer> {
    render() {
        return (
            <Tr>
                <Td>
                    {this.props.Online
                        ? <Icon status="success"><CheckCircleIcon /></Icon>
                        : <Icon status="danger"><ExclamationCircleIcon /></Icon>
                    }</Td>
                <Td>{this.props.TailscaleIPs[0]}</Td>
                <Td>{this.props.HostName}</Td>
            </Tr>);
    }
}
