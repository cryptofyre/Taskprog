const path = require("path")
const {ipcMain} = require("electron")

module.exports = class TaskprogMain {
    constructor(env) {
        // Define plugin enviornment within the class
        this.env = env
        this.playing = null;
    }

    // Called when the backend is ready
    onReady(win) {
        ipcMain.on('wsapi-updatePlaybackState', (event, attributes) => {
            if (attributes.status) {
                try {
                    this.env.utils.getWindow().setProgressBar(attributes.currentPlaybackProgress)
                } catch(e) {
                    console.log("[Plugin][Taskprog][Error]",e)
                }
            } else {
                this.env.utils.getWindow().setProgressBar(-1)
            }
        })

        console.log("[Plugin][Taskprog] Taskprog Backend Ready.")
    }

    // Called when the renderer is ready (app.init())
    onRendererReady(win) {
        console.debug("Renderer Ready Called")
        // Load the frontend plugin
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "index.frontend.js"))
    }
}
