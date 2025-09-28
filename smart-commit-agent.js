// Smart Commit Agent - Auto-generates commit messages
class SmartCommitAgent {
    constructor() {
        this.isActive = false;
        this.watchInterval = null;
        this.lastCommitHash = null;
        this.init();
    }
    
    init() {
        this.createCommitPanel();
        this.startGitWatcher();
        console.log('🤖 Smart Commit Agent activated');
    }
    
    createCommitPanel() {
        const panel = document.createElement('div');
        panel.id = 'smart-commit-panel';
        panel.innerHTML = `
            <div class="commit-header">
                <h3>🤖 Smart Commit</h3>
                <button onclick="smartCommitAgent.toggle()" id="commit-toggle">Start</button>
            </div>
            
            <div class="commit-status" id="commit-status">
                <span class="status-dot offline"></span>
                <span>Watching for changes...</span>
            </div>
            
            <div class="commit-actions">
                <button onclick="smartCommitAgent.generateMessage()" class="btn-generate">
                    ✨ Generate Message
                </button>
                <button onclick="smartCommitAgent.quickCommit()" class="btn-quick">
                    ⚡ Quick Commit
                </button>
                <button onclick="smartCommitAgent.analyzeChanges()" class="btn-analyze">
                    🔍 Analyze Changes
                </button>
            </div>
            
            <div class="commit-preview" id="commit-preview"></div>
        `;
        
        document.body.appendChild(panel);
        this.addCommitStyles();
    }
    
