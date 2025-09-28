// Two-Way GitHub Auto-Sync System
class AutoSync {
    constructor() {
        this.syncInterval = 300000; // 5 minutes
        this.lastSync = localStorage.getItem('lastSync') || 0;
        this.conflictResolution = 'local-wins'; // or 'remote-wins', 'merge'
        this.isOnline = navigator.onLine;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAutoSync();
        console.log('🔄 Auto-sync system activated');
    }
    
    setupEventListeners() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.performSync();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Monitor data changes
        window.addEventListener('beforeunload', () => {
            if (this.hasLocalChanges()) {
                this.queueSync();
            }
        });
        
        // Monitor localStorage changes
        this.setupStorageWatcher();
    }
    
    setupStorageWatcher() {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            originalSetItem.call(localStorage, key, value);
            if (key === 'amazonQCaseData') {
                this.scheduleSync();
            }
        };
    }
    
    startAutoSync() {
        setInterval(() => {
            if (this.isOnline) {
                this.performSync();
            }
        }, this.syncInterval);
        
        // Initial sync
        if (this.isOnline) {
            setTimeout(() => this.performSync(), 5000);
        }
    }
    
    async performSync() {
        try {
            console.log('🔄 Starting two-way sync...');
            
            // Step 1: Pull remote changes
            await this.pullRemoteChanges();
            
            // Step 2: Push local changes
            await this.pushLocalChanges();
            
            this.lastSync = Date.now();
            localStorage.setItem('lastSync', this.lastSync);
            
            this.showSyncNotification('✅ Sync complete');
            
        } catch (error) {
            console.error('Sync failed:', error);
            this.showSyncNotification('❌ Sync failed', 'error');
        }
    }
    
    async pullRemoteChanges() {
        try {
            // Check for remote changes
            const result = await this.executeGitCommand('git fetch origin');
            
            // Check if remote is ahead
            const status = await this.executeGitCommand('git status -uno');
            
            if (status.includes('behind')) {
                console.log('📥 Remote changes detected, pulling...');
                
                // Stash local changes if any
                if (this.hasLocalChanges()) {
                    await this.executeGitCommand('git stash push -m "Auto-stash before pull"');
                }
                
                // Pull remote changes
                await this.executeGitCommand('git pull origin main');
                
                // Restore stashed changes
                const stashList = await this.executeGitCommand('git stash list');
                if (stashList.includes('Auto-stash before pull')) {
                    await this.handleMergeConflicts();
                }
                
                // Update local data from files
                await this.updateLocalDataFromFiles();
            }
            
        } catch (error) {
            console.error('Pull failed:', error);
            throw error;
        }
    }
    
    async pushLocalChanges() {
        try {
            if (!this.hasLocalChanges()) {
                return;
            }
            
            console.log('📤 Local changes detected, pushing...');
            
            // Save current data to files
            await this.saveDataToFiles();
            
            // Stage changes
            await this.executeGitCommand('git add .');
            
            // Commit with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const message = `Auto-sync: ${timestamp}`;
            await this.executeGitCommand(`git commit -m "${message}"`);
            
            // Push to remote
            await this.executeGitCommand('git push origin main');
            
        } catch (error) {
            console.error('Push failed:', error);
            throw error;
        }
    }
    
    async handleMergeConflicts() {
        try {
            const stashResult = await this.executeGitCommand('git stash pop');
            
            if (stashResult.includes('CONFLICT')) {
                console.log('🔀 Merge conflicts detected, resolving...');
                
                switch (this.conflictResolution) {
                    case 'local-wins':
                        await this.executeGitCommand('git checkout --theirs .');
                        await this.executeGitCommand('git add .');
                        break;
                    case 'remote-wins':
                        await this.executeGitCommand('git checkout --ours .');
                        await this.executeGitCommand('git add .');
                        break;
                    case 'merge':
                        await this.smartMerge();
                        break;
                }
            }
        } catch (error) {
            console.error('Conflict resolution failed:', error);
        }
    }
    
    async smartMerge() {
        // Intelligent merge for case data
        try {
            const localData = JSON.parse(localStorage.getItem('amazonQCaseData') || '{}');
            const remoteData = await this.loadRemoteData();
            
            const merged = this.mergeData(localData, remoteData);
            localStorage.setItem('amazonQCaseData', JSON.stringify(merged));
            
            await this.saveDataToFiles();
            await this.executeGitCommand('git add .');
            
        } catch (error) {
            console.error('Smart merge failed:', error);
        }
    }
    
    mergeData(local, remote) {
        const merged = { ...remote };
        
        // Merge arrays intelligently
        ['timeline', 'evidence', 'correspondence'].forEach(key => {
            if (local[key] && remote[key]) {
                const localItems = new Map(local[key].map(item => [item.id, item]));
                const remoteItems = new Map(remote[key].map(item => [item.id, item]));
                
                // Combine and deduplicate
                const combined = new Map([...remoteItems, ...localItems]);
                merged[key] = Array.from(combined.values());
            } else if (local[key]) {
                merged[key] = local[key];
            }
        });
        
        // Use latest timestamps for metadata
        if (local.lastModified && remote.lastModified) {
            merged.lastModified = Math.max(
                new Date(local.lastModified).getTime(),
                new Date(remote.lastModified).getTime()
            );
        }
        
        return merged;
    }
    
    async saveDataToFiles() {
        const data = JSON.parse(localStorage.getItem('amazonQCaseData') || '{}');
        
        // Save to JSON file
        const dataFile = '/Users/owner/GitHub/SYNC/no-code-platform/case-data.json';
        await this.writeFile(dataFile, JSON.stringify(data, null, 2));
        
        // Update backup timestamp
        const backupInfo = {
            lastBackup: new Date().toISOString(),
            syncVersion: Date.now(),
            dataSize: JSON.stringify(data).length
        };
        
        const backupFile = '/Users/owner/GitHub/SYNC/no-code-platform/backup-info.json';
        await this.writeFile(backupFile, JSON.stringify(backupInfo, null, 2));
    }
    
    async updateLocalDataFromFiles() {
        try {
            const dataFile = '/Users/owner/GitHub/SYNC/no-code-platform/case-data.json';
            const fileData = await this.readFile(dataFile);
            
            if (fileData) {
                const data = JSON.parse(fileData);
                localStorage.setItem('amazonQCaseData', JSON.stringify(data));
                
                // Trigger UI update
                if (window.caseData) {
                    window.caseData = data;
                    if (window.updateUI) {
                        window.updateUI();
                    }
                }
            }
        } catch (error) {
            console.error('Failed to update local data:', error);
        }
    }
    
    async loadRemoteData() {
        try {
            const dataFile = '/Users/owner/GitHub/SYNC/no-code-platform/case-data.json';
            const fileData = await this.readFile(dataFile);
            return fileData ? JSON.parse(fileData) : {};
        } catch (error) {
            console.error('Failed to load remote data:', error);
            return {};
        }
    }
    
    hasLocalChanges() {
        const lastModified = localStorage.getItem('lastDataModified');
        return lastModified && parseInt(lastModified) > this.lastSync;
    }
    
    scheduleSync() {
        localStorage.setItem('lastDataModified', Date.now());
        
        // Debounce sync requests
        clearTimeout(this.syncTimeout);
        this.syncTimeout = setTimeout(() => {
            if (this.isOnline) {
                this.performSync();
            }
        }, 30000); // 30 seconds delay
    }
    
    queueSync() {
        localStorage.setItem('pendingSync', 'true');
    }
    
    async executeGitCommand(command) {
        // This would need to be implemented with a local server or electron app
        // For now, we'll simulate with fetch to a local endpoint
        try {
            const response = await fetch('/api/git', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command })
            });
            
            if (!response.ok) {
                throw new Error(`Git command failed: ${command}`);
            }
            
            return await response.text();
        } catch (error) {
            // Fallback: log command for manual execution
            console.log(`Manual git command needed: ${command}`);
            throw error;
        }
    }
    
    async readFile(path) {
        try {
            const response = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
            return response.ok ? await response.text() : null;
        } catch (error) {
            console.error('File read failed:', error);
            return null;
        }
    }
    
    async writeFile(path, content) {
        try {
            const response = await fetch('/api/file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path, content })
            });
            
            if (!response.ok) {
                throw new Error('File write failed');
            }
        } catch (error) {
            console.error('File write failed:', error);
            throw error;
        }
    }
    
    showSyncNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `sync-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10001;
            opacity: 0.9;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize auto-sync
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.autoSync = new AutoSync();
    }, 3000);
});