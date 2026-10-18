# ENPPI XpertGate (بوابة خبراء ومدربي إنبي وقطاع البترول)

**ENPPI XpertGate** is an interactive, client-side enterprise web portal designed for the Egyptian Petroleum Sector to discover, assess, accredit, and deploy elite internal technical trainers across 13 specialized engineering disciplines.

---

## 🌟 Demo Architecture & Core Role Views

The application provides 4 key role-based interfaces accessible from the top navigation bar:

### 1. Executive Overview (نظرة تنفيذية)
- **High-Impact Leadership Dashboard:** Sector key performance indicators (KPIs), 6 strategic goals, and investment returns.
- **2-Minute Featured Project Showcase Video:** Embedded inline player with instant preview and download.
- **Ready to Join Call-to-Action:** Placed directly under the showcase video with one-click navigation to trainer registration.
- **5-Phase Implementation Timeline:** Visual milestone tracking (`01` through `05`) displaying operational progression.
- **Return to Home:** Clicking the top-left ENPPI logo instantly returns to this Executive Overview.

### 2. Trainer Registration (تسجيل المدربين)
- **Comprehensive Intake Form:** Covering basic information, current sector entity, academic qualifications, and the top 7 proposed training programs.
- **Section 8 (2-Minute Introductory Video Pitch):** Dual-option card interface with clear visual icons distinguishing between:
  - `Direct Video File Upload` (`.mp4`, `.mov`, `.webm`, capped at 120s)
  - `Paste Video Pitch Link` (YouTube, Vimeo, OneDrive, Teams, Google Drive)
- **Instant Gate 1 Self-Assessment Indicator:** Live 1000-point calculation (Experience, Degree, Expert Classification, Certifications, English Proficiency) updating in real-time as the applicant fills the form.

### 3. Evaluation Committee (لجنة التحكيم والتقييم)
- **Protected Access Gate:** Clean committee login modal with demo credentials displayed on screen (`committee` / `Enppi2026!`).
- **Unified Candidate Review Roster:** All sector applicants displayed in one sortable, searchable table.
- **Live Candidate Dossier:** Selecting any candidate dynamically loads:
  - Gate 1 Score breakdown (out of 1000 points) with readiness status.
  - Candidate registration summary, proposed 7 courses, and direct CV download button.
  - Synchronized 2-minute introductory video player.
- **Physical In-Person Trainer Assessment Sheet (15-min Presentation, 100%):** Rebuilt strictly from `competencies matrix.docx`:
  - **Criterion 1: الرصانة العلمية والعمق التخصصي (25%)** — 3 items (1–5 scale)
  - **Criterion 2: هندسة العرض 15 دقيقة وإدارة الوقت (20%)** — 3 items (1–5 scale)
  - **Criterion 3: فن الإلقاء ولغة الجسد والحضور (25%)** — 3 items (1–5 scale)
  - **Criterion 4: التفاعل الذكي وإدارة القاعة (15%)** — 3 items (1–5 scale)
  - **Criterion 5: الأثر والقيمة المضافة ونقل الخبرة (15%)** — 3 items (1–5 scale)
  - **Strict Exclusion Rules:** Scoring $\le 2$ on item **1.1** (Scientific Soundness) or **2.2** (15-minute Time Discipline) triggers an immediate disqualification banner and disqualifies the candidate regardless of total score.
  - **Preset Scoring Demonstrators:** Instant one-click presets for Elite (100%), Certified (80%), Meets Minimum (60%), and Exclusion Rule demonstrations.

### 4. Approved Trainers Directory (دليل المدربين المعتمدين - بنك الكفاءات)
- **Sector Skills Bank:** Filterable dashboard pre-populated with benchmark candidates across all 13 specialized petroleum engineering disciplines.
- **Search & Filter:** Instant filtering by discipline (Exploration, Refining, HSE, Gas Processing, Instrumentation, etc.) or tier level.
- **Trainer Dossier Modal:** Detailed view of accreditations, CV download, video pitch, and course deployment scope.
- **Excel/CSV Export:** One-click download of the complete trainers roster.

### 5. Admin ROI & Financial Simulator (دراسة الجدوى والعائد المالي)
- Dedicated administrative tool for simulating training session costs, external trainer displacement savings, and net annual ROI for the petroleum sector.

---

## 🚀 Running the Demo Locally

1. Open `index.html` (or `demo/index.html`) directly in any modern web browser (Chrome, Edge, Firefox, Safari).
2. **Zero installation or server configuration required:** The app runs entirely in the browser with local persistence.

---

## 🌐 Deploying to GitHub Pages

To host this demo on GitHub Pages for easy sharing and presentation:

```bash
# 1. Initialize and commit files
git init
git add .
git commit -m "Initial commit: ENPPI XpertGate complete demo application"

# 2. Add your GitHub remote repository
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git branch -M main
git push -u origin main
```

### Enable GitHub Pages in 1 Click:
1. Go to your repository on GitHub.
2. Click **Settings** &rarr; **Pages** (under the "Code and automation" sidebar).
3. Under **Build and deployment** &rarr; **Branch**, select `main` (or `master`) and folder `/(root)` &rarr; Click **Save**.
4. Within 1 minute, your demo will be live at:
   `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## 📁 Repository Structure

```text
├── index.html                   # Root entry point with instant redirect to demo
├── .gitignore                   # Clean ignore file for legacy assets and cache
├── README.md                    # Project documentation and deployment guide
└── demo/
    ├── index.html               # Main application portal (all 4 views)
    ├── app.js                   # Application controller, rubric engine, and state
    ├── data.js                  # 13 benchmark discipline candidates & competency matrix
    ├── style.css                # ENPPI brand styling, responsive design & animations
    ├── assets/
    │   ├── Logo.jpeg            # Official ENPPI logo
    │   ├── logo_full.png        # Full vector badge logo
    │   ├── competencies matrix.docx # Source assessment matrix
    │   ├── Template Form for Expert Registration.docx # Official intake template
    │   └── template to evaluate trainer.docx # Evaluation sheet template
    └── video/
        └── sample-video.mp4     # Local 2-minute introductory video showcase
```
