#!/usr/bin/env python3
"""
Ontario Family Court Forms Generator
Generates required forms for sole caregiver emergency filing
"""

import json
import datetime
from pathlib import Path

class OntarioCourtForms:
    def __init__(self, base_path="/Users/owner/GitHub/SYNC/case-management"):
        self.base_path = Path(base_path)
        self.forms_dir = self.base_path / "ontario-forms"
        self.forms_dir.mkdir(exist_ok=True)
        
    def generate_form_14_application(self):
        """Form 14: Application (General)"""
        form_content = """ONTARIO FAMILY COURT
FORM 14: APPLICATION (GENERAL)

Court File Number: _________________
Court Office Address: _________________

BETWEEN:
[YOUR NAME]                                                    Applicant
- and -
[OTHER PARTY NAME]                                            Respondent

APPLICATION UNDER:
☐ Children's Law Reform Act
☐ Family Law Act  
☐ Divorce Act
☑ Other: Emergency Sole Caregiver Status

TO THE RESPONDENT(S):
A COURT CASE HAS BEEN STARTED AGAINST YOU IN THIS COURT. THE DETAILS ARE SET OUT ON THE ATTACHED PAGES.

THE FIRST COURT DATE IS _________________ AT _______ □ a.m. □ p.m.
or as soon as possible after that time, at: (address of court office)

IF YOU DO NOT COME TO COURT, AN ORDER MAY BE MADE WITHOUT YOU AND ENFORCED AGAINST YOU.

YOU SHOULD GET LEGAL ADVICE ABOUT THIS CASE RIGHT AWAY. If you cannot afford a lawyer, you may be able to get help from your local Legal Aid Ontario office.

Date: _________________     Signature of applicant or lawyer
                          _________________________________

CLAIM BY APPLICANT:
I ask the court for the following:

1. An order declaring me the sole caregiver of [CHILD'S NAME], born [DATE OF BIRTH]

2. An order for emergency interim custody and care of the said child

3. An order requiring accommodation for my emotional support animal as necessary for my caregiving duties

4. An order for child support in accordance with the Child Support Guidelines

5. Such further and other relief as this Honourable Court may deem just

IMPORTANT FACTS SUPPORTING MY CLAIM FOR RELIEF:

1. I am the biological/adoptive parent of the child named above
2. I have been the primary caregiver since [DATE]
3. The child resides with me at [ADDRESS]
4. I require ESA accommodation to maintain my caregiving capacity
5. Emergency relief is necessary due to [CIRCUMSTANCES]

Sworn/Affirmed before me at ________________
this _____ day of _______, 20___

_________________________________     _________________________________
Commissioner for Taking Affidavits     Signature of Applicant"""

        form_path = self.forms_dir / "Form_14_Application.txt"
        with open(form_path, 'w') as f:
            f.write(form_content)
        return form_path

    def generate_form_8_application_financial_statement(self):
        """Form 8: Application (Financial Statement)"""
        form_content = """ONTARIO FAMILY COURT
FORM 8: APPLICATION (FINANCIAL STATEMENT)

Court File Number: _________________

APPLICANT: [YOUR NAME]

PART 1: INCOME
1. Employment Income (last 12 months): $__________
2. Self-Employment Income: $__________
3. Investment Income: $__________
4. Pension Income: $__________
5. Employment Insurance Benefits: $__________
6. Workers' Compensation: $__________
7. Social Assistance: $__________
8. Other Income: $__________

TOTAL ANNUAL INCOME: $__________

PART 2: EXPENSES (Monthly)
HOUSING:
- Rent/Mortgage: $__________
- Property Taxes: $__________
- Home Insurance: $__________
- Utilities: $__________
- Maintenance: $__________

CHILD CARE:
- Daycare/Babysitting: $__________
- Medical/Dental (not covered): $__________
- Clothing: $__________
- School Expenses: $__________
- Extracurricular Activities: $__________

PERSONAL:
- Food: $__________
- Transportation: $__________
- Medical/Dental: $__________
- Life Insurance: $__________
- ESA Care and Maintenance: $__________

TOTAL MONTHLY EXPENSES: $__________

PART 3: ASSETS
- Bank Accounts: $__________
- Investments: $__________
- Real Estate: $__________
- Vehicles: $__________
- Other Assets: $__________

TOTAL ASSETS: $__________

PART 4: DEBTS
- Credit Cards: $__________
- Loans: $__________
- Mortgage: $__________
- Other Debts: $__________

TOTAL DEBTS: $__________

I swear/affirm that the information set out in this financial statement is true to the best of my knowledge, information and belief.

Sworn/Affirmed before me at ________________
this _____ day of _______, 20___

_________________________________     _________________________________
Commissioner for Taking Affidavits     Signature of Applicant"""

        form_path = self.forms_dir / "Form_8_Financial_Statement.txt"
        with open(form_path, 'w') as f:
            f.write(form_content)
        return form_path

    def generate_form_35_1_affidavit_support_claim(self):
        """Form 35.1: Affidavit in Support of Claim"""
        form_content = """ONTARIO FAMILY COURT
FORM 35.1: AFFIDAVIT IN SUPPORT OF CLAIM FOR CUSTODY OR ACCESS

Court File Number: _________________

APPLICANT: [YOUR NAME]

I, [YOUR FULL NAME], of the [City/Town] of ____________, in the [Province/Territory] of ____________, MAKE OATH AND SAY/AFFIRM:

1. I am the Applicant in this case and have personal knowledge of the matters set out in this affidavit.

2. I am the [relationship] of [CHILD'S NAME], born [DATE OF BIRTH] ("the child").

SOLE CAREGIVER STATUS:

3. I have been the sole primary caregiver of the child since [DATE].

4. The child has resided with me continuously at [ADDRESS] since [DATE].

5. I am responsible for all aspects of the child's daily care including:
   a) Feeding, bathing, and personal hygiene
   b) Medical appointments and healthcare decisions
   c) Educational support and school attendance
   d) Emotional support and guidance
   e) Financial support and provision of necessities

CAREGIVING CAPACITY AND ESA NEED:

6. I have a disability that affects my ability to provide care without accommodation.

7. I require the assistance of my emotional support animal to maintain my caregiving capacity.

8. My ESA provides essential support that enables me to:
   a) Manage anxiety and stress related to sole caregiving
   b) Maintain emotional stability for the child's benefit
   c) Continue employment to support the child financially
   d) Provide consistent, stable care

BEST INTERESTS OF THE CHILD:

9. It is in the child's best interests that I continue as sole caregiver because:
   a) The child has a strong attachment to me
   b) I have been the consistent primary caregiver
   c) The child's routine and stability would be disrupted by any change
   d) I am able to meet all of the child's physical and emotional needs

10. The child has expressed [if age appropriate] that they wish to remain in my care.

EMERGENCY CIRCUMSTANCES:

11. Emergency relief is necessary because [DESCRIBE CIRCUMSTANCES].

12. Any delay in obtaining this relief would be detrimental to the child's welfare.

SWORN/AFFIRMED before me at the [City/Town] of ____________, in the [Province/Territory] of ____________, this _____ day of _______, 20___.

_________________________________     _________________________________
Commissioner for Taking Affidavits     [YOUR SIGNATURE]
(Signature)                           [YOUR PRINTED NAME]"""

        form_path = self.forms_dir / "Form_35_1_Affidavit_Support.txt"
        with open(form_path, 'w') as f:
            f.write(form_content)
        return form_path

    def generate_form_14b_motion(self):
        """Form 14B: Motion"""
        form_content = """ONTARIO FAMILY COURT
FORM 14B: MOTION

Court File Number: _________________

APPLICANT: [YOUR NAME]

TO THE RESPONDENT(S):
THE APPLICANT WILL MAKE A MOTION to the court on [DATE] at [TIME] or as soon as possible after that time.

THE MOTION IS FOR:
1. An order for emergency interim sole custody of [CHILD'S NAME]
2. An order declaring me the sole caregiver with all decision-making authority
3. An order requiring accommodation for my emotional support animal
4. An order for interim child support
5. Such further and other relief as this court deems just

THE GROUNDS FOR THE MOTION ARE:
1. I am the sole primary caregiver of the child
2. The child's best interests require continuity of care
3. I require ESA accommodation to maintain caregiving capacity
4. Emergency circumstances exist requiring immediate relief
5. The Family Law Act, s. 20
6. The Children's Law Reform Act, s. 21
7. The facts set out in the attached affidavit(s)

THE FOLLOWING DOCUMENTARY EVIDENCE will be used at the hearing of the motion:
1. Affidavit of [YOUR NAME] sworn [DATE]
2. Financial Statement (Form 8)
3. ESA Medical Documentation
4. Child's Birth Certificate
5. Medical records of the child
6. School records
7. Such further and other evidence as counsel may advise

Date: _________________     _________________________________
                          Signature of applicant or lawyer

                          _________________________________
                          [YOUR NAME]
                          [ADDRESS]
                          [PHONE NUMBER]
                          [EMAIL]"""

        form_path = self.forms_dir / "Form_14B_Motion.txt"
        with open(form_path, 'w') as f:
            f.write(form_content)
        return form_path

    def generate_form_6b_continuing_record(self):
        """Form 6B: Continuing Record"""
        form_content = """ONTARIO FAMILY COURT
FORM 6B: CONTINUING RECORD

Court File Number: _________________

APPLICANT: [YOUR NAME]
RESPONDENT: [OTHER PARTY NAME]

TABLE OF CONTENTS

TAB    DOCUMENT                                    DATE FILED
1      Application (Form 14)                      ___________
2      Financial Statement (Form 8)               ___________
3      Affidavit in Support (Form 35.1)          ___________
4      Motion (Form 14B)                          ___________
5      ESA Medical Documentation                  ___________
6      Child's Birth Certificate                  ___________
7      Medical Records - Child                    ___________
8      School Records                             ___________
9      Caregiver Documentation                    ___________
10     Employment Records                         ___________
11     [Additional Documents]                     ___________

CERTIFICATE OF COMPLETENESS

I certify that this continuing record contains all the documents filed in this case as of [DATE].

Date: _________________     _________________________________
                          Signature of applicant or lawyer"""

        form_path = self.forms_dir / "Form_6B_Continuing_Record.txt"
        with open(form_path, 'w') as f:
            f.write(form_content)
        return form_path

    def generate_emergency_motion_checklist(self):
        """Emergency Motion Filing Checklist"""
        checklist_content = """ONTARIO FAMILY COURT
EMERGENCY SOLE CAREGIVER MOTION - FILING CHECKLIST

REQUIRED DOCUMENTS FOR FILING:

☐ 1. Form 14: Application (General)
☐ 2. Form 8: Financial Statement  
☐ 3. Form 35.1: Affidavit in Support of Claim
☐ 4. Form 14B: Motion
☐ 5. Form 6B: Continuing Record (Table of Contents)

SUPPORTING EVIDENCE:

☐ 6. Child's Birth Certificate (certified copy)
☐ 7. ESA Medical Letter/Documentation
☐ 8. Medical records of child (relevant portions)
☐ 9. School records showing your involvement
☐ 10. Employment records/pay stubs
☐ 11. Proof of residence (lease/mortgage)
☐ 12. Caregiver documentation/statements
☐ 13. Photos of child in your care
☐ 14. Character references (if available)

FILING REQUIREMENTS:

☐ Court filing fees paid (or fee waiver application)
☐ All documents properly sworn/commissioned
☐ Proper service on other parties (if applicable)
☐ Motion scheduled with court office
☐ All parties notified of motion date

EMERGENCY CRITERIA MET:

☐ Immediate risk to child's welfare
☐ Urgent need for sole caregiver determination  
☐ ESA accommodation required for caregiving
☐ Cannot wait for regular motion timeline

NEXT STEPS AFTER FILING:

1. Serve all documents on respondent (if applicable)
2. File affidavit of service
3. Prepare for motion hearing
4. Bring all original documents to court
5. Arrange for ESA accommodation at courthouse if needed

COURT APPEARANCE PREPARATION:

☐ Review all filed documents
☐ Prepare oral submissions
☐ Bring original documents
☐ Arrange childcare for court date
☐ Confirm ESA can attend court if needed
☐ Dress appropriately for court
☐ Arrive early on motion date

EMERGENCY CONTACT INFORMATION:

Court Office: _________________________
File Number: _________________________
Motion Date: _________________________
Motion Time: _________________________
Courtroom: ___________________________

Legal Aid Ontario: 1-800-668-8258
Duty Counsel: Available at courthouse"""

        checklist_path = self.forms_dir / "Emergency_Motion_Checklist.txt"
        with open(checklist_path, 'w') as f:
            f.write(checklist_content)
        return checklist_path

    def generate_all_forms(self):
        """Generate all Ontario Family Court forms"""
        forms_generated = []
        
        print("🏛️ Generating Ontario Family Court Forms...")
        
        forms_generated.append(self.generate_form_14_application())
        print("✅ Form 14: Application (General)")
        
        forms_generated.append(self.generate_form_8_application_financial_statement())
        print("✅ Form 8: Financial Statement")
        
        forms_generated.append(self.generate_form_35_1_affidavit_support_claim())
        print("✅ Form 35.1: Affidavit in Support")
        
        forms_generated.append(self.generate_form_14b_motion())
        print("✅ Form 14B: Motion")
        
        forms_generated.append(self.generate_form_6b_continuing_record())
        print("✅ Form 6B: Continuing Record")
        
        forms_generated.append(self.generate_emergency_motion_checklist())
        print("✅ Emergency Motion Checklist")
        
        # Generate summary
        summary = {
            "generated": datetime.datetime.now().isoformat(),
            "forms_created": len(forms_generated),
            "forms_list": [f.name for f in forms_generated],
            "purpose": "Ontario Family Court - Sole Caregiver Emergency Filing",
            "location": str(self.forms_dir)
        }
        
        summary_path = self.forms_dir / "forms_summary.json"
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)
            
        print(f"\n✅ ALL FORMS GENERATED!")
        print(f"📁 Location: {self.forms_dir}")
        print(f"📋 Total Forms: {len(forms_generated)}")
        
        return forms_generated

if __name__ == "__main__":
    generator = OntarioCourtForms()
    generator.generate_all_forms()