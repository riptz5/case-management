#!/usr/bin/env python3
"""
Enhanced Case Management Automation
Comprehensive file processing, evidence analysis, and integration
"""

import os
import json
import datetime
import shutil
from pathlib import Path
import re

class EnhancedCaseManager:
    def __init__(self, base_path="/Users/owner/GitHub/SYNC"):
        self.base_path = Path(base_path)
        self.case_folder = self.base_path / "case-management"
        self.archive_folder = self.case_folder / "archive"
        self.setup_enhanced_structure()
        
    def setup_enhanced_structure(self):
        """Create comprehensive folder structure"""
        try:
            folders = [
                "archive/correspondence/emails",
                "archive/correspondence/letters", 
                "archive/correspondence/messages",
                "archive/evidence/employment_records",
                "archive/evidence/hr_responses",
                "archive/evidence/screenshots",
                "archive/evidence/supporting_documents",
                "archive/evidence/esa_documents",
                "archive/intake/new_files",
                "archive/intake/processed",
                "archive/reports/timeline",
                "archive/reports/evidence_summaries",
                "archive/reports/case_analysis",
                "archive/analysis/ai_summaries",
                "archive/analysis/strategy_notes",
                "archive/analysis/risk_assessment",
                "archive/templates/legal_forms",
                "archive/templates/correspondence",
                "archive/templates/reports"
            ]
            
            for folder in folders:
                (self.case_folder / folder).mkdir(parents=True, exist_ok=True)
            
            self.log("SETUP", "Enhanced folder structure created")
        except Exception as e:
            self.log("ERROR", f"Setup failed: {str(e)}")
            
    def archive_all_existing_files(self):
        """Archive and analyze all existing files from workspace"""
        try:
            source_folders = [
                self.base_path / "INGEST",
                self.base_path / "solecaregiverontario" / "approved",
                self.base_path / "solecaregiverontario" / "intake",
                self.base_path / "Prompts"
            ]
            
            total_processed = 0
            
            for source in source_folders:
                if source.exists():
                    processed = self.process_source_folder(source)
                    total_processed += processed
                    
            self.log("ARCHIVE", f"Processed {total_processed} files")
            return total_processed
            
        except Exception as e:
            self.log("ERROR", f"Archive failed: {str(e)}")
            return 0
            
    def process_source_folder(self, source_folder):
        """Process files from a source folder"""
        try:
            processed_count = 0
            
            for file_path in source_folder.rglob("*"):
                if file_path.is_file() and not file_path.name.startswith('.'):
                    category = self.smart_categorize_file(file_path)
                    if self.archive_file(file_path, category):
                        processed_count += 1
                        
            return processed_count
            
        except Exception as e:
            self.log("ERROR", f"Processing {source_folder} failed: {str(e)}")
            return 0
            
    def smart_categorize_file(self, file_path):
        """Enhanced file categorization with AI-like analysis"""
        try:
            filename = file_path.name.lower()
            content = ""
            
            # Try to read text content for better categorization
            if file_path.suffix.lower() in ['.txt', '.md', '.rtf']:
                try:
                    content = file_path.read_text(encoding='utf-8', errors='ignore')[:1000]
                except:
                    content = ""
            
            # Enhanced categorization rules
            if any(word in filename for word in ['email', 'message', 'correspondence', 'communication']):
                return 'correspondence/emails'
            elif any(word in filename for word in ['hr', 'human_resources', 'response', 'reply']):
                return 'evidence/hr_responses'
            elif any(word in filename for word in ['esa', 'emotional_support', 'accommodation', 'request']):
                return 'evidence/esa_documents'
            elif any(word in filename for word in ['screenshot', 'screen', 'capture', 'image']):
                return 'evidence/screenshots'
            elif any(word in filename for word in ['chat', 'conversation', 'history']):
                return 'correspondence/messages'
            elif any(word in filename for word in ['caregiver', 'sole', 'amazon']):
                return 'evidence/supporting_documents'
            elif file_path.suffix.lower() in ['.pdf', '.doc', '.docx']:
                return 'evidence/supporting_documents'
            elif file_path.suffix.lower() in ['.jpg', '.png', '.jpeg', '.gif']:
                return 'evidence/screenshots'
            else:
                return 'intake/new_files'
                
        except Exception as e:
            self.log("ERROR", f"Categorization failed for {file_path}: {str(e)}")
            return 'intake/new_files'
            
    def archive_file(self, source_path, category):
        """Archive file with timestamp and metadata"""
        try:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            dest_folder = self.archive_folder / category
            dest_folder.mkdir(parents=True, exist_ok=True)
            
            # Create unique filename
            base_name = source_path.stem
            extension = source_path.suffix
            dest_name = f"{timestamp}_{base_name}{extension}"
            dest_path = dest_folder / dest_name
            
            # Copy file
            shutil.copy2(source_path, dest_path)
            
            # Create metadata
            self.create_file_metadata(source_path, dest_path, category)
            
            self.log("ARCHIVED", f"{source_path.name} -> {category}")
            return True
            
        except Exception as e:
            self.log("ERROR", f"Archive failed for {source_path}: {str(e)}")
            return False
            
    def create_file_metadata(self, source_path, dest_path, category):
        """Create comprehensive metadata for archived files"""
        try:
            metadata = {
                "original_path": str(source_path),
                "archived_path": str(dest_path),
                "category": category,
                "file_size": dest_path.stat().st_size,
                "archived_date": datetime.datetime.now().isoformat(),
                "original_modified": datetime.datetime.fromtimestamp(source_path.stat().st_mtime).isoformat(),
                "file_type": dest_path.suffix.lower(),
                "relevance_score": self.calculate_relevance_score(dest_path, category),
                "keywords": self.extract_keywords(dest_path),
                "case_priority": self.assess_case_priority(dest_path, category)
            }
            
            metadata_file = dest_path.with_suffix('.json')
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
                
        except Exception as e:
            self.log("ERROR", f"Metadata creation failed: {str(e)}")
            
    def calculate_relevance_score(self, file_path, category):
        """Calculate relevance score for case"""
        try:
            score = 50  # Base score
            
            # Category-based scoring
            if 'esa' in category or 'hr_responses' in category:
                score += 30
            elif 'correspondence' in category:
                score += 20
            elif 'evidence' in category:
                score += 25
                
            # Filename-based scoring
            filename = file_path.name.lower()
            high_value_terms = ['amazon', 'esa', 'accommodation', 'caregiver', 'hr', 'request']
            for term in high_value_terms:
                if term in filename:
                    score += 10
                    
            return min(100, score)
            
        except Exception as e:
            self.log("ERROR", f"Relevance scoring failed: {str(e)}")
            return 50
            
    def extract_keywords(self, file_path):
        """Extract relevant keywords from filename and content"""
        try:
            keywords = []
            filename = file_path.name.lower()
            
            # Common case-related keywords
            case_keywords = [
                'amazon', 'esa', 'accommodation', 'caregiver', 'sole', 'hr', 
                'request', 'response', 'email', 'letter', 'evidence', 'support'
            ]
            
            for keyword in case_keywords:
                if keyword in filename:
                    keywords.append(keyword)
                    
            return keywords
            
        except Exception as e:
            self.log("ERROR", f"Keyword extraction failed: {str(e)}")
            return []
            
    def assess_case_priority(self, file_path, category):
        """Assess priority level for case management"""
        try:
            filename = file_path.name.lower()
            
            if any(term in filename for term in ['urgent', 'deadline', 'final', 'legal']):
                return 'high'
            elif any(term in filename for term in ['esa', 'accommodation', 'hr']):
                return 'high'
            elif 'correspondence' in category:
                return 'medium'
            else:
                return 'low'
                
        except Exception as e:
            self.log("ERROR", f"Priority assessment failed: {str(e)}")
            return 'medium'
            
    def generate_comprehensive_timeline(self):
        """Generate enhanced timeline from all archived files"""
        try:
            timeline_events = []
            
            for metadata_file in self.archive_folder.rglob("*.json"):
                try:
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                        
                    event = {
                        "date": metadata.get('original_modified', metadata.get('archived_date')),
                        "title": Path(metadata['original_path']).name,
                        "category": metadata['category'],
                        "priority": metadata.get('case_priority', 'medium'),
                        "relevance_score": metadata.get('relevance_score', 50),
                        "keywords": metadata.get('keywords', []),
                        "file_path": metadata['archived_path']
                    }
                    
                    timeline_events.append(event)
                    
                except Exception as e:
                    self.log("ERROR", f"Timeline processing failed for {metadata_file}: {str(e)}")
                    
            # Sort by date
            timeline_events.sort(key=lambda x: x['date'])
            
            # Save timeline
            timeline_file = self.archive_folder / "reports/timeline/comprehensive_timeline.json"
            timeline_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(timeline_file, 'w') as f:
                json.dump(timeline_events, f, indent=2)
                
            self.log("TIMELINE", f"Generated timeline with {len(timeline_events)} events")
            return timeline_events
            
        except Exception as e:
            self.log("ERROR", f"Timeline generation failed: {str(e)}")
            return []
            
    def generate_evidence_database(self):
        """Create searchable evidence database"""
        try:
            evidence_db = {
                "generated": datetime.datetime.now().isoformat(),
                "total_files": 0,
                "categories": {},
                "high_priority": [],
                "evidence_summary": {}
            }
            
            for metadata_file in self.archive_folder.rglob("*.json"):
                try:
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                        
                    category = metadata['category']
                    if category not in evidence_db["categories"]:
                        evidence_db["categories"][category] = []
                        
                    evidence_item = {
                        "filename": Path(metadata['original_path']).name,
                        "archived_path": metadata['archived_path'],
                        "relevance_score": metadata.get('relevance_score', 50),
                        "priority": metadata.get('case_priority', 'medium'),
                        "keywords": metadata.get('keywords', []),
                        "date": metadata.get('original_modified')
                    }
                    
                    evidence_db["categories"][category].append(evidence_item)
                    evidence_db["total_files"] += 1
                    
                    if evidence_item["priority"] == "high":
                        evidence_db["high_priority"].append(evidence_item)
                        
                except Exception as e:
                    self.log("ERROR", f"Evidence DB processing failed: {str(e)}")
                    
            # Generate summary statistics
            evidence_db["evidence_summary"] = {
                "total_categories": len(evidence_db["categories"]),
                "high_priority_count": len(evidence_db["high_priority"]),
                "category_breakdown": {cat: len(items) for cat, items in evidence_db["categories"].items()}
            }
            
            # Save evidence database
            db_file = self.archive_folder / "reports/evidence_summaries/evidence_database.json"
            db_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(db_file, 'w') as f:
                json.dump(evidence_db, f, indent=2)
                
            self.log("EVIDENCE_DB", f"Created database with {evidence_db['total_files']} files")
            return evidence_db
            
        except Exception as e:
            self.log("ERROR", f"Evidence database generation failed: {str(e)}")
            return {}
            
    def generate_case_analysis_report(self):
        """Generate comprehensive case analysis"""
        try:
            analysis = {
                "generated": datetime.datetime.now().isoformat(),
                "case_name": "Amazon Q Sole Caregiver ESA Accommodation",
                "analysis_summary": {},
                "strengths": [],
                "risks": [],
                "recommendations": [],
                "next_actions": []
            }
            
            # Load evidence database for analysis
            db_file = self.archive_folder / "reports/evidence_summaries/evidence_database.json"
            if db_file.exists():
                with open(db_file, 'r') as f:
                    evidence_db = json.load(f)
                    
                # Analyze case strength
                total_files = evidence_db.get('total_files', 0)
                high_priority = len(evidence_db.get('high_priority', []))
                
                case_strength = min(100, (total_files * 5) + (high_priority * 15))
                
                analysis["analysis_summary"] = {
                    "case_strength_score": case_strength,
                    "total_evidence_files": total_files,
                    "high_priority_evidence": high_priority,
                    "evidence_categories": len(evidence_db.get('categories', {}))
                }
                
                # Generate strengths
                if high_priority >= 3:
                    analysis["strengths"].append("Strong high-priority evidence collection")
                if 'evidence/esa_documents' in evidence_db.get('categories', {}):
                    analysis["strengths"].append("ESA documentation present")
                if 'evidence/hr_responses' in evidence_db.get('categories', {}):
                    analysis["strengths"].append("HR correspondence documented")
                    
                # Generate risks
                if total_files < 5:
                    analysis["risks"].append("Limited evidence collection")
                if high_priority < 2:
                    analysis["risks"].append("Insufficient high-priority documentation")
                    
                # Generate recommendations
                analysis["recommendations"] = [
                    "Continue documenting all HR interactions",
                    "Maintain chronological timeline of events",
                    "Ensure ESA documentation is current and complete",
                    "Document sole caregiver responsibilities thoroughly"
                ]
                
                # Generate next actions
                analysis["next_actions"] = [
                    "Review and organize high-priority evidence",
                    "Follow up on pending HR requests",
                    "Update case timeline with recent events",
                    "Prepare comprehensive evidence summary"
                ]
                
            # Save analysis report
            report_file = self.archive_folder / "reports/case_analysis/comprehensive_analysis.json"
            report_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(report_file, 'w') as f:
                json.dump(analysis, f, indent=2)
                
            self.log("ANALYSIS", f"Generated case analysis report")
            return analysis
            
        except Exception as e:
            self.log("ERROR", f"Case analysis failed: {str(e)}")
            return {}
            
    def sync_with_web_interface(self):
        """Sync archived data with web case management interface"""
        try:
            # Load timeline data
            timeline_file = self.archive_folder / "reports/timeline/comprehensive_timeline.json"
            evidence_file = self.archive_folder / "reports/evidence_summaries/evidence_database.json"
            analysis_file = self.archive_folder / "reports/case_analysis/comprehensive_analysis.json"
            
            web_data = {
                "timeline": [],
                "evidence": [],
                "correspondence": [],
                "strategy": {}
            }
            
            # Process timeline
            if timeline_file.exists():
                with open(timeline_file, 'r') as f:
                    timeline_data = json.load(f)
                    
                for event in timeline_data:
                    web_event = {
                        "id": hash(event['file_path']),
                        "date": event['date'][:10],  # Extract date part
                        "title": event['title'],
                        "description": f"Category: {event['category']}",
                        "priority": event['priority'],
                        "type": "archived"
                    }
                    web_data["timeline"].append(web_event)
                    
            # Process evidence
            if evidence_file.exists():
                with open(evidence_file, 'r') as f:
                    evidence_db = json.load(f)
                    
                for category, items in evidence_db.get('categories', {}).items():
                    for item in items:
                        web_evidence = {
                            "id": hash(item['archived_path']),
                            "title": item['filename'],
                            "type": category.split('/')[-1],
                            "description": f"Keywords: {', '.join(item['keywords'])}",
                            "relevance": item['priority'],
                            "dateAdded": item['date'][:10] if item['date'] else datetime.datetime.now().strftime('%Y-%m-%d')
                        }
                        web_data["evidence"].append(web_evidence)
                        
            # Process strategy
            if analysis_file.exists():
                with open(analysis_file, 'r') as f:
                    analysis = json.load(f)
                    web_data["strategy"] = analysis.get('analysis_summary', {})
                    
            # Save web-compatible data
            web_data_file = self.case_folder / "archived_case_data.json"
            with open(web_data_file, 'w') as f:
                json.dump(web_data, f, indent=2)
                
            self.log("SYNC", "Web interface data synchronized")
            return True
            
        except Exception as e:
            self.log("ERROR", f"Web sync failed: {str(e)}")
            return False
            
    def log(self, action, message):
        """Enhanced logging with error handling"""
        try:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_entry = f"{timestamp} - {action}: {message}\n"
            
            log_file = self.case_folder / "automation.log"
            with open(log_file, "a") as f:
                f.write(log_entry)
                
            print(log_entry.strip())
            
        except Exception as e:
            print(f"Logging failed: {str(e)}")
            
    def run_complete_automation(self):
        """Run all automation processes"""
        try:
            print("🚀 Starting Enhanced Case Management Automation...")
            
            # Step 1: Archive all existing files
            print("📁 Archiving existing files...")
            archived_count = self.archive_all_existing_files()
            
            # Step 2: Generate timeline
            print("📅 Generating comprehensive timeline...")
            timeline = self.generate_comprehensive_timeline()
            
            # Step 3: Create evidence database
            print("📊 Creating evidence database...")
            evidence_db = self.generate_evidence_database()
            
            # Step 4: Generate case analysis
            print("🎯 Generating case analysis...")
            analysis = self.generate_case_analysis_report()
            
            # Step 5: Sync with web interface
            print("🌐 Syncing with web interface...")
            sync_success = self.sync_with_web_interface()
            
            # Final summary
            print("\n✅ AUTOMATION COMPLETE!")
            print(f"📁 Archived Files: {archived_count}")
            print(f"📅 Timeline Events: {len(timeline)}")
            print(f"📊 Evidence Items: {evidence_db.get('total_files', 0)}")
            print(f"🎯 Case Strength: {analysis.get('analysis_summary', {}).get('case_strength_score', 0)}%")
            print(f"🌐 Web Sync: {'Success' if sync_success else 'Failed'}")
            print(f"📂 Archive Location: {self.archive_folder}")
            
            return True
            
        except Exception as e:
            self.log("ERROR", f"Complete automation failed: {str(e)}")
            return False

if __name__ == "__main__":
    manager = EnhancedCaseManager()
    manager.run_complete_automation()