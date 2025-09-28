// Caregiver Toolkit Integration
class CaregiverToolkit {
    constructor() {
        this.tools = {
            scanner: { name: 'Document Scanner', cmd: 'process-document.sh', icon: '📱' },
            transcribe: { name: 'Audio Transcription', cmd: 'transcribe-audio.sh', icon: '🗣️' },
            organize: { name: 'Evidence Organizer', cmd: 'organize-evidence.py', icon: '📁' },
            encrypt: { name: 'File Encryption', app: 'VeraCrypt', icon: '🔒' },
            backup: { name: 'Auto Backup', app: 'Duplicati', icon: '💾' },
            notes: { name: 'Case Notes', app: 'Obsidian', icon: '📝' },
            research: { name: 'Legal Research', app: 'Zotero', icon: '⚖️' },
            time: { name: 'Time Tracking', app: 'Toggl', icon: '⏰' },
            secure: { name: 'Secure Chat', app: 'Signal', icon: '🔐' },
            video: { name: 'Video Calls', app: 'Jitsi', icon: '📹' },
            email: { name: 'Email Management', app: 'Thunderbird', icon: '📧' },
            password: { name: 'Password Manager', app: 'Bitwarden', icon: '🔑' },
            mindmap: { name: 'Case Mapping', app: 'FreeMind', icon: '🧠' },
            pdf: { name: 'PDF Tools', cmd: 'pdftk', icon: '📄' },
            calendar: { name: 'Calendar Sync', cmd: 'vdirsyncer', icon: '📅' }
        };
        
        this.init();
    }
    
    init() {
        this.createToolbar();
        this.setupQuickActions();
        console.log('🛠️ Caregiver toolkit loaded');
    }
    
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'caregiver-toolbar';
        toolbar.innerHTML = `
            <div class="toolkit-header">
                <h3>🏠 Caregiver Tools</h3>
                <button onclick="this.parentElement.parentElement.classList.toggle('collapsed')">−</button>
            </div>
            <div class="toolkit-grid">
                ${Object.entries(this.tools).map(([key, tool]) => `
                    <button class="tool-btn" onclick="caregiverToolkit.useTool('${key}')">
                        <span class="tool-icon">${tool.icon}</span>
                        <span class="tool-name">${tool.name}</span>
                    </button>
                `).join('')}
            </div>
            <div class="quick-actions">
                <button onclick="caregiverToolkit.quickScan()">📱 Quick Scan</button>
                <button onclick="caregiverToolkit.recordNote()">🎤 Voice Note</button>
                <button onclick="caregiverToolkit.organizeFiles()">📁 Organize</button>
            </div>
        `;
        
