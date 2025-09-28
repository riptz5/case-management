#!/usr/bin/env python3
"""
Amazon Q Case Management Automation
AI-assisted file organization and case tracking
"""

import os
import json
import datetime
from pathlib import Path
import shutil
import re

class CaseAutomation:
    def __init__(self, base_path="/Users/owner/GitHub/SYNC"):
        self.base_path = Path(base_path)
        self.case_folder = self.base_path / "amazon-q-case"
        self.setup_folders()
        
    def setup_folders(self):
        """Create organized folder structure"""
        folders = [
            "01_Amazon_Q_Correspondence/Emails",
            "01_Amazon_Q_Correspondence/Letters", 
            "01_Amazon_Q_Correspondence/Messages",
            "02_Evidence/Employment_Records",
            "02_Evidence/HR_Responses",
            "02_Evidence/Screenshots",
            "02_Evidence/Supporting_Documents",
            "03_Requests_and_Responses/Accommodation_Requests",
            "03_Requests_and_Responses/ESA_Leave_Documents",
            "03_Requests_and_Responses/HR_Feedback",
            "04_Timeline",
            "05_AI_Analysis/Summaries",
            "05_AI_Analysis/Strategy_Notes",
            "06_Templates/HR_Requests",
            "06_Templates/Follow_up_Emails",
            "06_Templates/Statements",
            "06_Templates/Reports",
            "07_Archive"
        ]
        
        for folder in folders:
            (self.case_folder / folder).mkdir(parents=True, exist_ok=True)
            
    def auto_organize_files(self, source_folder):
        """Automatically organize files based on naming patterns"""
        source = Path(source_folder)
        if not source.exists():
            return
            
        for file_path in source.rglob("*"):
            if file_path.is_file():
                self.categorize_file(file_path)
                
    def categorize_file(self, file_path):
        """Categorize file based on name and content patterns"""
        filename = file_path.name.lower()
        
        # Email patterns
        if any(word in filename for word in ['email', 'message', 'correspondence']):
            dest = self.case_folder / "01_Amazon_Q_Correspondence/Emails"
            
        # HR response patterns  
        elif any(word in filename for word in ['hr', 'human_resources', 'response']):
            dest = self.case_folder / "02_Evidence/HR_Responses"
            
        # ESA/accommodation patterns
        elif any(word in filename for word in ['esa', 'accommodation', 'request']):
            dest = self.case_folder / "03_Requests_and_Responses/Accommodation_Requests"
            
        # Screenshot patterns
        elif any(word in filename for word in ['screenshot', 'screen', 'capture']):
            dest = self.case_folder / "02_Evidence/Screenshots"
            
        # Document patterns
        elif file_path.suffix.lower() in ['.pdf', '.doc', '.docx']:
            dest = self.case_folder / "02_Evidence/Supporting_Documents"
            
        else:
            dest = self.case_folder / "07_Archive"
            
        # Copy file with timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d")
        new_name = f"{timestamp}_{file_path.name}"
        shutil.copy2(file_path, dest / new_name)
        
    def generate_timeline_log(self):
        """Generate chronological timeline from organized files"""
        timeline = []
        
        # Scan all folders for files
        for folder in self.case_folder.rglob("*"):
            if folder.is_file():
                # Extract date from filename
                date_match = re.search(r'(\d{8})', folder.name)
                if date_match:
                    date_str = date_match.group(1)
                    date_obj = datetime.datetime.strptime(date_str, "%Y%m%d")
                    
                    timeline.append({
                        'date': date_obj.strftime("%Y-%m-%d"),
                        'file': folder.name,
                        'category': folder.parent.name,
                        'path': str(folder)
                    })
                    
        # Sort by date
        timeline.sort(key=lambda x: x['date'])
        
        # Generate timeline document
        timeline_doc = self.case_folder / "04_Timeline/Event_Log.md"
        with open(timeline_doc, 'w') as f:
            f.write("# Amazon Q Case Timeline\n\n")
            f.write("| Date | Event | Category | File |\n")
            f.write("|------|-------|----------|------|\n")
            
            for event in timeline:
                f.write(f"| {event['date']} | {event['file']} | {event['category']} | {event['path']} |\n")
                
    def generate_evidence_index(self):
        """Create searchable index of all evidence"""
        evidence_index = []
        
        evidence_folder = self.case_folder / "02_Evidence"
        for file_path in evidence_folder.rglob("*"):
            if file_path.is_file():
                evidence_index.append({
                    'filename': file_path.name,
                    'category': file_path.parent.name,
                    'size': file_path.stat().st_size,
                    'modified': datetime.datetime.fromtimestamp(file_path.stat().st_mtime).strftime("%Y-%m-%d"),
                    'path': str(file_path)
                })
                
        # Save as JSON for web interface
        index_file = self.case_folder / "05_AI_Analysis/evidence_index.json"
        with open(index_file, 'w') as f:
            json.dump(evidence_index, f, indent=2)
            
    def generate_case_summary(self):
        """AI-generated case summary"""
        summary = {
            'case_name': 'Amazon Q Sole Caregiver ESA Accommodation',
            'generated': datetime.datetime.now().isoformat(),
            'folder_structure': self.get_folder_stats(),
            'key_documents': self.identify_key_documents(),
            'timeline_events': self.count_timeline_events(),
            'next_actions': [
                'Follow up on pending HR requests',
                'Organize recent correspondence',
                'Update evidence documentation',
                'Prepare status report'
            ]
        }
        
        summary_file = self.case_folder / "05_AI_Analysis/case_summary.json"
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
            
    def get_folder_stats(self):
        """Get statistics for each folder"""
        stats = {}
        for folder in self.case_folder.iterdir():
            if folder.is_dir():
                file_count = len(list(folder.rglob("*")))
                stats[folder.name] = file_count
        return stats
        
    def identify_key_documents(self):
        """Identify most important documents"""
        key_docs = []
        
        # Look for ESA documents
        for file_path in self.case_folder.rglob("*esa*"):
            if file_path.is_file():
                key_docs.append({
                    'type': 'ESA Document',
                    'file': file_path.name,
                    'importance': 'high'
                })
                
        # Look for HR correspondence
        hr_folder = self.case_folder / "02_Evidence/HR_Responses"
        for file_path in hr_folder.rglob("*"):
            if file_path.is_file():
                key_docs.append({
                    'type': 'HR Response',
                    'file': file_path.name,
                    'importance': 'high'
                })
                
        return key_docs
        
    def count_timeline_events(self):
        """Count events in timeline"""
        timeline_folder = self.case_folder / "04_Timeline"
        return len(list(timeline_folder.rglob("*")))
        
    def run_daily_automation(self):
        """Run daily automation tasks"""
        print("🤖 Running Amazon Q Case Automation...")
        
        # Check for new files in common locations
        common_locations = [
            Path.home() / "Downloads",
            Path.home() / "Desktop",
            Path.home() / "Documents"
        ]
        
        for location in common_locations:
            if location.exists():
                self.auto_organize_files(location)
                
        # Generate reports
        self.generate_timeline_log()
        self.generate_evidence_index()
        self.generate_case_summary()
        
        print("✅ Automation complete!")
        print(f"📁 Case folder: {self.case_folder}")

if __name__ == "__main__":
    automation = CaseAutomation()
    automation.run_daily_automation()