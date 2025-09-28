// Case Management System
let caseData = {
    timeline: [],
    evidence: [],
    correspondence: [],
    strategy: {}
};

// Initialize system
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadCaseData();
    renderTimeline();
    renderEvidence();
    renderCorrespondence();
});

// Tab functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Timeline Functions
function addTimelineEvent() {
    const date = prompt('Event Date (YYYY-MM-DD):');
    const title = prompt('Event Title:');
    const description = prompt('Event Description:');
    const priority = prompt('Priority (high/medium/low):') || 'medium';
    
    if (date && title) {
        const event = {
            id: Date.now(),
            date: date,
            title: title,
            description: description,
            priority: priority,
            type: 'manual'
        };
        
        caseData.timeline.push(event);
        caseData.timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
        renderTimeline();
        saveCaseData();
    }
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';
    
    caseData.timeline.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-item';
        eventDiv.innerHTML = `
            <div class="timeline-date">${formatDate(event.date)}</div>
            <div class="timeline-content">
                <div class="timeline-title">${event.title}</div>
                <div class="timeline-description">${event.description}</div>
                <div class="timeline-tags">
                    <span class="tag ${event.priority}">${event.priority}</span>
                    <span class="tag">${event.type}</span>
                </div>
            </div>
        `;
        container.appendChild(eventDiv);
    });
}

function exportTimeline() {
    const data = caseData.timeline.map(event => ({
        Date: event.date,
        Event: event.title,
        Description: event.description,
        Priority: event.priority,
        Type: event.type
    }));
    
    const csv = convertToCSV(data);
    downloadFile(csv, 'amazon-q-timeline.csv', 'text/csv');
}

// Evidence Functions
function addEvidence() {
    const title = prompt('Evidence Title:');
    const type = prompt('Evidence Type (email/document/screenshot/other):');
    const description = prompt('Description:');
    const relevance = prompt('Relevance (high/medium/low):') || 'medium';
    
    if (title && type) {
        const evidence = {
            id: Date.now(),
            title: title,
            type: type,
            description: description,
            relevance: relevance,
            dateAdded: new Date().toISOString().split('T')[0]
        };
        
        caseData.evidence.push(evidence);
        renderEvidence();
        saveCaseData();
    }
}

function renderEvidence() {
    const container = document.getElementById('evidence-grid');
    container.innerHTML = '';
    
    caseData.evidence.forEach(evidence => {
        const evidenceDiv = document.createElement('div');
        evidenceDiv.className = 'evidence-card';
        evidenceDiv.innerHTML = `
            <div class="evidence-type">${evidence.type}</div>
            <h3>${evidence.title}</h3>
            <p>${evidence.description}</p>
            <div class="timeline-tags">
                <span class="tag ${evidence.relevance}">${evidence.relevance}</span>
                <span class="tag">${evidence.dateAdded}</span>
            </div>
        `;
        container.appendChild(evidenceDiv);
    });
}

function generateEvidenceReport() {
    const report = `
# Amazon Q Case Evidence Report
Generated: ${new Date().toLocaleDateString()}

## High Priority Evidence
${caseData.evidence.filter(e => e.relevance === 'high').map(e => `- ${e.title}: ${e.description}`).join('\n')}

## Medium Priority Evidence  
${caseData.evidence.filter(e => e.relevance === 'medium').map(e => `- ${e.title}: ${e.description}`).join('\n')}

## Evidence Summary
Total Evidence Items: ${caseData.evidence.length}
High Priority: ${caseData.evidence.filter(e => e.relevance === 'high').length}
Medium Priority: ${caseData.evidence.filter(e => e.relevance === 'medium').length}
Low Priority: ${caseData.evidence.filter(e => e.relevance === 'low').length}
    `;
    
    downloadFile(report, 'evidence-report.md', 'text/markdown');
}

// Correspondence Functions
function addCorrespondence() {
    const from = prompt('From (HR/You/Other):');
    const subject = prompt('Subject:');
    const date = prompt('Date (YYYY-MM-DD):');
    const summary = prompt('Summary:');
    
    if (from && subject && date) {
        const correspondence = {
            id: Date.now(),
            from: from,
            subject: subject,
            date: date,
            summary: summary,
            status: 'received'
        };
        
        caseData.correspondence.push(correspondence);
        renderCorrespondence();
        saveCaseData();
    }
}

function renderCorrespondence() {
    const container = document.getElementById('correspondence-list');
    container.innerHTML = '';
    
    caseData.correspondence.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    caseData.correspondence.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'correspondence-item';
        itemDiv.innerHTML = `
            <div class="correspondence-header">
                <div class="correspondence-from">${item.from}</div>
                <div class="correspondence-date">${formatDate(item.date)}</div>
            </div>
            <div class="correspondence-subject"><strong>${item.subject}</strong></div>
            <div class="correspondence-summary">${item.summary}</div>
        `;
        container.appendChild(itemDiv);
    });
}

