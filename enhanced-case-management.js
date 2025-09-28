// Enhanced Case Management System with Auto-Integration
let caseData = {
    timeline: [],
    evidence: [],
    correspondence: [],
    strategy: {},
    archived: {
        timeline: [],
        evidence: [],
        analysis: {}
    }
};

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeTabs();
        loadCaseData();
        loadArchivedData();
        renderAllSections();
        startAutoSync();
        initializeEnhancedFeatures();
    } catch (error) {
        console.error('Initialization failed:', error);
        showErrorMessage('System initialization failed. Please refresh the page.');
    }
});

// Load archived data from Python automation
async function loadArchivedData() {
    try {
        const response = await fetch('./archived_case_data.json');
        if (response.ok) {
            const archivedData = await response.json();
            
            // Merge archived data with existing data
            if (archivedData.timeline) {
                caseData.archived.timeline = archivedData.timeline;
                caseData.timeline = [...caseData.timeline, ...archivedData.timeline];
            }
            
            if (archivedData.evidence) {
                caseData.archived.evidence = archivedData.evidence;
                caseData.evidence = [...caseData.evidence, ...archivedData.evidence];
            }
            
            if (archivedData.strategy) {
                caseData.archived.analysis = archivedData.strategy;
            }
            
            console.log('Archived data loaded successfully');
            showSuccessMessage('Archived case data integrated successfully');
        }
    } catch (error) {
        console.error('Failed to load archived data:', error);
        // Continue without archived data
    }
}

// Enhanced timeline rendering with archived data
function renderTimeline() {
    try {
        const container = document.getElementById('timeline-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Sort all timeline events by date
        const allEvents = [...caseData.timeline].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        allEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `timeline-item ${event.type || 'manual'}`;
            
            const priorityClass = event.priority || 'medium';
            const isArchived = event.type === 'archived';
            
            eventDiv.innerHTML = `
                <div class="timeline-date">${formatDate(event.date)}</div>
                <div class="timeline-content">
                    <div class="timeline-title">
                        ${event.title}
                        ${isArchived ? '<span class="archived-badge">📁 Archived</span>' : ''}
                    </div>
                    <div class="timeline-description">${event.description}</div>
                    <div class="timeline-tags">
                        <span class="tag ${priorityClass}">${priorityClass}</span>
                        <span class="tag">${event.type || 'manual'}</span>
                        ${isArchived ? '<span class="tag archived">archived</span>' : ''}
                    </div>
                </div>
                ${!isArchived ? `<button onclick="removeTimelineEvent('${event.id}')" class="remove-btn">×</button>` : ''}
            `;
            
            container.appendChild(eventDiv);
        });
        
        updateTimelineStats();
    } catch (error) {
        console.error('Timeline rendering failed:', error);
        showErrorMessage('Failed to render timeline');
    }
}

// Enhanced evidence rendering with categorization
function renderEvidence() {
    try {
        const container = document.getElementById('evidence-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Group evidence by type
        const evidenceByType = {};
        caseData.evidence.forEach(evidence => {
            const type = evidence.type || 'other';
            if (!evidenceByType[type]) {
                evidenceByType[type] = [];
            }
            evidenceByType[type].push(evidence);
        });
        
        // Render by category
        Object.keys(evidenceByType).forEach(type => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'evidence-category';
            categoryDiv.innerHTML = `<h3 class="category-title">${type.toUpperCase()} (${evidenceByType[type].length})</h3>`;
            
            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'category-grid';
            
            evidenceByType[type].forEach(evidence => {
                const evidenceDiv = document.createElement('div');
                evidenceDiv.className = 'evidence-card';
                
                const isArchived = evidence.id && typeof evidence.id === 'number' && evidence.id < 0;
                const relevanceClass = evidence.relevance || 'medium';
                
                evidenceDiv.innerHTML = `
                    <div class="evidence-type">${evidence.type}</div>
                    <h4>${evidence.title}</h4>
                    <p>${evidence.description}</p>
                    <div class="timeline-tags">
                        <span class="tag ${relevanceClass}">${relevanceClass}</span>
                        <span class="tag">${evidence.dateAdded}</span>
                        ${isArchived ? '<span class="tag archived">archived</span>' : ''}
                    </div>
                    ${!isArchived ? `<button onclick="removeEvidence('${evidence.id}')" class="remove-btn">×</button>` : ''}
                `;
                
                categoryGrid.appendChild(evidenceDiv);
            });
            
            categoryDiv.appendChild(categoryGrid);
            container.appendChild(categoryDiv);
        });
        
        updateEvidenceStats();
    } catch (error) {
        console.error('Evidence rendering failed:', error);
        showErrorMessage('Failed to render evidence');
    }
}

