#!/usr/bin/env python3
"""
Enhanced Version Control System
Tracks all runs, forms, and system changes with detailed versioning
"""

import json
import datetime
import subprocess
from pathlib import Path
import hashlib

class VersionControl:
    def __init__(self, base_path="/Users/owner/GitHub/SYNC/case-management"):
        self.base_path = Path(base_path)
        self.versions_dir = self.base_path / "versions"
        self.versions_dir.mkdir(exist_ok=True)
        
    def create_version_snapshot(self, description="Automated snapshot"):
        """Create a complete version snapshot"""
        try:
            timestamp = datetime.datetime.now()
            version_id = timestamp.strftime("%Y%m%d_%H%M%S")
            
            # Get Git commit info
            git_info = self.get_git_info()
            
            # Create version metadata
            version_data = {
                "version_id": version_id,
                "timestamp": timestamp.isoformat(),
                "description": description,
                "git_commit": git_info.get("commit"),
                "git_branch": git_info.get("branch"),
                "files_snapshot": self.create_files_snapshot(),
                "forms_generated": self.get_forms_info(),
                "system_status": self.get_system_status()
            }
            
            # Save version data
            version_file = self.versions_dir / f"version_{version_id}.json"
            with open(version_file, 'w') as f:
                json.dump(version_data, f, indent=2)
                
            print(f"✅ Version snapshot created: {version_id}")
            return version_id
            
        except Exception as e:
            print(f"❌ Version snapshot failed: {str(e)}")
            return None
            
    def get_git_info(self):
        """Get current Git information"""
        try:
            # Get current commit
            commit_result = subprocess.run(
                ["git", "rev-parse", "HEAD"], 
                capture_output=True, text=True, cwd=self.base_path
            )
            
            # Get current branch
            branch_result = subprocess.run(
                ["git", "branch", "--show-current"], 
                capture_output=True, text=True, cwd=self.base_path
            )
            
            return {
                "commit": commit_result.stdout.strip() if commit_result.returncode == 0 else None,
                "branch": branch_result.stdout.strip() if branch_result.returncode == 0 else None
            }
        except Exception as e:
            return {"commit": None, "branch": None, "error": str(e)}
            
    def create_files_snapshot(self):
        """Create snapshot of all important files"""
        try:
            files_info = {}
            
            # Key files to track
            key_files = [
                "index.html",
                "enhanced-case-management.js", 
                "enhanced-automation.py",
                "integration-manager.py",
                "ontario-court-forms.py"
            ]
            
            for file_name in key_files:
                file_path = self.base_path / file_name
                if file_path.exists():
                    # Get file hash for change detection
                    with open(file_path, 'rb') as f:
                        file_hash = hashlib.md5(f.read()).hexdigest()
                        
                    files_info[file_name] = {
                        "exists": True,
                        "size": file_path.stat().st_size,
                        "modified": datetime.datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                        "hash": file_hash
                    }
                else:
                    files_info[file_name] = {"exists": False}
                    
            return files_info
            
        except Exception as e:
            return {"error": str(e)}
            
    def get_forms_info(self):
        """Get information about generated forms"""
        try:
            forms_dir = self.base_path / "ontario-forms"
            if not forms_dir.exists():
                return {"forms_generated": 0, "forms": []}
                
            forms = list(forms_dir.glob("*.txt"))
            forms_info = {
                "forms_generated": len(forms),
                "forms": [f.name for f in forms],
                "last_generated": None
            }
            
            # Check forms summary
            summary_file = forms_dir / "forms_summary.json"
            if summary_file.exists():
                with open(summary_file, 'r') as f:
                    summary = json.load(f)
                    forms_info["last_generated"] = summary.get("generated")
                    
            return forms_info
            
        except Exception as e:
            return {"error": str(e)}
            
    def get_system_status(self):
        """Get current system status"""
        try:
            status = {
                "case_management": (self.base_path / "index.html").exists(),
                "enhanced_features": (self.base_path / "enhanced-case-management.js").exists(),
                "automation": (self.base_path / "enhanced-automation.py").exists(),
                "integration": (self.base_path / "integration-manager.py").exists(),
                "ontario_forms": (self.base_path / "ontario-forms").exists(),
                "archive_data": (self.base_path / "archived_case_data.json").exists()
            }
            
            status["systems_active"] = sum(status.values())
            return status
            
        except Exception as e:
            return {"error": str(e)}
            
    def list_versions(self):
        """List all available versions"""
        try:
            versions = []
            for version_file in self.versions_dir.glob("version_*.json"):
                with open(version_file, 'r') as f:
                    version_data = json.load(f)
                    versions.append({
                        "version_id": version_data["version_id"],
                        "timestamp": version_data["timestamp"],
                        "description": version_data["description"],
                        "git_commit": version_data.get("git_commit", "Unknown")[:8]
                    })
                    
            # Sort by timestamp (newest first)
            versions.sort(key=lambda x: x["timestamp"], reverse=True)
            return versions
            
        except Exception as e:
            return []
            
    def compare_versions(self, version1_id, version2_id):
        """Compare two versions"""
        try:
            v1_file = self.versions_dir / f"version_{version1_id}.json"
            v2_file = self.versions_dir / f"version_{version2_id}.json"
            
            if not (v1_file.exists() and v2_file.exists()):
                return {"error": "One or both versions not found"}
                
            with open(v1_file, 'r') as f:
                v1_data = json.load(f)
            with open(v2_file, 'r') as f:
                v2_data = json.load(f)
                
            comparison = {
                "version1": version1_id,
                "version2": version2_id,
                "files_changed": [],
                "forms_changed": False,
                "system_changes": []
            }
            
            # Compare files
            v1_files = v1_data.get("files_snapshot", {})
            v2_files = v2_data.get("files_snapshot", {})
            
            for file_name in set(v1_files.keys()) | set(v2_files.keys()):
                v1_hash = v1_files.get(file_name, {}).get("hash")
                v2_hash = v2_files.get(file_name, {}).get("hash")
                
                if v1_hash != v2_hash:
                    comparison["files_changed"].append(file_name)
                    
            # Compare forms
            v1_forms = v1_data.get("forms_generated", {}).get("forms_generated", 0)
            v2_forms = v2_data.get("forms_generated", {}).get("forms_generated", 0)
            comparison["forms_changed"] = v1_forms != v2_forms
            
            return comparison
            
        except Exception as e:
            return {"error": str(e)}
            
    def auto_version_on_changes(self):
        """Automatically create version when significant changes detected"""
        try:
            # Check if there are uncommitted changes
            result = subprocess.run(
                ["git", "status", "--porcelain"], 
                capture_output=True, text=True, cwd=self.base_path
            )
            
            if result.returncode == 0 and result.stdout.strip():
                # There are changes, create version
                version_id = self.create_version_snapshot("Auto-version: Uncommitted changes detected")
                
                # Commit changes
                subprocess.run(["git", "add", "."], cwd=self.base_path)
                subprocess.run([
                    "git", "commit", "-m", f"Auto-commit: Version {version_id}"
                ], cwd=self.base_path)
                
                return version_id
            else:
                print("No changes detected")
                return None
                
        except Exception as e:
            print(f"Auto-versioning failed: {str(e)}")
            return None
            
    def generate_version_report(self):
        """Generate comprehensive version report"""
        try:
            versions = self.list_versions()
            
            report = f"""# Version Control Report
Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
- Total Versions: {len(versions)}
- Latest Version: {versions[0]['version_id'] if versions else 'None'}
- Version Control Location: {self.versions_dir}

## Recent Versions
"""
            
            for i, version in enumerate(versions[:5]):  # Show last 5 versions
                report += f"""
### Version {version['version_id']}
- **Timestamp:** {version['timestamp'][:19]}
- **Description:** {version['description']}
- **Git Commit:** {version['git_commit']}
"""
            
            # Current system status
            status = self.get_system_status()
            report += f"""
## Current System Status
- Case Management: {'✅' if status['case_management'] else '❌'}
- Enhanced Features: {'✅' if status['enhanced_features'] else '❌'}
- Automation: {'✅' if status['automation'] else '❌'}
- Integration: {'✅' if status['integration'] else '❌'}
- Ontario Forms: {'✅' if status['ontario_forms'] else '❌'}
- Archive Data: {'✅' if status['archive_data'] else '❌'}

**Active Systems:** {status['systems_active']}/6
"""
            
            # Save report
            report_file = self.versions_dir / "version_report.md"
            with open(report_file, 'w') as f:
                f.write(report)
                
            print(f"📊 Version report generated: {report_file}")
            return report_file
            
        except Exception as e:
            print(f"Report generation failed: {str(e)}")
            return None

if __name__ == "__main__":
    vc = VersionControl()
    
    # Create current version snapshot
    version_id = vc.create_version_snapshot("Ontario Court Forms v1.0 - Complete form set generated")
    
    # Generate report
    vc.generate_version_report()
    
    # List all versions
    versions = vc.list_versions()
    print(f"\n📋 Available Versions: {len(versions)}")
    for v in versions:
        print(f"  - {v['version_id']}: {v['description']}")
        
    # Auto-commit if changes exist
    auto_version = vc.auto_version_on_changes()
    if auto_version:
        print(f"🔄 Auto-version created: {auto_version}")