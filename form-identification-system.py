#!/usr/bin/env python3
"""
Automated Form Identification System
Identifies legal forms and documents automatically with AI-powered analysis
"""

import json
import re
import hashlib
from pathlib import Path
from datetime import datetime

class FormIdentificationSystem:
    def __init__(self):
        self.base_path = Path("/Users/owner/GitHub/SYNC/case-management")
        self.forms_dir = self.base_path / "ontario-forms"
        self.archive_dir = self.base_path / "archive"
        
        # Enhanced form identification patterns
        self.form_signatures = {
            "Form_14A_Affidavit": {
                "patterns": [r"FORM 14A", r"AFFIDAVIT.*GENERAL", r"MAKE OATH AND SAY"],
                "keywords": ["affidavit", "sworn", "affirmed", "oath"],
                "priority": 9
            },
            "Form_14_Application": {
                "patterns": [r"FORM 14", r"APPLICATION.*GENERAL", r"COURT CASE HAS BEEN STARTED"],
                "keywords": ["application", "court case", "respondent"],
                "priority": 10
            },
            "Form_14B_Motion": {
                "patterns": [r"FORM 14B", r"MOTION", r"WILL MAKE A MOTION"],
                "keywords": ["motion", "grounds", "relief sought"],
                "priority": 9
            },
            "Form_8_Financial": {
                "patterns": [r"FORM 8", r"FINANCIAL STATEMENT", r"INCOME", r"EXPENSES"],
                "keywords": ["income", "expenses", "assets", "debts"],
                "priority": 8
            },
            "Form_35_1_Support": {
                "patterns": [r"FORM 35.1", r"AFFIDAVIT.*SUPPORT.*CLAIM", r"CUSTODY OR ACCESS"],
                "keywords": ["custody", "access", "best interests"],
                "priority": 9
            },
            "Form_6B_Record": {
                "patterns": [r"FORM 6B", r"CONTINUING RECORD", r"TABLE OF CONTENTS"],
                "keywords": ["continuing record", "table of contents", "tab"],
                "priority": 7
            },
            "Emergency_Motion_Request": {
                "patterns": [r"EMERGENCY MOTION", r"URGENT", r"IMMEDIATE RELIEF"],
                "keywords": ["emergency", "urgent", "immediate", "risk"],
                "priority": 10
            },
            "Supreme_Court_Application": {
                "patterns": [r"SUPREME COURT", r"LEAVE TO APPEAL", r"COURT OF APPEAL"],
                "keywords": ["supreme court", "leave", "appeal", "national importance"],
                "priority": 8
            },
            "FACS_Complaint": {
                "patterns": [r"FAMILY.*CHILDREN.*SERVICES", r"FACS", r"COMPLAINT.*CONCERN"],
                "keywords": ["family services", "children services", "complaint"],
                "priority": 7
            },
            "Police_Report_Ontario": {
                "patterns": [r"ONTARIO POLICE", r"INCIDENT REPORT", r"OCCURRENCE"],
                "keywords": ["police", "incident", "report", "occurrence"],
                "priority": 8
            },
            "Police_Complaint_Niagara": {
                "patterns": [r"NIAGARA.*POLICE", r"PUBLIC COMPLAINT", r"PROFESSIONAL STANDARDS"],
                "keywords": ["niagara police", "complaint", "professional standards"],
                "priority": 8
            },
            "Police_Report_Peel": {
                "patterns": [r"PEEL.*POLICE", r"OCCURRENCE REPORT", r"COMPLAINANT"],
                "keywords": ["peel police", "occurrence", "complainant"],
                "priority": 8
            },
            "ESA_Documentation": {
                "patterns": [r"EMOTIONAL SUPPORT", r"ESA", r"ACCOMMODATION"],
                "keywords": ["emotional support", "ESA", "accommodation", "disability"],
                "priority": 9
            },
            "HR_Correspondence": {
                "patterns": [r"HUMAN RESOURCES", r"HR", r"ACCOMMODATION REQUEST"],
                "keywords": ["human resources", "HR", "accommodation", "workplace"],
                "priority": 8
            },
            "Medical_Records": {
                "patterns": [r"MEDICAL", r"DOCTOR", r"PHYSICIAN", r"DIAGNOSIS"],
                "keywords": ["medical", "doctor", "physician", "diagnosis", "treatment"],
                "priority": 7
            },
            "Legal_Correspondence": {
                "patterns": [r"LEGAL", r"LAWYER", r"COUNSEL", r"SOLICITOR"],
                "keywords": ["legal", "lawyer", "counsel", "solicitor", "attorney"],
                "priority": 8
            }
        }
    
    def calculate_file_hash(self, file_path):
        """Calculate SHA-256 hash of file"""
        hash_sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        return hash_sha256.hexdigest()
    
    def identify_document_type(self, content, filename=""):
        """Identify document type with confidence scoring"""
        results = []
        content_lower = content.lower()
        filename_lower = filename.lower()
        
        for doc_type, signature in self.form_signatures.items():
            confidence = 0
            matches = []
            
            # Pattern matching
            for pattern in signature["patterns"]:
                if re.search(pattern, content, re.IGNORECASE):
                    confidence += 25
                    matches.append(f"Pattern: {pattern}")
            
            # Keyword matching
            keyword_matches = 0
            for keyword in signature["keywords"]:
                if keyword in content_lower:
                    keyword_matches += 1
                    confidence += 10
                    matches.append(f"Keyword: {keyword}")
            
            # Filename matching
            if any(keyword in filename_lower for keyword in signature["keywords"]):
                confidence += 15
                matches.append("Filename match")
            
            # Priority weighting
            confidence = confidence * (signature["priority"] / 10)
            
            if confidence > 20:  # Minimum threshold
                results.append({
                    "document_type": doc_type,
                    "confidence": min(confidence, 100),
                    "matches": matches,
                    "priority": signature["priority"]
                })
        
        # Sort by confidence
        results.sort(key=lambda x: x["confidence"], reverse=True)
        return results
    
    def extract_case_metadata(self, content):
        """Extract comprehensive case metadata"""
        metadata = {
            "court_file_numbers": [],
            "dates": [],
            "names": [],
            "addresses": [],
            "phone_numbers": [],
            "emails": [],
            "case_elements": []
        }
        
        # Court file numbers
        file_patterns = [
            r"Court File Number:?\s*([A-Z0-9-]+)",
            r"File Number:?\s*([A-Z0-9-]+)",
            r"Case Number:?\s*([A-Z0-9-]+)"
        ]
        for pattern in file_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            metadata["court_file_numbers"].extend(matches)
        
        # Dates
        date_patterns = [
            r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b",
            r"\b(\d{1,2}\s+\w+\s+\d{4})\b",
            r"\b(\w+\s+\d{1,2},?\s+\d{4})\b"
        ]
        for pattern in date_patterns:
            matches = re.findall(pattern, content)
            metadata["dates"].extend(matches)
        
        # Names (after common form labels)
        name_patterns = [
            r"APPLICANT:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
            r"RESPONDENT:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
            r"Name:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)"
        ]
        for pattern in name_patterns:
            matches = re.findall(pattern, content)
            metadata["names"].extend(matches)
        
        # Phone numbers
        phone_pattern = r"\b(\d{3}[-.]?\d{3}[-.]?\d{4})\b"
        metadata["phone_numbers"] = re.findall(phone_pattern, content)
        
        # Email addresses
        email_pattern = r"\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b"
        metadata["emails"] = re.findall(email_pattern, content)
        
        # Case-specific elements
        case_elements = [
            "sole caregiver", "ESA", "emotional support", "custody",
            "emergency", "accommodation", "disability", "child support"
        ]
        for element in case_elements:
            if element.lower() in content.lower():
                metadata["case_elements"].append(element)
        
        return metadata
    
    def analyze_document_relevance(self, content, metadata):
        """Calculate document relevance to sole caregiver case"""
        relevance_score = 0
        relevance_factors = []
        
        # High-value keywords
        high_value_terms = {
            "sole caregiver": 20,
            "ESA": 15,
            "emotional support": 15,
            "custody": 15,
            "emergency": 10,
            "accommodation": 10,
            "disability": 10,
            "child support": 10,
            "family court": 10
        }
        
        content_lower = content.lower()
        for term, score in high_value_terms.items():
            if term in content_lower:
                relevance_score += score
                relevance_factors.append(f"{term} (+{score})")
        
        # Legal document bonus
        legal_indicators = ["sworn", "affirmed", "court", "motion", "affidavit"]
        legal_count = sum(1 for indicator in legal_indicators if indicator in content_lower)
        if legal_count >= 2:
            relevance_score += 15
            relevance_factors.append(f"Legal document (+15)")
        
        # Case metadata bonus
        if metadata["court_file_numbers"]:
            relevance_score += 10
            relevance_factors.append("Court file number (+10)")
        
        if len(metadata["case_elements"]) >= 3:
            relevance_score += 10
            relevance_factors.append("Multiple case elements (+10)")
        
        return min(relevance_score, 100), relevance_factors
    
    def process_directory(self, directory_path):
        """Process all files in a directory"""
        directory = Path(directory_path)
        if not directory.exists():
            return []
        
        processed_files = []
        
        for file_path in directory.rglob("*"):
            if file_path.is_file() and file_path.suffix.lower() in ['.txt', '.md', '.rtf', '.doc', '.docx']:
                try:
                    # Read file content
                    if file_path.suffix.lower() == '.txt':
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                    else:
                        # For other formats, try to read as text
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                    
                    # Analyze document
                    doc_types = self.identify_document_type(content, file_path.name)
                    metadata = self.extract_case_metadata(content)
                    relevance_score, relevance_factors = self.analyze_document_relevance(content, metadata)
                    
                    # Create analysis record
                    analysis = {
                        "file_path": str(file_path),
                        "file_name": file_path.name,
                        "file_size": file_path.stat().st_size,
                        "file_hash": self.calculate_file_hash(file_path),
                        "modified_date": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                        "analyzed_date": datetime.now().isoformat(),
                        "document_types": doc_types,
                        "metadata": metadata,
                        "relevance_score": relevance_score,
                        "relevance_factors": relevance_factors,
                        "content_preview": content[:200] + "..." if len(content) > 200 else content
                    }
                    
                    processed_files.append(analysis)
                    
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
        
        return processed_files
    
    def generate_identification_report(self, processed_files):
        """Generate comprehensive identification report"""
        report = {
            "analysis_date": datetime.now().isoformat(),
            "total_files_analyzed": len(processed_files),
            "document_type_summary": {},
            "high_relevance_files": [],
            "case_metadata_summary": {
                "court_files": set(),
                "unique_names": set(),
                "date_range": [],
                "case_elements": set()
            },
            "files_by_relevance": {
                "critical": [],  # 80-100
                "high": [],      # 60-79
                "medium": [],    # 40-59
                "low": []        # 0-39
            },
            "detailed_analysis": processed_files
        }
        
        # Analyze results
        for file_analysis in processed_files:
            # Document types
            if file_analysis["document_types"]:
                top_type = file_analysis["document_types"][0]["document_type"]
                report["document_type_summary"][top_type] = report["document_type_summary"].get(top_type, 0) + 1
            
            # High relevance files
            if file_analysis["relevance_score"] >= 70:
                report["high_relevance_files"].append({
                    "file": file_analysis["file_name"],
                    "score": file_analysis["relevance_score"],
                    "type": file_analysis["document_types"][0]["document_type"] if file_analysis["document_types"] else "Unknown"
                })
            
            # Categorize by relevance
            score = file_analysis["relevance_score"]
            if score >= 80:
                report["files_by_relevance"]["critical"].append(file_analysis["file_name"])
            elif score >= 60:
                report["files_by_relevance"]["high"].append(file_analysis["file_name"])
            elif score >= 40:
                report["files_by_relevance"]["medium"].append(file_analysis["file_name"])
            else:
                report["files_by_relevance"]["low"].append(file_analysis["file_name"])
            
            # Aggregate metadata
            metadata = file_analysis["metadata"]
            report["case_metadata_summary"]["court_files"].update(metadata["court_file_numbers"])
            report["case_metadata_summary"]["unique_names"].update(metadata["names"])
            report["case_metadata_summary"]["case_elements"].update(metadata["case_elements"])
        
        # Convert sets to lists for JSON serialization
        for key in report["case_metadata_summary"]:
            if isinstance(report["case_metadata_summary"][key], set):
                report["case_metadata_summary"][key] = list(report["case_metadata_summary"][key])
        
        # Save report
        report_path = self.base_path / "form_identification_report.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

