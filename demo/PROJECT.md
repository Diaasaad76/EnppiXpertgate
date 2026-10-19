# ENPPI XpertGate — Project Master Specification & Documentation
**بوابة خبراء ومدربي إنبي وقطاع البترول المصري**

---

## 📌 Executive Overview & Objectives

**ENPPI XpertGate** is an interactive, standalone client-side enterprise web portal designed for the Egyptian Petroleum Sector under the auspices of the Ministry of Petroleum and Mineral Resources. The platform identifies, evaluates, accredits, and deploys high-caliber internal subject matter experts across **13 specialized petroleum engineering and management disciplines**.

---

## 🏛️ Application Architecture & Core Views

The application features a responsive, role-based single-page architecture with 4 primary operational views accessible via the top executive navigation bar:

### 1. Executive Overview (`executiveView`)
- **Executive Navigation Dropdown Menu:** Features an interactive sub-menu matching the Approved Trainers Directory style with 6 direct section anchors:
  - **Mission & Vision (`#execMissionVision`):** Strategic pillars, national knowledge retention, and sector vision.
  - **Project Video (`#execProjectVideo`):** Featured 120-second project pitch showcase.
  - **Key Indicators (`#execKeyIndicators`):** Real-time candidate intake, qualification rates, and TQI averages.
  - **Project Objectives (`#execProjectObjectives`):** The 6 strategic pillars of XpertGate.
  - **Project Workflow (`#execProjectWorkflow`):** 5-phase operational implementation timeline.
  - **Register (`applicantView`):** Instant jump to the trainer intake application.
- **Executive Strategic Dashboard:** Displays sector KPIs, strategic training goals, and ROI indicators.
- **2-Minute Featured Showcase Video:** Embedded inline video player (`video/sample-video.mp4`) with instant playback and download capabilities.
- **"Ready to Join?" Call-to-Action:** Placed directly beneath the video showcase for seamless one-click onboarding into the registration flow.
- **5-Phase Implementation Timeline:** Milestone tracker detailing operational phases (`01` through `05`) from discovery to sector-wide deployment.
- **Quick Home Navigation:** The ENPPI brand logo in the top bar acts as an immediate return to this executive overview.

### 2. Register (`applicantView`)
- **Step 1: Training Area & Specialty Showcase (`.featured-specialty-card`):**
  - High-contrast visual card with `START HERE • STEP 1` badge.
  - Large dual dropdowns for the 13 main disciplines and focus sub-disciplines.
  - Dynamic technical dossier containing key competencies, priority courses, Word registration template download, 2-minute video pitch player, and one-click auto-fill for 7 suggested courses.
- **Step 2: Personal & Contact Information:** Full Name, Phone, Corporate Email, LinkedIn profile, Website/Portfolio, and Mandatory CV Upload.
- **Step 3: Company Details, Job History & Training Availability:**
  - Company Name (`appCompany`)
  - Department / Division (`appDepartment`)
  - Current Job Title (`appJobTitle`)
  - **Direct Manager (`appDirectManager`):** Direct Manager Name & Position *(New Field)*
  - Company HR Department Email (`appHrEmail`)
  - Chronological Career Positions Held (`appCareerPositions`)
  - Employment Status / Cohort (`Cohort A` In-Service vs `Cohort B` Veteran Consultant)
  - Availability Level for Training (`High`, `Medium`, `Low`)
- **Step 4: Academic Degrees:** Bachelor's (Mandatory *), Master's, Doctorate / PhD.
- **Step 5: Professional & International Certifications:** 13 discipline-specific technical certificates and credentials.
- **Step 6: Expert Classification & English Proficiency:** Local, Regional, or International Expert + English Business Fluency.
- **Step 7: 7 Specialized Training Courses:** List of 7 specific training programs the candidate can deliver.
- **Step 8: 2-Minute Introductory Video Pitch:** Dual-card selector for direct video file upload (`.mp4`, `.mov`, `.webm`) or external link (YouTube, OneDrive, Teams, Google Drive).
- **Step 9: Financial Information:** Bank Account details for trainer compensation.
- **Step 10: Official Declaration & Signature:** Checkbox confirmation and digital signature.
- **Instant Gate 1 Indicator:** Live 1000-point calculation (Experience, Degree, Expert Tier, Certifications, Language) updating dynamically.
- **Automated CV Scanning & Specialty Matching Engine (`xgCvEngine`):**
  - Instant client-side text extraction from uploaded PDF/Word CVs via `pdf.js` with manual paste/preview toggle (`#toggleCvPasteBtn`, `#appCvTextPaste`).
  - Scans and matches CV content against primary petroleum disciplines, focus sub-disciplines, and engineering standards (API, ASME, ISO, NEBOSH, PMP, SPE, Aspen HYSYS, etc.).
  - Real-time live card (`#cvLiveScanCard`) shows instant alignment score, matched area points, and matched specialty points.

