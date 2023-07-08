declare module "hcloud-js" {
    class Client {
        new(token: string): Promise<HetznerClient>;
        constructor(token: string);
        actions: HetznerActionsEndpoint;
        servers: ServersEndpoint;
        floatingIPs: FloatingIps;
        sshKeys: SshKeys;
        serverTypes: ServerTypes;
        locations: Locations;
        datacenters: Datacenters;
        images: Images;
        isos: Isos;
    }
}

interface HetznerClient {
    actions: HetznerActionsEndpoint;
    servers: ServersEndpoint;
    floatingIPs: FloatingIps;
    sshKeys: SshKeys;
    serverTypes: ServerTypes;
    locations: Locations;
    datacenters: Datacenters;
    images: Images;
    isos: Isos;
    hCloudToken: {
        token: string;
        name: string;
    };
}

interface HetznerActionsEndpoint {
    list: { (params: Record<string, any>): Promise<Array<HetznerAction>> };
    get: { (id: number): Promise<HetznerAction> };
}

interface HetznerAction {
    command: string;
    error: HetznerError;
    finished: string;
    id: number;
    progress: number;
    resources: Array<Record<string, { id: number; type: string }>>;
    started: string;
    status: string;
}

interface ServersEndpoint {
    list: { (params?: Record<string, any>): Promise<ServerList> };
}

interface Server {
    backupWindow: string;
    created: string;
    datacenter: Record<string, any>;
    id: number;
    image: Record<string, any>;
    includedTraffic: number;
    ingoingTraffic: number;
    iso: Record<string, any>;
    labels: Record<string, any>;
    loadBalancers: Array<number>;
    locked: boolean;
    name: string;
    outgoingTraffic: number;
    placementGroup: object;
    primaryDiskSize: number;
    privateNet: Array<Record<string, any>>;
    protection: Record<string, any>;
    publicNet: Record<string, any>;
    rescueEnabled: boolean;
    serverType: Record<string, any>;
    status:
        | "initializing"
        | "starting"
        | "running"
        | "stopping"
        | "off"
        | "deleting"
        | "rebuilding"
        | "migrating"
        | "unknown";
    volumes: Array<number>;
}

interface FloatingIps {}

interface SshKeys {}

interface ServerList {
    endpoint: any;
    params: Record<string, any>;
    servers: Array<Server>;
}

interface ServerTypes {}

interface Locations {}

interface Datacenters {}

interface Images {}

interface Isos {}

interface HetznerError {
    code: string;
    message: string;
}