def main():
    """Main execution function"""
    identifier = FormIdentificationSystem()
    
    print("🔍 Starting Automated Form Identification...")
    
    # Process multiple directories
    directories_to_scan = [
        "/Users/owner/GitHub/SYNC/case-management/archive",
        "/Users/owner/GitHub/SYNC/INGEST",
        "/Users/owner/GitHub/SYNC/solecaregiverontario/approved"
    ]
    
    all_processed = []
    
    for directory in directories_to_scan:
        if Path(directory).exists():
            print(f"📁 Scanning: {directory}")
            processed = identifier.process_directory(directory)
            all_processed.extend(processed)
            print(f"   Found {len(processed)} files")
    
    # Generate report
    report = identifier.generate_identification_report(all_processed)
    
    print(f"\n✅ IDENTIFICATION COMPLETE!")
    print(f"📊 Total Files Analyzed: {report['total_files_analyzed']}")
    print(f"🎯 High Relevance Files: {len(report['high_relevance_files'])}")
    print(f"📋 Document Types Found: {len(report['document_type_summary'])}")
    print(f"💾 Report saved to: form_identification_report.json")
    
    # Show top findings
    if report['high_relevance_files']:
        print(f"\n🔥 TOP RELEVANT FILES:")
        for file_info in sorted(report['high_relevance_files'], key=lambda x: x['score'], reverse=True)[:5]:
            print(f"   {file_info['file']} - {file_info['score']}% ({file_info['type']})")

if __name__ == "__main__":
    main()