// Enhanced strategy analysis with archived data
function generateStrategy() {
    try {
        const timelineCount = caseData.timeline.length;
        const evidenceCount = caseData.evidence.length;
        const correspondenceCount = caseData.correspondence.length;
        const archivedAnalysis = caseData.archived.analysis || {};
        
        // Enhanced case strength calculation
        let strength = Math.min(90, (timelineCount * 8) + (evidenceCount * 12) + (correspondenceCount * 5));
        
        // Boost from archived analysis
        if (archivedAnalysis.case_strength_score) {
            strength = Math.max(strength, archivedAnalysis.case_strength_score);
        }
        
        // Update UI
        const strengthBar = document.getElementById('case-strength');
        const strengthText = document.getElementById('strength-text');
        
        if (strengthBar && strengthText) {
            strengthBar.style.width = strength + '%';
            strengthText.textContent = `${strength}% - ${getStrengthLabel(strength)}`;
        }
        
        // Enhanced risk factors
        const risks = [
            'Incomplete ESA documentation',
            'Insufficient sole caregiver proof',
            'Missing HR response timeline',
            'Lack of work performance evidence'
        ];
        
        // Add risks based on archived analysis
        if (archivedAnalysis.high_priority_evidence < 3) {
            risks.push('Limited high-priority evidence');
        }
        
        updateListElement('risk-factors', risks);
        
        // Enhanced strengths
        const strengths = [
            'Documented ESA medical necessity',
            'Clear sole caregiver responsibilities',
            'Maintained work performance',
            'Reasonable accommodation request'
        ];
        
        // Add strengths from archived data
        if (timelineCount > 10) {
            strengths.push('Comprehensive timeline documentation');
        }
        if (evidenceCount > 15) {
            strengths.push('Extensive evidence collection');
        }
        
        updateListElement('case-strengths', strengths);
        
        // Enhanced next actions
        const actions = [
            'Follow up on pending HR requests',
            'Gather additional caregiver documentation',
            'Document all HR interactions',
            'Prepare for potential escalation',
            'Review archived evidence for gaps',
            'Update case timeline with recent events'
        ];
        
        updateListElement('next-actions', actions);
        
    } catch (error) {
        console.error('Strategy generation failed:', error);
        showErrorMessage('Failed to generate strategy analysis');
    }
}

// Enhanced template system with legal forms
function useTemplate(templateType) {
    try {
        let template = '';
        
        switch(templateType) {
            case 'esa-request':
                template = generateESARequestTemplate();
                break;
            case 'caregiver-statement':
                template = generateCaregiverStatementTemplate();
                break;
            case 'hr-followup':
                template = generateHRFollowupTemplate();
                break;
            case 'evidence-summary':
                template = generateEvidenceSummaryTemplate();
                break;
            case 'legal-demand':
                template = generateLegalDemandTemplate();
                break;
            case 'accommodation-appeal':
                template = generateAccommodationAppealTemplate();
                break;
        }
        
        const outputElement = document.getElementById('template-output');
        if (outputElement) {
            outputElement.innerHTML = `<pre>${template}</pre>`;
            
            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy to Clipboard';
            copyBtn.className = 'copy-btn';
            copyBtn.onclick = () => copyToClipboard(template);
            outputElement.appendChild(copyBtn);
        }
        
    } catch (error) {
        console.error('Template generation failed:', error);
        showErrorMessage('Failed to generate template');
    }
}

// Enhanced template generators
function generateESARequestTemplate() {
    const currentDate = new Date().toLocaleDateString();
    return `Subject: Formal Request for Emotional Support Animal Accommodation

Date: ${currentDate}

Dear HR Department,

I am formally requesting a reasonable accommodation under the Americans with Disabilities Act (ADA) and Fair Housing Act for my emotional support animal (ESA).

ACCOMMODATION REQUEST:
• Permission to have my ESA in workplace/housing as needed
• Flexible work arrangements to accommodate caregiving responsibilities
• Waiver of pet fees or restrictions for ESA

SUPPORTING DOCUMENTATION:
• ESA letter from licensed mental health professional (attached)
• Sole caregiver documentation and responsibilities
• Work performance records demonstrating capability
• Medical necessity documentation

LEGAL BASIS:
As the sole caregiver for [family member], this accommodation is essential for:
1. Managing disability-related symptoms
2. Maintaining employment while fulfilling caregiving duties
3. Ensuring reasonable accommodation under federal law

I am available to discuss this request and provide any additional documentation required. Please confirm receipt and provide timeline for accommodation review.

Thank you for your consideration of this legally protected accommodation request.

Sincerely,
[Your Name]
[Contact Information]
[Date]

ATTACHMENTS:
- ESA Medical Letter
- Caregiver Documentation
- Work Performance Records`;
}

