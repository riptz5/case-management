// AI Toolkit Integration for Caregiver Case
class AIToolkit {
    constructor() {
        this.aiTools = {
            chat: { name: 'AI Case Chat', script: 'case-ai-chat.py', icon: '🤖', port: 7860 },
            analyze: { name: 'Document Analysis', script: 'analyze-legal-doc.py', icon: '📄' },
            transcribe: { name: 'Smart Transcribe', script: 'smart-transcribe.py', icon: '🗣️' },
            categorize: { name: 'Auto Categorize', script: 'categorize-evidence.py', icon: '📁' },
            strength: { name: 'Case Strength', script: 'analyze-case-strength.py', icon: '📊' },
            ocr: { name: 'Smart OCR', cmd: 'tesseract', icon: '👁️' },
            translate: { name: 'Translate', service: 'local', icon: '🌐' },
            summarize: { name: 'Summarize', service: 'local', icon: '📝' },
            sentiment: { name: 'Sentiment', service: 'local', icon: '😊' },
            keywords: { name: 'Extract Keywords', service: 'local', icon: '🏷️' },
            timeline: { name: 'Auto Timeline', service: 'local', icon: '📅' },
            evidence: { name: 'Evidence Score', service: 'local', icon: '⚖️' },
            predict: { name: 'Outcome Predict', service: 'local', icon: '🔮' },
            generate: { name: 'Generate Forms', service: 'local', icon: '📋' },
            voice: { name: 'Voice Assistant', service: 'local', icon: '🎤' }
        };
        
        this.isProcessing = false;
        this.init();
    }
    
    init() {
        this.createAIPanel();
        this.setupAIServices();
        console.log('🤖 AI Toolkit loaded');
    }
    
    createAIPanel() {
        const panel = document.createElement('div');
        panel.id = 'ai-toolkit';
        panel.innerHTML = `
            <div class="ai-header">
                <h3>🤖 AI Assistant</h3>
                <div class="ai-status" id="ai-status">🟢 Ready</div>
                <button onclick="this.parentElement.parentElement.classList.toggle('minimized')">−</button>
            </div>
            
            <div class="ai-quick-chat">
                <input type="text" id="ai-question" placeholder="Ask about your case..." />
                <button onclick="aiToolkit.quickAsk()">Ask</button>
            </div>
            
            <div class="ai-tools-grid">
                ${Object.entries(this.aiTools).map(([key, tool]) => `
                    <button class="ai-tool-btn" onclick="aiToolkit.useAI('${key}')" 
                            title="${tool.name}">
                        <span class="ai-icon">${tool.icon}</span>
                        <span class="ai-name">${tool.name}</span>
                    </button>
                `).join('')}
            </div>
            
            <div class="ai-results" id="ai-results"></div>
        `;
        
        document.body.appendChild(panel);
        this.addAIStyles();
    }
    
