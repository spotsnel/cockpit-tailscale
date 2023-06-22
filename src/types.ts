// BackendState
// Keep in sync with https://github.com/tailscale/tailscale/blob/main/ipn/backend.go
export type TailscaleBackendState =
  | 'NoState'
  | 'NeedsMachineAuth'
  | 'NeedsLogin'
  | 'InUseOtherUser'
  | 'Stopped'
  | 'Starting'
  | 'Running';

export enum OS {
    Android = "android",
    IOS = "iOS",
    Linux = "linux",
    MACOS = "macOS",
    Windows = "windows",
}

export type TailscalePeer = {
    ID: string;
    PublicKey: string;
    HostName: string;
    DNSName: string;
    OS: OS;
    UserID: string;
    TailscaleIPs: string[]
    Tags?: string[];
    Online: boolean;
    Capabilities?: string[];
}

export interface TailscaleExitNodeStatus {
    ID:           string;
    Online:       boolean;
    TailscaleIPs: string[];
}

export type TailscaleStatus = {
  BackendState: TailscaleBackendState;
  AuthURL: string;
  Self: TailscalePeer,
  User: Record<string, TailscaleUser> | null;
  CurrentTailnet: {
    Name: string;
    MagicDNSSuffix: string;
    MagicDNSEnabled: boolean;
  } | null;
  ExitNodeStatus: TailscaleExitNodeStatus | null;
  Peer: {
    [key: string]: TailscalePeer
  };
};

export type TailscaleUser = {
  ID: number;
  LoginName: string;
  DisplayName: string;
  ProfilePicURL: string;
  Roles: string[];
};

export type TailscaleUp = {
  BackendState: TailscaleBackendState;
  AuthURL?: string;
  QR?: string;
};