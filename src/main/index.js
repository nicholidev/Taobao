import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const ipc = require('electron').ipcMain;
const session = require("electron").session;
let mainWindow
let tbWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1200,
    center:true,
    resizable:false,
    frame:false,
    hasShadow:true
  })

  mainWindow.loadURL(winURL)
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

//登录窗口
function loginWindow(){
  tbWindow = new BrowserWindow({
    height:600,
    width:400,
    center:true,
    resizable:false,
    //frame:false,
    hasShadow:true
  })
  tbWindow.loadURL(`http://localhost:9080/src/main/login.html`);
  //found-in-page
  //did-get-redirect-request
  tbWindow.webContents.on("did-get-redirect-request", function(){

    session.defaultSession.cookies.get({domain:".taobao.com"}, (error, cookies)=>{
      mainWindow.webContents.send('loginTB',cookies)
      tbWindow.close();
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on("loginTB", function(){
  loginWindow()
})

ipc.on("test", function(){
  //先清空所有cookie
  session.defaultSession.cookies.get({domain:".taobao.com"}, (error, cookies)=>{
    mainWindow.webContents.send('loginTB',cookies)

  })
})

//关闭窗口
ipc.on("close", function(){
  app.quit();
  //mainWindow.close();
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
