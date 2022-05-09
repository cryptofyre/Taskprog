const path = require("path")
const {ipcMain} = require("electron")
const WebSocketW3C = require('websocket').w3cwebsocket;
const socket = new WebSocketW3C(`ws://127.0.0.1:26369`);
var socketResponse;
var playing;

module.exports = class TaskprogMain {
    constructor(env) {
        // Define plugin enviornment within the class
        this.env = env
    }

    // Called when the backend is ready
    onReady(win) {
        socket.onopen = (e) => {
            console.log(e);
            console.log('[Plugin][Taskprog] Connected to Websocket.');
        }
        console.log("[Plugin][Taskprog] Taskprog Backend Ready.")
    }

    onPlaybackStateDidChange(attributes) {
        playing = attributes.status
        if (attributes.status) {
            while (playing) {
                socket.onmessage = (e) => {
                    console.log(e.data)
                    socketResponse = JSON.parse(e.data);
                }
                try { 
                    this.env.utils.getWindow().setProgressBar(socketResponse.currentPlaybackProgress)
                } catch(e) {
                    console.log("[Plugin][Taskprog][Error]",e)
                }
            }  
        } else {
            this.env.utils.getWindow().setProgressBar(-1)
        }
    }

    // Called when the renderer is ready (app.init())
    onRendererReady(win) {
        console.debug("Renderer Ready Called")
        // Load the frontend plugin
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "index.frontend.js"))
    }
}