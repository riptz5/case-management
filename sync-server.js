// Local sync server for Git operations
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const REPO_PATH = '/Users/owner/GitHub/SYNC';

app.use(express.json());
app.use(express.static('.'));

// Git operations endpoint
app.post('/api/git', async (req, res) => {
    const { command } = req.body;
    
    try {
        const result = await executeCommand(command, REPO_PATH);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// File operations endpoint
app.get('/api/file', async (req, res) => {
    const { path: filePath } = req.query;
    
    try {
        const content = await fs.readFile(filePath, 'utf8');
        res.send(content);
    } catch (error) {
        res.status(404).json({ error: 'File not found' });
    }
});

app.post('/api/file', async (req, res) => {
    const { path: filePath, content } = req.body;
    
    try {
        await fs.writeFile(filePath, content, 'utf8');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync status endpoint
app.get('/api/sync-status', async (req, res) => {
    try {
        const status = await executeCommand('git status --porcelain', REPO_PATH);
        const remoteStatus = await executeCommand('git fetch && git status -uno', REPO_PATH);
        
        res.json({
            hasLocalChanges: status.trim().length > 0,
            isAhead: remoteStatus.includes('ahead'),
            isBehind: remoteStatus.includes('behind'),
            lastSync: Date.now()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function executeCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
            } else {
                resolve(stdout);
            }
        });
    });
}

app.listen(PORT, () => {
    console.log(`🔄 Sync server running on http://localhost:${PORT}`);
    console.log(`📁 Repository path: ${REPO_PATH}`);
});

module.exports = app;