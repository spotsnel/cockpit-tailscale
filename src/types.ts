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

export type TailscaleStatusResponse = {
  BackendState: TailscaleBackendState;
  AuthURL: string;
  Self: {
    ID: string;
    UserID: number;
    HostName: string;
    DNSName: string;
    OS: string;
    TailscaleIPs: string[];
    Capabilities: string[];
    Online: boolean
  };
  User: Record<string, TailscaleUser> | null;
  CurrentTailnet: {
    Name: string;
    MagicDNSSuffix: string;
    MagicDNSEnabled: boolean;
  } | null;
};

export type TailscaleUser = {
  ID: number;
  LoginName: string;
  DisplayName: string;
  ProfilePicURL: string;
  Roles: string[];
};

export type TailscaleUpResponse = {
  BackendState: TailscaleBackendState;
  AuthURL?: string; // e.g. https://login.tailscale.com/a/0123456789abcdef
  QR?: string; // a DataURL-encoded QR code PNG of the AuthURL
};