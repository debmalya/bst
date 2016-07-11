import * as net from 'net';
import {Node} from "./node";
import {Socket} from "net";
import {SocketHandler} from "./../core/socket-handler";
import {Server} from "net";

export interface OnConnectCallback {
    (node: Node): void;
}

export interface OnReceiveCallback {
    (connection: Node, data: string): void;
}

export interface OnCloseCallback {
    (connection: Node): void;
}

export class NodeManager {
    public host:string = '0.0.0.0';
    public onClose:OnCloseCallback;
    public onConnect:OnConnectCallback;
    //public onReceive:OnReceiveCallback;

    private nodes: {[id: string] : Node } = {};
    public server: Server;

    constructor(private port:number) {}

    public node (nodeID: string): Node {
        return this.nodes[nodeID];
    }

    public start () {
        let self = this;
        this.server = net.createServer(function(socket:Socket) {
            let initialConnection = true;
            let node: Node = null;
            let socketHandler = new SocketHandler(socket, function(message: string) {
                //We do special handling when we first connect
                if (initialConnection) {
                    let connectData = JSON.parse(message);
                    node = new Node(connectData.id, socketHandler);
                    self.nodes[node.id] = node;

                    socketHandler.send("ACK");
                    initialConnection = false;
                }

                if (self.onConnect != null) {
                    self.onConnect(node);
                }
            });

            // We have a connection - a socket object is assigned to the connection automatically
            console.log('NODE CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);

        }).listen(this.port, this.host);

        console.log('NodeServer listening on ' + this.host + ':' + this.port);
    }

    public stop (): void {
        this.server.close(function() {
            console.log("NodeManager STOP");
        })
    }
}