    addAIStyles() {
        const css = `
            #ai-toolkit {
                position: fixed;
                left: 20px;
                top: 100px;
                width: 300px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                padding: 20px;
                z-index: 1001;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }
            
            #ai-toolkit.minimized .ai-quick-chat,
            #ai-toolkit.minimized .ai-tools-grid,
            #ai-toolkit.minimized .ai-results {
                display: none;
            }
            
            .ai-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.2);
                padding-bottom: 10px;
            }
            
            .ai-header h3 {
                margin: 0;
                font-size: 16px;
            }
            
            .ai-status {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 10px;
                background: rgba(255,255,255,0.2);
            }
            
            .ai-header button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }
            
            .ai-quick-chat {
                display: flex;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .ai-quick-chat input {
                flex: 1;
                padding: 8px;
                border: none;
                border-radius: 5px;
                background: rgba(255,255,255,0.9);
                font-size: 12px;
            }
            
            .ai-quick-chat button {
                background: #27ae60;
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .ai-tools-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .ai-tool-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 10px 5px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 10px;
                transition: all 0.2s;
            }
            
            .ai-tool-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-2px);
            }
            
            .ai-tool-btn.processing {
                background: #f39c12;
                animation: pulse 1s infinite;
            }
            
            .ai-icon {
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .ai-results {
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
                padding: 10px;
                font-size: 12px;
                max-height: 200px;
                overflow-y: auto;
                display: none;
            }
            
            .ai-results.show {
                display: block;
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    setupAIServices() {
        // Initialize local AI services
        this.loadTransformers();
        this.setupVoiceRecognition();
    }
    
    async loadTransformers() {
        try {
            // Check if transformers are available
            const response = await fetch('/api/ai-status');
            if (response.ok) {
                this.updateStatus('🟢 AI Ready');
            } else {
                this.updateStatus('🟡 AI Loading...');
            }
        } catch (error) {
            this.updateStatus('🔴 AI Offline');
        }
    }
    
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('ai-question').value = transcript;
                this.quickAsk();
            };
        }
    }
    
    async useAI(toolKey) {
        const tool = this.aiTools[toolKey];
        const btn = event.target.closest('.ai-tool-btn');
        
        btn.classList.add('processing');
        this.updateStatus('🔄 Processing...');
        
        try {
            switch (toolKey) {
                case 'chat':
                    await this.startAIChat();
                    break;
                case 'analyze':
                    await this.analyzeDocument();
                    break;
                case 'transcribe':
                    await this.smartTranscribe();
                    break;
                case 'categorize':
                    await this.categorizeEvidence();
                    break;
                case 'strength':
                    await this.analyzeCaseStrength();
                    break;
                case 'voice':
                    this.startVoiceAssistant();
                    break;
                default:
                    await this.runAIService(toolKey);
            }
        } catch (error) {
            this.showResult(`❌ Error: ${error.message}`);
        } finally {
            btn.classList.remove('processing');
            this.updateStatus('🟢 Ready');
        }
    }
    
    async quickAsk() {
        const question = document.getElementById('ai-question').value;
        if (!question.trim()) return;
        
        this.updateStatus('🤔 Thinking...');
        
        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    question: question,
                    context: this.getCaseContext()
                })
            });
            
            const result = await response.json();
            this.showResult(`Q: ${question}\nA: ${result.answer}`);
            
        } catch (error) {
            this.showResult(`❌ Could not get AI response: ${error.message}`);
        }
        
        document.getElementById('ai-question').value = '';
        this.updateStatus('🟢 Ready');
    }
    
    async startAIChat() {
        // Open AI chat interface
        window.open('http://localhost:7860', '_blank');
        this.showResult('🌐 AI Chat opened in new window');
    }
    
    async analyzeDocument() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.pdf,.doc,.docx';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const result = await this.processFile(file, 'analyze-legal-doc.py');
                this.showResult(result);
            }
        };
        input.click();
    }
    
    async smartTranscribe() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const result = await this.processFile(file, 'smart-transcribe.py');
                this.showResult(result);
                this.addTranscriptToCase(result);
            }
        };
        input.click();
    }
    
    async categorizeEvidence() {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            const result = await this.processFiles(files, 'categorize-evidence.py');
            this.showResult(result);
        };
        input.click();
    }
    
    async analyzeCaseStrength() {
        const caseData = this.getCaseData();
        const result = await this.runPythonScript('analyze-case-strength.py', caseData);
        this.showResult(result);
        this.updateCaseStrength(result);
    }
    
    startVoiceAssistant() {
        if (this.recognition) {
            this.recognition.start();
            this.showResult('🎤 Listening... Speak your question.');
        } else {
            this.showResult('❌ Voice recognition not supported');
        }
    }
    
    async runAIService(service) {
        const services = {
            translate: () => this.translateText(),
            summarize: () => this.summarizeContent(),
            sentiment: () => this.analyzeSentiment(),
            keywords: () => this.extractKeywords(),
            timeline: () => this.generateTimeline(),
            evidence: () => this.scoreEvidence(),
            predict: () => this.predictOutcome(),
            generate: () => this.generateForms()
        };
        
        if (services[service]) {
            await services[service]();
        }
    }
    
    async translateText() {
        const text = prompt('Enter text to translate:');
        if (text) {
            const result = await this.callAIAPI('translate', { text, target: 'en' });
            this.showResult(`Translation: ${result.translation}`);
        }
    }
    
    async summarizeContent() {
        const caseData = this.getCaseData();
        const content = this.extractTextFromCase(caseData);
        const result = await this.callAIAPI('summarize', { text: content });
        this.showResult(`Summary: ${result.summary}`);
    }
    
    async analyzeSentiment() {
        const caseData = this.getCaseData();
        const content = this.extractTextFromCase(caseData);
        const result = await this.callAIAPI('sentiment', { text: content });
        this.showResult(`Sentiment: ${result.sentiment} (${result.confidence})`);
    }
    
    async extractKeywords() {
        const caseData = this.getCaseData();
        const content = this.extractTextFromCase(caseData);
        const result = await this.callAIAPI('keywords', { text: content });
        this.showResult(`Keywords: ${result.keywords.join(', ')}`);
    }
    
    async generateTimeline() {
        const caseData = this.getCaseData();
        const result = await this.callAIAPI('timeline', { data: caseData });
        this.showResult(`Generated ${result.events.length} timeline events`);
        this.addTimelineEvents(result.events);
    }
    
    async scoreEvidence() {
        const caseData = this.getCaseData();
        const result = await this.callAIAPI('evidence-score', { evidence: caseData.evidence });
        this.showResult(`Evidence Score: ${result.score}/100`);
    }
    
    async predictOutcome() {
        const caseData = this.getCaseData();
        const result = await this.callAIAPI('predict', { data: caseData });
        this.showResult(`Predicted Outcome: ${result.prediction} (${result.confidence}% confidence)`);
    }
    
    async generateForms() {
        const caseData = this.getCaseData();
        const result = await this.callAIAPI('generate-forms', { data: caseData });
        this.showResult(`Generated ${result.forms.length} forms`);
    }
    
    // Utility methods
    async processFile(file, script) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('script', script);
        
        const response = await fetch('/api/process-file', {
            method: 'POST',
            body: formData
        });
        
        return await response.text();
    }
    
    async processFiles(files, script) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        formData.append('script', script);
        
        const response = await fetch('/api/process-files', {
            method: 'POST',
            body: formData
        });
        
        return await response.text();
    }
    
    async runPythonScript(script, data) {
        const response = await fetch('/api/run-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script, data })
        });
        
        return await response.text();
    }
    
    async callAIAPI(endpoint, data) {
        const response = await fetch(`/api/ai/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        return await response.json();
    }
    
