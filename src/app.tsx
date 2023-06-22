import React from 'react';

import { TailscaleBackendState, TailscalePeer, TailscaleStatus, TailscaleUp } from './types';
import { Icon } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
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
        
        return (
            <>
                {
                    this.state.Status != null
                        ? <Table
                                aria-label="Tailscale peers"
                                variant='compact' borders={false}>
                            <Caption>Tailscale peers</Caption>
                            <Thead noWrap>
                                <Tr>
                                    <Th></Th>
                                    <Th>IP</Th>
                                    <Th>Hostname</Th>
                                    <Th>Network</Th>
                                    <Th>Tags</Th>
                                    <Th>State</Th>
                                    <Th>Exit node</Th>
                                    <Th>OS</Th>
                                    <Th>Traffic</Th>
                                </Tr>
                            </Thead>
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

        const name = this.props.DNSName.split('.');
        const hostName = name[0];
        const network = name[1] + '.' + 'ts.net';

        var tags = "-"
        if(this.props.Tags) {
            const mapped_items = this.props.Tags?.map(t => { return t})
            tags = mapped_items.join(', ')
        }

        return (
            <Tr>
                <Td>
                    { this.props.Online
                        ? <Icon status="success"><CheckCircleIcon /></Icon>
                        : <Icon status="danger"><ExclamationCircleIcon /></Icon>
                    }</Td>
                <Td>{ this.props.TailscaleIPs[0] }</Td>
                <Td>{ hostName }</Td>
                <Td>{ network }</Td>
                <Td>{
                        tags
                    }
                </Td>
                <Td>{ this.props.Active 
                    ? this.props.CurAddr != "" 
                        ? "Direct"
                        : "Relay: " + this.props.Relay
                    : this.props.Online
                        ? "Idle"
                        : "-"
                }</Td>
                <Td>{ this.props.ExitNode
                        ? "Current"
                        : this.props.ExitNodeOption
                            ? "Yes"
                            : "-"
                }</Td>
                <Td>{ this.props.OS }</Td>
                <Td>{ this.props.TxBytes } / { this.props.RxBytes }</Td>
            </Tr>);
    }
}
