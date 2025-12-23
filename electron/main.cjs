const { app, BrowserWindow, screen, ipcMain, session } = require('electron');
const http = require('http');
const handler = require('serve-handler');
const path = require('path');

// Disable caching entirely
app.commandLine.appendSwitch('disable-http-cache');

let mainWindow;
const isDev = process.env.NODE_ENV === 'development';
const SHELL_URL = 'http://localhost:5173';

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        // autoHideMenuBar: tr
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
    });

    if (isDev) {
        mainWindow.loadURL(SHELL_URL);
    } else {
        const server = http.createServer((request, response) => {
            return handler(request, response, {
                public: path.join(__dirname, '../dist'),
                headers: [
                    {
                        source: '**',
                        headers: [
                            { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
                            { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
                            { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
                            { key: 'Pragma', value: 'no-cache' },
                            { key: 'Expires', value: '0' },
                        ]
                    },
                    {
                        source: '**/**',
                        headers: [
                            { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
                            { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
                            { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
                        ]
                    }
                ]
            });
        });

        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;
            // Add timestamp to force fresh load
            mainWindow.loadURL(`http://127.0.0.1:${port}?v=${Date.now()}`);
        });
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Handle Logout - Just return true (let Firebase handle auth state, keep Google cookies for account chooser)
    ipcMain.handle('auth:logout', async () => {
        // We do NOT clear storage data so that Google remembers the account list (email)
        // If we want to force password, we rely on provider parameters.
        return { success: true };
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
