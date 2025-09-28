// Auto-Features System - Runs continuously without user interaction
class AutoFeatures {
    constructor() {
        this.deadlines = new Map();
        this.followUps = new Map();
        this.backupInterval = 300000; // 5 minutes
        this.analysisInterval = 60000; // 1 minute
        this.reminderInterval = 3600000; // 1 hour
        
        this.init();
    }
    
    init() {
        this.startDeadlineMonitoring();
        this.startAutoBackup();
        this.startContinuousAnalysis();
        this.startFollowUpTracking();
        this.startSmartCategorization();
        console.log('🤖 Auto-features activated');
    }
    
    // Auto-deadline tracking
    startDeadlineMonitoring() {
        setInterval(() => {
            this.checkDeadlines();
            this.addImpliedDeadlines();
        }, this.analysisInterval);
    }
    
    checkDeadlines() {
        const now = new Date();
        const urgentThreshold = 3; // days
        const warningThreshold = 7; // days
        
        // Check timeline events for deadlines
        caseData.timeline.forEach(event => {
            if (event.date) {
                const eventDate = new Date(event.date);
                const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
                
                if (daysUntil <= urgentThreshold && daysUntil > 0) {
                    this.createUrgentAlert(event, daysUntil);
                } else if (daysUntil <= warningThreshold && daysUntil > 0) {
                    this.createWarningAlert(event, daysUntil);
                }
            }
        });
        
        // Check correspondence for response deadlines
        caseData.correspondence.forEach(item => {
            if (item.status === 'pending' && item.date) {
                const sentDate = new Date(item.date);
                const daysSince = Math.ceil((now - sentDate) / (1000 * 60 * 60 * 24));
                
                if (daysSince >= 10) {
                    this.createFollowUpReminder(item, daysSince);
                }
            }
        });
    }
    
    addImpliedDeadlines() {
        // Auto-add common legal deadlines based on case events
        const legalDeadlines = [
            { trigger: 'esa-request', deadline: 30, title: 'ESA Response Due' },
            { trigger: 'hr-complaint', deadline: 180, title: 'EEOC Filing Deadline' },
            { trigger: 'court-filing', deadline: 30, title: 'Response Deadline' }
        ];
        
        caseData.timeline.forEach(event => {
            legalDeadlines.forEach(rule => {
                if (event.title.toLowerCase().includes(rule.trigger.replace('-', ' '))) {
                    const deadlineDate = new Date(event.date);
                    deadlineDate.setDate(deadlineDate.getDate() + rule.deadline);
                    
                    // Check if deadline already exists
                    const existingDeadline = caseData.timeline.find(e => 
                        e.title === rule.title && 
                        Math.abs(new Date(e.date) - deadlineDate) < 86400000
                    );
                    
                    if (!existingDeadline) {
                        this.addAutoDeadline(deadlineDate, rule.title, event.id);
                    }
                }
            });
        });
    }
    
    addAutoDeadline(date, title, sourceEventId) {
        const deadline = {
            id: `auto-${Date.now()}`,
            date: date.toISOString().split('T')[0],
            title: title,
            description: `Auto-generated deadline based on timeline event`,
            priority: 'high',
            type: 'auto-deadline',
            sourceEvent: sourceEventId
        };
        
        caseData.timeline.push(deadline);
        this.saveAndNotify(`📅 Auto-added deadline: ${title}`);
    }
    
    // Smart document categorization
    startSmartCategorization() {
        setInterval(() => {
            this.categorizePendingItems();
            this.updateRelevanceScores();
        }, this.analysisInterval * 2);
    }
    
    categorizePendingItems() {
        // Auto-categorize evidence without explicit type
        caseData.evidence.forEach(item => {
            if (!item.type || item.type === 'other') {
                item.type = this.inferDocumentType(item.title, item.description);
                item.relevance = this.calculateRelevance(item);
            }
        });
        
        // Auto-tag timeline events
        caseData.timeline.forEach(event => {
            if (!event.tags) {
                event.tags = this.generateTags(event.title, event.description);
            }
        });
    }
    
    inferDocumentType(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        
        if (text.includes('esa') || text.includes('emotional support')) return 'esa-document';
        if (text.includes('medical') || text.includes('doctor') || text.includes('therapist')) return 'medical';
        if (text.includes('hr') || text.includes('human resources')) return 'hr-correspondence';
        if (text.includes('court') || text.includes('legal')) return 'legal-document';
        if (text.includes('caregiver') || text.includes('child')) return 'caregiver-proof';
        if (text.includes('work') || text.includes('performance')) return 'employment';
        
        return 'supporting-document';
    }
    
    calculateRelevance(item) {
        const text = `${item.title} ${item.description}`.toLowerCase();
        let score = 0;
        
        // High-value keywords
        const highValue = ['esa', 'accommodation', 'medical', 'caregiver', 'disability'];
        const mediumValue = ['hr', 'work', 'performance', 'request'];
        const lowValue = ['email', 'note', 'misc'];
        
        highValue.forEach(keyword => {
            if (text.includes(keyword)) score += 3;
        });
        
        mediumValue.forEach(keyword => {
            if (text.includes(keyword)) score += 2;
        });
        
        lowValue.forEach(keyword => {
            if (text.includes(keyword)) score += 1;
        });
        
        if (score >= 6) return 'high';
        if (score >= 3) return 'medium';
        return 'low';
    }
    
