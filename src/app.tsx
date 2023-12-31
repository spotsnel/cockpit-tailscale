import React from 'react';

import { TailscaleBackendState, TailscalePeer, TailscaleStatus, TailscaleUp, TailscaleVersion } from './types';
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
    Version: TailscaleVersion
}

export class Application extends React.Component<ApplicationProps, ApplicationState> {
    state: ApplicationState = {
        Status: null,
        Version: null
    }

    constructor(props: ApplicationProps) {
        super(props);

        cockpit
            .spawn(['tailscale', 'version', '--json'])
            .done(content => {
                const version: TailscaleVersion = JSON.parse(content)
                this.setState(state => ({ Version: version }));
            });

        cockpit
            .spawn(['tailscale', 'status', '--json'])
            .done(content => {
                const status: TailscaleStatus = JSON.parse(content)
                this.setState(state => ({ Status: status }));
            });
    }

    render() {

        function isNotSharee(peer: TailscalePeer): peer is TailscalePeer {
            return peer.DNSName !== "";     // ShareeNode doesn't work?
        }

        return (
            <>
                {
                    this.state.Status != null
                        ? <div>
                            <Table
                                aria-label="Tailscale peers"
                                variant='compact' borders={false}>
                                <Caption>Tailscale peers</Caption>
                                <Thead>
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
                                    {this.state.Status.Self.Self = true}
                                    <Peer {...this.state.Status.Self} />
                                    {
                                        Object.values(this.state.Status.Peer)
                                            .filter(isNotSharee)
                                            .map(peer => {
                                                return <Peer {...peer} />
                                            }
                                            )
                                    }
                                </Tbody>
                            </Table>

                            <div>Tailscale {this.state.Version.majorMinorPatch}</div>
                        </div>

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
        if (this.props.Tags) {
            const mapped_items = this.props.Tags?.map(t => { return t.split(":")[1] })
            tags = mapped_items.join(', ')
        }

        return (
            <Tr>
                <Td>
                    {this.props.Online
                        ? <Icon status="success"><CheckCircleIcon /></Icon>
                        : <Icon status="danger"><ExclamationCircleIcon /></Icon>
                    }</Td>
                <Td>{this.props.TailscaleIPs[0]}</Td>
                <Td>{hostName}</Td>
                <Td>{network}</Td>
                <Td>{
                    tags
                }
                </Td>
                <Td>{this.props.Self
                    ? "Self"
                    : this.props.Active
                        ? this.props.CurAddr != ""
                            ? "Direct"
                            : "Relay: " + this.props.Relay
                        : this.props.Online
                            ? "Idle"
                            : "-"
                }</Td>
                <Td>{this.props.ExitNode
                    ? "Current"
                    : this.props.ExitNodeOption
                        ? "Yes"
                        : "-"
                }</Td>
                <Td>{this.props.OS}</Td>
                <Td>{this.props.Self
                        ? "-"
                        : "" + this.props.TxBytes + " / " + this.props.RxBytes
                }</Td>
            </Tr>);
    }
}
