import { PluginV2 } from 'ilp-compat-plugin';
export declare class PluginProxy {
    private _plugin;
    private _bridge;
    constructor(plugin: PluginV2, bridge: PluginV2);
    connect(): Promise<void>;
    disconnect(): Promise<[void, void]>;
}
export declare function createBtpClientProxy(server: string, plugin: PluginV2): Promise<PluginProxy>;
export declare function createBtpServerProxy(port: number, secret: string, plugin: PluginV2): Promise<PluginProxy>;