    generateTags(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        const tags = [];
        
        const tagMap = {
            'urgent': ['urgent', 'emergency', 'immediate'],
            'legal': ['court', 'legal', 'lawsuit', 'attorney'],
            'medical': ['medical', 'doctor', 'therapist', 'health'],
            'hr': ['hr', 'human resources', 'employer'],
            'esa': ['esa', 'emotional support', 'animal'],
            'deadline': ['deadline', 'due', 'response required']
        };
        
        Object.keys(tagMap).forEach(tag => {
            if (tagMap[tag].some(keyword => text.includes(keyword))) {
                tags.push(tag);
            }
        });
        
        return tags;
    }
    
    // Continuous case analysis
    startContinuousAnalysis() {
        setInterval(() => {
            this.updateCaseStrength();
            this.identifyGaps();
            this.suggestActions();
        }, this.analysisInterval * 3);
    }
    
    updateCaseStrength() {
        const analysis = this.performCaseAnalysis();
        
        // Auto-update strategy if significant change
        if (Math.abs(analysis.strength - (caseData.strategy.lastStrength || 0)) > 5) {
            caseData.strategy = {
                ...caseData.strategy,
                strength: analysis.strength,
                lastStrength: analysis.strength,
                lastUpdated: new Date().toISOString(),
                autoAnalysis: analysis,
                gaps: analysis.gaps,
                recommendations: analysis.recommendations
            };
            
            this.saveAndNotify(`📊 Case strength updated: ${analysis.strength}%`);
        }
    }
    
    performCaseAnalysis() {
        const timeline = caseData.timeline.length;
        const evidence = caseData.evidence.length;
        const correspondence = caseData.correspondence.length;
        
        // Evidence quality scoring
        const highEvidence = caseData.evidence.filter(e => e.relevance === 'high').length;
        const medicalEvidence = caseData.evidence.filter(e => e.type === 'medical').length;
        const esaEvidence = caseData.evidence.filter(e => e.type === 'esa-document').length;
        
        // Timeline completeness
        const recentEvents = caseData.timeline.filter(e => {
            const eventDate = new Date(e.date);
            const monthsAgo = (new Date() - eventDate) / (1000 * 60 * 60 * 24 * 30);
            return monthsAgo <= 6;
        }).length;
        
        // Calculate strength
        let strength = Math.min(95, 
            (timeline * 2) + 
            (evidence * 3) + 
            (correspondence * 2) + 
            (highEvidence * 5) + 
            (medicalEvidence * 8) + 
            (esaEvidence * 10) + 
            (recentEvents * 3)
        );
        
        // Identify gaps
        const gaps = [];
        if (medicalEvidence < 2) gaps.push('Need more medical documentation');
        if (esaEvidence < 1) gaps.push('Missing ESA certification');
        if (recentEvents < 3) gaps.push('Timeline needs recent updates');
        if (correspondence.filter(c => c.status === 'pending').length > 3) {
            gaps.push('Too many pending responses');
        }
        
        // Generate recommendations
        const recommendations = [];
        if (strength < 60) recommendations.push('Gather additional evidence');
        if (gaps.length > 2) recommendations.push('Address documentation gaps');
        if (timeline < 10) recommendations.push('Document more timeline events');
        
        return { strength, gaps, recommendations };
    }
    
    // Auto follow-up tracking
    startFollowUpTracking() {
        setInterval(() => {
            this.checkPendingItems();
            this.generateFollowUpSuggestions();
        }, this.reminderInterval);
    }
    
    checkPendingItems() {
        const now = new Date();
        
        // Check correspondence for overdue responses
        caseData.correspondence.forEach(item => {
            if (item.status === 'pending') {
                const sentDate = new Date(item.date);
                const daysSince = Math.ceil((now - sentDate) / (1000 * 60 * 60 * 24));
                
                if (daysSince >= 7 && !this.followUps.has(item.id)) {
                    this.createFollowUpTask(item, daysSince);
                }
            }
        });
        
        // Check for missing documentation
        this.checkMissingDocumentation();
    }
    
    checkMissingDocumentation() {
        const requiredDocs = [
            { type: 'esa-document', name: 'ESA Medical Letter' },
            { type: 'medical', name: 'Medical Documentation' },
            { type: 'caregiver-proof', name: 'Caregiver Evidence' },
            { type: 'employment', name: 'Work Performance Records' }
        ];
        
        requiredDocs.forEach(doc => {
            const hasDoc = caseData.evidence.some(e => e.type === doc.type);
            if (!hasDoc) {
                this.suggestDocumentCollection(doc);
            }
        });
    }
    