    addCommitStyles() {
        const css = `
            #smart-commit-panel {
                position: fixed;
                right: 20px;
                top: 100px;
                width: 280px;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                color: white;
                border-radius: 12px;
                padding: 15px;
                z-index: 1002;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                font-family: 'SF Mono', Monaco, monospace;
            }
            
            .commit-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 8px;
            }
            
            .commit-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
            }
            
            #commit-toggle {
                background: #27ae60;
                border: none;
                color: white;
                padding: 4px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }
            
            #commit-toggle:hover {
                background: #2ecc71;
            }
            
            #commit-toggle.active {
                background: #e74c3c;
            }
            
            .commit-status {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
                font-size: 11px;
                color: #bdc3c7;
            }
            
            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #95a5a6;
            }
            
            .status-dot.online {
                background: #27ae60;
                animation: pulse 2s infinite;
            }
            
            .status-dot.offline {
                background: #e74c3c;
            }
            
            .commit-actions {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 12px;
            }
            
            .commit-actions button {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
                text-align: left;
            }
            
            .commit-actions button:hover {
                background: rgba(255,255,255,0.2);
                transform: translateX(2px);
            }
            
            .btn-generate {
                background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
            }
            
            .btn-quick {
                background: linear-gradient(45deg, #3498db, #2980b9) !important;
            }
            
            .btn-analyze {
                background: linear-gradient(45deg, #f39c12, #e67e22) !important;
            }
            
            .commit-preview {
                background: rgba(0,0,0,0.3);
                border-radius: 6px;
                padding: 10px;
                font-size: 11px;
                font-family: monospace;
                max-height: 150px;
                overflow-y: auto;
                display: none;
            }
            
            .commit-preview.show {
                display: block;
            }
            
            .commit-message {
                background: rgba(46, 204, 113, 0.2);
                border-left: 3px solid #2ecc71;
                padding: 8px;
                margin: 5px 0;
                border-radius: 3px;
            }
            
            .commit-files {
                color: #f39c12;
                font-size: 10px;
                margin-top: 5px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    startGitWatcher() {
        this.watchInterval = setInterval(() => {
            if (this.isActive) {
                this.checkGitStatus();
            }
        }, 5000);
    }
    
    async checkGitStatus() {
        try {
            const response = await fetch('/api/git-status');
            const status = await response.json();
            
            if (status.hasChanges) {
                this.updateStatus('Changes detected', 'online');
                if (status.staged.length > 0) {
                    this.autoGenerateMessage(status);
                }
            } else {
                this.updateStatus('No changes', 'offline');
            }
        } catch (error) {
            // Fallback to local detection
            this.detectLocalChanges();
        }
    }
    
    detectLocalChanges() {
        // Check if we're in a git commit message file
        const currentFile = window.location.pathname;
        if (currentFile.includes('COMMIT_EDITMSG')) {
            this.updateStatus('Commit in progress', 'online');
            this.autoGenerateForCurrentCommit();
        }
    }
    
    async autoGenerateForCurrentCommit() {
        // Get git diff information
        const changes = await this.analyzeCurrentChanges();
        if (changes) {
            const message = this.generateSmartMessage(changes);
            this.showPreview(message, changes);
        }
    }
    
    async analyzeCurrentChanges() {
        // Parse the current commit message file to extract changes
        const commitContent = document.querySelector('body').textContent;
        const changes = this.parseGitStatus(commitContent);
        return changes;
    }
    
    parseGitStatus(content) {
        const lines = content.split('\n');
        const changes = {
            staged: [],
            modified: [],
            deleted: [],
            untracked: []
        };
        
        let currentSection = null;
        
        lines.forEach(line => {
            if (line.includes('Changes to be committed:')) {
                currentSection = 'staged';
            } else if (line.includes('Changes not staged for commit:')) {
                currentSection = 'modified';
            } else if (line.includes('Untracked files:')) {
                currentSection = 'untracked';
            } else if (line.startsWith('#\t')) {
                const match = line.match(/#\t([^:]+):\s*(.+)/);
                if (match && currentSection === 'staged') {
                    const [, action, file] = match;
                    if (action === 'new file') {
                        changes.staged.push({ action: 'add', file });
                    } else if (action === 'modified') {
                        changes.staged.push({ action: 'modify', file });
                    } else if (action === 'deleted') {
                        changes.staged.push({ action: 'delete', file });
                    }
                }
            }
        });
        
        return changes;
    }
    
    generateSmartMessage(changes) {
        const { staged } = changes;
        
        if (staged.length === 0) {
            return 'Update files';\n        }
        
        // Analyze file types and changes
        const fileTypes = this.categorizeFiles(staged);
        const actions = this.categorizeActions(staged);
        
        // Generate contextual message
        let message = this.createContextualMessage(fileTypes, actions, staged);
        
        // Add detailed description
        const details = this.generateDetails(staged, fileTypes);
        if (details.length > 0) {
            message += '\n\n' + details.join('\n');
        }
        
        return message;
    }
    
    categorizeFiles(files) {
        const categories = {
            js: [],
            json: [],
            html: [],
            css: [],
            md: [],
            config: [],
            script: [],
            other: []
        };
        
        files.forEach(({ file }) => {
            const ext = file.split('.').pop().toLowerCase();
            if (categories[ext]) {
                categories[ext].push(file);
            } else if (file.includes('.sh') || file.includes('install')) {
                categories.script.push(file);
            } else if (file.includes('config') || file.includes('.json')) {
                categories.config.push(file);
            } else {
                categories.other.push(file);
            }
        });
        
        return categories;
    }
    
    categorizeActions(files) {
        const actions = {
            add: files.filter(f => f.action === 'add').length,
            modify: files.filter(f => f.action === 'modify').length,
            delete: files.filter(f => f.action === 'delete').length
        };
        
        return actions;
    }
    
    createContextualMessage(fileTypes, actions, files) {
        // Smart message generation based on file patterns
        if (fileTypes.js.length > 0 && fileTypes.json.length > 0) {
            if (files.some(f => f.file.includes('auto') || f.file.includes('ai'))) {
                return 'Add automation features and AI toolkit integration';\n            }\n            return 'Add JavaScript functionality and configuration';\n        }\n        \n        if (fileTypes.script.length > 0) {\n            return 'Add installation and setup scripts';\n        }\n        \n        if (actions.add > actions.modify) {\n            const mainType = Object.keys(fileTypes).find(type => \n                fileTypes[type].length > 0 && type !== 'other'\n            );\n            \n            if (mainType) {\n                return `Add ${mainType.toUpperCase()} ${mainType === 'js' ? 'modules' : 'files'}`;\n            }\n            return `Add ${actions.add} new files`;\n        }\n        \n        if (actions.modify > 0) {\n            return 'Update existing functionality';\n        }\n        \n        if (actions.delete > 0) {\n            return 'Clean up and remove unused files';\n        }\n        \n        return 'Update project files';\n    }\n    \n    generateDetails(files, fileTypes) {\n        const details = [];\n        \n        // Group by action\n        const added = files.filter(f => f.action === 'add');\n        const modified = files.filter(f => f.action === 'modify');\n        const deleted = files.filter(f => f.action === 'delete');\n        \n        if (added.length > 0) {\n            const addedDetails = added.map(f => `- Added ${f.file}`);\n            if (addedDetails.length <= 5) {\n                details.push(...addedDetails);\n            } else {\n                details.push(`- Added ${added.length} new files`);\n            }\n        }\n        \n        if (modified.length > 0) {\n            details.push(`- Modified ${modified.length} existing files`);\n        }\n        \n        if (deleted.length > 0) {\n            details.push(`- Removed ${deleted.length} files`);\n        }\n        \n        return details;\n    }\n    \n    async generateMessage() {\n        this.updateStatus('Generating...', 'online');\n        \n        try {\n            const changes = await this.analyzeCurrentChanges();\n            const message = this.generateSmartMessage(changes);\n            \n            // Write to commit message file\n            await this.writeCommitMessage(message);\n            \n            this.showPreview(message, changes);\n            this.updateStatus('Message generated', 'online');\n            \n        } catch (error) {\n            this.updateStatus('Generation failed', 'offline');\n            console.error('Commit generation error:', error);\n        }\n    }\n    \n    async writeCommitMessage(message) {\n        // Find and update the commit message file\n        const commitFile = document.querySelector('textarea, input[type=\"text\"]');\n        if (commitFile) {\n            commitFile.value = message;\n            commitFile.dispatchEvent(new Event('input', { bubbles: true }));\n        } else {\n            // Fallback: try to write to file directly\n            try {\n                await fetch('/api/write-commit', {\n                    method: 'POST',\n                    headers: { 'Content-Type': 'application/json' },\n                    body: JSON.stringify({ message })\n                });\n            } catch (error) {\n                console.log('Direct write failed, using clipboard');\n                navigator.clipboard.writeText(message);\n            }\n        }\n    }\n    \n    async quickCommit() {\n        this.updateStatus('Quick committing...', 'online');\n        \n        try {\n            const changes = await this.analyzeCurrentChanges();\n            const message = this.generateQuickMessage(changes);\n            \n            await this.writeCommitMessage(message);\n            \n            // Auto-save if possible\n            const saveEvent = new KeyboardEvent('keydown', {\n                key: 's',\n                ctrlKey: true,\n                bubbles: true\n            });\n            document.dispatchEvent(saveEvent);\n            \n            this.showPreview(`Quick commit: ${message}`, changes);\n            this.updateStatus('Quick commit ready', 'online');\n            \n        } catch (error) {\n            this.updateStatus('Quick commit failed', 'offline');\n        }\n    }\n    \n    generateQuickMessage(changes) {\n        const { staged } = changes;\n        \n        if (staged.length === 1) {\n            const file = staged[0].file;\n            const action = staged[0].action;\n            return `${action === 'add' ? 'Add' : action === 'modify' ? 'Update' : 'Remove'} ${file}`;\n        }\n        \n        if (staged.length <= 3) {\n            return `Update ${staged.map(f => f.file.split('/').pop()).join(', ')}`;\n        }\n        \n        const fileTypes = this.categorizeFiles(staged);\n        const mainType = Object.keys(fileTypes).find(type => \n            fileTypes[type].length > 0 && type !== 'other'\n        );\n        \n        return mainType ? `Update ${mainType} files` : `Update ${staged.length} files`;\n    }\n    \n    async analyzeChanges() {\n        this.updateStatus('Analyzing...', 'online');\n        \n        try {\n            const changes = await this.analyzeCurrentChanges();\n            const analysis = this.performChangeAnalysis(changes);\n            \n            this.showAnalysis(analysis);\n            this.updateStatus('Analysis complete', 'online');\n            \n        } catch (error) {\n            this.updateStatus('Analysis failed', 'offline');\n        }\n    }\n    \n    performChangeAnalysis(changes) {\n        const { staged } = changes;\n        \n        const analysis = {\n            totalFiles: staged.length,\n            fileTypes: this.categorizeFiles(staged),\n            actions: this.categorizeActions(staged),\n            complexity: this.assessComplexity(staged),\n            suggestions: this.generateSuggestions(staged)\n        };\n        \n        return analysis;\n    }\n    \n    assessComplexity(files) {\n        let score = 0;\n        \n        files.forEach(({ file, action }) => {\n            // File type complexity\n            if (file.endsWith('.js')) score += 3;\n            else if (file.endsWith('.json')) score += 1;\n            else if (file.endsWith('.html')) score += 2;\n            else score += 1;\n            \n            // Action complexity\n            if (action === 'add') score += 2;\n            else if (action === 'modify') score += 1;\n            else if (action === 'delete') score += 1;\n        });\n        \n        if (score <= 5) return 'Simple';\n        if (score <= 15) return 'Moderate';\n        return 'Complex';\n    }\n    \n    generateSuggestions(files) {\n        const suggestions = [];\n        \n        if (files.length > 10) {\n            suggestions.push('Consider splitting into multiple commits');\n        }\n        \n        if (files.some(f => f.file.includes('config'))) {\n            suggestions.push('Review configuration changes carefully');\n        }\n        \n        if (files.some(f => f.file.includes('install') || f.file.includes('.sh'))) {\n            suggestions.push('Test installation scripts before committing');\n        }\n        \n        return suggestions;\n    }\n    \n    showPreview(message, changes) {\n        const preview = document.getElementById('commit-preview');\n        preview.innerHTML = `\n            <div class=\"commit-message\">${message}</div>\n            <div class=\"commit-files\">\n                Files: ${changes.staged.map(f => f.file).join(', ')}\n            </div>\n        `;\n        preview.classList.add('show');\n        \n        setTimeout(() => {\n            preview.classList.remove('show');\n        }, 10000);\n    }\n    \n    showAnalysis(analysis) {\n        const preview = document.getElementById('commit-preview');\n        preview.innerHTML = `\n            <div><strong>Analysis:</strong></div>\n            <div>Files: ${analysis.totalFiles}</div>\n            <div>Complexity: ${analysis.complexity}</div>\n            <div>Actions: +${analysis.actions.add} ~${analysis.actions.modify} -${analysis.actions.delete}</div>\n            ${analysis.suggestions.length > 0 ? \n                `<div><strong>Suggestions:</strong><br>${analysis.suggestions.join('<br>')}</div>` : \n                ''\n            }\n        `;\n        preview.classList.add('show');\n    }\n    \n    toggle() {\n        this.isActive = !this.isActive;\n        const button = document.getElementById('commit-toggle');\n        \n        if (this.isActive) {\n            button.textContent = 'Stop';\n            button.classList.add('active');\n            this.updateStatus('Watching for changes', 'online');\n        } else {\n            button.textContent = 'Start';\n            button.classList.remove('active');\n            this.updateStatus('Stopped', 'offline');\n        }\n    }\n    \n    updateStatus(message, type) {\n        const status = document.getElementById('commit-status');\n        const dot = status.querySelector('.status-dot');\n        const text = status.querySelector('span:last-child');\n        \n        dot.className = `status-dot ${type}`;\n        text.textContent = message;\n    }\n}\n\n// Auto-initialize\ndocument.addEventListener('DOMContentLoaded', function() {\n    setTimeout(() => {\n        window.smartCommitAgent = new SmartCommitAgent();\n    }, 1000);\n});\n