    getCaseData() {
        return JSON.parse(localStorage.getItem('amazonQCaseData') || '{}');
    }
    
    getCaseContext() {
        const data = this.getCaseData();
        let context = '';
        
        if (data.timeline) {
            context += 'Timeline: ' + data.timeline.map(e => `${e.title}: ${e.description}`).join('. ');
        }
        
        if (data.evidence) {
            context += ' Evidence: ' + data.evidence.map(e => `${e.title}: ${e.description}`).join('. ');
        }
        
        return context.substring(0, 2000);
    }
    
    extractTextFromCase(caseData) {
        let text = '';
        
        ['timeline', 'evidence', 'correspondence'].forEach(section => {
            if (caseData[section]) {
                caseData[section].forEach(item => {
                    text += `${item.title || ''} ${item.description || ''} `;
                });
            }
        });
        
        return text;
    }
    
    addTranscriptToCase(transcript) {
        const caseData = this.getCaseData();
        if (!caseData.timeline) caseData.timeline = [];
        
        caseData.timeline.push({
            id: `transcript-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Voice Note Transcript',
            description: transcript,
            type: 'ai-generated'
        });
        
        this.saveCaseData(caseData);
    }
    
    addTimelineEvents(events) {
        const caseData = this.getCaseData();
        if (!caseData.timeline) caseData.timeline = [];
        
        events.forEach(event => {
            caseData.timeline.push({
                ...event,
                id: `ai-${Date.now()}-${Math.random()}`,
                type: 'ai-generated'
            });
        });
        
        this.saveCaseData(caseData);
    }
    
    updateCaseStrength(analysis) {
        const caseData = this.getCaseData();
        if (!caseData.strategy) caseData.strategy = {};
        
        caseData.strategy.aiAnalysis = analysis;
        caseData.strategy.lastAIUpdate = new Date().toISOString();
        
        this.saveCaseData(caseData);
    }
    
    saveCaseData(data) {
        localStorage.setItem('amazonQCaseData', JSON.stringify(data));
    }
    
    updateStatus(status) {
        document.getElementById('ai-status').textContent = status;
    }
    
    showResult(result) {
        const resultsDiv = document.getElementById('ai-results');
        resultsDiv.textContent = result;
        resultsDiv.classList.add('show');
        
        setTimeout(() => {
            resultsDiv.classList.remove('show');
        }, 10000);
    }
}

// Initialize AI toolkit
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.aiToolkit = new AIToolkit();
    }, 2000);
});