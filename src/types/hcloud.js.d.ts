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
    backup_window: string;
    created: string;
    datacenter: Record<string, any>;
    id: number;
    image: Record<string, any>;
    included_traffic: number;
    ingoing_traffic: number;
    iso: Record<string, any>;
    labels: Record<string, any>;
    load_balancers: Array<number>;
    locked: boolean;
    name: string;
    outgoing_traffic: number;
    placement_group: object;
    primary_disk_size: number;
    private_net: Array<Record<string, any>>;
    protection: Record<string, any>;
    public_net: Record<string, any>;
    rescue_enabled: boolean;
    server_type: Record<string, any>;
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