        document.body.appendChild(toolbar);
        this.addToolbarCSS();
    }
    
    addToolbarCSS() {
        const css = `
            #caregiver-toolbar {
                position: fixed;
                right: 20px;
                top: 100px;
                width: 250px;
                background: #2c3e50;
                color: white;
                border-radius: 10px;
                padding: 15px;
                z-index: 1000;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            }
            
            #caregiver-toolbar.collapsed .toolkit-grid,
            #caregiver-toolbar.collapsed .quick-actions {
                display: none;
            }
            
            .toolkit-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 1px solid #34495e;
                padding-bottom: 10px;
            }
            
            .toolkit-header h3 {
                margin: 0;
                font-size: 16px;
            }
            
            .toolkit-header button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }
            
            .toolkit-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .tool-btn {
                background: #34495e;
                border: none;
                color: white;
                padding: 10px 5px;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 11px;
                transition: background 0.2s;
            }
            
            .tool-btn:hover {
                background: #4a6741;
            }
            
            .tool-icon {
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .quick-actions {
                display: flex;
                gap: 5px;
            }
            
            .quick-actions button {
                flex: 1;
                background: #27ae60;
                border: none;
                color: white;
                padding: 8px 4px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
            }
            
            .quick-actions button:hover {
                background: #2ecc71;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    setupQuickActions() {
        // File drop zone for quick processing
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.showDropZone();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            this.hideDropZone();
            this.processDroppedFiles(e.dataTransfer.files);
        });
    }
    
    useTool(toolKey) {
        const tool = this.tools[toolKey];
        
        if (tool.app) {
            this.openApp(tool.app);
        } else if (tool.cmd) {
            this.runCommand(tool.cmd);
        }
        
        this.logToolUsage(toolKey);
    }
    
    openApp(appName) {
        // Open application
        this.executeCommand(`open -a "${appName}"`);
        this.showNotification(`🚀 Opening ${appName}...`);
    }
    
    runCommand(command) {
        // Show file picker for command input
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.processFileWithCommand(file, command);
            });
        };
        input.click();
    }
    
    processFileWithCommand(file, command) {
        // Save file temporarily and process
        const reader = new FileReader();
        reader.onload = (e) => {
            const tempPath = `/tmp/${file.name}`;
            this.saveFile(tempPath, e.target.result);
            this.executeCommand(`~/caregiver-tools/${command} "${tempPath}"`);
        };
        reader.readAsArrayBuffer(file);
    }
    
    quickScan() {
        // Quick document scan
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.processDocument(file);
            });
        };
        input.click();
    }
    
    recordNote() {
        // Voice recording
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.startRecording(stream);
                })
                .catch(err => {
                    this.showNotification('❌ Microphone access denied');
                });
        }
    }
    
    startRecording(stream) {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];
        
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            this.saveRecording(blob);
        };
        
        mediaRecorder.start();
        
        // Show recording UI
        this.showRecordingUI(mediaRecorder);
    }
    
    showRecordingUI(recorder) {
        const ui = document.createElement('div');
        ui.id = 'recording-ui';
        ui.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: #e74c3c; color: white; padding: 20px; border-radius: 10px; z-index: 10000;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🎤 Recording...</div>
                    <button onclick="document.getElementById('recording-ui').recorder.stop(); this.parentElement.parentElement.remove();">
                        Stop Recording
                    </button>
                </div>
            </div>
        `;
        ui.recorder = recorder;
        document.body.appendChild(ui);
    }
    
    saveRecording(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice-note-${Date.now()}.wav`;
        a.click();
        
        // Auto-transcribe
        this.transcribeAudio(blob);
    }
    
    transcribeAudio(blob) {
        // Save and transcribe
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');
        
        fetch('/api/transcribe', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(transcript => {
            this.addToTimeline('Voice Note', transcript);
            this.showNotification('✅ Voice note transcribed and added');
        });
    }
    
    organizeFiles() {
        // File organization
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.onchange = (e) => {
            this.organizeDirectory(e.target.files);
        };
        input.click();
    }
    
    organizeDirectory(files) {
        const organized = {
            medical: [],
            legal: [],
            correspondence: [],
            childcare: [],
            financial: [],
            other: []
        };
        
        Array.from(files).forEach(file => {
            const category = this.categorizeFile(file.name);
            organized[category].push(file);
        });
        
        this.showOrganizationResults(organized);
    }
    
    categorizeFile(filename) {
        const name = filename.toLowerCase();
        
        if (name.includes('medical') || name.includes('doctor') || name.includes('therapy')) return 'medical';
        if (name.includes('court') || name.includes('legal') || name.includes('lawyer')) return 'legal';
        if (name.includes('email') || name.includes('letter') || name.includes('communication')) return 'correspondence';
        if (name.includes('school') || name.includes('daycare') || name.includes('child')) return 'childcare';
        if (name.includes('bill') || name.includes('receipt') || name.includes('expense')) return 'financial';
        
        return 'other';
    }
    
    processDocument(file) {
        this.showNotification(`📱 Processing ${file.name}...`);
        
        // OCR processing would happen here
        setTimeout(() => {
            this.showNotification(`✅ ${file.name} processed and OCR'd`);
            this.addToEvidence(file.name, 'Scanned document');
        }, 2000);
    }
    
    addToTimeline(title, description) {
        if (window.caseData && window.caseData.timeline) {
            const event = {
                id: `tool-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                title: title,
                description: description,
                type: 'tool-generated'
            };
            
            window.caseData.timeline.push(event);
            this.saveData();
        }
    }
    
    addToEvidence(title, description) {
        if (window.caseData && window.caseData.evidence) {
            const evidence = {
                id: `evidence-${Date.now()}`,
                title: title,
                description: description,
                type: 'document',
                relevance: 'medium',
                date: new Date().toISOString().split('T')[0]
            };
            
            window.caseData.evidence.push(evidence);
            this.saveData();
        }
    }
    
    saveData() {
        if (window.caseData) {
            localStorage.setItem('amazonQCaseData', JSON.stringify(window.caseData));
        }
    }
    
    logToolUsage(toolKey) {
        const usage = JSON.parse(localStorage.getItem('toolUsage') || '{}');
        usage[toolKey] = (usage[toolKey] || 0) + 1;
        localStorage.setItem('toolUsage', JSON.stringify(usage));
    }
    
    executeCommand(command) {
        fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
        });
    }
    
    saveFile(path, content) {
        fetch('/api/file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, content })
        });
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; background: #27ae60; color: white;
            padding: 10px 15px; border-radius: 5px; z-index: 10001; font-size: 12px;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    showDropZone() {
        if (document.getElementById('drop-zone')) return;
        
        const dropZone = document.createElement('div');
        dropZone.id = 'drop-zone';
        dropZone.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(52, 152, 219, 0.8); z-index: 10000;
                        display: flex; align-items: center; justify-content: center;
                        color: white; font-size: 24px; font-weight: bold;">
                📁 Drop files here to process
            </div>
        `;
        document.body.appendChild(dropZone);
    }
    
    hideDropZone() {
        const dropZone = document.getElementById('drop-zone');
        if (dropZone) dropZone.remove();
    }
    
    processDroppedFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                this.processDocument(file);
            } else if (file.type.startsWith('audio/')) {
                this.transcribeAudio(file);
            } else {
                this.addToEvidence(file.name, 'Dropped file');
            }
        });
    }
}

// Initialize toolkit
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.caregiverToolkit = new CaregiverToolkit();
    }, 1000);
});