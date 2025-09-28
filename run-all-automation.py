#!/usr/bin/env python3
"""
Complete Automation Runner
Runs all missing form generation and identification processes
"""

import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

class CompleteAutomationRunner:
    def __init__(self):
        self.base_path = Path("/Users/owner/GitHub/SYNC/case-management")
        self.scripts = [
            {
                "name": "Original Ontario Court Forms",
                "script": "ontario-court-forms.py",
                "description": "Generate Forms 14, 8, 35.1, 14B, 6B"
            },
            {
                "name": "Multi-Jurisdiction Forms",
                "script": "multi-jurisdiction-forms.py", 
                "description": "Generate Form 14A, Emergency Motion, Police Reports, FACS Complaints"
            },
            {
                "name": "Form Identification System",
                "script": "form-identification-system.py",
                "description": "AI-powered document identification and analysis"
            },
            {
                "name": "Enhanced Automation",
                "script": "enhanced-automation.py",
                "description": "File organization and evidence analysis"
            },
            {
                "name": "Integration Manager",
                "script": "integration-manager.py",
                "description": "Cross-system integration and synchronization"
            },
            {
                "name": "Version Control",
                "script": "version-control.py",
                "description": "Git integration and version tracking"
            }
        ]
        
    def run_script(self, script_info):
        """Run a single automation script"""
        try:
            script_path = self.base_path / script_info["script"]
            if not script_path.exists():
                return {
                    "success": False,
                    "error": f"Script not found: {script_info['script']}",
                    "output": ""
                }
            
            print(f"🔄 Running: {script_info['name']}")
            print(f"   {script_info['description']}")
            
            result = subprocess.run(
                [sys.executable, str(script_path)],
                cwd=str(self.base_path),
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                print(f"✅ {script_info['name']} completed successfully")
                return {
                    "success": True,
                    "output": result.stdout,
                    "error": result.stderr
                }
            else:
                print(f"❌ {script_info['name']} failed with return code {result.returncode}")
                return {
                    "success": False,
                    "output": result.stdout,
                    "error": result.stderr
                }
                
        except subprocess.TimeoutExpired:
            print(f"⏰ {script_info['name']} timed out")
            return {
                "success": False,
                "error": "Script execution timed out",
                "output": ""
            }
        except Exception as e:
            print(f"💥 {script_info['name']} crashed: {e}")
            return {
                "success": False,
                "error": str(e),
                "output": ""
            }
    
    def run_all_automation(self):
        """Run all automation scripts in sequence"""
        print("🚀 STARTING COMPLETE AUTOMATION SUITE")
        print("=" * 50)
        
        results = {
            "start_time": datetime.now().isoformat(),
            "scripts_run": [],
            "successful": 0,
            "failed": 0,
            "total_time": 0
        }
        
        start_time = datetime.now()
        
        for script_info in self.scripts:
            script_start = datetime.now()
            result = self.run_script(script_info)
            script_end = datetime.now()
            script_duration = (script_end - script_start).total_seconds()
            
            script_result = {
                "name": script_info["name"],
                "script": script_info["script"],
                "description": script_info["description"],
                "success": result["success"],
                "duration": script_duration,
                "output": result["output"],
                "error": result["error"]
            }
            
            results["scripts_run"].append(script_result)
            
            if result["success"]:
                results["successful"] += 1
            else:
                results["failed"] += 1
            
            print(f"   Duration: {script_duration:.2f} seconds")
            print()
        
        end_time = datetime.now()
        results["end_time"] = end_time.isoformat()
        results["total_time"] = (end_time - start_time).total_seconds()
        
        # Save results
        results_path = self.base_path / "automation_results.json"
        with open(results_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Print summary
        print("=" * 50)
        print("🎯 AUTOMATION SUITE COMPLETE")
        print(f"✅ Successful: {results['successful']}")
        print(f"❌ Failed: {results['failed']}")
        print(f"⏱️  Total Time: {results['total_time']:.2f} seconds")
        print(f"📊 Results saved to: automation_results.json")
        
        if results["failed"] > 0:
            print("\n❌ FAILED SCRIPTS:")
            for script_result in results["scripts_run"]:
                if not script_result["success"]:
                    print(f"   {script_result['name']}: {script_result['error']}")
        
        return results
    
    def generate_missing_forms_summary(self):
        """Generate summary of all missing forms that are now available"""
        forms_summary = {
            "ontario_family_court": [
                "Form 14: Application (General)",
                "Form 14A: Affidavit (General) - ✨ NEW",
                "Form 14B: Motion",
                "Form 8: Financial Statement", 
                "Form 35.1: Affidavit in Support",
                "Form 6B: Continuing Record",
                "Emergency Motion Request - ✨ NEW"
            ],
            "supreme_court": [
                "Application for Leave to Appeal - ✨ NEW"
            ],
            "police_services": [
                "Ontario Police Incident Report - ✨ NEW",
                "Niagara Regional Police Complaint - ✨ NEW",
                "Peel Regional Police Report - ✨ NEW"
            ],
            "family_services": [
                "FACS Niagara Complaint Form - ✨ NEW"
            ],
            "automated_processes": [
                "Form Identification System - ✨ NEW",
                "Multi-Jurisdiction Form Generator - ✨ NEW", 
                "Automated File Processing - ✨ NEW",
                "AI-Powered Document Analysis - ✨ NEW"
            ]
        }
        
        print("\n📋 COMPLETE FORMS INVENTORY:")
        print("=" * 50)
        
        for category, forms in forms_summary.items():
            print(f"\n{category.upper().replace('_', ' ')}:")
            for form in forms:
                print(f"   • {form}")
        
        # Save summary
        summary_path = self.base_path / "complete_forms_inventory.json"
        with open(summary_path, 'w') as f:
            json.dump(forms_summary, f, indent=2)
        
        print(f"\n📁 Complete inventory saved to: complete_forms_inventory.json")
        
        return forms_summary

def main():
    """Main execution"""
    runner = CompleteAutomationRunner()
    
    # Run all automation
    results = runner.run_all_automation()
    
    # Generate forms summary
    runner.generate_missing_forms_summary()
    
    # Final status
    if results["failed"] == 0:
        print("\n🎉 ALL AUTOMATION COMPLETED SUCCESSFULLY!")
        print("   All missing forms and processes are now available.")
    else:
        print(f"\n⚠️  AUTOMATION COMPLETED WITH {results['failed']} ISSUES")
        print("   Check automation_results.json for details.")

if __name__ == "__main__":
    main()