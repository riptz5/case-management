#!/usr/bin/env python3
"""
Automated Form Processor
Identifies and processes legal forms automatically
"""

import json
import re
from pathlib import Path
from datetime import datetime

class AutomatedFormProcessor:
    def __init__(self):
        self.forms_dir = Path("/Users/owner/GitHub/SYNC/case-management/ontario-forms")
        self.intake_dir = Path("/Users/owner/GitHub/SYNC/case-management/archive/intake")
        self.processed_dir = Path("/Users/owner/GitHub/SYNC/case-management/archive/processed")
        
        # Form identification patterns
        self.form_patterns = {
            "Form_14A": r"FORM 14A|Affidavit.*General",
            "Form_14": r"FORM 14|Application.*General",
            "Form_14B": r"FORM 14B|Motion",
            "Form_8": r"FORM 8|Financial Statement",
            "Form_35_1": r"FORM 35.1|Affidavit.*Support",
            "Form_6B": r"FORM 6B|Continuing Record",
            "Emergency_Motion": r"Emergency Motion|Urgent",
            "Police_Report": r"Police.*Report|Incident Report",
            "FACS_Complaint": r"FACS|Family.*Children.*Services",
            "Supreme_Court": r"Supreme Court|Leave to Appeal"
        }
    
    def identify_form_type(self, content):
        """Identify form type from content"""
        for form_type, pattern in self.form_patterns.items():
            if re.search(pattern, content, re.IGNORECASE):
                return form_type
        return "Unknown"
    
    def extract_case_info(self, content):
        """Extract key case information"""
        info = {}
        
        # Extract court file number
        file_match = re.search(r"Court File Number:?\s*([A-Z0-9-]+)", content, re.IGNORECASE)
        if file_match:
            info["court_file"] = file_match.group(1)
        
        # Extract child name
        child_match = re.search(r"CHILD'S NAME\]?\s*([A-Za-z\s]+)", content)
        if child_match:
            info["child_name"] = child_match.group(1).strip()
        
        # Extract dates
        date_matches = re.findall(r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", content)
        if date_matches:
            info["dates"] = date_matches
        
        return info
    
    def process_intake_files(self):
        """Process files in intake directory"""
        if not self.intake_dir.exists():
            return []
        
        processed_files = []
        
        for file_path in self.intake_dir.glob("*"):
            if file_path.is_file():
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    form_type = self.identify_form_type(content)
                    case_info = self.extract_case_info(content)
                    
                    # Create processing record
                    record = {
                        "file_name": file_path.name,
                        "form_type": form_type,
                        "case_info": case_info,
                        "processed_date": datetime.now().isoformat(),
                        "file_size": file_path.stat().st_size,
                        "relevance_score": self.calculate_relevance(content)
                    }
                    
                    processed_files.append(record)
                    
                    # Move to processed directory
                    self.processed_dir.mkdir(exist_ok=True)
                    new_path = self.processed_dir / f"{form_type}_{file_path.name}"
                    file_path.rename(new_path)
                    
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
        
        return processed_files
    
    def calculate_relevance(self, content):
        """Calculate relevance score for legal content"""
        keywords = [
            "sole caregiver", "ESA", "emotional support", "custody",
            "emergency", "child", "accommodation", "disability",
            "family court", "motion", "affidavit"
        ]
        
        score = 0
        content_lower = content.lower()
        
        for keyword in keywords:
            if keyword in content_lower:
                score += 10
        
        # Bonus for legal formatting
        if re.search(r"SWORN|AFFIRMED|Court File", content):
            score += 20
        
        return min(score, 100)  # Cap at 100
    
    def generate_processing_report(self, processed_files):
        """Generate automated processing report"""
        report = {
            "processing_date": datetime.now().isoformat(),
            "total_files": len(processed_files),
            "form_types": {},
            "high_relevance": [],
            "files_processed": processed_files
        }
        
        for file_record in processed_files:
            form_type = file_record["form_type"]
            report["form_types"][form_type] = report["form_types"].get(form_type, 0) + 1
            
            if file_record["relevance_score"] >= 70:
                report["high_relevance"].append(file_record["file_name"])
        
        # Save report
        report_path = self.forms_dir / "automated_processing_report.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

if __name__ == "__main__":
    processor = AutomatedFormProcessor()
    processed = processor.process_intake_files()
    report = processor.generate_processing_report(processed)
    
    print(f"✅ Processed {len(processed)} files")
    print(f"📊 Report saved to automated_processing_report.json")