function generateLegalDemandTemplate() {
    const currentDate = new Date().toLocaleDateString();
    return `FORMAL DEMAND FOR ACCOMMODATION COMPLIANCE

Date: ${currentDate}

TO: Amazon Q Human Resources Department
RE: Failure to Provide Reasonable Accommodation - ESA and Sole Caregiver Status

Dear Legal Department,

This letter serves as formal notice of your failure to provide reasonable accommodations as required under:
• Americans with Disabilities Act (ADA)
• Fair Housing Act
• State disability accommodation laws

ACCOMMODATION REQUESTS DENIED/IGNORED:
1. Emotional Support Animal accommodation (submitted: [DATE])
2. Flexible work arrangements for sole caregiver responsibilities
3. Reasonable modifications to workplace policies

LEGAL VIOLATIONS:
Your failure to engage in the interactive process and provide reasonable accommodations constitutes:
• Disability discrimination under ADA
• Failure to accommodate under Fair Housing Act
• Potential retaliation for protected activity

DEMAND FOR IMMEDIATE ACTION:
1. Immediate approval of ESA accommodation
2. Implementation of flexible work arrangements
3. Written confirmation of accommodation approval
4. Cessation of any retaliatory actions

TIMELINE: You have 10 business days to respond with accommodation approval.

Failure to comply will result in filing complaints with:
• Equal Employment Opportunity Commission (EEOC)
• Department of Housing and Urban Development (HUD)
• State civil rights agencies
• Potential federal lawsuit for damages

This matter can be resolved immediately through accommodation approval. I prefer resolution without legal action but will pursue all available remedies if necessary.

Sincerely,
[Your Name]
[Date]

CC: Legal Department, EEOC, State Civil Rights Agency`;
}

// Auto-sync functionality
function startAutoSync() {
    try {
        // Auto-save every 30 seconds
        setInterval(() => {
            saveCaseData();
        }, 30000);
        
        // Check for new archived data every 5 minutes
        setInterval(() => {
            loadArchivedData().then(() => {
                renderAllSections();
            });
        }, 300000);
        
        console.log('Auto-sync started');
    } catch (error) {
        console.error('Auto-sync failed to start:', error);
    }
}

// Enhanced utility functions
function updateTimelineStats() {
    try {
        const statsElement = document.getElementById('timeline-stats');
        if (statsElement) {
            const total = caseData.timeline.length;
            const archived = caseData.timeline.filter(e => e.type === 'archived').length;
            const manual = total - archived;
            
            statsElement.innerHTML = `
                <div class="stats-item">Total Events: ${total}</div>
                <div class="stats-item">Manual: ${manual}</div>
                <div class="stats-item">Archived: ${archived}</div>
            `;
        }
    } catch (error) {
        console.error('Timeline stats update failed:', error);
    }
}

function updateEvidenceStats() {
    try {
        const statsElement = document.getElementById('evidence-stats');
        if (statsElement) {
            const total = caseData.evidence.length;
            const highPriority = caseData.evidence.filter(e => e.relevance === 'high').length;
            const archived = caseData.evidence.filter(e => e.id && typeof e.id === 'number' && e.id < 0).length;
            
            statsElement.innerHTML = `
                <div class="stats-item">Total Evidence: ${total}</div>
                <div class="stats-item">High Priority: ${highPriority}</div>
                <div class="stats-item">Archived: ${archived}</div>
            `;
        }
    } catch (error) {
        console.error('Evidence stats update failed:', error);
    }
}

function updateListElement(elementId, items) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        }
    } catch (error) {
        console.error(`Failed to update ${elementId}:`, error);
    }
}

function copyToClipboard(text) {
    try {
        navigator.clipboard.writeText(text).then(() => {
            showSuccessMessage('Copied to clipboard');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessMessage('Copied to clipboard');
        });
    } catch (error) {
        console.error('Copy to clipboard failed:', error);
        showErrorMessage('Failed to copy to clipboard');
    }
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    try {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    } catch (error) {
        console.error('Message display failed:', error);
    }
}

function renderAllSections() {
    try {
        renderTimeline();
        renderEvidence();
        renderCorrespondence();
        generateStrategy();
    } catch (error) {
        console.error('Section rendering failed:', error);
    }
}

