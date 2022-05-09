const path = require("path")
const {ipcMain} = require("electron")

module.exports = class TaskprogMain {
    constructor(env) {
        // Define plugin enviornment within the class
        this.env = env
    }

    // Called when the backend is ready
    onReady(win) {
        console.log("[Plugin][Taskprog] Taskprog Backend Ready.")
    }

    onPlaybackStateDidChange(attributes) {
        window.playing = attributes.status
        if (attributes.status) {
            while (playing) {
                try {
                    ipcMain.on('wsapi-updatePlaybackState', (attributes) => {
                        this.env.utils.getWindow().setProgressBar(attributes.currentPlaybackProgress)
                    })
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