function generateFollowUp() {
    const template = `Subject: Follow-up on ESA Accommodation Request

Dear HR Team,

I am writing to follow up on my previous request for emotional support animal (ESA) accommodation submitted on [DATE]. As a sole caregiver with documented responsibilities, this accommodation is essential for my continued employment and well-being.

Key points for your consideration:
• Valid ESA documentation provided
• Sole caregiver status documented
• Work performance maintained remotely
• Reasonable accommodation under ADA/Fair Housing Act

I would appreciate an update on the status of this request and any additional documentation you may require.

Thank you for your time and consideration.

Best regards,
[Your Name]`;

    document.getElementById('template-output').innerHTML = `<pre>${template}</pre>`;
    document.querySelector('[data-tab="templates"]').click();
}

// Template Functions
function useTemplate(templateType) {
    let template = '';
    
    switch(templateType) {
        case 'esa-request':
            template = `Subject: Emotional Support Animal Accommodation Request

Dear HR Department,

I am formally requesting a reasonable accommodation under the Americans with Disabilities Act (ADA) for my emotional support animal (ESA).

Attached Documentation:
• ESA letter from licensed mental health professional
• Sole caregiver documentation
• Work-from-home capability evidence

As the sole caregiver for [family member], this accommodation is essential for maintaining both my employment and caregiving responsibilities.

I am available to discuss this request and provide any additional documentation needed.

Sincerely,
[Your Name]
[Date]`;
            break;
            
        case 'caregiver-statement':
            template = `SOLE CAREGIVER STATEMENT

I, [Your Name], hereby declare that I am the sole primary caregiver for [Family Member Name].

Caregiving Responsibilities Include:
• Daily care and supervision
• Medical appointment coordination
• Educational support and advocacy
• Emergency response availability
• Financial and legal responsibility

This caregiving role requires:
• Flexible work arrangements
• Emotional support animal accommodation
• Potential schedule modifications

Supporting Documentation:
• Medical records
• School/daycare communications
• Legal guardianship documents
• ESA certification

Signed: [Your Name]
Date: [Current Date]`;
            break;
            
        case 'hr-followup':
            template = generateFollowUp();
            return;
            
        case 'evidence-summary':
            template = `AMAZON Q CASE EVIDENCE SUMMARY

Case Overview: ESA Accommodation & Sole Caregiver Rights

Timeline Summary:
${caseData.timeline.map(e => `${e.date}: ${e.title}`).join('\n')}

Evidence Inventory:
${caseData.evidence.map(e => `• ${e.type}: ${e.title} (${e.relevance} priority)`).join('\n')}

Correspondence Log:
${caseData.correspondence.map(c => `${c.date}: ${c.subject} (${c.from})`).join('\n')}

Case Strength: Strong documentation of sole caregiver status and valid ESA requirements.`;
            break;
    }
    
    document.getElementById('template-output').innerHTML = `<pre>${template}</pre>`;
}

// Strategy Functions
function generateStrategy() {
    const timelineCount = caseData.timeline.length;
    const evidenceCount = caseData.evidence.length;
    const correspondenceCount = caseData.correspondence.length;
    
    // Calculate case strength
    const strength = Math.min(90, (timelineCount * 10) + (evidenceCount * 15) + (correspondenceCount * 5));
    
    document.getElementById('case-strength').style.width = strength + '%';
    document.getElementById('strength-text').textContent = `${strength}% - ${getStrengthLabel(strength)}`;
    
    // Risk factors
    const risks = [
        'Incomplete ESA documentation',
        'Insufficient sole caregiver proof',
        'Missing HR response timeline',
        'Lack of work performance evidence'
    ];
    
    document.getElementById('risk-factors').innerHTML = risks.map(risk => `<li>${risk}</li>`).join('');
    
    // Strengths
    const strengths = [
        'Documented ESA medical necessity',
        'Clear sole caregiver responsibilities',
        'Maintained work performance',
        'Reasonable accommodation request'
    ];
    
    document.getElementById('case-strengths').innerHTML = strengths.map(strength => `<li>${strength}</li>`).join('');
    
    // Next actions
    const actions = [
        'Follow up on pending HR requests',
        'Gather additional caregiver documentation',
        'Document all HR interactions',
        'Prepare for potential escalation'
    ];
    
    document.getElementById('next-actions').innerHTML = actions.map(action => `<li>${action}</li>`).join('');
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function getStrengthLabel(strength) {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Moderate';
    return 'Needs Work';
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csv = [headers.join(',')];
    
    data.forEach(row => {
        csv.push(headers.map(header => `"${row[header]}"`).join(','));
    });
    
    return csv.join('\n');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function saveCaseData() {
    localStorage.setItem('amazonQCaseData', JSON.stringify(caseData));
}

function loadCaseData() {
    const saved = localStorage.getItem('amazonQCaseData');
    if (saved) {
        caseData = JSON.parse(saved);
    } else {
        // Initialize with sample data
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
}