function initializeEnhancedFeatures() {
    try {
        // Add stats containers if they don't exist
        addStatsContainers();
        
        // Initialize enhanced templates
        addEnhancedTemplates();
        
        // Initialize keyboard shortcuts
        initializeKeyboardShortcuts();
        
        console.log('Enhanced features initialized');
    } catch (error) {
        console.error('Enhanced features initialization failed:', error);
    }
}

function addStatsContainers() {
    try {
        const timelineSection = document.querySelector('#timeline .section-header');
        if (timelineSection && !document.getElementById('timeline-stats')) {
            const statsDiv = document.createElement('div');
            statsDiv.id = 'timeline-stats';
            statsDiv.className = 'stats-container';
            timelineSection.appendChild(statsDiv);
        }
        
        const evidenceSection = document.querySelector('#evidence .section-header');
        if (evidenceSection && !document.getElementById('evidence-stats')) {
            const statsDiv = document.createElement('div');
            statsDiv.id = 'evidence-stats';
            statsDiv.className = 'stats-container';
            evidenceSection.appendChild(statsDiv);
        }
    } catch (error) {
        console.error('Stats containers creation failed:', error);
    }
}

function addEnhancedTemplates() {
    try {
        const templatesGrid = document.querySelector('.templates-grid');
        if (templatesGrid) {
            const enhancedTemplates = [
                {
                    id: 'legal-demand',
                    title: '⚖️ Legal Demand Letter',
                    description: 'Formal demand for accommodation compliance'
                },
                {
                    id: 'accommodation-appeal',
                    title: '📋 Accommodation Appeal',
                    description: 'Appeal denied accommodation requests'
                }
            ];
            
            enhancedTemplates.forEach(template => {
                if (!document.querySelector(`[onclick="useTemplate('${template.id}')"]`)) {
                    const templateCard = document.createElement('div');
                    templateCard.className = 'template-card';
                    templateCard.onclick = () => useTemplate(template.id);
                    templateCard.innerHTML = `
                        <h3>${template.title}</h3>
                        <p>${template.description}</p>
                    `;
                    templatesGrid.appendChild(templateCard);
                }
            });
        }
    } catch (error) {
        console.error('Enhanced templates creation failed:', error);
    }
}

function initializeKeyboardShortcuts() {
    try {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        saveCaseData();
                        showSuccessMessage('Case data saved');
                        break;
                    case 'e':
                        e.preventDefault();
                        exportAllData();
                        break;
                }
            }
        });
    } catch (error) {
        console.error('Keyboard shortcuts initialization failed:', error);
    }
}

function exportAllData() {
    try {
        const exportData = {
            caseData: caseData,
            exported: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        downloadFile(dataStr, 'complete-case-data.json', 'application/json');
        showSuccessMessage('Complete case data exported');
    } catch (error) {
        console.error('Data export failed:', error);
        showErrorMessage('Failed to export data');
    }
}

// Enhanced save/load with error handling
function saveCaseData() {
    try {
        localStorage.setItem('amazonQCaseData', JSON.stringify(caseData));
        return true;
    } catch (error) {
        console.error('Save failed:', error);
        showErrorMessage('Failed to save case data');
        return false;
    }
}

function loadCaseData() {
    try {
        const saved = localStorage.getItem('amazonQCaseData');
        if (saved) {
            const parsedData = JSON.parse(saved);
            caseData = { ...caseData, ...parsedData };
        } else {
            // Initialize with sample data
            initializeSampleData();
        }
        return true;
    } catch (error) {
        console.error('Load failed:', error);
        showErrorMessage('Failed to load case data');
        initializeSampleData();
        return false;
    }
}

function initializeSampleData() {
    caseData.timeline = [
        {
            id: 1,
            date: '2025-01-15',
            title: 'Initial ESA Request Submitted',
            description: 'Submitted formal ESA accommodation request to HR with medical documentation',
            priority: 'high',
            type: 'submission'
        }
    ];
    
    caseData.evidence = [
        {
            id: 1,
            title: 'ESA Medical Letter',
            type: 'document',
            description: 'Licensed therapist letter confirming ESA medical necessity',
            relevance: 'high',
            dateAdded: '2025-01-15'
        }
    ];
    
    caseData.correspondence = [
        {
            id: 1,
            from: 'HR',
            subject: 'ESA Request Received',
            date: '2025-01-16',
            summary: 'Acknowledgment of ESA request, requesting additional documentation',
            status: 'received'
        }
    ];
}