    createFollowUpTask(item, daysSince) {
        const task = {
            id: `followup-${item.id}`,
            type: 'follow-up',
            priority: daysSince > 14 ? 'urgent' : 'high',
            title: `Follow up on: ${item.subject}`,
            description: `No response received for ${daysSince} days`,
            created: new Date().toISOString(),
            sourceItem: item.id
        };
        
        this.followUps.set(item.id, task);
        this.addAutoTimelineEvent(task);
    }
    
    suggestDocumentCollection(doc) {
        const suggestion = {
            id: `collect-${doc.type}`,
            type: 'document-collection',
            priority: 'medium',
            title: `Collect: ${doc.name}`,
            description: `Missing required documentation type: ${doc.type}`,
            created: new Date().toISOString()
        };
        
        // Only add if not already suggested recently
        const recentSuggestion = caseData.timeline.find(e => 
            e.title === suggestion.title && 
            (new Date() - new Date(e.date)) < 7 * 24 * 60 * 60 * 1000
        );
        
        if (!recentSuggestion) {
            this.addAutoTimelineEvent(suggestion);
        }
    }
    
    addAutoTimelineEvent(event) {
        const timelineEvent = {
            id: event.id,
            date: new Date().toISOString().split('T')[0],
            title: event.title,
            description: event.description,
            priority: event.priority,
            type: 'auto-suggestion',
            autoGenerated: true
        };
        
        caseData.timeline.push(timelineEvent);
        this.saveAndNotify(`🤖 Auto-suggestion: ${event.title}`);
    }
    
    // Auto-backup system
    startAutoBackup() {
        setInterval(() => {
            this.createBackup();
            this.cleanOldBackups();
        }, this.backupInterval);
    }
    
    createBackup() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                data: JSON.parse(JSON.stringify(caseData)),
                version: '2.0',
                autoBackup: true
            };
            
            const backupKey = `backup-${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(backup));
            
            // Keep reference to latest backup
            localStorage.setItem('latestBackup', backupKey);
            
        } catch (error) {
            console.error('Auto-backup failed:', error);
        }
    }
    
    cleanOldBackups() {
        try {
            const keys = Object.keys(localStorage);
            const backupKeys = keys.filter(key => key.startsWith('backup-'));
            
            // Keep only last 10 backups
            if (backupKeys.length > 10) {
                backupKeys.sort();
                const toDelete = backupKeys.slice(0, backupKeys.length - 10);
                toDelete.forEach(key => localStorage.removeItem(key));
            }
        } catch (error) {
            console.error('Backup cleanup failed:', error);
        }
    }
    
    // Utility methods
    createUrgentAlert(event, daysUntil) {
        const alert = {
            type: 'urgent',
            message: `⚠️ URGENT: ${event.title} in ${daysUntil} days`,
            event: event,
            created: new Date().toISOString()
        };
        
        this.showPersistentAlert(alert);
    }
    
    createWarningAlert(event, daysUntil) {
        const alert = {
            type: 'warning',
            message: `⏰ Upcoming: ${event.title} in ${daysUntil} days`,
            event: event,
            created: new Date().toISOString()
        };
        
        this.showPersistentAlert(alert);
    }
    
    createFollowUpReminder(item, daysSince) {
        const reminder = {
            type: 'follow-up',
            message: `📧 Follow-up needed: ${item.subject} (${daysSince} days ago)`,
            item: item,
            created: new Date().toISOString()
        };
        
        this.showPersistentAlert(reminder);
    }
    
    showPersistentAlert(alert) {
        // Create persistent notification that stays until acknowledged
        const alertDiv = document.createElement('div');
        alertDiv.className = `persistent-alert ${alert.type}`;
        alertDiv.innerHTML = `
            <div class="alert-content">
                <span class="alert-message">${alert.message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="alert-close">×</button>
            </div>
        `;
        
        // Add to top of page
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        // Auto-remove after 30 seconds for non-urgent alerts
        if (alert.type !== 'urgent') {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 30000);
        }
    }
    
    saveAndNotify(message) {
        try {
            localStorage.setItem('amazonQCaseData', JSON.stringify(caseData));
            
            // Show subtle notification
            const notification = document.createElement('div');
            notification.className = 'auto-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #2c3e50;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 1000;
                opacity: 0.8;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 3000);
            
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for main system to initialize first
    setTimeout(() => {
        window.autoFeatures = new AutoFeatures();
    }, 2000);
});

// Add CSS for auto-features
const autoFeaturesCSS = `
.persistent-alert {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    padding: 15px;
    font-weight: bold;
    text-align: center;
}

.persistent-alert.urgent {
    background: #e74c3c;
    color: white;
    animation: pulse 2s infinite;
}

.persistent-alert.warning {
    background: #f39c12;
    color: white;
}

.persistent-alert.follow-up {
    background: #3498db;
    color: white;
}

.alert-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.alert-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 20px;
    cursor: pointer;
    padding: 0 10px;
}

.auto-notification {
    transition: opacity 0.3s ease;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = autoFeaturesCSS;
document.head.appendChild(style);