### 3. Evaluation Committee (`committeeView`)
- **Access Gate:** Interactive login modal with displayed credentials (`committee` / `Enppi2026!`).
- **Unified Candidates Table:** Searchable, filterable candidate roster with Gate 1 scores, live readiness indicators, and instant CV Match tags.
- **Candidate Dossier Review:**
  - Candidate details breakdown (including Company, Department, Job Title, **Direct Manager**, HR Email, and phone).
  - Attached CV download (`.pdf` / `.docx`).
  - **Scanned CV Technical Alignment Dossier:** Dedicated committee dossier card displaying discipline alignment percentage, matched primary area points (green chips), matched focus specialty points (cyan chips), matched certifications/standards (gold chips), and a highlighted CV excerpt.
  - Synchronized 2-minute introductory video player.
- **Gate 1 Initiation Score Highlight Widget (`#committeeGate1Widget`):**
  - Featured CV Alignment Scan row with highlighted glowing border, match percentage badge, and area/sub-discipline breakdown.
  - Live status pill (`#liveCvScanPill`) reflecting CV alignment status in real time.
- **Physical In-Person Trainer Assessment Sheet (15-Minute Presentation, 100%):**
  - Rebuilt strictly from `competencies matrix.docx`.
  - **5 Weighted Evaluation Dimensions:**
    1. الرصانة العلمية والعمق التخصصي (Scientific Soundness & Depth — 25%)
    2. هندسة العرض 15 دقيقة وإدارة الوقت (15-Min Presentation Engineering & Time Discipline — 20%)
    3. فن الإلقاء ولغة الجسد والحضور (Delivery, Body Language & Presence — 25%)
    4. التفاعل الذكي وإدارة القاعة (Audience Interaction & Hall Management — 15%)
    5. الأثر والقيمة المضافة ونقل الخبرة (Impact, Added Value & Knowledge Transfer — 15%)
  - **Strict Disqualification Rules:** Scoring $\le 2$ on Criterion **1.1** or **2.2** triggers an immediate disqualification banner regardless of aggregate score.
  - **Preset Demonstrator Buttons:** Elite (100%), Certified (80%), Meets Minimum (60%), and Exclusion Rule trigger for rapid demonstration.

### 4. Approved Trainers Directory (`skillsBankView`)
- **Sector Skills Bank:** Directory populated with accredited trainers across all 13 disciplines.
- **Discipline & Tier Filtering:** Exploration, Refining, HSE, Gas Processing, Instrumentation, Digital Transformation, etc.
- **Full Dossier View:** Accreditations, SECI knowledge transfer case studies, TQI score, and course scope.
- **Export Capabilities:** One-click CSV export of the certified trainers roster.
- **Integrated Admin ROI Sub-Menu:** Embedded direct sub-navigation to the Financial Feasibility & ROI Calculator without leaving the directory hierarchy.

---

## 📂 Project Directory Structure

```text
├── index.html                   # Primary root entry point (synchronized with demo)
├── app.js                       # Root application controller and scoring engine
├── data.js                      # Root domain data, rubric items, and candidate seeds
├── style.css                    # Root application styling and animations
├── README.md                    # Public quick-start guide
├── PROJECT.md                   # Complete architectural and field specification (this file)
├── assets/                      # Documents, templates, and corporate logos
│   ├── Logo.jpeg
│   ├── logo_full.png
│   ├── competencies matrix.docx
│   ├── Template Form for Expert Registration.docx
│   └── template to evaluate trainer.docx
├── video/
│   └── sample-video.mp4         # Official 2-minute demo video
└── demo/                        # Mirror standalone web demo directory
    ├── index.html
    ├── app.js
    ├── data.js
    ├── style.css
    └── README.md
```

---

## 🛡️ Project Backup Ledger

| Backup Directory | Timestamp | Description |
| :--- | :--- | :--- |
| `backup_current_state` | 2026-10-18 17:14 | Initial working snapshot before major structural refactoring |
| `backup_safe_working` | 2026-10-18 17:22 | Stable snapshot prior to navigation adjustments |
| `backup_before_root_sync` | 2026-10-18 17:30 | Snapshot before root directory mirror synchronization |
| `backup_verified_working_20261018` | 2026-10-18 17:35 | Verified working baseline with all navbar routes functional |
| `backup_trainer_reg_before_visual_enhancement_20261018` | 2026-10-18 17:58 | Snapshot before Trainer Registration Section 1 visual redesign |
| `backup_before_direct_manager_field_20261018` | 2026-10-18 18:08 | Snapshot before adding Direct Manager field to Section 3 |
| `backup_before_executive_dropdown_20261018` | 2026-10-18 18:21 | Snapshot before adding Executive Overview dropdown menu & Register label |
| `backup_before_rubric_table_overflow_fix_20261018` | 2026-10-18 19:30 | Snapshot before Candidate Table Rubric button overflow & width fix |
| `backup_enlarge_rubric_box_20261018` | 2026-10-18 20:00 | Enlarged main-content and table container box so Rubric button and Action column are fully displayed |

---

## 🚀 Local Execution & GitHub Pages Hosting

### Local Execution:
Double-click `index.html` or `demo/index.html` in any browser. No web server, Node.js runtime, or external network connection is required.

### GitHub Pages Deployment:
1. Initialize git and commit:
   ```bash
   git add .
   git commit -m "feat: complete ENPPI XpertGate demo with Direct Manager field"
   git push origin main
   ```
2. In GitHub repository settings &rarr; **Pages** &rarr; Select `main` branch and `/(root)` &rarr; Save.
