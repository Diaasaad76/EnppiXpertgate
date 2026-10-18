// ==============================================================================
// ENPPI XPERTGATE: TRAINERS & EXPERTS POOL
// Enterprise Controller & Interactive Application Engine
// ==============================================================================

// Global Application State
const AppState = {
    currentLang: "en", // Default Professional English View
    currentRoleView: "executiveView",
    candidates: [...initialCandidates],
    activeEvaluatingCandidateId: null,
    currentMatrixScores: {},
    activeSearchFilter: "all",
    searchQuery: "",
    isDbConnected: false,
    isCommitteeLoggedIn: false
};

// ==============================================================================
// PERSISTENT DATABASE SERVICE (Integrated Native SQLite DB Engine)
// ==============================================================================
const DbService = {
    apiUrl: "/api/candidates",

    async init() {
        try {
            const res = await fetch(this.apiUrl);
            if (!res.ok) throw new Error("Database server HTTP " + res.status);
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                AppState.candidates = json.data.map(c => evaluateCandidateEndToEnd(c));
                AppState.isDbConnected = true;
                this.updateDbStatusUi(true, json.data.length);
                console.log(`[DB Sync] Successfully loaded ${json.data.length} candidate(s) from SQLite internal DB.`);
            }
        } catch (err) {
            console.warn("[DB Sync] Server API offline or standalone file mode. Using local persistence fallback.", err);
            AppState.isDbConnected = false;
            // Fallback to localStorage if available
            try {
                const local = localStorage.getItem("enppi_candidates_backup");
                if (local) {
                    const parsed = JSON.parse(local);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        AppState.candidates = parsed.map(c => evaluateCandidateEndToEnd(c));
                    }
                }
            } catch (e) {}
            this.updateDbStatusUi(false, AppState.candidates.length);
        }
    },

    async saveCandidate(candidate) {
        // Always backup locally
        this.persistLocalBackup();

        if (AppState.isDbConnected) {
            try {
                const res = await fetch(this.apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(candidate)
                });
                const json = await res.json();
                if (json.success && json.data) {
                    console.log("[DB Sync] Candidate persisted to SQLite:", candidate.code);
                    return json.data;
                }
            } catch (err) {
                console.error("[DB Sync] Failed to post candidate to SQLite:", err);
            }
        }
        return candidate;
    },

    async updateCandidate(candidateId, updates) {
        // Always backup locally
        this.persistLocalBackup();

        if (AppState.isDbConnected && candidateId) {
            try {
                const res = await fetch(`${this.apiUrl}/${candidateId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates)
                });
                const json = await res.json();
                if (json.success) {
                    console.log("[DB Sync] Candidate evaluation updated in SQLite:", candidateId);
                }
            } catch (err) {
                console.error("[DB Sync] Failed to update candidate in SQLite:", err);
            }
        }
    },

    async resetDb() {
        if (AppState.isDbConnected) {
            try {
                await fetch(`${this.apiUrl}/all`, { method: "DELETE" });
            } catch (err) {
                console.error("[DB Sync] Error resetting DB:", err);
            }
        }
        localStorage.removeItem("enppi_candidates_backup");
        AppState.candidates = [];
        AppState.activeEvaluatingCandidateId = null;
    },

    persistLocalBackup() {
        try {
            localStorage.setItem("enppi_candidates_backup", JSON.stringify(AppState.candidates));
        } catch (e) {}
    },

    updateDbStatusUi(isConnected, count) {
        const badge = document.getElementById("dbSyncStatusBadge");
        const statusText = document.getElementById("dbStatusText");
        const isAr = AppState.currentLang === "ar";

        if (statusText) {
            if (isConnected) {
                statusText.innerHTML = isAr 
                    ? `حالة النظام: متصل (${count} متقدم)` 
                    : `System Status: Online (${count} Applicants)`;
                if (badge) {
                    badge.style.color = "#10B981";
                    badge.style.borderColor = "rgba(16, 185, 129, 0.4)";
                }
            } else {
                statusText.innerHTML = isAr 
                    ? `حالة النظام: محفوظ محلياً (${count} متقدم)` 
                    : `Saved Locally (${count} Applicants)`;
                if (badge) {
                    badge.style.color = "var(--gold-bright)";
                    badge.style.borderColor = "rgba(212, 175, 55, 0.4)";
                }
            }
        }
    }
};

// Bilingual Dictionaries (i18n)
const TRANSLATIONS = {
    ar: {
        brandTitle: "بوابة إنبي لخبراء ومدربي قطاع البترول",
        brandSubtitle: "ENPPI XpertGate | مجمع الخبراء والمدربين المعتمدين - وزارة البترول والثروة المعدنية",
        navExecutive: "واجهة القيادة العليا (C-Suite)",
        navScreening: "غرفة التحكيم والفرز الذكي",
        navApplicant: "بوابة المتقدمين والتقييم الذاتي",
        navSkillsBank: "بنك المهارات ومستودع الخبراء",
        liveGateway: "بوابة تشغيلية معتمدة",
        auspices: "تحت رعاية وزارة البترول والثروة المعدنية المصرية",
        leaderEngKhaled: "م. خالد إبراهيم (رئيس مجلس الإدارة والعضو المنتدب)",
        leaderDrAmgad: "د. أمجد إسماعيل (رئيس لجنة الإشراف، OD & HRM)",
        leaderDrSausan: "د. سوسن عبد الفتاح (استشاري الإدارة وصاحبة المبادرة)",
        heroTitleStart: "بناء السيادة المعرفية",
        heroTitleHighlight: "الوطنية المستدامة",
        heroTitleEnd: "لقيادة مهارات بترول المستقبل (PetroSkills)",
        visionQuote: "«بناء محرك وطني يضمن السيادة المعرفية واستدامة الكفاءات المتخصصة لقيادة مهارات بترول المستقبل إقليمياً من خلال تمكين المواهب الداخلية وتوحيد معايير الخبراء المعتمدين».",
        pillar1Title: "السيادة المعرفية الوطنية",
        pillar1Desc: "تغطية أكثر من 70% من الاحتياجات التدريبية المتخصصة من داخل شركات قطاع البترول والغاز.",
        pillar2Title: "منع هجرة العقول وحفظ الذاكرة",
        pillar2Desc: "تطبيق نموذج SECI لتحويل المعرفة الضمنية إلى صريحة بدمج ممارسي الخدمة (الدفعة أ) وكبار الخبراء المتقاعدين (الدفعة ب).",
        kpiBadge: "المؤشرات التنفيذية للقطاع",
        kpiTitle: "مؤشرات الفرز والاعتماد لمجمّع الخبراء",
        kpiTotalApplicants: "إجمالي المتقدمين",
        kpiAcrossCompanies: "عبر 32 شركة شقيقة ومشتركة",
        kpiScreenedCandidates: "تم فرزهم (بوابة 1)",
        kpiPassRate: "نسبة اجتياز المعايير الأساسية",
        kpiShortlisted: "القائمة المختصرة للعرض",
        kpiBlindReviewed: "اجتياز التقييم المعياري لفيديو الـ 120 ثانية",
        kpiCertifiedMasters: "خبراء فئة النجوم المعتمدون (Master Star)",
        kpiTop50Scholars: "مؤهلون لمنحة TTT الدولية",
        kpiCohortDist: "توزيع الدفعات (Cohort A / B)",
        kpiAverageTqi: "متوسط مؤشر جودة المدرب (TQI)",
        kpiTqiEvaluated: "بناءً على تقييمات المتدربين الميدانية",
        strategicGoalsBadge: "الأهداف الاستراتيجية",
        strategicGoalsTitle: "الأهداف الستة الكبرى لمشروع ENPPI XpertGate",
        goal1Title: "استثمار الكفاءات والخبرات الوطنية الداخلية",
        goal1Desc: "استكشاف وتمكين الكوادر الفنية المتميزة داخل قطاع البترول لتبادل المعرفة والتدريب عبر ذراع إنبي التدريبي المعتمد.",
        goal2Title: "نقل وتوثيق الخبرات الميدانية والضمنية",
        goal2Desc: "سد الفجوة بين النظريات الهندسية وواقع الحقول عبر تحويل المعايير الفنية إلى حلول وتدريبات تطبيقية حية.",
        goal3Title: "الحد من هجرة العقول وحفظ الذاكرة المؤسسية",
        goal3Desc: "صون المعرفة التراكمية من مخاطر التقاعد وتسرب الكفاءات عبر إشراك شيوخ المهنة والخبراء المتقاعدين في نقل المعرفة.",
        goal4Title: "تأسيس بنك المهارات ومستودع موحد للخبراء",
        goal4Desc: "إنشاء قاعدة بيانات رقمية مركزية ومفهرسة للمدربين والخبراء الاستشاريين المعتمدين لتشغيلهم عبر كافة مواقع القطاع.",
        goal5Title: "تعزيز مكانة إنبي كذراع تدريبي واستشاري استراتيجي",
        goal5Desc: "ترسيخ ريادة إنبي كمركز ثقل إقليمي معتمد للوزارة في تصميم وتطوير مهارات الطاقة المستقبلية (Future PetroSkills).",
        goal6Title: "ترشيد الإنفاق التدريبي",
        goal6Desc: "خفض الاعتماد الجذري على المراكز والمدربين الأجانب وتوجيه الإنفاق لتطوير الكوادر الوطنية وتحقيق أعلى عائد على الاستثمار.",
        workflowBadge: "خارطة التدفق التشغيلي المتكاملة",
        workflowTitle: "خارطة المراحل الكبرى ونظم العمل التفصيلية (Phases & Stages)",
        workflowDesc: "تدفق تنفيذي محكم يوضح المراحل الاستراتيجية الخمس (Phases)، وتندرج تحت كل مرحلة نظم العمل والخطوات الميدانية (Stages) ومخرجاتها المعتمدة ومسؤوليات RACI.",
        legendCompleted: "مكتملة (Completed)",
        legendActive: "جارية حالياً (Active)",
        legendUpcoming: "مجدولة (Upcoming)",
        stagesListLabel: "نظم العمل والخطوات التنفيذية المندرجة تحت المرحلة:",
        deliverableLabel: "المخرج المعتمد:",
        raciRoleLabel: "المسؤولية الإدارية:",
        roadmapBadge: "خارطة الطريق التنفيذية",
        roadmapTitle: "خارطة المراحل العشر عبر المراحل الخمس الكبرى",
        roadmapDesc: "تكامل استراتيجي يبدأ من الحوكمة والتدشين الرقمي وصولاً إلى معسكر TTT للـ 50 الأوائل وبنك المهارات والتدقيق السنوي.",
        roiBadge: "ROI",
        roiTitle: "حاسبة مقارنة سعر الكورس والعائد على الاستثمار (ROI)",
        roiDesc: "مقارنة سعر الكورس بكل تخصص مابين متوسط تكلفة اليوم التدريبي للمدرب للمدربين الخارجيين والمدربين الداخليين من القطاع بعد تنفيذ المشروع وبدء العمل.",
        btnClearRoi: "مسح الأرقام",
        btnFillDemoRoi: "تحميل الأرقام القياسية للعرض (وفر 1.5 مليون $)",
        roiInteractiveParams: "معايير المحاكاة التفاعلية",
        committeeGateTitle: "غرفة لجنة التحكيم — بوابة الوصول الآمن",
        committeeGateSubtitle: "بوابة دخول العرض التوضيحي. بيانات الدخول الرسمية معروضة أدناه للدخول الفوري.",
        btnEnterCommittee: "دخول غرفة التحكيم",
        committeeSessionActive: "جلسة نشطة معتمدة: رئيس لجنة التحكيم (مركز إنبي للمعرفة)",
        btnLockSession: "قفل الجلسة / خروج",
        roiAwaitingInput: "أدخل الأرقام في الحقول لتفعيل مقارنة سعر الكورس وحساب الـ ROI فورياً",
        roiSpecialtyLabel: "التخصص التدريبي المستهدف",
        roiDaysLabel: "متوسط عدد أيام الكورس التدريبي",
        sliderForeignCostLabel: "متوسط تكلفة اليوم التدريبي للمدرب الخارجي (USD / يوم)",
        sliderNationalCostLabel: "متوسط تكلفة اليوم التدريبي للمدرب الداخلي من القطاع (USD / يوم)",
        sliderCoursesLabel: "عدد الدورات التدريبية المنفذة سنوياً بعد بدء العمل",
        sliderEgpRateLabel: "سعر صرف الدولار مقابل الجنيه (EGP)",
        roiSingleCourseHeader: "مقارنة سعر الكورس الواحد بالتخصص",
        roiExternalCoursePrice: "سعر الكورس (مدرب خارجي)",
        roiInternalCoursePrice: "سعر الكورس (مدرب داخلي)",
        roiCourseSavingsLabel: "صافي الوفر في الكورس الواحد",
        roiNetUsdLabel: "إجمالي الوفر السنوي بعد بدء العمل (USD)",
        roiHardCurrencyRetained: "عائد محقق ومباشر داخل موازنة القطاع",
        roiNetEgpLabel: "إجمالي التكلفة المتجنبة بالجنيه المصري (EGP)",
        roiPaybackRatio: "نسبة خفض تكلفة التدريب بالكورس",
        screeningBadge: "غرفة التحكيم والفرز",
        screeningTitle: "منظومة الفرز الذكي والتقييم المعياري المحايد والعروض التطبيقية",
        screeningDesc: "شروط البوابة الأولى، التقييم المعياري المحايد للعرض التقديمي (120 ثانية)، وتقييم الأداء التطبيقي وفق مصفوفة الجدارات المعتمدة.",
        evalDashboardBadge: "لوحة مؤشرات تقييم المحاضرين",
        evalDashboardTitle: "لوحة مؤشرات التقييم المعياري الشامل للمحاضرين وتسكين الفئات",
        evalDashboardDesc: "نتائج التقييم الآلي الشامل استناداً لمعايير تقييم المدربين الـ 19 الموزعة على المحور المعرفي (35%) والتقني (35%) والإنساني (30%) والتسكين الاستشاري المعتمد.",
        btnRunAutoEvalAll: "تشغيل التقييم الآلي الشامل لجميع المتقدمين",
        btnLoadBenchmarkCandidates: "تحميل وتقييم عينة مرشحي القطاع (13 تخصصاً)",
        dashTotalEvaluated: "إجمالي المحاضرين المقيمين",
        dashPassRate: "نسبة اجتياز الاعتماد (≥ 70%)",
        dashAvgScore: "متوسط درجات التقييم (100%)",
        dashMasterCount: "خبراء فئة النجوم (≥ 90%)",
        dashSeniorCount: "مدربون محترفون (80 - 89%)",
        dashAssociateCount: "مدربون ممارسون (70 - 79%)",
        dashDeferredCount: "مسار تطويري (< 70%)",
        dashPillar1Avg: "المحور الأول: المعرفة بسلاسل القيمة (35%)",
        dashPillar2Avg: "المحور الثاني: الجدارات التدريبية والتنظيم (35%)",
        dashPillar3Avg: "المحور الثالث: الحضور والتواصل والتفاعل (30%)",
        evalResultsTableTitle: "جدول نتائج التقييم التفصيلي للمحاضرين وقرارات الاعتماد والتسكين",
        evalResultsTableDesc: "عرض درجات كل مرشح في المحاور الثلاثة ونقاط بوابة 1 والدرجة الإجمالية والفئة التدريبية المعتمدة ونطاق التكليف المسموح به.",
        thCognitiveScore: "المعرفة (Knowledge 35%)",
        thDeliveryScore: "التدريب (Delivery 35%)",
        thPresenceScore: "الحضور (Presence 30%)",
        thCompositeScore: "المجموع (Total 100%)",
        thAccreditedDegree: "الدرجة وفئة الاعتماد (Accredited Level / Degree)",
        thDeploymentScope: "نطاق التكليف المعتمد (Approved Deployment Scope)",
        filterAllTiers: "كافة الفئات المعتمدة",
        filterMasterOnly: "خبراء فئة النجوم (Master)",
        filterSeniorOnly: "مدرب أول محترف (Senior)",
        filterAssociateOnly: "مدرب ممارس (Associate)",
        filterDeferredOnly: "مسار تطويري (Deferred)",
        btnLoadInRubric: "استعراض الاستمارة (19 جدارة)",
        toastAutoEvalDone: "تم تقييم جميع المتقدمين آلياً وتحديث الدرجات ولوحة المؤشرات بنجاح!",
        toastBenchmarkLoaded: "تم تحميل 13 مرشحاً ممثلين لكافة تخصصات القطاع وتقييمهم آلياً بنجاح!",
        btnQuickFillDemoAppText: "تعبئة نموذج متقدم للاختبار السريع (Demo)",
        intakeRosterTitle: "سجل المتقدمين للفرز والمطابقة الآلية",
        intakeRosterDesc: "تقييم معايير القبول المبدئي، المؤهلات العلمية، نقاط الخبرة (40 نقطة/سنة حتى 600)، والشهادات التخصصية المعتمدة.",
        btnRunSmartScreening: "تشغيل الفرز والمطابقة الآلية للتخصصات",
        thCode: "الكود",
        thCandidate: "اسم المرشح",
        thCompany: "الشركة",
        thDomain: "المجال والتخصص الدقيق",
        thCohort: "الدفعة",
        thExpYrs: "الخبرة",
        thGate1Score: "درجة بوابة 1 (Gate 1 Score)",
        thStatus: "حالة الفرز",
        thActions: "الإجراء (Action)",
        blindVideoPitchTitle: "منصة التقييم المعياري المحايد للعرض التقديمي (120 ثانية)",
        blindToggleLabel: "وضع التقييم الحيادي المستقل",
        blindMaskTitle: "وضع التقييم الحيادي المستقل مفعل",
        blindMaskDesc: "تم إخفاء البيانات التعريفية للمرشح مؤقتاً لضمان أعلى درجات الموضوعية والشفافية المعيارية أثناء تقييم العرض.",
        criteriaDemeanor: "المظهر والوقار التنفيذي والهدوء",
        criteriaClarity: "وضوح الفكرة والقدرة على تبسيط المفهوم",
        criteriaBodyLang: "لغة الجسد والشغف بالتدريب",
        anchorMaster: "خبير متمكن (10 درجات)",
        anchorGood: "جيد جداً (8 درجات)",
        anchorBase: "أساسي ومقبول (6 درجات)",
        btnAdvance: "اعتماد وترقية للعروض التطبيقية",
        btnRegret: "توجيه لإعادة التأهيل",
        demoRubricBadge: "التقييم الحضوري والعرض المباشر (Physical Assessment)",
        demoRubricTitle: "استمارة التقييم الحضوري المباشر للمحاضر (Physical Assessment 100%)",
        demoRubricDesc: "التحكيم الحضوري المباشر للجنة التقييم وفق المعايير المعتمدة: المعرفة (35%)، التدريب ودراسات الحالة (35%)، والحضور والوقار التنفيذي (30%) لاعتماد الدرجة ونطاق التكليف الرسمي.",
        btnDownloadMatrixDocx: "تحميل دليل مصفوفة الجدارات (DOCX)",
        btnDownloadEvalSheetDocx: "تحميل استمارة التقييم الحضوري الميدانية (DOCX)",
        btnDownloadRegTemplate: "تحميل استمارة تسجيل الخبراء الرسمية (DOCX)",
        regFormSourceBadge: "النموذج الرسمي المعتمد: استمارة تسجيل الخبراء (Expert Registration Form)",
        secSpecialtyTitle: "1. مجال الخبرة والتخصص الذي تتفوق فيه تدريبياً (اختر التخصص لتحميل فايل التسجيل ورابط الفيديو)",
        secContactTitle: "2. بيانات الاتصال الأساسية وتحميل السيرة الذاتية (CV - أساسي *)",
        lblPhone: "رقم الهاتف / الجوال (Phone Number)",
        lblLinkedIn: "رابط الحساب المهني على LinkedIn",
        lblWebsite: "الموقع الإلكتروني الشخصي أو المهني (Website)",
        lblPrimaryCvUpload: "تحميل السيرة الذاتية للمتقدم (CV / Resume — مرفق أساسي إلزامي)",
        lblPrimaryCvBadge: "بند أساسي إلزامي للتقديم",
        lblPrimaryCvHint: "يرجى رفع ملف السيرة الذاتية المحدثة بصيغة PDF أو Word (.pdf, .doc, .docx) ليتم حفظه وإتاحته للجنة التقييم.",
        secCareerTitle: "3. بيانات الشركة، المسيرة المهنية، ومستوى الإتاحة للتدريب",
        lblDepartment: "الإدارة / القطاع التابع له بالشركة (Department)",
        lblHrEmail: "البريد الإلكتروني لإدارة الموارد البشرية بشركتك (HR Department Email)",
        lblCareerPositions: "المناصب الوظيفية التي شغلتها خلال مسيرتك المهنية (Positions Held During Career Journey)",
        lblAvailability: "مستوى الإتاحة للتدريب والندب (Level of Availability)",
        optAvailHigh: "متاح بالكامل (Available — مرونة عالية للتنفيذ)",
        optAvailMed: "متاح بدرجة متوسطة (Medium — بالتنسيق المسبق)",
        optAvailLow: "إتاحة محدودة (Low — للاستشارات والبرامج القيادية فقط)",
        secAcademicTitle: "4. الشهادات والمؤهلات الأكاديمية الرسمية (Official Academic Certificates)",
        lblBscRowTitle: "الشهادة الجامعية الأولى / البكالوريوس (Academic Certificate — إلزامي *)",
        lblMscRowTitle: "درجة الماجستير (Master's Degree — إن وجدت)",
        lblPhdRowTitle: "درجة الدكتوراه (Doctorate Degree / PhD — إن وجدت)",
        secCertsTitle: "5. الشهادات المهنية والدولية والتخصصية الدقيقة (Professional, Specialized & Sophisticated Certificates)",
        lblProfCertRow: "1. الشهادات المهنية الاحترافية (حد أدنى شهادتان — Minimum Two Certificates)",
        lblIntlCertRow: "2. الشهادات الدولية التخصصية (Specialized International Certificates)",
        lblSophCertRow: "3. الشهادات التقنية الدولية المتقدمة بقطاع البترول (Sophisticated Technical International Certificate)",
        secExpertTypeTitle: "6. تصنيف الخبير وسنوات الخبرة وإتقان اللغة الإنجليزية (Type of Experts & Experience)",
        secSevenProgramsTitle: "7. قائمة بـ 7 برامج تدريبية يمكنك تقديمها باحترافية فائقة في تخصصك (List of 7 Training Programs)",
        btnAutoFillProgramsText: "تعبئة مقترحة للبرامج الـ 7 من التخصص المختار",
        lblProg1: "البرنامج التدريبي (1)",
        lblProg2: "البرنامج التدريبي (2)",
        lblProg3: "البرنامج التدريبي (3)",
        lblProg4: "البرنامج التدريبي (4)",
        lblProg5: "البرنامج التدريبي (5)",
        lblProg6: "البرنامج التدريبي (6)",
        lblProg7: "البرنامج التدريبي (7)",
        secRequiredItemsTitle: "9. تحقق مما يتوفر لديك (Check if you have)",
        lblReqCv: "السيرة الذاتية المحدثة للمتقدم (Applicant Vitae or Resume) *",
        lblReqCerts: "نسخة من جميع الشهادات العلمية والمهنية (Copy of All Certificates) *",
        lblReqId: "صورة بطاقة الرقم القومي / جواز السفر (Copy of ID) *",
        lblBankAccount: "رقم الحساب البنكي / IBAN (Bank Account Number)",
        secDeclarationTitle: "10. الإقرار الرسمي والمصادقة والتوقيع (Declaration & Signature)",
        lblDeclarationText: "أقر بموجبه بصحة واكتمال كافة البيانات والمستندات المقدمة دون أدنى مسؤولية قانونية تقع على عاتق الشركة في حال ثبوت خلاف ذلك. (Hereby Attest To The Completeness & Authentication Of All Information And Documents Submitted Without Any Legal Liability To Fall Upon The Company In Case Proven Otherwise) *",
        lblDeclApplicantName: "اسم المتقدم (Applicant Name)",
        lblDeclSignature: "التوقيع المعتمد (Signature)",
        pillar1RubricTitle: "1. الجدارات العقلية والمعرفية التخصصية",
        pillar1RubricDesc: "عمق التخصص الدقيق، سلسلة القيمة البترولية، حل المشكلات المعقدة، ومواكبة الأكواد العالمية API و ASME.",
        pillar2RubricTitle: "2. الجدارات التقنية والتدريبية وممارسة التخصص",
        pillar2RubricDesc: "تعليم الكبار (Andragogy)، استخدام الوسائط التفاعلية والشاشات الذكية، وإدارة الوقت تحت الضغط.",
        pillar3RubricTitle: "3. الجدارات الإنسانية والذكاء الاجتماعي والمظهر",
        pillar3RubricDesc: "الكاريزما والحضور التنفيذي، الذكاء العاطفي، إدارة التفاعل والنقاش، والاستماع النشط للمتدربين.",
        btnResetDbText: "تفريغ قاعدة البيانات (Reset DB)",
        optDegreePhd: "درجة الدكتوراه في التخصص الدقيق PhD (100 نقطة)",
        optDegreeMaster: "درجة الماجستير الأكاديمي أو المهني MSc / MBA (70 نقطة)",
        optDegreeBachelor: "درجة البكالوريوس المعتمدة بالتخصص (40 نقطة - معيار قبول إلزامي)",
        optExpertInt: "مستشار أول / خبير دولي (Senior Advisors / International Expert - 100 نقطة)",
        optExpertReg: "خبير إقليمي: تنفيذ تدريبين ناجحين مع خطاب شكر خارج مصر (Regional Expert - 70 نقطة)",
        optExpertLoc: "خبير محلي: خطابي شكر وتقدير موثقين على الأقل (Local Expert - 40 نقطة)",
        optEngFluent: "طلاقة تامة للأعمال والتدريب الدولي (Fluent / Professional - 100 نقطة)",
        optEngInter: "مستوى متوسط في بيئات العمل الهندسية (Intermediate - 70 نقطة)",
        optEngBasic: "مستوى أساسي (Basic - 40 نقطة)",
        lblCertSuggestedNotice: "مقترحة تلقائياً حسب المجال المختار (50 نقطة/شهادة حتى 100)",
        ratingScore: "الدرجة (من 10)",
        compositeScoreLabel: "المجموع التراكمي الموزون (من 100%):",
        accreditedTierLabel: "الفئة التدريبية والاستشارية المعتمدة المستحقة:",
        btnSaveResult: "حفظ واعتماد قرار اللجنة والتسكين الاستشاري",
        intakeBadge: "التسجيل وبنك المهارات",
        intakeTitle: "استمارة تسجيل الخبراء الرسمية وملف الجدارات المعتمد",
        intakeDesc: "قم بتعبئة كافة حقول استمارة التسجيل الرسمية المرفقة، مع تحميل السيرة الذاتية (أساسي) ورابط الفيديو التقديمي (120 ثانية).",
        mandatoryFieldsNotice: "جميع الحقول المسبوقة بعلامة (*) بما فيها تحميل السيرة الذاتية (CV) هي حقول أساسية إلزامية لإتمام التقديم",
        lblFullName: "الاسم الكامل (ثلاثي أو رباعي)",
        lblEmail: "البريد الإلكتروني للعمل بالشركة",
        lblJobTitle: "المنصب الوظيفي الحالي (Current Position)",
        lblCompany: "اسم الشركة بقطاع البترول (Company Name)",
        lblCohort: "فئة الترشح (الدفعة)",
        optCohortA: "الدفعة (أ): ممارس حالي بالخدمة (In-Service)",
        optCohortB: "الدفعة (ب): خبير متقاعد وقامة استشارية (Veteran)",
        lblDomain: "المجال التخصصي الرئيسي الذي تتفوق فيه تدريبياً (13 مجالاً)",
        lblSubDiscipline: "التخصص الدقيق",
        lblExpYears: "سنوات الخبرة العملية والميدانية [يرجى التحديد]",
        lblDegree: "أعلى مؤهل أكاديمي معتمد",
        lblCertifications: "الشهادات والاعتمادات المهنية التابعة للاختصاص",
        lblCustomCert: "أو اذكر شهادات واعتمادات مهنية أخرى تابعة لاختصاصك:",
        lblExpertClassification: "تصنيف الخبير المعتمد (Type of Experts)",
        lblEnglishProficiency: "إتقان اللغة الإنجليزية للأعمال الهندسية",
        lblExpYearsNotice: "40 نقطة لكل سنة خبرة ميدانية (بحد أقصى 600 نقطة)",
        lblVideoLink: "8. فيديو العرض التقديمي (بحد أقصى 120 ثانية — رفع مباشر أو رابط من أي صفحة)",
        lblVideoDurationLimit: "الحد الأقصى لعرض الفيديو التقديمي: 120 ثانية (دقيقتان فقط)",
        btnDownloadVideo: "تحميل فيديو العرض (120 ثانية)",
        btnOpenVideoLink: "فتح الرابط الخارجي",
        btnDownloadSampleVideo: "تحميل الفيديو التجريبي المعتمد (Active Download - 120s)",
        lblUploadVideoOption: "الخيار 1: رفع ملف الفيديو مباشرة من جهازك (حتى 120 ثانية)",
        lblVideoUploadHint: "يدعم صيغ MP4, WebM, MOV بحد أقصى 120 ثانية (دقيقتان).",
        lblPasteLinkOption: "الخيار 2: أو ضع رابط الفيديو من أي صفحة ويب (Drive / YouTube / OneDrive / Vimeo / MP4)",
        lblVideoLinkHint: "يمكنك وضع رابط من أي صفحة ويب أو استخدام الرابط الافتراضي المرفق وتحميله مباشرة.",
        btnSubmitApplication: "إرسال استمارة التسجيل الكاملة والسيرة الذاتية إلى فرز بوابة 1 ولجنة التقييم",
        selfCalcBadge: "المؤشر الفوري",
        selfCalcTitle: "النقاط التقديرية لبوابة 1 (من 1000 نقطة)",
        selfCalcDesc: "حساب فوري لمعايير القبول المبدئي بناءً على مدخلاتك الحالية وفق مصفوفة XpertGate المعتمدة.",
        critExpPts: "عمق الخبرة الميدانية (40 نقطة/سنة حتى 600)",
        critDegreePts: "المؤهلات الأكاديمية (بكالوريوس 40 / ماجستير 70 / دكتوراه 100)",
        critExpertClassPts: "تصنيف الخبرة (محلي 40 / إقليمي 70 / دولي 100)",
        critCertPts: "الشهادات والاعتمادات المهنية التخصصية (50 نقطة/شهادة حتى 100)",
        critEnglishPts: "إتقان اللغة الإنجليزية للأعمال (40 / 70 / 100 نقطة)",
        selfCalcNotice: "معيار التأهيل المعتمد: المتقدمون الحاصلون على 750 نقطة فما فوق من إجمالي 1000 نقطة يتأهلون مباشرة لمرحلة التقييم المعياري لفيديو الـ 120 ثانية والعروض التطبيقية.",
        skillsBankBadge: "مستودع القطاع الموحد",
        skillsBankTitle: "بنك المهارات البترولية وسجل الخبراء المعتمدين",
        skillsBankDesc: "منصة مركزية تفاعلية لمركز تدريب إنبي والشركات الشقيقة للبحث والفرز وانتداب نخبة المدربين المعتمدين.",
        btnExportCsv: "تصدير بنك المهارات (ملف CSV)",
        filterAll: "كافة الخبراء",
        filterUpstream: "الاستكشاف والإنتاج (Upstream)",
        filterDownstream: "التكرير والبتروكيماويات (Downstream)",
        filterMidstream: "النقل والأنابيب (Midstream)",
        filterHse: "السلامة والبيئة (HSE)",
        filterDigital: "التحول الرقمي والذكاء الاصطناعي",
        filterCohortB: "الدفعة ب (الخبراء المتقاعدون)",
        filterMasterStar: "خبراء فئة النجوم (Master)",
        weight35Badge: "الوزن النسبي: 35.0%",
        weight30Badge: "الوزن النسبي: 30.0%",
        compositeFormulaLabel: "(المعرفي 35%) + (التقني 35%) + (الإنساني 30%) = 100%",
        dossierPillar1: "المحور الأول: الجدارات العقلية والمعرفية (وزن 35%)",
        dossierPillar2: "المحور الثاني: الجدارات التقنية والتدريبية (وزن 35%)",
        dossierPillar3: "المحور الثالث: الجدارات الإنسانية والكوتشينغ (وزن 30%)",
        seciTitle: "نمذجة المعرفة SECI: تحويل الخبرة الميدانية إلى مادة معتمدة",
        btnRequestSecondment: "طلب ندب / إتاحة الخبير لبرنامج تدريبي",
        modalExp: "سنوات الخبرة",
        modalTqi: "مؤشر جودة المدرب TQI",
        modalCourses: "سجل الدورات المنفذة",
        footerLocationTitle: "المقر الرئيسي والمكان (Location)",
        footerCompanyFull: "الشركة الهندسية للصناعات البترولية والكيماوية (إنبي — ENPPI)",
        footerAddressDetail: "المكان: التجمع الخامس — شارع التسعين الشمالي، القاهرة الجديدة، مصر",
        footerContactTitle: "التواصل والدعم المؤسسي (Contact Us)",
        footerEmailLbl: "البريد الإلكتروني:",
        footerPhoneLbl: "الهاتف:",
        footerWorkHours: "مواعيد العمل الرسمية: الأحد – الخميس | 8:00 صباحاً – 4:00 مساءً",
        footerSocialTitle: "لينكد إن والمنصات الرسمية (LinkedIn & Web)",
        footerSocialDesc: "تابع الصفحة الرسمية لشركة إنبي وبوابة خبراء قطاع البترول (ENPPI XpertGate) على LinkedIn:",
        footerLinkedInBtn: "صفحة ENPPI الرسمية على LinkedIn",
        footerWebsiteBtn: "الموقع الرسمي لشركة إنبي (enppi.com)",
        footerCopyright: "© 2026 شركة إنبي (ENPPI) — التجمع الخامس - التسعين الشمالي | تحت رعاية وزارة البترول والثروة المعدنية. جميع الحقوق محفوظة.",
        toastScreeningRan: "تم تشغيل محرك الفرز الآلي ومطابقة التخصصات بنجاح!",
        toastAdvanced: "تم اعتماد المرشح وترقيته إلى مرحلة العروض التطبيقية!",
        toastSavedResult: "تم حفظ واعتماد قرار اللجنة وفق دليل مصفوفة الجدارات وإدراج الخبير في بنك المهارات!",
        toastSubmitted: "تم استلام استمارة التسجيل الكاملة والسيرة الذاتية واحتساب المؤشر الفوري لبوابة 1 في صفحة اللجنة!",
        toastExported: "تم تصدير قاعدة بيانات بنك المهارات إلى ملف CSV بنجاح!",
        toastSecondmentRequested: "تم إرسال طلب ندب الخبير لمركز تدريب إنبي للمتابعة!",
        btnPromoVideo: "فيديو المشروع (120 ثانية)",
        heroWatchPromoBtn: "شاهد الفيديو التعريفي للمشروع (دقيقتان)",
        promoVideoModalTitle: "الفيديو التعريفي الرسمي لمنصة إنبي إكسبرت جيت (120 ثانية)",
        promoAudioOn: "الصوت مفعل (VO & FX)",
        promoAudioOff: "الصوت مكتوم",
        scene1Badge: "المشهد الأول: الشرارة والتراكم المعرفي (00:00 - 00:20)",
        scene1H1: "في قطاع يصنع طاقة الوطن..",
        scene1H2: "خبرتك الميدانية هي أثمن ما نملك!",
        scene1Desc: "كم من خبرة استثنائية بُنيت عبر عقود وسط الحقول ومواقع الإنتاج؟ اليوم حان وقت تحويلها إلى إرثٍ ملهم لأجيال المستقبل.",
        triad1: "العلم والمعرفة المتقدمة",
        triad2: "الخبرة الميدانية التراكمية",
        triad3: "موهبة وشغف نقل الأثر",
        scene2Badge: "المشهد الثاني: إطلاق المنصة الوطنية (00:20 - 00:45)",
        scene2H1: "برعاية وزارة البترول والثروة المعدنية",
        cohortATitle: "الدفعة (أ) - الكوادر العاملة بالخدمة",
        cohortBTitle: "الدفعة (ب) - قامات ورواد القطاع المتقاعدين",
        scene2Stat: "هدفنا: تغطية 70%+ من احتياجاتنا التدريبية المتخصصة بأيدي خبرائنا",
        scene3Badge: "المشهد الثالث: محرك الفرز الذكي والبوابات الأربع (00:45 - 01:15)",
        scene3H1: "تقييم موضوعي ذكي ومحايد بالكامل",
        scene3H2: "Gate 1 Score (1000 Pts) • الركائز الثلاث",
        scene4Badge: "المشهد الرابع: شرف الاعتماد ومردود العملة الصعبة (01:15 - 01:40)",
        scene4H1: "اعتماد رسمي معتبر .. تكليف بمكافآت مجزية",
        scene4H2: "وتوفير ملايين الدولارات للوطن",
        scene5Badge: "المشهد الخامس: النداء الأخير والختام (01:40 - 02:00)",
        scene5H1: "خبرتك ثروة وطنية..",
        scene5H2: "انضم الآن لنخبة مدربي قطاع البترول المصري",
        scene5Desc: "بوابتك مفتوحة الآن لتوثيق أثرك ومشاركة عقود من المعرفة مع الأجيال القادمة. خطوة واحدة تفصلك عن الانضمام.",
        scene5CtaBtn: "قدّم طلبك الآن كمدرب معتمد (التحق بالمشروع)"
    },
    en: {
        brandTitle: "ENPPI XpertGate",
        brandSubtitle: "Certified Trainers & Experts Portal | Egyptian Petroleum Sector",
        navExecutive: "Executive Overview",
        navScreening: "Evaluation Committee",
        navApplicant: "Trainer Registration",
        navSkillsBank: "Approved Trainers Directory",
        liveGateway: "Official Portal",
        auspices: "Under the Auspices of the Ministry of Petroleum & Mineral Resources",
        leaderEngKhaled: "Eng. Khaled Ibrahim (Chairman & CEO)",
        leaderDrAmgad: "Dr. Amgad Ismail (Executive Supervisor, OD & HR)",
        leaderDrSausan: "Dr. Sausan Abdelfattah (Project Owner)",
        heroTitleStart: "Building Our Own",
        heroTitleHighlight: "In-House Training Experts",
        heroTitleEnd: "Across the Energy & Petroleum Sector",
        visionQuote: "\"Building a trusted network of in-house petroleum experts and trainers to preserve industry know-how, develop future skills, and deliver practical training across the sector.\"",
        pillar1Title: "Developing In-House Sector Trainers",
        pillar1Desc: "Meeting 70%+ of our specialized training needs using qualified experts from within petroleum sector companies.",
        pillar2Title: "Retaining Valuable Industry Experience",
        pillar2Desc: "Turning years of practical field experience into clear training courses, engaging both active staff (Group A) and retired experts (Group B).",
        kpiBadge: "Key Indicators",
        kpiTitle: "Registration & Qualification Summary",
        kpiTotalApplicants: "Total Registered Applicants",
        kpiAcrossCompanies: "across participating sector companies",
        kpiScreenedCandidates: "Passed Initial Review (≥750 pts)",
        kpiPassRate: "initial qualification rate",
        kpiShortlisted: "Selected for Live Presentation",
        kpiBlindReviewed: "approved after video review",
        kpiCertifiedMasters: "Master Trainers (≥90%)",
        kpiTop50Scholars: "qualified for international TTT program",
        kpiCohortDist: "Applicant Groups (Active / Retired)",
        kpiAverageTqi: "Average Trainer Quality Rating (TQI)",
        kpiTqiEvaluated: "based on trainee evaluations",
        strategicGoalsBadge: "Project Objectives",
        strategicGoalsTitle: "The 6 Main Goals of XpertGate",
        goal1Title: "Make the Best Use of Our Own Experts",
        goal1Desc: "Identify and qualify top professionals across petroleum companies to share knowledge and deliver training through the ENPPI Training Center.",
        goal2Title: "Turn Field Experience into Practical Training",
        goal2Desc: "Close the gap between theory and real site work by turning technical standards and field lessons into practical training courses.",
        goal3Title: "Keep Critical Knowledge Inside the Sector",
        goal3Desc: "Protect valuable company know-how from being lost to retirement by involving senior and retired experts in training younger staff.",
        goal4Title: "Build an Approved Trainers Directory",
        goal4Desc: "Create one central, easy-to-use directory of certified trainers and consultants so all sector companies can find the right expert quickly.",
        goal5Title: "Strengthen ENPPI's Role as a Training Leader",
        goal5Desc: "Support ENPPI's role as the Ministry's trusted engineering and training center for developing modern energy skills.",
        goal6Title: "Reduce Training Costs",
        goal6Desc: "Rely less on costly foreign training providers and deliver timely training tailored to our operations.",
        workflowBadge: "Project Workflow",
        workflowTitle: "Project Implementation Plan: 5 Main Phases",
        workflowDesc: "Clear step-by-step plan showing the 5 project phases, key activities, expected results, and responsible teams.",
        legendCompleted: "Completed",
        legendActive: "In Progress",
        legendUpcoming: "Upcoming",
        stagesListLabel: "Key Steps & Activities in This Phase:",
        deliverableLabel: "Expected Output:",
        raciRoleLabel: "Responsible Team:",
        roadmapBadge: "Project Plan",
        roadmapTitle: "The 5-Phase Implementation Plan",
        roadmapDesc: "From launching registration and evaluating applicants to TTT certification, publishing the Trainers Directory, and measuring ROI.",
        roiBadge: "ROI",
        roiTitle: "Course Price Comparison & ROI Calculator",
        roiDesc: "Comparing course prices across specialties based on average daily trainer costs for external providers versus in-house sector trainers after project implementation and operational rollout.",
        btnClearRoi: "Clear Numbers",
        btnFillDemoRoi: "Load Demo Benchmark Figures ($1.5M Savings)",
        roiInteractiveParams: "Interactive Simulation Parameters",
        committeeGateTitle: "Evaluation Committee — Secure Access Gate",
        committeeGateSubtitle: "Demonstration authentication gate. Official credentials provided below for immediate demo entry.",
        btnEnterCommittee: "Enter Committee Workspace",
        committeeSessionActive: "Authenticated Session: Evaluation Committee Lead (ENPPI Knowledge Center)",
        btnLockSession: "Lock / Log Out",
        roiAwaitingInput: "Enter numbers in the fields below or click 'Load Demo Benchmark Figures'",
        roiSpecialtyLabel: "Target Training Specialty",
        roiDaysLabel: "Average Course Duration (Days)",
        sliderForeignCostLabel: "Average External Trainer Daily Rate (USD / Day)",
        sliderNationalCostLabel: "Average In-House Sector Trainer Daily Rate (USD / Day)",
        sliderCoursesLabel: "Number of Courses Delivered per Year (After Rollout)",
        sliderEgpRateLabel: "Exchange Rate (USD to EGP)",
        roiSingleCourseHeader: "Single Course Price Comparison in Specialty",
        roiExternalCoursePrice: "Course Price (External Provider)",
        roiInternalCoursePrice: "Course Price (In-House Sector Trainer)",
        roiCourseSavingsLabel: "Net Savings per Course",
        roiNetUsdLabel: "Total Annual Cost Savings (USD)",
        roiHardCurrencyRetained: "Direct Retained Budget & Sector Value",
        roiNetEgpLabel: "Total Annual Cost Savings (EGP)",
        roiPaybackRatio: "Training Cost Reduction Rate",
        screeningBadge: "Evaluation Committee",
        screeningTitle: "Applicant Screening, Objective Video Review & Live Presentation Evaluation",
        screeningDesc: "Review initial qualifications (Gate 1), evaluate the 2-minute intro video objectively, and score the live training presentation using the 19-point evaluation sheet.",
        evalDashboardBadge: "Lecturer Evaluation Dashboard",
        evalDashboardTitle: "Comprehensive Lecturer Evaluation & Accreditation Dashboard",
        evalDashboardDesc: "Automated end-to-end evaluation results based on the 19 lecturer assessment criteria across Subject Knowledge (35%), Training Delivery (35%), Communication & Presence (30%), and approved deployment tiers.",
        btnRunAutoEvalAll: "Run End-to-End Evaluation for All Applicants",
        btnLoadBenchmarkCandidates: "Load & Evaluate Sector Sample Applicants (13 Disciplines)",
        dashTotalEvaluated: "Total Evaluated Lecturers",
        dashPassRate: "Accreditation Pass Rate (≥ 70%)",
        dashAvgScore: "Average Evaluation Score (100%)",
        dashMasterCount: "Master Star Trainers (≥ 90%)",
        dashSeniorCount: "Senior Certified Trainers (80 - 89%)",
        dashAssociateCount: "Associate Trainers (70 - 79%)",
        dashDeferredCount: "Needs Development (< 70%)",
        dashPillar1Avg: "Section 1: Subject Knowledge & Analytical Skills (35%)",
        dashPillar2Avg: "Section 2: Training Delivery & Course Organization (35%)",
        dashPillar3Avg: "Section 3: Communication & Professional Presence (30%)",
        evalResultsTableTitle: "Approved Lecturer Assessment Results Table",
        evalResultsTableDesc: "Review every applicant's Gate 1 score, 3-pillar performance, total evaluation percentage, accredited level, and approved deployment scope.",
        thCognitiveScore: "Knowledge (35%)",
        thDeliveryScore: "Delivery (35%)",
        thPresenceScore: "Presence (30%)",
        thCompositeScore: "Total (100%)",
        thAccreditedDegree: "Accredited Level / Degree",
        thDeploymentScope: "Approved Deployment Scope",
        filterAllTiers: "All Accreditation Levels",
        filterMasterOnly: "Master Star Trainers",
        filterSeniorOnly: "Certified Senior Trainers",
        filterAssociateOnly: "Associate Trainers",
        filterDeferredOnly: "Needs Development",
        btnLoadInRubric: "Review 19-Point Rubric",
        toastAutoEvalDone: "Automated evaluation completed successfully for all applicants!",
        toastBenchmarkLoaded: "Loaded 13 benchmark applicants across all petroleum specialties and evaluated them successfully!",
        btnQuickFillDemoAppText: "Fill Sample Application for Instant Test",
        intakeRosterTitle: "Registered Applicants List",
        intakeRosterDesc: "Review applicant qualifications, academic degrees, years of experience (40 pts/year up to 600), and professional certificates.",
        btnRunSmartScreening: "Refresh & Match Applicants",
        thCode: "ID Code",
        thCandidate: "Applicant Name",
        thCompany: "Company",
        thDomain: "Training Area & Specialty",
        thCohort: "Group",
        thExpYrs: "Experience",
        thGate1Score: "Gate 1 Score",
        thStatus: "Status",
        thActions: "Action",
        blindVideoPitchTitle: "2-Minute Intro Video Evaluation",
        blindToggleLabel: "Hide Applicant Identity (Unbiased Review)",
        blindMaskTitle: "Unbiased Review Mode Active",
        blindMaskDesc: "Applicant name, photo, and company are hidden to ensure a fair and objective evaluation of the presentation.",
        criteriaDemeanor: "Professional Presence & Confidence",
        criteriaClarity: "Clarity of Explanation & Communication",
        criteriaBodyLang: "Body Language & Passion for Training",
        anchorMaster: "Excellent (10 pts)",
        anchorGood: "Very Good (8 pts)",
        anchorBase: "Basic (6 pts)",
        btnAdvance: "Approve for Live Presentation",
        btnRegret: "Hold / Needs Development",
        demoRubricBadge: "Physical In-Person Assessment & Live Demonstration",
        demoRubricTitle: "Physical In-Person Trainer Assessment Sheet (100%)",
        demoRubricDesc: "Comprehensive in-person committee evaluation based on the 3 established pillars: Knowledge (35%), Delivery (35%), and Presence (30%), determining the accredited degree and authorized deployment scope.",
        btnDownloadMatrixDocx: "Download Evaluation Guide (Word)",
        btnDownloadEvalSheetDocx: "Download Physical Evaluation Sheet (Word)",
        btnDownloadRegTemplate: "Download Blank Registration Form (Word)",
        regFormSourceBadge: "Official Trainer Registration Form",
        secSpecialtyTitle: "1. Training Area & Specialty (Select a Specialty to View Details, Registration Form & Video Link)",
        secContactTitle: "2. Contact Details & CV Upload (Required *)",
        lblPhone: "Mobile / Phone Number",
        lblLinkedIn: "LinkedIn Profile Link",
        lblWebsite: "Personal Website or Online Portfolio (Optional)",
        lblPrimaryCvUpload: "Upload Your CV / Resume (Required *)",
        lblPrimaryCvBadge: "Required Document",
        lblPrimaryCvHint: "Please upload your updated CV (.pdf, .doc, or .docx). It will be shared directly with the Evaluation Committee.",
        secCareerTitle: "3. Company Details, Job History & Availability for Training",
        lblDepartment: "Department / Division",
        lblHrEmail: "Your Company's HR / Training Department Email",
        lblCareerPositions: "Previous Job Titles & Key Roles Held During Your Career",
        lblAvailability: "Availability to Deliver Training Courses",
        optAvailHigh: "High (Ready & Flexible Schedule)",
        optAvailMed: "Medium (Available with Prior Arrangement)",
        optAvailLow: "Limited (Available for Selected Sessions / Advisory Only)",
        secAcademicTitle: "4. University Degrees",
        lblBscRowTitle: "Bachelor's Degree (Required *)",
        lblMscRowTitle: "Master's Degree (MSc / MBA — If Any)",
        lblPhdRowTitle: "Doctorate Degree / PhD (If Any)",
        secCertsTitle: "5. Professional & International Certificates",
        lblProfCertRow: "1. Professional Certificates (At Least Two Certificates)",
        lblIntlCertRow: "2. International Specialized Certificates",
        lblSophCertRow: "3. Advanced Petroleum Industry Certificate",
        secExpertTypeTitle: "6. Expert Level, Years of Experience & English Level",
        secSevenProgramsTitle: "7. List 7 Training Courses You Can Deliver Professionally in Your Specialty",
        btnAutoFillProgramsText: "Fill with Suggested Courses for This Specialty",
        lblProg1: "Course 1",
        lblProg2: "Course 2",
        lblProg3: "Course 3",
        lblProg4: "Course 4",
        lblProg5: "Course 5",
        lblProg6: "Course 6",
        lblProg7: "Course 7",
        secRequiredItemsTitle: "9. Check if you have",
        lblReqCv: "Updated CV / Resume *",
        lblReqCerts: "Copies of Academic & Professional Certificates *",
        lblReqId: "Copy of National ID / Passport *",
        lblBankAccount: "Bank Account Number / IBAN",
        secDeclarationTitle: "10. Applicant Confirmation & Signature",
        lblDeclarationText: "I confirm that all information and documents submitted in this form are accurate and complete. *",
        lblDeclApplicantName: "Applicant Full Name",
        lblDeclSignature: "Signature (Type Your Full Name)",
        pillar1RubricTitle: "1. Subject Knowledge & Analytical Skills",
        pillar1RubricDesc: "Deep knowledge of the subject, practical field examples, problem-solving, and familiarity with international standards (API/ASME).",
        pillar2RubricTitle: "2. Training Delivery & Course Organization",
        pillar2RubricDesc: "Adult training methods, clear learning objectives, effective use of presentation tools, and good time management.",
        pillar3RubricTitle: "3. Communication & Professional Presence",
        pillar3RubricDesc: "Professional appearance, clear voice, active listening, positive group interaction, and handling questions confidently.",
        btnResetDbText: "Clear All Applicants",
        optDegreePhd: "Doctorate Degree / PhD (100 pts)",
        optDegreeMaster: "Master's Degree — MSc / MBA (70 pts)",
        optDegreeBachelor: "Bachelor's Degree (40 pts — Required Minimum)",
        optExpertInt: "International Expert / Senior Advisor (100 pts)",
        optExpertReg: "Regional Expert — Delivered 2+ courses with recommendation outside Egypt (70 pts)",
        optExpertLoc: "Local Expert — At least 2 recommendation letters (40 pts)",
        optEngFluent: "Fluent — Can deliver full training in English (100 pts)",
        optEngInter: "Good / Working English Proficiency (70 pts)",
        optEngBasic: "Basic English Proficiency (40 pts)",
        lblCertSuggestedNotice: "Recommended certificates for the selected specialty (50 pts per certificate, up to 100 pts)",
        ratingScore: "Score (0 - 10)",
        compositeScoreLabel: "Total Evaluation Score (out of 100%):",
        accreditedTierLabel: "Approved Trainer Level:",
        btnSaveResult: "Save Evaluation Decision",
        intakeBadge: "Trainer Registration",
        intakeTitle: "Trainer & Expert Registration Form",
        intakeDesc: "Please fill in your details below, upload your CV, and attach or link your 2-minute introductory video.",
        mandatoryFieldsNotice: "All fields marked with an asterisk (*), including uploading your CV, are required to submit your registration.",
        lblFullName: "Full Name",
        lblEmail: "Work Email Address",
        lblJobTitle: "Current Job Title",
        lblCompany: "Company Name",
        lblCohort: "Applicant Group",
        optCohortA: "Group A: Current Employee in the Sector",
        optCohortB: "Group B: Retired Expert / Senior Consultant",
        lblDomain: "Main Training Area (13 Areas)",
        lblSubDiscipline: "Specific Specialty",
        lblExpYears: "Total Years of Experience",
        lblDegree: "Highest University Degree",
        lblCertifications: "Select Your Professional Certificates",
        lblCustomCert: "Or type other professional certificates you hold:",
        lblExpertClassification: "Expert Level",
        lblEnglishProficiency: "English Language Level",
        lblExpYearsNotice: "40 points for each year of experience (up to 600 points)",
        lblVideoLink: "8. 2-Minute Introductory Video (Upload Video File or Paste Link)",
        lblVideoDurationLimit: "Maximum Video Length: 120 Seconds (2 Minutes)",
        btnDownloadVideo: "Download Video (120s)",
        btnOpenVideoLink: "Open Video Link",
        btnDownloadSampleVideo: "Download Sample Video (120s)",
        lblUploadVideoOption: "Option 1: Upload Video File from Your Device (Max 2 Minutes)",
        lblVideoUploadHint: "Supported formats: MP4, WebM, MOV (up to 120 seconds).",
        lblPasteLinkOption: "Option 2: Or Paste a Video Link (Google Drive, YouTube, OneDrive, Vimeo, or Direct Link)",
        lblVideoLinkHint: "You can paste any video link or keep the sample video to test the form.",
        btnSubmitApplication: "Submit Registration Form & CV for Review",
        selfCalcBadge: "Instant Score",
        selfCalcTitle: "Estimated Initial Review Score — Gate 1 (Out of 1000 Points)",
        selfCalcDesc: "Automatic calculation of your initial qualification score based on the details entered in your registration form.",
        critExpPts: "Years of Experience (40 pts/year, up to 600 pts)",
        critDegreePts: "University Degree (Bachelor's 40 / Master's 70 / PhD 100)",
        critExpertClassPts: "Expert Level (Local 40 / Regional 70 / International 100)",
        critCertPts: "Professional Certificates (50 pts each, up to 100 pts)",
        critEnglishPts: "English Language Level (40 / 70 / 100 pts)",
        selfCalcNotice: "Qualification Requirement: Applicants scoring 750 points or more (out of 1000) pass Gate 1 and move to the video review and live training presentation.",
        skillsBankBadge: "Trainers Directory",
        skillsBankTitle: "Approved Trainers & Experts Directory",
        skillsBankDesc: "A central directory for the ENPPI Training Center and petroleum sector companies to find, select, and schedule certified trainers.",
        btnExportCsv: "Download Trainers List (Excel / CSV)",
        filterAll: "All Trainers",
        filterUpstream: "Exploration & Production (Upstream)",
        filterDownstream: "Refining & Petrochemicals (Downstream)",
        filterMidstream: "Pipelines & Gas Processing (Midstream)",
        filterHse: "Health, Safety & Environment (HSE)",
        filterDigital: "Digital Transformation & AI",
        filterCohortB: "Group B (Retired Experts)",
        filterMasterStar: "Master Trainers",
        weight35Badge: "Weight: 35.0%",
        weight30Badge: "Weight: 30.0%",
        compositeFormulaLabel: "(Subject Knowledge 35%) + (Training Delivery 35%) + (Communication & Presence 30%) = 100%",
        dossierPillar1: "Section 1: Subject Knowledge & Analytical Skills (35%)",
        dossierPillar2: "Section 2: Training Delivery & Course Organization (35%)",
        dossierPillar3: "Section 3: Communication & Professional Presence (30%)",
        seciTitle: "Proposed Training Courses & Practical Case Studies",
        btnRequestSecondment: "Request This Trainer for a Course",
        modalExp: "Experience",
        modalTqi: "Quality Rating",
        modalCourses: "Courses Delivered",
        footerLocationTitle: "Address & Location",
        footerCompanyFull: "Engineering for the Petroleum & Process Industries (ENPPI)",
        footerAddressDetail: "Location: Fifth Settlement — North 90th Street, New Cairo, Cairo, Egypt",
        footerContactTitle: "Contact Us",
        footerEmailLbl: "Email:",
        footerPhoneLbl: "Phone:",
        footerWorkHours: "Working Hours: Sunday – Thursday | 8:00 AM – 4:00 PM",
        footerSocialTitle: "Official LinkedIn & Website",
        footerSocialDesc: "Follow ENPPI on LinkedIn for training announcements, expert updates, and sector news:",
        footerLinkedInBtn: "ENPPI on LinkedIn",
        footerWebsiteBtn: "ENPPI Official Website (enppi.com)",
        footerCopyright: "© 2026 ENPPI (Fifth Settlement — North 90th Street, New Cairo) | Under the Auspices of the Ministry of Petroleum & Mineral Resources. All Rights Reserved.",
        toastScreeningRan: "Applicants list refreshed and matched with specialties!",
        toastAdvanced: "Applicant approved for the Live Training Presentation!",
        toastSavedResult: "Evaluation saved and trainer profile updated in the Approved Trainers Directory!",
        toastSubmitted: "Registration form and CV submitted! Initial score and profile are now ready in the Evaluation Committee page.",
        toastExported: "Approved Trainers list downloaded as an Excel/CSV file!",
        toastSecondmentRequested: "Trainer booking request sent to the ENPPI Training Center!",
        btnPromoVideo: "Project Video (120s)",
        heroWatchPromoBtn: "Watch 2-Minute Project Video (120s)",
        promoVideoModalTitle: "Official 120s Cinematic Promo Video • ENPPI XpertGate",
        promoAudioOn: "Sound On (VO & FX)",
        promoAudioOff: "Sound Muted",
        scene1Badge: "Scene 1: The Spark & Knowledge Triad (00:00 - 00:20)",
        scene1H1: "In an industry powering our nation..",
        scene1H2: "Your field expertise is our greatest asset!",
        scene1Desc: "How much extraordinary wisdom was forged across decades at production sites? Now is the time to transform it into an enduring legacy for future generations.",
        triad1: "Advanced Science & Knowledge",
        triad2: "Cumulative Field Experience",
        triad3: "Passion for Training & Delivery",
        scene2Badge: "Scene 2: National Portal Launch (00:20 - 00:45)",
        scene2H1: "Under the Auspices of the Ministry of Petroleum",
        cohortATitle: "Cohort (A) - In-Service Sector Cadres",
        cohortBTitle: "Cohort (B) - Retired Industry Veterans & Legends",
        scene2Stat: "Our Goal: 70%+ self-sufficiency for specialized training delivered by our own experts",
        scene3Badge: "Scene 3: Smart Screening Engine & 4 Gates (00:45 - 01:15)",
        scene3H1: "Objective, Smart, and Unbiased Evaluation",
        scene3H2: "Gate 1 Score (1000 Pts) • The 3 Core Pillars",
        scene4Badge: "Scene 4: Prestige, Star Tiers & ROI Impact (01:15 - 01:40)",
        scene4H1: "Official Prestige .. Rewarding Training Assignments",
        scene4H2: "Saving Millions of Dollars for Our Country",
        scene5Badge: "Scene 5: Grand Finale & Official Call (01:40 - 02:00)",
        scene5H1: "Your Expertise is a National Treasure..",
        scene5H2: "Join the Elite Trainers of the Egyptian Petroleum Sector",
        scene5Desc: "The gateway is now open to register your legacy and transfer decades of know-how. You are one step away from joining.",
        scene5CtaBtn: "Apply Now as a Certified Trainer (Join the Pool)",
        // Committee Rubric / Evaluation Matrix (AR translations; EN is inline default)
        rubricMatrixTitle: "مصفوفة تقييم العروض التدريبية",
        rubricScaleLabel: "مقياس التقييم (1–5 لكل بند)",
        rubricCriterion: "المعيار",
        rubricItem: "البند",
        rubricWeight: "الوزن النسبى",
        rubricScore: "الدرجة",
        rubricTotal: "المجموع /100",
        rubricDecisionMatrix: "مصفوفة القرار",
        rubricElite: "خبير نخبوي — اعتماد فوري + دعوة للتحكيم",
        rubricCertified: "خبير معتمد",
        rubricConditional: "اعتماد مشروط — إعادة عرض خلال 6 أشهر",
        rubricNotQualified: "غير مؤهل لهذه الدورة",
        rubricExclusionRule: "قاعدة الإقصاء: أي درجة ≤2 في البند 1.1 أو 2.2 = إقصاء مباشر مهما بلغ المجموع.",
        rubricScore5: "يفوق المعايير الدولية",
        rubricScore4: "يلبي المعايير بامتياز",
        rubricScore3: "يلبي المعايير",
        rubricScore2: "يلبيها جزئياً",
        rubricScore1: "لا يلبيها"
    }
};

// ==============================================================================
// INITIALIZATION ON DOM READY
// ==============================================================================
document.addEventListener("DOMContentLoaded", async () => {
    initI18n();
    initRoleSwitcher();
    renderRoadmapStages();
    initRoiCalculator();
    
    // Connect to internal SQLite DB and load candidates
    await DbService.init();
    AppState.candidates = AppState.candidates.map(c => evaluateCandidateEndToEnd(c));
    if (!AppState.activeEvaluatingCandidateId && AppState.candidates.length > 0) {
        AppState.activeEvaluatingCandidateId = AppState.candidates[0].id;
    }

    updateExecutiveKpiMetrics();
    renderLecturerAssessmentDashboard();
    renderScreeningTable();
    initScreeningControls();
    initBlindReviewer();
    initSimulationRubric();
    updateEvaluatingCandidateDisplay();
    initApplicantIntakeForm();
    renderSkillsBank();
    initSkillsFilterAndSearch();
    initDossierModal();
    initCsvExport();
    initDatabaseControls();
});

function initDatabaseControls() {
    const btnReset = document.getElementById("btnResetDatabase");
    if (btnReset) {
        btnReset.addEventListener("click", async () => {
            const isAr = AppState.currentLang === "ar";
            const confirmMsg = isAr 
                ? "هل أنت متأكد من رغبتك في مسح قائمة المتقدمين بالكامل؟" 
                : "Are you sure you want to clear all registered applicants?";
            if (confirm(confirmMsg)) {
                await DbService.resetDb();
                renderScreeningTable();
                renderSkillsBank();
                updateExecutiveKpiMetrics();
                updateEvaluatingCandidateDisplay();
                DbService.updateDbStatusUi(AppState.isDbConnected, 0);
                showToast(isAr ? "تم مسح قائمة المتقدمين بنجاح." : "All applicants have been cleared.");
            }
        });
    }
}

// ==============================================================================
// 1. INTERNATIONALIZATION (i18n) ENGINE
// ==============================================================================
function initI18n() {
    const langBtn = document.getElementById("langToggleBtn");

    applyLanguage(AppState.currentLang);

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            AppState.currentLang = AppState.currentLang === "ar" ? "en" : "ar";
            applyLanguage(AppState.currentLang);
        });
    }
}

function applyLanguage(lang) {
    const isAr = lang === "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.title = isAr
        ? "بوابة إنبي لخبراء ومدربي قطاع البترول | ENPPI XpertGate"
        : "ENPPI XpertGate | Certified Trainers & Experts Portal";
    
    const langLabel = document.getElementById("langLabel");
    if (langLabel) {
        langLabel.textContent = isAr ? "English (EN)" : "Arabic (AR)";
    }

    // Update standalone Rubric button text
    const rubricBtnTextEl = document.getElementById("rubricBtnText");
    if (rubricBtnTextEl) {
        rubricBtnTextEl.textContent = isAr ? "الاستمارة" : "Rubric";
    }

    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Apply to elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    // Update Input Placeholders dynamically
    const setPlaceholder = (id, arText, enText) => {
        const el = document.getElementById(id);
        if (el) el.placeholder = isAr ? arText : enText;
    };
    setPlaceholder("coursesSlider", "أدخل عدد الدورات سنوياً بعد بدء العمل (مثال: 100)", "Enter number of courses per year after rollout (e.g., 100)");
    setPlaceholder("foreignCostSlider", "أدخل متوسط تكلفة اليوم للمدرب الخارجي بالدولار (مثال: 3000)", "Enter external trainer daily rate in USD (e.g., 3000)");
    setPlaceholder("nationalCostSlider", "أدخل متوسط تكلفة اليوم للمدرب الداخلي بالدولار (مثال: 500)", "Enter internal trainer daily rate in USD (e.g., 500)");
    setPlaceholder("egpRateSlider", "أدخل سعر صرف الدولار بالجنيه (مثال: 50)", "Enter USD to EGP exchange rate (e.g., 50)");
    setPlaceholder("roiCourseDays", "أدخل متوسط عدد أيام الكورس (مثال: 5)", "Enter average course duration in days (e.g., 5)");
    setPlaceholder("appFullName", "مثال: م. طارق محمود حسن", "e.g., Eng. Tarek Mahmoud Hassan");
    setPlaceholder("appPhone", "+20 100 000 0000", "+20 100 000 0000");
    setPlaceholder("appLinkedIn", "https://www.linkedin.com/in/your-profile", "https://www.linkedin.com/in/your-profile");
    setPlaceholder("appWebsite", "https://your-portfolio.com", "https://your-website-or-portfolio.com");
    setPlaceholder("appCompany", "مثال: ENPPI, GASCO, GUPCO, Petrobel", "e.g., ENPPI, GASCO, GUPCO, Petrobel");
    setPlaceholder("appDepartment", "مثال: الإدارة العامة لهندسة العمليات / الحفر / الموارد البشرية", "e.g., Process Engineering / Drilling / HR & Training");
    setPlaceholder("appJobTitle", "مثال: مدير عام هندسة العمليات / استشاري حفر أول", "e.g., General Manager of Process Engineering / Senior Drilling Advisor");
    setPlaceholder("appHrEmail", "hr@company.com.eg", "hr@company.com.eg");
    setPlaceholder("appCareerPositions", "اذكر أهم المناصب الهندسية والقيادية والاستشارية التي شغلتها خلال مسيرتك المهنية...", "List your previous job titles and key roles in chronological order...");
    setPlaceholder("bscField", "التخصص (مثال: هندسة البترول / الهندسة الكيميائية)", "Major / Specialty (e.g., Chemical Engineering)");
    setPlaceholder("bscUniversity", "الجامعة (مثال: جامعة القاهرة / جامعة الإسكندرية)", "University (e.g., Cairo University)");
    setPlaceholder("bscYear", "سنة التخرج (مثال: 2008)", "Graduation Year (e.g., 2008)");
    setPlaceholder("mscField", "مجال التخصص بالماجستير", "Major / Specialty");
    setPlaceholder("mscUniversity", "الجامعة المانحة", "University");
    setPlaceholder("mscYear", "سنة التخرج", "Graduation Year");
    setPlaceholder("phdField", "مجال التخصص بالدكتوراه", "Major / Specialty");
    setPlaceholder("phdUniversity", "الجامعة المانحة", "University");
    setPlaceholder("phdYear", "سنة التخرج", "Graduation Year");
    setPlaceholder("appCustomCert", "أسماء الشهادات ومجال التخصص (مثال: PMP, API 570, CMRP)", "Certificate Names & Specialty (e.g., PMP, API 570)");
    setPlaceholder("profCertYear", "سنة الحصول عليها (مثال: 2019, 2022)", "Year(s) Obtained (e.g., 2019, 2022)");
    setPlaceholder("intlCertArea", "مجال التخصص واسم الشهادة الدولية", "Specialty & Certificate Name");
    setPlaceholder("intlCertInst", "الجهة المانحة (مثال: IWCF, NEBOSH, ASME)", "Issuing Organization (e.g., IWCF, NEBOSH, ASME)");
    setPlaceholder("intlCertYear", "سنة الحصول عليها", "Year Obtained");
    setPlaceholder("sophCertArea", "الشهادة التقنية المتقدمة في قطاع البترول", "Specialty & Technical Certificate Name");
    setPlaceholder("sophCertInst", "الجهة الدولية المانحة (مثال: SPE, API, AMPP)", "Issuing Organization (e.g., SPE, API, AMPP)");
    setPlaceholder("sophCertYear", "سنة الحصول عليها", "Year Obtained");
    setPlaceholder("appBankAccount", "مثال: EG00 0000 0000 0000 0000 0000 00000 (اسم البنك ورقم الحساب / IBAN)", "e.g., EG00 0000 0000 0000 0000 0000 00000 (Bank Name & Account / IBAN)");
    setPlaceholder("appDeclName", "الاسم الثلاثي أو الرباعي للمتقدم", "Full Name");
    setPlaceholder("appSignature", "التوقيع الرقمي للمتقدم", "Type Your Full Name as Signature");
    setPlaceholder("skillsSearchInput", "ابحث باسم الخبير، المجال، الشركة، أو الفئة التدريبية...", "Search by trainer name, specialty, company, or trainer level...");
    setPlaceholder("evalTableSearchInput", "ابحث باسم المحاضر أو التخصص أو الشركة...", "Search lecturer, specialty, or company...");

    // Re-render language-sensitive components
    renderRoadmapStages();
    updateExecutiveKpiMetrics();
    renderLecturerAssessmentDashboard();
    renderScreeningTable();
    populateDomainDropdowns();
    populateRoiSpecialtyOptions();
    renderSkillsBank();
    updateRoiCalculations();
    loadRubricCriteria();
    updateEvaluatingCandidateDisplay();
    calculateSimulationRubric();
    DbService.updateDbStatusUi(AppState.isDbConnected, AppState.candidates.length);
}

// Helper: Show brief toast notification
function showToast(msgKey) {
    const toast = document.getElementById("toastNotification");
    const toastMessage = document.getElementById("toastMessage");
    const dict = TRANSLATIONS[AppState.currentLang];
    
    toastMessage.textContent = dict[msgKey] || msgKey;
    toast.classList.add("active");

    setTimeout(() => {
        toast.classList.remove("active");
    }, 3500);
}

// ==============================================================================
// 2. ROLE SWITCHER (محول الأدوار التنفيذي)
// ==============================================================================
function initRoleSwitcher() {
    const roleButtons = document.querySelectorAll(".role-btn");
    const viewSections = document.querySelectorAll(".view-section");

    window.switchRoleView = function(targetViewId) {
        if (!targetViewId) return;

        const isRoiTarget = targetViewId === "adminView" || targetViewId === "roiCalculatorSection";
        const actualViewSectionId = isRoiTarget ? "skillsBankView" : targetViewId;

        // Toggle active states on role buttons
        roleButtons.forEach(b => {
            const btnView = b.getAttribute("data-view");
            const isMatch = btnView === targetViewId;
            b.classList.toggle("active", isMatch);
            b.setAttribute("aria-selected", isMatch ? "true" : "false");
        });

        // Toggle visibility of view sections
        viewSections.forEach(section => {
            const isTargetSection = section.id === actualViewSectionId;
            section.classList.toggle("active", isTargetSection);
        });

        AppState.currentRoleView = targetViewId;

        // If switching to Committee room, adapt gate/workspace to login state
        if (actualViewSectionId === "screeningView") {
            const gate = document.getElementById("committeeLoginGate");
            const ws = document.getElementById("committeeWorkspace");
            if (AppState.isCommitteeLoggedIn) {
                if (gate) gate.style.display = "none";
                if (ws) ws.style.display = "block";
            } else {
                if (gate) gate.style.display = "block";
                if (ws) ws.style.display = "none";
            }
        }

        // Handle scrolling: scroll directly to ROI section if requested, otherwise top
        if (isRoiTarget) {
            setTimeout(() => {
                const roiEl = document.getElementById("roiCalculatorSection");
                if (roiEl) {
                    roiEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 80);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    roleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetViewId = btn.getAttribute("data-view");
            window.switchRoleView(targetViewId);
        });
    });
}

// Committee Authentication Gates
window.handleCommitteeLogin = function(e) {
    if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
    }
    const user = document.getElementById("committeeUser")?.value?.trim() || "";
    const pass = document.getElementById("committeePass")?.value?.trim() || "";

    if ((user === "committee" && pass === "Enppi2026!") || (user && pass)) {
        AppState.isCommitteeLoggedIn = true;
        const gate = document.getElementById("committeeLoginGate");
        const ws = document.getElementById("committeeWorkspace");
        if (gate) gate.style.display = "none";
        if (ws) ws.style.display = "block";
        const isAr = AppState.currentLang === "ar";
        showToast(isAr ? "تم تسجيل الدخول بنجاح إلى غرفة لجنة التحكيم" : "Welcome to the Evaluation Committee Workspace");
        renderScreeningTable();
        updateEvaluatingCandidateDisplay();
    } else {
        const isAr = AppState.currentLang === "ar";
        showToast(isAr ? "يرجى إدخال اسم المستخدم وكلمة المرور (committee / Enppi2026!)" : "Please enter username and password (committee / Enppi2026!)", "warning");
    }
    return false;
};

window.handleCommitteeLogout = function() {
    AppState.isCommitteeLoggedIn = false;
    const gate = document.getElementById("committeeLoginGate");
    const ws = document.getElementById("committeeWorkspace");
    if (gate) gate.style.display = "block";
    if (ws) ws.style.display = "none";
    const isAr = AppState.currentLang === "ar";
    showToast(isAr ? "تم تسجيل الخروج وقفل غرفة التحكيم" : "Logged out from Committee Workspace");
};

// ==============================================================================
// 3. C-SUITE SHOWCASE: MASTER OPERATIONAL WORKFLOW & ROI CALCULATOR
// ==============================================================================
function renderRoadmapStages() {
    const wrapper = document.getElementById("workflowTrackWrapper") || document.getElementById("roadmapStagesWrapper");
    if (!wrapper) return;

    const isAr = AppState.currentLang === "ar";
    const dict = TRANSLATIONS[AppState.currentLang] || TRANSLATIONS.en;
    wrapper.innerHTML = "";

    const phasesToRender = (typeof WORKFLOW_PHASES !== "undefined" && WORKFLOW_PHASES.length > 0)
        ? WORKFLOW_PHASES
        : ROADMAP_STAGES;

    phasesToRender.forEach((phase, index) => {
        const phaseDiv = document.createElement("div");
        const statusClass = (phase.status || "completed").toLowerCase();
        phaseDiv.className = `workflow-phase-card status-${statusClass}`;
        
        // Circular milestone marker (01, 02, 03, 04, 05) on the vertical spine
        const milestoneMarker = document.createElement("div");
        milestoneMarker.className = "timeline-milestone-marker";
        milestoneMarker.textContent = `0${index + 1}`;
        phaseDiv.appendChild(milestoneMarker);

        const pNum = phase.phaseNumber || `PHASE 0${index + 1}`;
        const pTitle = isAr ? (phase.titleAr || phase.titleEn) : phase.titleEn;
        const pSubtitle = isAr ? (phase.subtitleAr || phase.subtitleEn || "") : (phase.subtitleEn || "");
        const pStatus = isAr ? (phase.statusAr || phase.status) : (phase.status || "Completed");
        const pIcon = phase.icon || "fa-layer-group";

        // Nested Operational Stages
        let stagesHtml = "";
        const stagesList = phase.stages || phase.phases || [];

        stagesList.forEach(stg => {
            const stgCode = stg.stageCode || `Stage ${index + 1}.${stg.phaseNumber || 1}`;
            const stgTitle = isAr ? (stg.titleAr || stg.nameAr || stg.titleEn) : (stg.titleEn || stg.nameEn);
            const stgDesc = isAr ? (stg.descriptionAr || stg.deliverableAr || "") : (stg.descriptionEn || stg.deliverableEn || "");
            const stgDeliverable = isAr ? (stg.deliverableAr || stg.deliverableEn) : stg.deliverableEn;
            const stgRaci = stg.raci || "Steering Committee";
            const stgBadge = stg.badge || "System";

            stagesHtml += `
                <div class="stage-step-card">
                    <div>
                        <div class="stage-top-meta">
                            <span class="stage-code-badge">${stgCode}</span>
                            <span class="stage-type-pill">${stgBadge}</span>
                        </div>
                        <h4 class="stage-step-title">${stgTitle}</h4>
                        <p class="stage-step-desc">${stgDesc}</p>
                    </div>

                    <div>
                        <div class="stage-deliverable-box">
                            <i class="fa-solid fa-box-archive"></i>
                            <div>
                                <strong>${dict.deliverableLabel || (isAr ? 'المخرج المعتمد:' : 'Expected Output:')}</strong>
                                <span>${stgDeliverable}</span>
                            </div>
                        </div>
                        <div class="stage-footer-raci">
                            <span><i class="fa-solid fa-users-gear" style="margin-right: 0.3rem;"></i> ${dict.raciRoleLabel || 'Responsible Team:'}</span>
                            <span class="raci-badge">${stgRaci}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        phaseDiv.innerHTML = `
            <div class="workflow-phase-header">
                <div class="phase-identity">
                    <div class="phase-icon-circle">
                        <i class="fa-solid ${pIcon}"></i>
                    </div>
                    <div class="phase-title-text">
                        <h3>
                            <span class="phase-number-tag">${pNum}</span>
                            <span>${pTitle}</span>
                        </h3>
                        <p>${pSubtitle}</p>
                    </div>
                </div>

                <div class="phase-status-pill ${statusClass}">
                    <span class="legend-dot ${statusClass}"></span>
                    <span>${pStatus}</span>
                </div>
            </div>

            <div class="workflow-stages-container">
                <div class="stages-section-label">
                    <i class="fa-solid fa-list-check"></i>
                    <span>${dict.stagesListLabel || (isAr ? 'نظم العمل والخطوات المندرجة تحت المرحلة:' : 'Key Steps in This Phase:')} (${stagesList.length} Steps)</span>
                </div>
                <div class="workflow-stages-grid">
                    ${stagesHtml}
                </div>
            </div>
        `;

        wrapper.appendChild(phaseDiv);

        // Add visual transition connector between phases (except the last phase)
        if (index < phasesToRender.length - 1) {
            const connectorDiv = document.createElement("div");
            connectorDiv.className = "workflow-phase-connector";
            connectorDiv.innerHTML = `
                <div class="connector-pill">
                    <i class="fa-solid fa-arrow-down-long"></i>
                    <span>${isAr ? 'الانتقال إلى المرحلة التالية' : 'Next Phase'}</span>
                    <i class="fa-solid fa-arrow-down-long"></i>
                </div>
            `;
            wrapper.appendChild(connectorDiv);
        }
    });
}

function populateRoiSpecialtyOptions() {
    const sel = document.getElementById("roiSpecialtySelect");
    if (!sel) return;
    const isAr = AppState.currentLang === "ar";
    const currentVal = sel.value || "all";

    sel.innerHTML = "";

    // Default option: All Disciplines
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = isAr ? "كافة التخصصات البترولية والهندسية (13 تخصصاً)" : "All Petroleum & Engineering Disciplines (13 Areas)";
    sel.appendChild(allOpt);

    if (typeof PETROLEUM_DOMAINS !== "undefined" && Array.isArray(PETROLEUM_DOMAINS)) {
        PETROLEUM_DOMAINS.forEach(domain => {
            const opt = document.createElement("option");
            opt.value = domain.id;
            opt.textContent = isAr ? domain.nameAr : domain.nameEn;
            sel.appendChild(opt);
        });
    }

    // Restore selected value if still valid
    sel.value = currentVal;
}

function initRoiCalculator() {
    const specialtySelect = document.getElementById("roiSpecialtySelect");
    const courseDaysInput = document.getElementById("roiCourseDays");
    const coursesSlider = document.getElementById("coursesSlider");
    const foreignCostSlider = document.getElementById("foreignCostSlider");
    const nationalCostSlider = document.getElementById("nationalCostSlider");
    const egpRateSlider = document.getElementById("egpRateSlider");
    const btnClear = document.getElementById("btnClearRoiInputs");

    populateRoiSpecialtyOptions();

    const inputs = [specialtySelect, courseDaysInput, coursesSlider, foreignCostSlider, nationalCostSlider, egpRateSlider];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener("input", updateRoiCalculations);
            input.addEventListener("change", updateRoiCalculations);
        }
    });

    if (btnClear) {
        btnClear.addEventListener("click", () => {
            if (courseDaysInput) courseDaysInput.value = "";
            if (coursesSlider) coursesSlider.value = "";
            if (foreignCostSlider) foreignCostSlider.value = "";
            if (nationalCostSlider) nationalCostSlider.value = "";
            if (egpRateSlider) egpRateSlider.value = "";
            if (specialtySelect) specialtySelect.value = "all";
            updateRoiCalculations();
        });
    }

    const btnFillDemo = document.getElementById("btnFillDemoRoi");
    if (btnFillDemo) {
        btnFillDemo.addEventListener("click", fillDemoRoiBenchmark);
    }

    updateRoiCalculations();
}

window.fillDemoRoiBenchmark = function() {
    const specialtySelect = document.getElementById("roiSpecialtySelect");
    const courseDaysInput = document.getElementById("roiCourseDays");
    const coursesSlider = document.getElementById("coursesSlider");
    const foreignCostSlider = document.getElementById("foreignCostSlider");
    const nationalCostSlider = document.getElementById("nationalCostSlider");
    const egpRateSlider = document.getElementById("egpRateSlider");

    if (specialtySelect) specialtySelect.value = "all";
    if (courseDaysInput) courseDaysInput.value = "5";
    if (foreignCostSlider) foreignCostSlider.value = "3000";
    if (nationalCostSlider) nationalCostSlider.value = "500";
    if (coursesSlider) coursesSlider.value = "120";
    if (egpRateSlider) egpRateSlider.value = "50";

    updateRoiCalculations();
    const isAr = AppState.currentLang === "ar";
    showToast(isAr 
        ? "تم تحميل أرقام المقارنة القياسية: وفر سنوي يتجاوز 1,500,000 دولار" 
        : "Loaded benchmark figures: $1,500,000 annual net savings retained!");
};

function updateRoiCalculations() {
    const isAr = AppState.currentLang === "ar";
    const specialtySelect = document.getElementById("roiSpecialtySelect");
    const courseDaysEl = document.getElementById("roiCourseDays");
    const coursesEl = document.getElementById("coursesSlider");
    const foreignEl = document.getElementById("foreignCostSlider");
    const nationalEl = document.getElementById("nationalCostSlider");
    const egpRateEl = document.getElementById("egpRateSlider");

    const specVal = specialtySelect ? specialtySelect.value : "all";
    const rawDays = courseDaysEl ? courseDaysEl.value.trim() : "";
    const rawCourses = coursesEl ? coursesEl.value.trim() : "";
    const rawForeign = foreignEl ? foreignEl.value.trim() : "";
    const rawNational = nationalEl ? nationalEl.value.trim() : "";
    const rawEgp = egpRateEl ? egpRateEl.value.trim() : "";

    const days = rawDays !== "" ? parseFloat(rawDays) : NaN;
    const courses = rawCourses !== "" ? parseFloat(rawCourses) : NaN;
    const foreignDaily = rawForeign !== "" ? parseFloat(rawForeign) : NaN;
    const nationalDaily = rawNational !== "" ? parseFloat(rawNational) : NaN;
    const egpRate = rawEgp !== "" ? parseFloat(rawEgp) : NaN;

    const specialtyDisp = document.getElementById("roiSpecialtyDisplay");
    const daysDisp = document.getElementById("roiDaysDisplay");
    const coursesDisp = document.getElementById("coursesCountDisplay");
    const foreignDisp = document.getElementById("foreignCostDisplay");
    const nationalDisp = document.getElementById("nationalCostDisplay");
    const egpRateDisp = document.getElementById("egpRateDisplay");

    const singleExternalDisp = document.getElementById("singleCourseExternalDisplay");
    const singleInternalDisp = document.getElementById("singleCourseInternalDisplay");
    const singleExternalFormula = document.getElementById("singleCourseExternalFormula");
    const singleInternalFormula = document.getElementById("singleCourseInternalFormula");
    const singleSavingsDisp = document.getElementById("singleCourseSavingsDisplay");

    const netUsdDisp = document.getElementById("netUsdSavedDisplay");
    const netEgpDisp = document.getElementById("netEgpSavedDisplay");
    const paybackDisp = document.getElementById("roiDynamicPaybackText");
    const summaryBox = document.getElementById("roiMetricsSummaryBox");
    const statusBanner = document.getElementById("roiStatusBanner");

    // 1. Specialty Display
    if (specialtyDisp) {
        if (specVal === "all") {
            specialtyDisp.textContent = isAr ? "كافة التخصصات البترولية والهندسية" : "All Petroleum & Engineering Disciplines";
        } else if (typeof PETROLEUM_DOMAINS !== "undefined") {
            const domain = PETROLEUM_DOMAINS.find(d => d.id === specVal);
            specialtyDisp.textContent = domain ? (isAr ? domain.nameAr : domain.nameEn) : specVal;
        }
    }

    // 2. Input Metric Displays
    if (daysDisp) {
        daysDisp.textContent = !isNaN(days) && days > 0
            ? (isAr ? `${days} أيام` : `${days} Days`)
            : "—";
    }
    if (foreignDisp) {
        foreignDisp.textContent = !isNaN(foreignDaily) && foreignDaily >= 0
            ? (isAr ? `$${foreignDaily.toLocaleString()} / يوم` : `$${foreignDaily.toLocaleString()} / Day`)
            : "—";
    }
    if (nationalDisp) {
        nationalDisp.textContent = !isNaN(nationalDaily) && nationalDaily >= 0
            ? (isAr ? `$${nationalDaily.toLocaleString()} / يوم` : `$${nationalDaily.toLocaleString()} / Day`)
            : "—";
    }
    if (coursesDisp) {
        coursesDisp.textContent = !isNaN(courses) && courses >= 0
            ? (isAr ? `${courses.toLocaleString()} دورة` : `${courses.toLocaleString()} Courses`)
            : "—";
    }
    if (egpRateDisp) {
        egpRateDisp.textContent = !isNaN(egpRate) && egpRate > 0
            ? `${egpRate.toFixed(1)} EGP`
            : "—";
    }

    const hasAnyInput = !isNaN(days) || !isNaN(courses) || !isNaN(foreignDaily) || !isNaN(nationalDaily) || !isNaN(egpRate);

    if (!hasAnyInput) {
        if (singleExternalDisp) singleExternalDisp.textContent = "—";
        if (singleInternalDisp) singleInternalDisp.textContent = "—";
        if (singleSavingsDisp) singleSavingsDisp.textContent = "—";
        if (singleExternalFormula) singleExternalFormula.textContent = isAr ? "عدد الأيام × يومية المدرب الخارجي" : "Days × External Rate";
        if (singleInternalFormula) singleInternalFormula.textContent = isAr ? "عدد الأيام × يومية مدرب القطاع" : "Days × Sector Rate";
        if (netUsdDisp) netUsdDisp.textContent = "—";
        if (netEgpDisp) netEgpDisp.textContent = "—";
        if (paybackDisp) paybackDisp.textContent = isAr ? "نسبة خفض تكلفة التدريب بالكورس: —" : "Training Cost Reduction Rate: —";

        if (summaryBox) {
            summaryBox.style.opacity = "0.55";
        }
        if (statusBanner) {
            statusBanner.style.background = "rgba(212, 175, 55, 0.12)";
            statusBanner.style.borderColor = "rgba(212, 175, 55, 0.35)";
            statusBanner.style.color = "var(--gold-bright)";
            statusBanner.innerHTML = `<i class="fa-solid fa-keyboard"></i> <span>${isAr ? 'أدخل الأرقام في الحقول لتفعيل مقارنة سعر الكورس وحساب الـ ROI فورياً' : 'Enter numbers in the fields below to calculate course price comparison and ROI'}</span>`;
        }
        return;
    }

    if (summaryBox) {
        summaryBox.style.opacity = "1";
    }

    // Effective days for course price calculation
    const effectiveDays = (!isNaN(days) && days > 0) ? days : 5;
    const hasForeignDaily = !isNaN(foreignDaily) && foreignDaily > 0;
    const hasNationalDaily = !isNaN(nationalDaily) && nationalDaily >= 0;

    let externalCoursePrice = NaN;
    let internalCoursePrice = NaN;
    let singleCourseSavings = NaN;
    let savingsPercent = 0;

    // Single Course External Price
    if (hasForeignDaily) {
        externalCoursePrice = foreignDaily * effectiveDays;
        if (singleExternalDisp) singleExternalDisp.textContent = `$${Math.round(externalCoursePrice).toLocaleString()}`;
        if (singleExternalFormula) {
            singleExternalFormula.textContent = isAr
                ? `${effectiveDays} أيام × $${foreignDaily.toLocaleString()}`
                : `${effectiveDays} Days × $${foreignDaily.toLocaleString()}`;
        }
    } else {
        if (singleExternalDisp) singleExternalDisp.textContent = "—";
        if (singleExternalFormula) {
            singleExternalFormula.textContent = isAr ? "عدد الأيام × يومية المدرب الخارجي" : "Days × External Rate";
        }
    }

    // Single Course Internal Price
    if (hasNationalDaily) {
        internalCoursePrice = nationalDaily * effectiveDays;
        if (singleInternalDisp) singleInternalDisp.textContent = `$${Math.round(internalCoursePrice).toLocaleString()}`;
        if (singleInternalFormula) {
            singleInternalFormula.textContent = isAr
                ? `${effectiveDays} أيام × $${nationalDaily.toLocaleString()}`
                : `${effectiveDays} Days × $${nationalDaily.toLocaleString()}`;
        }
    } else {
        if (singleInternalDisp) singleInternalDisp.textContent = "—";
        if (singleInternalFormula) {
            singleInternalFormula.textContent = isAr ? "عدد الأيام × يومية مدرب القطاع" : "Days × Sector Rate";
        }
    }

    // Single Course Savings Comparison
    if (!isNaN(externalCoursePrice) && !isNaN(internalCoursePrice)) {
        singleCourseSavings = Math.max(0, externalCoursePrice - internalCoursePrice);
        savingsPercent = externalCoursePrice > 0 ? Math.round((singleCourseSavings / externalCoursePrice) * 100) : 0;
        if (singleSavingsDisp) {
            singleSavingsDisp.textContent = `$${Math.round(singleCourseSavings).toLocaleString()} (${isAr ? `وفر ${savingsPercent}%` : `${savingsPercent}% Saved`})`;
        }
    } else {
        if (singleSavingsDisp) singleSavingsDisp.textContent = "—";
    }

    // Annual Cost Savings (USD and EGP)
    const hasAnnualCourses = !isNaN(courses) && courses > 0;

    if (!isNaN(singleCourseSavings) && hasAnnualCourses) {
        const totalUsdSaved = courses * singleCourseSavings;
        if (netUsdDisp) netUsdDisp.textContent = `$${Math.round(totalUsdSaved).toLocaleString()}`;

        if (!isNaN(egpRate) && egpRate > 0) {
            const totalEgpSaved = totalUsdSaved * egpRate;
            if (netEgpDisp) netEgpDisp.textContent = `${Math.round(totalEgpSaved).toLocaleString()} EGP`;
            if (paybackDisp) {
                paybackDisp.textContent = isAr
                    ? `نسبة خفض تكلفة التدريب بالكورس: ${savingsPercent}%`
                    : `Training Cost Reduction Rate: ${savingsPercent}%`;
            }
            if (statusBanner) {
                statusBanner.style.background = "rgba(16, 185, 129, 0.15)";
                statusBanner.style.borderColor = "rgba(16, 185, 129, 0.45)";
                statusBanner.style.color = "#34D399";
                statusBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${isAr ? `مقارنة سعر الكورس وحاسبة الـ ROI نشطة — الوفر في الكورس الواحد: $${Math.round(singleCourseSavings).toLocaleString()} (${savingsPercent}%) | إجمالي الوفر السنوي: $${Math.round(totalUsdSaved).toLocaleString()}` : `Course Price Comparison & ROI Active — Saved per Course: $${Math.round(singleCourseSavings).toLocaleString()} (${savingsPercent}%) | Total Annual Savings: $${Math.round(totalUsdSaved).toLocaleString()}`}</span>`;
            }
        } else {
            if (netEgpDisp) netEgpDisp.textContent = isAr ? "أدخل سعر الصرف" : "Enter Exchange Rate";
            if (paybackDisp) {
                paybackDisp.textContent = isAr
                    ? `نسبة خفض تكلفة التدريب بالكورس: ${savingsPercent}%`
                    : `Training Cost Reduction Rate: ${savingsPercent}%`;
            }
            if (statusBanner) {
                statusBanner.style.background = "rgba(16, 185, 129, 0.12)";
                statusBanner.style.borderColor = "rgba(16, 185, 129, 0.35)";
                statusBanner.style.color = "#34D399";
                statusBanner.innerHTML = `<i class="fa-solid fa-calculator"></i> <span>${isAr ? 'تمت مقارنة سعر الكورس وحساب الوفر بالدولار — أدخل سعر الصرف لحساب المعادل بالجنيه المصري' : 'Course prices compared & USD savings calculated — Enter exchange rate to calculate EGP savings'}</span>`;
            }
        }
    } else if (!isNaN(singleCourseSavings)) {
        if (netUsdDisp) netUsdDisp.textContent = isAr ? "أدخل عدد الدورات سنوياً" : "Enter Annual Courses";
        if (netEgpDisp) netEgpDisp.textContent = "—";
        if (paybackDisp) {
            paybackDisp.textContent = isAr
                ? `نسبة خفض تكلفة التدريب بالكورس: ${savingsPercent}%`
                : `Training Cost Reduction Rate: ${savingsPercent}%`;
        }
        if (statusBanner) {
            statusBanner.style.background = "rgba(16, 185, 129, 0.12)";
            statusBanner.style.borderColor = "rgba(16, 185, 129, 0.35)";
            statusBanner.style.color = "#34D399";
            statusBanner.innerHTML = `<i class="fa-solid fa-hand-holding-dollar"></i> <span>${isAr ? `تمت مقارنة سعر الكورس بنجاح (وفر $${Math.round(singleCourseSavings).toLocaleString()} / ${savingsPercent}%) — استكمل عدد الدورات السنوية لحساب إجمالي الوفر` : `Course price comparison calculated ($${Math.round(singleCourseSavings).toLocaleString()} / ${savingsPercent}% savings) — Enter annual courses to calculate total savings`}</span>`;
        }
    } else {
        if (netUsdDisp) netUsdDisp.textContent = "—";
        if (netEgpDisp) netEgpDisp.textContent = "—";
        if (paybackDisp) paybackDisp.textContent = isAr ? "نسبة خفض تكلفة التدريب بالكورس: —" : "Training Cost Reduction Rate: —";
        if (statusBanner) {
            statusBanner.style.background = "rgba(212, 175, 55, 0.15)";
            statusBanner.style.borderColor = "rgba(212, 175, 55, 0.45)";
            statusBanner.style.color = "var(--gold-bright)";
            statusBanner.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> <span>${isAr ? 'جاري الإدخال... استكمل تكلفة اليوم للمدرب الخارجي ومدرب القطاع لمقارنة سعر الكورس' : 'Please enter external trainer rate and internal trainer rate to compare course prices'}</span>`;
        }
    }
}

function updateExecutiveKpiMetrics() {
    const totalCandidates = AppState.candidates.length;
    const isAr = AppState.currentLang === "ar";

    // 1. Total Registered Pool
    const totalEl = document.getElementById("kpiTotalApplicantsCount");
    if (totalEl) totalEl.textContent = totalCandidates;

    // Distinct Companies
    const companies = new Set(AppState.candidates.map(c => c.company));
    const companiesSubtext = document.getElementById("kpiCompaniesSubtext");
    if (companiesSubtext) {
        companiesSubtext.textContent = isAr 
            ? `عبر ${companies.size} شركات قطاع معتمدة` 
            : `across ${companies.size} participating companies`;
    }

    // 2. Gate 1 Screened & Qualified (Points >= 750 or percentage >= 75%)
    const qualifiedGate1 = AppState.candidates.filter(c => (c.gate1Points || 0) >= 750);
    const screenedEl = document.getElementById("kpiScreenedCount");
    if (screenedEl) screenedEl.textContent = qualifiedGate1.length;

    const passRateEl = document.getElementById("kpiPassRatePercent");
    if (passRateEl) {
        const passPct = totalCandidates > 0 ? Math.round((qualifiedGate1.length / totalCandidates) * 100) : 0;
        passRateEl.textContent = `${passPct}%`;
    }

    // 3. Shortlisted for Live Demos (Screening status Shortlisted or decision Advance)
    const shortlisted = AppState.candidates.filter(c => c.screeningStatus === "Shortlisted" || c.blindScores?.decision === "Advance");
    const shortlistedEl = document.getElementById("kpiShortlistedCount");
    if (shortlistedEl) shortlistedEl.textContent = shortlisted.length;

    const demoReadyRatio = document.getElementById("kpiDemoReadyRatio");
    if (demoReadyRatio) {
        const demoPct = totalCandidates > 0 ? Math.round((shortlisted.length / totalCandidates) * 100) : 0;
        demoReadyRatio.textContent = `${demoPct}%`;
    }

    // 4. Certified Master Trainers (Composite >= 90)
    const masters = AppState.candidates.filter(c => (c.compositeScore || 0) >= 90);
    const mastersEl = document.getElementById("kpiCertifiedMastersCount");
    if (mastersEl) mastersEl.textContent = masters.length;

    const mastersRatio = document.getElementById("kpiMastersRatio");
    if (mastersRatio) {
        const masterPct = totalCandidates > 0 ? Math.round((masters.length / totalCandidates) * 100) : 0;
        mastersRatio.textContent = `${masterPct}%`;
    }

    // 5. Cohort Distribution
    const cohortA = AppState.candidates.filter(c => c.cohort === "Cohort A").length;
    const cohortB = AppState.candidates.filter(c => c.cohort === "Cohort B").length;
    const cohortDisplay = document.getElementById("kpiCohortCountDisplay");
    if (cohortDisplay) {
        cohortDisplay.textContent = `${cohortA}A / ${cohortB}B`;
    }

    const cohortRatio = document.getElementById("kpiCohortRatio");
    if (cohortRatio) {
        if (totalCandidates > 0) {
            const pctA = Math.round((cohortA / totalCandidates) * 100);
            const pctB = 100 - pctA;
            cohortRatio.innerHTML = isAr 
                ? `${pctA}% بالخدمة / <span style="color: var(--gold-bright);">${pctB}% قامات متقاعدة</span>`
                : `${pctA}% Active / <span style="color: var(--gold-bright);">${pctB}% Retired</span>`;
        } else {
            cohortRatio.innerHTML = isAr ? `0% بالخدمة / 0% متقاعدين` : `0% Active / 0% Retired`;
        }
    }

    // 6. Average TQI Quality Index
    const avgTqiDisplay = document.getElementById("kpiAvgTqiDisplay");
    if (avgTqiDisplay) {
        const validTqi = AppState.candidates.filter(c => c.tqiScore > 0);
        const avg = validTqi.length > 0 
            ? (validTqi.reduce((acc, c) => acc + c.tqiScore, 0) / validTqi.length).toFixed(2)
            : "0.00";
        avgTqiDisplay.textContent = avg;
    }
}

// ==============================================================================
// 4. AUTOMATED LECTURER EVALUATION ENGINE, DASHBOARD & ASSESSMENT ROSTER
// ==============================================================================

function evaluateCandidateEndToEnd(cand) {
    if (!cand) return cand;

    const regDetails = cand.registrationDetails || {};
    cand.registrationDetails = regDetails;
    if (!regDetails.cvUrl) {
        regDetails.cvUrl = "assets/Template%20Form%20for%20Expert%20Registration.docx";
    }
    if (!regDetails.cvFileName) {
        regDetails.cvFileName = `${cand.code || 'Candidate'}_CV.docx`;
    }
    const expYears = Number(cand.experienceYears) || 0;
    
    // --------------------------------------------------------------------------
    // SCAN APPLICANT INFORMATION
    // --------------------------------------------------------------------------
    // 1. Resolve Degree Level
    let degreeLevel = cand.degreeLevel;
    if (!degreeLevel) {
        if (regDetails.phd?.field || (cand.degreeEn && cand.degreeEn.includes("PhD"))) degreeLevel = "PhD";
        else if (regDetails.msc?.field || (cand.degreeEn && cand.degreeEn.includes("Master"))) degreeLevel = "Master";
        else degreeLevel = "Bachelor";
    }

    // 2. Resolve Expert Classification
    const expertClass = cand.expertClassification || "local";

    // 3. Resolve Certifications
    let certCount = 0;
    if (Array.isArray(cand.certs)) certCount = cand.certs.length;
    else if (typeof cand.certs === "string" && cand.certs.trim()) certCount = cand.certs.split(",").length;
    if (regDetails.intlCerts?.area) certCount = Math.max(certCount, 2);
    if (regDetails.sophCerts?.area) certCount = Math.max(certCount, 3);

    // 4. Resolve English Proficiency
    const english = cand.englishProficiency || "Fluent";

    // 5. Resolve Top 7 Training Courses
    const progList = Array.isArray(regDetails.programs) ? regDetails.programs.filter(p => p && p.trim()) : [];
    const progCount = progList.length > 0 ? progList.length : (cand.coursesDelivered ? Math.min(7, cand.coursesDelivered) : 5);

    // 6. Resolve Video Pitch
    const hasVideo = Boolean(cand.pitchVideoUrl && cand.pitchVideoUrl.trim());

    // 7. Resolve Executive Demeanor / Seniority from Job Title & History
    const titleText = `${cand.jobTitle || ''} ${regDetails.careerPositions || ''}`.toLowerCase();
    const isExecutive = titleText.includes("general manager") || titleText.includes("مدير عام") || 
                        titleText.includes("advisor") || titleText.includes("استشاري") || 
                        titleText.includes("head") || titleText.includes("رئيس") || 
                        titleText.includes("consultant") || cand.cohort === "Cohort B";

    // --------------------------------------------------------------------------
    // CRITERION 1: GATE 1 SCORE (Out of 1000 Points - Passing Threshold: 750)
    // --------------------------------------------------------------------------
    const expPoints = Math.min(expYears * 40, 600); // 40 pts/yr up to 600
    const degreePts = degreeLevel === "PhD" ? 100 : (degreeLevel === "Master" ? 70 : 40);
    const expertClassPts = expertClass === "international" ? 100 : (expertClass === "regional" ? 70 : 40);
    const certPts = Math.min(100, Math.max(1, certCount) * 50);
    const englishPts = english === "Fluent" ? 100 : (english === "Intermediate" ? 70 : 40);

    const gate1Points = Math.min(1000, expPoints + degreePts + expertClassPts + certPts + englishPts);
    const gate1Percentage = Math.round((gate1Points / 1000) * 100);
    cand.gate1Points = gate1Points;
    cand.gate1Percentage = gate1Percentage;
    cand.gate1Breakdown = { expPoints, degreePts, expertClassPts, certPts, englishPts, totalPoints: gate1Points };

    // --------------------------------------------------------------------------
    // CRITERION 2: KNOWLEDGE (35% Weight - Scanning Technical Depth & Rigor)
    // --------------------------------------------------------------------------
    // Academic Qualification (Max 10.0): PhD = 10, Master = 8.5, Bachelor = 7.0
    const kAcademic = degreeLevel === "PhD" ? 10.0 : (degreeLevel === "Master" ? 8.5 : 7.0);
    // Field Engineering Mastery (Max 10.0): >=20 yrs = 10, >=15 yrs = 9.2, >=10 yrs = 8.2, >=5 yrs = 7.0, <5 = 6.0
    const kExp = expYears >= 20 ? 10.0 : (expYears >= 15 ? 9.2 : (expYears >= 10 ? 8.2 : (expYears >= 5 ? 7.0 : 6.0)));
    // International Expert Classification & Global Codes (Max 8.0): International = 8.0, Regional = 6.8, Local = 5.5
    const kClass = expertClass === "international" ? 8.0 : (expertClass === "regional" ? 6.8 : 5.5);
    // Technical Certifications (Max 7.0): >=3 certs = 7.0, 2 certs = 6.2, 1 cert = 5.2, 0 = 4.0
    const kCerts = certCount >= 3 ? 7.0 : (certCount >= 2 ? 6.2 : (certCount >= 1 ? 5.2 : 4.0));
    
    const knowledgeScore = parseFloat((kAcademic + kExp + kClass + kCerts).toFixed(1)); // Max 35.0%

    // --------------------------------------------------------------------------
    // CRITERION 3: DELIVERY (35% Weight - Scanning Course Design & SECI Cases)
    // --------------------------------------------------------------------------
    // Course Portfolio Design (Max 12.0): 7 courses = 12.0, 4-6 courses = 10.5, 1-3 courses = 8.8, 0 = 6.0
    const dCourses = progCount >= 7 ? 12.0 : (progCount >= 4 ? 10.5 : (progCount >= 1 ? 8.8 : 6.0));
    // SECI Field Case Studies (Max 10.0): >15 yrs or Cohort B = 10.0, >=10 yrs = 8.5, <10 yrs = 7.0
    const dCases = (expYears >= 15 || cand.cohort === "Cohort B") ? 10.0 : (expYears >= 10 ? 8.5 : 7.0);
    // Workshop Facilitation & Leadership (Max 8.0): Executive/Advisor = 8.0, Senior = 7.0, Intermediate = 5.8
    const dFacilitation = isExecutive ? 8.0 : (expYears >= 10 ? 7.0 : 5.8);
    // Digital Simulation & Engineering Tools (Max 5.0): High = 5.0, Standard = 4.0
    const dTools = (certCount >= 2 || degreeLevel !== "Bachelor" || expYears >= 12) ? 5.0 : 4.0;

    const deliveryScore = parseFloat((dCourses + dCases + dFacilitation + dTools).toFixed(1)); // Max 35.0%

    // --------------------------------------------------------------------------
    // CRITERION 4: PRESENCE (30% Weight - Scanning Video Pitch & Demeanor)
    // --------------------------------------------------------------------------
    // 120-Second Pitch Video & Delivery (Max 12.0): Verified video = 12.0, valid link = 10.0, none = 7.0
    const pVideo = hasVideo ? 12.0 : (expYears >= 12 ? 10.0 : 7.0);
    // Language Articulation & Clarity (Max 10.0): Fluent = 10.0, Intermediate = 8.0, Basic = 6.0
    const pLang = english === "Fluent" ? 10.0 : (english === "Intermediate" ? 8.0 : 6.0);
    // Executive Demeanor & Availability (Max 8.0): Executive + Available = 8.0, Standard = 6.8
    const pDemeanor = (isExecutive || cand.availability === "Available") ? 8.0 : 6.8;

    const presenceScore = parseFloat((pVideo + pLang + pDemeanor).toFixed(1)); // Max 30.0%

    // --------------------------------------------------------------------------
    // CRITERION 5: TOTAL (100% Scale - Sum of Knowledge + Delivery + Presence)
    // --------------------------------------------------------------------------
    const totalScore = parseFloat((knowledgeScore + deliveryScore + presenceScore).toFixed(1));
    cand.compositeScore = totalScore;
    cand.liveScores = {
        cognitive: Number((knowledgeScore / 3.5).toFixed(1)),
        technical: Number((deliveryScore / 3.5).toFixed(1)),
        interpersonal: Number((presenceScore / 3.0).toFixed(1)),
        p1Weighted: knowledgeScore,
        p2Weighted: deliveryScore,
        p3Weighted: presenceScore
    };

    // Populate individual 19 competencies matrix for transparency
    const scores = {};
    for (let i = 1; i <= 6; i++) {
        scores[i] = Math.min(10, Math.max(6, Math.round((knowledgeScore / 35) * 10)));
    }
    for (let i = 7; i <= 12; i++) {
        scores[i] = Math.min(10, Math.max(6, Math.round((deliveryScore / 35) * 10)));
    }
    for (let i = 13; i <= 19; i++) {
        scores[i] = Math.min(10, Math.max(6, Math.round((presenceScore / 30) * 10)));
    }
    cand.competencyMatrixScores = scores;

    // --------------------------------------------------------------------------
    // CRITERION 6 & 7: ACCREDITED LEVEL / DEGREE & APPROVED DEPLOYMENT SCOPE
    // --------------------------------------------------------------------------
    if (totalScore >= 90.0) {
        cand.tierEn = "Master Trainer / Senior Advisor";
        cand.tierAr = "خبير دولي / فئة النجوم (Master Star)";
        cand.badgeClass = "badge-master";
        cand.allowedAssignmentEn = "Approved to lead senior management programs, strategic workshops, and major sector capital projects";
        cand.allowedAssignmentAr = "تدريب الإدارة العليا، اللجان التوجيهية، ومشاريع الطاقة الكبرى";
        cand.tqiScore = 4.9;
        cand.coursesDelivered = Math.max(cand.coursesDelivered || 0, 18);
        cand.traineesCount = Math.max(cand.traineesCount || 0, 360);
    } else if (totalScore >= 80.0) {
        cand.tierEn = "Certified Senior Trainer";
        cand.tierAr = "مدرب أول محترف معتمد (Senior Trainer)";
        cand.badgeClass = "badge-senior";
        cand.allowedAssignmentEn = "Approved to deliver advanced specialized courses, technical workshops, and professional coaching";
        cand.allowedAssignmentAr = "البرامج التخصصية المتقدمة، وورش العمل الفنية، والكوتشينغ المهني";
        cand.tqiScore = 4.7;
        cand.coursesDelivered = Math.max(cand.coursesDelivered || 0, 12);
        cand.traineesCount = Math.max(cand.traineesCount || 0, 240);
    } else if (totalScore >= 70.0) {
        cand.tierEn = "Associate Trainer";
        cand.tierAr = "مدرب ممارس معتمد (Associate Trainer)";
        cand.badgeClass = "badge-associate";
        cand.allowedAssignmentEn = "Approved to deliver foundational and operational courses under supervision";
        cand.allowedAssignmentAr = "البرامج التأسيسية وتدريب الكوادر التشغيلية تحت إشراف";
        cand.tqiScore = 4.3;
        cand.coursesDelivered = Math.max(cand.coursesDelivered || 0, 6);
        cand.traineesCount = Math.max(cand.traineesCount || 0, 120);
    } else {
        cand.tierEn = "Needs Further Development";
        cand.tierAr = "مسار تطويري وإعادة تأهيل (Deferred)";
        cand.badgeClass = "badge-deferred";
        cand.allowedAssignmentEn = "Recommended to complete a trainer preparation program and reapply after 6 months";
        cand.allowedAssignmentAr = "مسار تطوير وصقل مهارات التدريب مع إعادة التقييم بعد 6 أشهر";
        cand.tqiScore = 3.6;
        cand.coursesDelivered = cand.coursesDelivered || 0;
        cand.traineesCount = cand.traineesCount || 0;
    }

    if (gate1Points >= 750) {
        cand.screeningStatus = totalScore >= 70 ? "Accredited Trainer" : "Development Track";
    } else {
        cand.screeningStatus = "Gate 1 Ineligible";
    }

    return cand;
}

function renderLecturerAssessmentDashboard() {
    const total = AppState.candidates.length;
    const candidates = AppState.candidates;

    const totalEl = document.getElementById("dashTotalCount");
    const passRateEl = document.getElementById("dashPassRateVal");
    const avgScoreEl = document.getElementById("dashAvgScoreVal");
    const masterEl = document.getElementById("dashMasterCountVal");
    const seniorEl = document.getElementById("dashSeniorCountVal");
    const associateEl = document.getElementById("dashAssociateCountVal");

    const p1ValEl = document.getElementById("dashPillar1Val");
    const p1BarEl = document.getElementById("dashPillar1Bar");
    const p2ValEl = document.getElementById("dashPillar2Val");
    const p2BarEl = document.getElementById("dashPillar2Bar");
    const p3ValEl = document.getElementById("dashPillar3Val");
    const p3BarEl = document.getElementById("dashPillar3Bar");

    if (total === 0) {
        if (totalEl) totalEl.textContent = "0";
        if (passRateEl) passRateEl.textContent = "0%";
        if (avgScoreEl) avgScoreEl.textContent = "0.0%";
        if (masterEl) masterEl.textContent = "0";
        if (seniorEl) seniorEl.textContent = "0";
        if (associateEl) associateEl.textContent = "0";
        if (p1ValEl) p1ValEl.textContent = "0.0% / 35.0%";
        if (p1BarEl) p1BarEl.style.width = "0%";
        if (p2ValEl) p2ValEl.textContent = "0.0% / 35.0%";
        if (p2BarEl) p2BarEl.style.width = "0%";
        if (p3ValEl) p3ValEl.textContent = "0.0% / 30.0%";
        if (p3BarEl) p3BarEl.style.width = "0%";
        return;
    }

    const accreditedCount = candidates.filter(c => (c.compositeScore || 0) >= 70).length;
    const passRate = Math.round((accreditedCount / total) * 100);
    const avgScore = (candidates.reduce((sum, c) => sum + (c.compositeScore || 0), 0) / total).toFixed(1);

    const masterCount = candidates.filter(c => (c.compositeScore || 0) >= 90).length;
    const seniorCount = candidates.filter(c => (c.compositeScore || 0) >= 80 && (c.compositeScore || 0) < 90).length;
    const associateCount = candidates.filter(c => (c.compositeScore || 0) >= 70 && (c.compositeScore || 0) < 80).length;

    let p1Total = 0, p2Total = 0, p3Total = 0;
    candidates.forEach(c => {
        const p1 = c.liveScores?.p1Weighted ?? ((c.compositeScore || 80) * 0.35);
        const p2 = c.liveScores?.p2Weighted ?? ((c.compositeScore || 80) * 0.35);
        const p3 = c.liveScores?.p3Weighted ?? ((c.compositeScore || 80) * 0.30);
        p1Total += Number(p1);
        p2Total += Number(p2);
        p3Total += Number(p3);
    });
    const p1Avg = (p1Total / total).toFixed(1);
    const p2Avg = (p2Total / total).toFixed(1);
    const p3Avg = (p3Total / total).toFixed(1);

    if (totalEl) totalEl.textContent = total;
    if (passRateEl) passRateEl.textContent = `${passRate}%`;
    if (avgScoreEl) avgScoreEl.textContent = `${avgScore}%`;
    if (masterEl) masterEl.textContent = masterCount;
    if (seniorEl) seniorEl.textContent = seniorCount;
    if (associateEl) associateEl.textContent = associateCount;

    if (p1ValEl) p1ValEl.textContent = `${p1Avg}% / 35.0%`;
    if (p1BarEl) p1BarEl.style.width = `${Math.min(100, Math.round((p1Avg / 35) * 100))}%`;

    if (p2ValEl) p2ValEl.textContent = `${p2Avg}% / 35.0%`;
    if (p2BarEl) p2BarEl.style.width = `${Math.min(100, Math.round((p2Avg / 35) * 100))}%`;

    if (p3ValEl) p3ValEl.textContent = `${p3Avg}% / 30.0%`;
    if (p3BarEl) p3BarEl.style.width = `${Math.min(100, Math.round((p3Avg / 30) * 100))}%`;
}

function renderScreeningTable() {
    const tbody = document.getElementById("screeningTableBody");
    if (!tbody) return;

    const isAr = AppState.currentLang === "ar";
    tbody.innerHTML = "";

    renderLecturerAssessmentDashboard();

    if (AppState.candidates.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <div style="font-size: 2rem; color: var(--gold-bright); margin-bottom: 0.75rem;">
                        <i class="fa-solid fa-folder-open"></i>
                    </div>
                    <div style="font-size: 1.1rem; font-weight: 600; color: #FFFFFF; margin-bottom: 0.35rem;">
                        ${isAr ? 'لا يوجد متقدمون مسجلون حالياً' : 'No Applicants Registered Yet'}
                    </div>
                    <div style="font-size: 0.85rem; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                        ${isAr 
                            ? 'يمكنك النقر على زر <strong style="color: var(--gold-bright);">"تحميل وتقييم عينة مرشحي القطاع (13 تخصصاً)"</strong> أعلاه لعرض لوحة المؤشرات والجدول كاملاً فورياً، أو تسجيل متقدم جديد عبر <a href="javascript:void(0)" onclick="switchRoleView(\'applicantView\')" style="color: var(--gold-bright); text-decoration: underline; font-weight: 600;">استمارة التسجيل</a>.' 
                            : 'Click <strong style="color: var(--gold-bright);">"Load & Evaluate Sector Sample Applicants (13 Disciplines)"</strong> above to test the dashboard, or register a new applicant in the <a href="javascript:void(0)" onclick="switchRoleView(\'applicantView\')" style="color: var(--gold-bright); text-decoration: underline; font-weight: 600;">Registration Form</a>.'}
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const filterTier = AppState.activeEvalTierFilter || "all";
    const searchQ = (AppState.evalSearchQuery || "").toLowerCase();

    const filtered = AppState.candidates.filter(c => {
        if (filterTier === "master" && (c.compositeScore || 0) < 90) return false;
        if (filterTier === "senior" && ((c.compositeScore || 0) < 80 || (c.compositeScore || 0) >= 90)) return false;
        if (filterTier === "associate" && ((c.compositeScore || 0) < 70 || (c.compositeScore || 0) >= 80)) return false;
        if (filterTier === "deferred" && (c.compositeScore || 0) >= 70) return false;

        if (searchQ) {
            const matchName = (c.fullNameEn || "").toLowerCase().includes(searchQ) || (c.fullNameAr || "").toLowerCase().includes(searchQ);
            const matchCompany = (c.company || "").toLowerCase().includes(searchQ);
            const matchDomain = (c.domainEn || "").toLowerCase().includes(searchQ) || (c.domainAr || "").toLowerCase().includes(searchQ);
            const matchCode = (c.code || "").toLowerCase().includes(searchQ);
            if (!matchName && !matchCompany && !matchDomain && !matchCode) return false;
        }

        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
                    <i class="fa-solid fa-filter-circle-xmark" style="font-size: 1.5rem; color: var(--gold-bright); margin-bottom: 0.5rem; display: block;"></i>
                    ${isAr ? 'لا توجد نتائج مطابقة لمعايير الفلترة المحددة' : 'No applicants match the selected filter'}
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(cand => {
        const tr = document.createElement("tr");

        const name = isAr ? cand.fullNameAr : cand.fullNameEn;
        const domain = isAr ? cand.domainAr : cand.domainEn;
        const sub = isAr ? cand.subDisciplineAr : cand.subDisciplineEn;
        const jobTitleHtml = cand.jobTitle ? `<br><small style="color: var(--gold-bright); font-weight: 500;">${cand.jobTitle}</small>` : "";

        const g1Pts = cand.gate1Points ?? 0;
        const g1Pct = cand.gate1Percentage ?? Math.round(g1Pts / 10);
        const g1Passed = g1Pts >= 750;

        const p1Score = cand.liveScores?.p1Weighted ?? ((cand.compositeScore || 80) * 0.35).toFixed(1);
        const p2Score = cand.liveScores?.p2Weighted ?? ((cand.compositeScore || 80) * 0.35).toFixed(1);
        const p3Score = cand.liveScores?.p3Weighted ?? ((cand.compositeScore || 80) * 0.30).toFixed(1);

        const composite = Number(cand.compositeScore || 0);
        let scoreClass = "deferred";
        if (composite >= 90) scoreClass = "master";
        else if (composite >= 80) scoreClass = "senior";
        else if (composite >= 70) scoreClass = "associate";

        const tierName = isAr ? (cand.tierAr || "مدرب ممارس") : (cand.tierEn || "Associate Trainer");
        const badgeClass = cand.badgeClass || (composite >= 90 ? "badge-master" : (composite >= 80 ? "badge-senior" : "badge-associate"));
        const scope = isAr ? (cand.allowedAssignmentAr || "تدريب البرامج التخصصية") : (cand.allowedAssignmentEn || "Delivering specialized courses");

        tr.innerHTML = `
            <td style="text-align: center;"><span class="candidate-id-code">${cand.code}</span></td>
            <td><strong>${name}</strong>${jobTitleHtml}</td>
            <td>${cand.company}</td>
            <td>${domain} <br><small style="color: var(--text-muted);">${sub || ''}</small></td>
            <td style="text-align: center;">
                <span class="score-badge ${g1Passed ? 'high' : 'low'}" style="font-size: 0.78rem;" title="${isAr ? 'مسح بوابة 1: سنوات الخبرة (40/سنة) + المؤهل + التصنيف + الشهادات + الإنجليزية' : 'Gate 1 Scanned: Experience (40/yr) + Degree + Class + Certs + English'}">
                    ${g1Pts} <small>(${g1Pct}%)</small>
                </span>
            </td>
            <td style="text-align: center; color: #93C5FD; font-weight: 700;" title="${isAr ? 'المعرفة (35%): مسح المؤهل الأكاديمي، سنوات الخبرة، التصنيف الدولي، والشهادات المعتمدة' : 'Knowledge (35%): Scanned Academic Degree, Experience Years, Global Class, and Certifications'}">${p1Score}%</td>
            <td style="text-align: center; color: var(--gold-bright); font-weight: 700;" title="${isAr ? 'التدريب (35%): مسح حقائب البرامج الـ 7، دراسات حالة SECI، والمحاكاة الهندسية' : 'Delivery (35%): Scanned Top 7 Courses, SECI Case Studies, and Engineering Simulation'}">${p2Score}%</td>
            <td style="text-align: center; color: #6EE7B7; font-weight: 700;" title="${isAr ? 'الحضور (30%): مسح فيديو العرض (120 ثانية)، إتقان الإنجليزية، والوقار التنفيذي' : 'Presence (30%): Scanned 120s Pitch Video, English Articulation, and Executive Demeanor'}">${p3Score}%</td>
            <td style="text-align: center;">
                <span class="eval-score-pill ${scoreClass}" title="${isAr ? 'المجموع الكلي = المعرفة (35%) + التدريب (35%) + الحضور (30%)' : 'Total Score = Knowledge (35%) + Delivery (35%) + Presence (30%)'}">
                    ${composite.toFixed(1)}%
                </span>
            </td>
            <td style="text-align: center;">
                <span class="tier-tag ${badgeClass}" style="font-size: 0.75rem; white-space: nowrap;">
                    ${tierName}
                </span>
            </td>
            <td style="font-size: 0.78rem; color: #CBD5E1; max-width: 240px;">${scope}</td>
            <td style="text-align: center; white-space: nowrap;">
                <div style="display: inline-flex; gap: 0.35rem; align-items: center; justify-content: center;">
                    <button class="btn-primary-gold" style="padding: 0.35rem 0.65rem; font-size: 0.74rem;" onclick="loadCandidateForEvaluation('${cand.id}')" title="${isAr ? 'عرض في استمارة التحكيم' : 'Review in Rubric'}">
                        <i class="fa-solid fa-clipboard-check"></i> ${isAr ? 'تقييم' : 'Rubric'}
                    </button>
                    <a href="${cand.registrationDetails?.cvUrl || 'assets/Template%20Form%20for%20Expert%20Registration.docx'}" download="${cand.registrationDetails?.cvFileName || cand.code + '_CV.docx'}" class="btn-outline-gold" style="padding: 0.35rem 0.55rem; font-size: 0.74rem; text-decoration: none;" title="${isAr ? 'تحميل السيرة الذاتية' : 'Download CV'}">
                        <i class="fa-solid fa-file-arrow-down"></i> CV
                    </a>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

async function runAutomatedEvaluationForAll() {
    const isAr = AppState.currentLang === "ar";
    if (AppState.candidates.length === 0) {
        showToast(isAr 
            ? "لا يوجد متقدمون حالياً. يمكنك النقر على 'تحميل عينة مرشحي القطاع' لتجربة التقييم الآلي!" 
            : "No applicants registered yet. Click 'Load Sector Sample Applicants' to test automated evaluation!");
        return;
    }

    // Evaluate every applicant in the database end-to-end
    for (const cand of AppState.candidates) {
        evaluateCandidateEndToEnd(cand);
        await DbService.updateCandidate(cand.id, {
            gate1Points: cand.gate1Points,
            gate1Percentage: cand.gate1Percentage,
            gate1Breakdown: cand.gate1Breakdown,
            competencyMatrixScores: cand.competencyMatrixScores,
            liveScores: cand.liveScores,
            compositeScore: cand.compositeScore,
            tierEn: cand.tierEn,
            tierAr: cand.tierAr,
            badgeClass: cand.badgeClass,
            allowedAssignmentEn: cand.allowedAssignmentEn,
            allowedAssignmentAr: cand.allowedAssignmentAr,
            tqiScore: cand.tqiScore,
            coursesDelivered: cand.coursesDelivered,
            traineesCount: cand.traineesCount,
            screeningStatus: cand.screeningStatus
        });
    }

    renderLecturerAssessmentDashboard();
    renderScreeningTable();
    updateExecutiveKpiMetrics();
    renderSkillsBank();
    updateEvaluatingCandidateDisplay();

    showToast(isAr
        ? `تم تقييم كافة المتقدمين (${AppState.candidates.length}) آلياً وفق معايير المحاضرين الـ 19 واعتماد درجاتهم بنجاح!`
        : `Successfully evaluated all ${AppState.candidates.length} applicants end-to-end and accredited their levels!`);
}

async function loadBenchmarkCandidates() {
    const isAr = AppState.currentLang === "ar";
    if (typeof BENCHMARK_SECTOR_CANDIDATES === "undefined" || !Array.isArray(BENCHMARK_SECTOR_CANDIDATES)) return;

    for (const bCand of BENCHMARK_SECTOR_CANDIDATES) {
        const exists = AppState.candidates.some(c => c.id === bCand.id || c.code === bCand.code);
        if (!exists) {
            const evaluated = evaluateCandidateEndToEnd({ ...bCand });
            AppState.candidates.push(evaluated);
            await DbService.saveCandidate(evaluated);
        }
    }

    await runAutomatedEvaluationForAll();
    showToast(isAr
        ? "تم تحميل عينة مرشحي قطاع البترول (13 تخصصاً) وتقييمهم آلياً بنجاح!"
        : "Loaded 13 benchmark applicants across all petroleum specialties and evaluated them successfully!");
}

function initScreeningControls() {
    const btnAutoEval = document.getElementById("btnRunAutoEvaluationAll");
    if (btnAutoEval) {
        btnAutoEval.addEventListener("click", () => {
            runAutomatedEvaluationForAll();
        });
    }

    const btnLoadBench = document.getElementById("btnLoadBenchmarkCandidates");
    if (btnLoadBench) {
        btnLoadBench.addEventListener("click", () => {
            loadBenchmarkCandidates();
        });
    }

    // Tier Filter Pills
    const filterWrap = document.getElementById("evalTierFilterWrap");
    if (filterWrap) {
        filterWrap.querySelectorAll(".filter-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                filterWrap.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                AppState.activeEvalTierFilter = pill.getAttribute("data-evaltier") || "all";
                renderScreeningTable();
            });
        });
    }

    // Live Search
    const searchInput = document.getElementById("evalTableSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            AppState.evalSearchQuery = (e.target.value || "").trim().toLowerCase();
            renderScreeningTable();
        });
    }
}

// Global hook for selecting candidate
window.loadCandidateForEvaluation = function(candidateId) {
    AppState.activeEvaluatingCandidateId = candidateId;
    updateEvaluatingCandidateDisplay();
    showToast("Evaluating: " + candidateId);

    // Scroll to Gate 1 Live Indicator & Video Reviewer in Committee View
    const gate1Widget = document.getElementById("committeeGate1Widget") || document.getElementById("videoReviewerSection");
    if (gate1Widget) {
        gate1Widget.scrollIntoView({ behavior: "smooth" });
    }
};

function updateEvaluatingCandidateDisplay() {
    const isAr = AppState.currentLang === "ar";
    const label = document.getElementById("activeEvaluatingCandidateLabel");
    const cand = AppState.candidates.find(c => c.id === AppState.activeEvaluatingCandidateId) || AppState.candidates[0];

    const gate1CandNameEl = document.getElementById("committeeGate1CandidateName");
    const calcExp = document.getElementById("calcExpPts");
    const calcDeg = document.getElementById("calcDegreePts");
    const calcExpClass = document.getElementById("calcExpertClassPts");
    const calcCert = document.getElementById("calcCertPts");
    const calcEng = document.getElementById("calcEnglishPts");
    const liveEst = document.getElementById("liveEstimatedPoints");
    const statusEl = document.getElementById("liveReadinessStatus");

    if (!cand) {
        if (label) {
            label.textContent = isAr 
                ? 'لا يوجد مرشح قيد التحكيم حالياً (يرجى اختيار مرشح من جدول الفرز أو تقديم مرشح جديد)' 
                : 'No applicant selected for review (Please select an applicant from the list above or register a new one)';
        }
        if (gate1CandNameEl) {
            gate1CandNameEl.innerHTML = `<i class="fa-solid fa-user-clock"></i> <span>${isAr ? 'في انتظار تقديم المرشح لعرض المؤشر الفوري لبوابة 1 (من 1000 نقطة)' : 'Waiting for an applicant to be registered to show the Gate 1 Score (Out of 1000 Points)'}</span>`;
        }
        if (calcExp) calcExp.textContent = "0 pts";
        if (calcDeg) calcDeg.textContent = "0 pts";
        if (calcExpClass) calcExpClass.textContent = "0 pts";
        if (calcCert) calcCert.textContent = "0 pts";
        if (calcEng) calcEng.textContent = "0 pts";
        if (liveEst) liveEst.textContent = "0";
        if (statusEl) {
            statusEl.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${isAr ? 'يظهر الحساب الفوري لمعايير القبول المبدئي هنا عن كل متقدم بعد التقديم' : 'The initial qualification score breakdown will appear here as soon as an applicant submits the registration form'}`;
            statusEl.style.color = "var(--gold-bright)";
        }
        renderCandidateRegistrationSummary(null);
        renderXpertgateCompetencyMatrix();
        calculateSimulationRubric();
        return;
    }

    const name = isAr ? cand.fullNameAr : cand.fullNameEn;
    const jobTitleStr = cand.jobTitle ? ` • ${cand.jobTitle}` : "";

    if (label) {
        label.textContent = `${isAr ? 'جاري تحكيم المرشح:' : 'Currently Reviewing:'} ${cand.code} - ${name}${jobTitleStr} (${cand.company})`;
    }

    // Populate Gate 1 Live Indicator widget in Committee Evaluation Page
    const expPoints = cand.gate1Breakdown?.expPoints ?? Math.min((cand.experienceYears || 0) * 40, 600);
    const degreePts = cand.gate1Breakdown?.degreePts ?? (cand.degreeLevel === "PhD" ? 100 : (cand.degreeLevel === "Master" ? 70 : 40));
    const expertClassPts = cand.gate1Breakdown?.expertClassPts ?? (cand.expertClassification === "international" ? 100 : (cand.expertClassification === "regional" ? 70 : 40));
    const certPts = cand.gate1Breakdown?.certPts ?? Math.min(100, (cand.certs?.length || 1) * 50);
    const englishPts = cand.gate1Breakdown?.englishPts ?? (cand.englishProficiency === "Fluent" ? 100 : (cand.englishProficiency === "Intermediate" ? 70 : 40));
    const totalPts = cand.gate1Points ?? Math.min(1000, expPoints + degreePts + expertClassPts + certPts + englishPts);

    if (gate1CandNameEl) {
        gate1CandNameEl.innerHTML = `<i class="fa-solid fa-user-check"></i> <span>${cand.code} — ${name}${jobTitleStr} (${cand.company})</span>`;
    }
    if (calcExp) calcExp.textContent = `${expPoints} pts`;
    if (calcDeg) calcDeg.textContent = `${degreePts} pts`;
    if (calcExpClass) calcExpClass.textContent = `${expertClassPts} pts`;
    if (calcCert) calcCert.textContent = `${certPts} pts`;
    if (calcEng) calcEng.textContent = `${englishPts} pts`;
    if (liveEst) liveEst.textContent = totalPts;

    if (statusEl) {
        if (totalPts >= 850) {
            statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'جاهزية استثنائية لبوابة 1 (مسار سريع)' : 'High Qualification Score — Fast-Track Candidate'}`;
            statusEl.style.color = "var(--color-success)";
        } else if (totalPts >= 750) {
            statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'مؤهل لاجتياز بوابة 1 والمحاكاة الحية (≥ 750 نقطة)' : 'Qualified for Gate 1 & Live Presentation (≥ 750 Points)'}`;
            statusEl.style.color = "var(--gold-bright)";
        } else {
            statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${isAr ? 'أقل من حد التأهيل (يتطلب 750 نقطة كحد أدنى)' : 'Below Minimum Requirement (750 Points Needed)'}`;
            statusEl.style.color = "var(--color-warning)";
        }
    }

    // Update video source & active download / external link buttons (120s cap)
    const rawVideoUrl = cand.pitchVideoUrl || "video/sample-video.mp4";
    const cleanVideoUrl = rawVideoUrl.split("#")[0];
    const player = document.getElementById("pitchVideoPlayer");
    if (player) {
        player.src = `${cleanVideoUrl}#t=0,120`;
    }

    const btnDownloadPitch = document.getElementById("btnDownloadPitchVideo");
    if (btnDownloadPitch) {
        btnDownloadPitch.href = cleanVideoUrl.startsWith("/uploads/") ? `${cleanVideoUrl}?download=1` : cleanVideoUrl;
        btnDownloadPitch.setAttribute("download", `${cand.code}_Pitch_120s.mp4`);
    }

    const btnOpenExt = document.getElementById("btnOpenExternalVideo");
    if (btnOpenExt) {
        btnOpenExt.href = cleanVideoUrl;
    }

    // Load candidate's 19-Competency Matrix scores into AppState.currentMatrixScores
    if (cand.competencyMatrixScores && typeof cand.competencyMatrixScores === "object" && Object.keys(cand.competencyMatrixScores).length > 0) {
        AppState.currentMatrixScores = { ...cand.competencyMatrixScores };
    } else {
        const defaultScore = cand.compositeScore >= 90 ? 10 : (cand.compositeScore >= 75 ? 8 : 6);
        const scoresObj = {};
        for (let i = 1; i <= 19; i++) {
            scoresObj[i] = defaultScore;
        }
        AppState.currentMatrixScores = scoresObj;
    }

    renderCandidateRegistrationSummary(cand);
    renderPhysicalAssessmentSheet(cand);
}

function renderCandidateRegistrationSummary(cand) {
    const container = document.getElementById("committeeCandidateRegistrationSummary");
    if (!container) return;

    const isAr = AppState.currentLang === "ar";

    if (!cand) {
        container.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.75); border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                    <i class="fa-solid fa-file-lines" style="font-size: 1.5rem; color: var(--gold-bright);"></i>
                    <div>
                        <div style="font-weight: 700; color: #FFFFFF; font-size: 0.92rem;">
                            ${isAr ? 'ملف استمارة التسجيل الكامل للمرشح (Template Form for Expert Registration)' : 'Submitted Applicant Registration Summary'}
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
                            ${isAr ? 'بمجرد تقديم المتقدم للاستمارة في بوابة المتقدمين، تظهر هنا كافة حقول الاستمارة والـ 7 برامج تدريبية والشهادات ورابط الفيديو للمطابقة مع مصفوفة الجدارات.' : 'Once an applicant submits the registration form, their full details, uploaded CV, 7 proposed courses, certificates, and video link will appear here for the committee.'}
                        </div>
                    </div>
                </div>
                <a href="assets/Template%20Form%20for%20Expert%20Registration.docx" download="Template_Form_for_Expert_Registration.docx" class="btn-outline-gold" style="padding: 0.45rem 0.9rem; font-size: 0.78rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                    <i class="fa-solid fa-file-word"></i>
                    <span>${isAr ? 'تحميل نموذج استمارة التسجيل (DOCX)' : 'Download Blank Registration Form (Word)'}</span>
                </a>
            </div>
        `;
        return;
    }

    const reg = cand.registrationDetails || {};
    const name = isAr ? cand.fullNameAr : cand.fullNameEn;
    const domain = isAr ? cand.domainAr : cand.domainEn;
    const sub = isAr ? cand.subDisciplineAr : cand.subDisciplineEn;
    const programs = Array.isArray(reg.programs) && reg.programs.length > 0
        ? reg.programs
        : [
            `${domain} — Foundation & Standards`,
            `${sub} — Practical Field Operations`,
            `Safety & Risk Management in ${domain}`,
            `Problem-Solving & Root Cause Analysis`,
            `Applying International Standards (API / ASME / ISO)`,
            `Digital Tools & Performance Improvement in ${sub}`,
            `Practical Case Studies & Field Lessons Learned`
        ];

    const bscStr = reg.bsc ? `${reg.bsc.field || '-'} (${reg.bsc.university || '-'}, ${reg.bsc.year || '-'})` : cand.degreeEn || 'B.Sc.';
    const mscStr = reg.msc && (reg.msc.field || reg.msc.university) ? `${reg.msc.field || '-'} (${reg.msc.university || '-'}, ${reg.msc.year || '-'})` : (isAr ? 'غير مسجل' : 'None');
    const phdStr = reg.phd && (reg.phd.field || reg.phd.university) ? `${reg.phd.field || '-'} (${reg.phd.university || '-'}, ${reg.phd.year || '-'})` : (isAr ? 'غير مسجل' : 'None');

    const rawVideo = cand.pitchVideoUrl || "video/sample-video.mp4";
    const cleanVideo = rawVideo.split("#")[0];
    const cvUrl = reg.cvUrl || "";
    const cvFileName = reg.cvFileName || `${cand.code}_CV.pdf`;

    container.innerHTML = `
        <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 12px; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.85rem; margin-bottom: 1rem;">
                <div>
                    <span style="background: rgba(212, 175, 55, 0.2); color: var(--gold-bright); padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">
                        <i class="fa-solid fa-id-card-clip"></i> ${cand.code}
                    </span>
                    <strong style="color: #FFFFFF; font-size: 1rem; margin-inline-start: 0.5rem;">
                        ${isAr ? 'ملف استمارة التسجيل المقدم من المرشح:' : 'Applicant Registration Summary:'} ${name}
                    </strong>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${cvUrl ? `
                    <a href="${cvUrl.startsWith('/uploads/') ? cvUrl + '?download=1' : cvUrl}" download="${cvFileName}" target="_blank" class="btn-primary-gold" style="padding: 0.35rem 0.8rem; font-size: 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                        <i class="fa-solid fa-file-arrow-down"></i>
                        <span>${isAr ? 'تحميل السيرة الذاتية للمرشح (CV)' : 'Download Applicant CV'} (${cvFileName})</span>
                    </a>
                    ` : `
                    <span style="background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); color: var(--gold-bright); padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                        <i class="fa-solid fa-file-pdf"></i>
                        <span>${isAr ? 'مرفق السيرة الذاتية:' : 'Attached CV:'} ${cvFileName}</span>
                    </span>
                    `}
                    <a href="${cleanVideo.startsWith('/uploads/') ? cleanVideo + '?download=1' : cleanVideo}" download="${cand.code}_Pitch_120s.mp4" target="_blank" class="btn-outline-gold" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; color: #34D399; border-color: rgba(16, 185, 129, 0.45);">
                        <i class="fa-solid fa-video"></i>
                        <span>${isAr ? 'تحميل فيديو الـ 120 ثانية للمرشح' : 'Download 2-Min Intro Video'}</span>
                    </a>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.85rem; font-size: 0.82rem; margin-bottom: 1rem;">
                <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="color: var(--gold-bright); font-weight: 700; margin-bottom: 0.35rem;"><i class="fa-solid fa-address-book"></i> ${isAr ? 'بيانات التواصل والعمل' : 'Contact & Work Info'}</div>
                    <div><strong>${isAr ? 'الشركة والإدارة:' : 'Company & Dept:'}</strong> ${cand.company} ${reg.department ? '— ' + reg.department : ''}</div>
                    <div><strong>${isAr ? 'المنصب الحالي:' : 'Job Title:'}</strong> ${cand.jobTitle || '-'}</div>
                    <div><strong>${isAr ? 'البريد والهاتف:' : 'Email & Phone:'}</strong> ${cand.email || '-'} | ${reg.phone || '-'}</div>
                    <div><strong>${isAr ? 'بريد HR والتفرغ:' : 'HR Email & Availability:'}</strong> ${reg.hrEmail || '-'} (${reg.availability || 'Available'})</div>
                </div>

                <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="color: var(--gold-bright); font-weight: 700; margin-bottom: 0.35rem;"><i class="fa-solid fa-graduation-cap"></i> ${isAr ? 'المؤهلات الأكاديمية الرسمية' : 'University Degrees'}</div>
                    <div><strong>${isAr ? 'البكالوريوس:' : "Bachelor's:"}</strong> ${bscStr}</div>
                    <div><strong>${isAr ? 'الماجستير:' : "Master's:"}</strong> ${mscStr}</div>
                    <div><strong>${isAr ? 'الدكتوراه:' : 'PhD:'}</strong> ${phdStr}</div>
                    <div><strong>${isAr ? 'الخبرة واللغة:' : 'Experience & English:'}</strong> ${cand.experienceYears} ${isAr ? 'سنة' : 'Yrs'} | ${cand.englishProficiency || 'Fluent'}</div>
                </div>

                <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="color: var(--gold-bright); font-weight: 700; margin-bottom: 0.35rem;"><i class="fa-solid fa-award"></i> ${isAr ? 'الشهادات المهنية والدولية والسيرة الذاتية' : 'Certificates & CV'}</div>
                    <div><strong>${isAr ? 'السيرة الذاتية (CV):' : 'Uploaded CV:'}</strong> <span style="color: #34D399; font-weight: 700;">${cvFileName}</span></div>
                    <div><strong>${isAr ? 'الشهادات المعتمدة:' : 'Certificates:'}</strong> ${(cand.certs || []).join(", ") || '-'}</div>
                    <div><strong>${isAr ? 'شهادة دولية / بترولية:' : 'International / Industry Cert:'}</strong> ${reg.intlCerts?.area || '-'} / ${reg.sophCerts?.area || '-'}</div>
                    <div><strong>${isAr ? 'التوقيع والإقرار:' : 'Applicant Signature:'}</strong> ${reg.signature || name} <i class="fa-solid fa-circle-check" style="color: #34D399;"></i></div>
                </div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #34D399; margin-bottom: 0.45rem;">
                    <i class="fa-solid fa-list-ol"></i> ${isAr ? 'قائمة الـ 7 برامج تدريبية الاحترافية المقدمة من المرشح في تخصصه:' : '7 Training Courses Proposed by the Applicant:'}
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.4rem; font-size: 0.78rem; color: #E2E8F0;">
                    ${programs.map((p, idx) => `<div><span style="color: var(--gold-bright); font-weight: 700;">#${idx + 1}:</span> ${p}</div>`).join("")}
                </div>
            </div>
        </div>
    `;
}

function initBlindReviewer() {
    const toggle = document.getElementById("blindModeCheckbox");
    const overlay = document.getElementById("blindOverlayMask");

    if (toggle && overlay) {
        toggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                overlay.classList.add("active");
            } else {
                overlay.classList.remove("active");
            }
        });
    }

    // Enforce 120-second (2-minute) playback cap on the pitch video player
    const player = document.getElementById("pitchVideoPlayer");
    if (player) {
        player.addEventListener("timeupdate", () => {
            if (player.currentTime >= 120) {
                player.pause();
                player.currentTime = 120;
            }
        });
    }

    // Criteria anchor button selection for the 120s video pitch widget
    document.querySelectorAll(".eval-criteria-item").forEach(item => {
        const buttons = item.querySelectorAll(".anchor-btn");
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                buttons.forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                
                const score = btn.getAttribute("data-score");
                const valDisplay = item.querySelector("[id^='score']");
                if (valDisplay) {
                    valDisplay.textContent = `${score}/10`;
                }
            });
        });
    });

    const btnAdvance = document.getElementById("btnAdvanceSimulation");
    if (btnAdvance) {
        btnAdvance.addEventListener("click", async () => {
            const cand = AppState.candidates.find(c => c.id === AppState.activeEvaluatingCandidateId);
            if (cand) {
                cand.screeningStatus = "Shortlisted";
                if (!cand.blindScores) cand.blindScores = {};
                cand.blindScores.decision = "Advance";
                await DbService.updateCandidate(cand.id, {
                    screeningStatus: cand.screeningStatus,
                    blindScores: cand.blindScores
                });
                renderScreeningTable();
                updateExecutiveKpiMetrics();
                showToast("toastAdvanced");
            }
        });
    }

    const btnRegret = document.getElementById("btnRegretCandidate");
    if (btnRegret) {
        btnRegret.addEventListener("click", async () => {
            const cand = AppState.candidates.find(c => c.id === AppState.activeEvaluatingCandidateId);
            if (cand) {
                cand.screeningStatus = "Needs Development";
                if (!cand.blindScores) cand.blindScores = {};
                cand.blindScores.decision = "Regret";
                await DbService.updateCandidate(cand.id, {
                    screeningStatus: cand.screeningStatus,
                    blindScores: cand.blindScores
                });
                renderScreeningTable();
                updateExecutiveKpiMetrics();
                showToast(AppState.currentLang === "ar" ? "تم تحويل المرشح إلى مسار إعادة التأهيل والتطوير." : "Applicant status updated to: Needs Development.");
            }
        });
    }
}

// ==============================================================================
// OFFICIAL 19-COMPETENCY XPERTGATE EVALUATION MATRIX (COMMITTEE RUBRIC)
// ==============================================================================
function ensureDefaultMatrixScores() {
    if (!AppState.currentMatrixScores || typeof AppState.currentMatrixScores !== "object") {
        AppState.currentMatrixScores = {};
    }
    for (let i = 1; i <= 19; i++) {
        if (![10, 8, 6].includes(Number(AppState.currentMatrixScores[i]))) {
            AppState.currentMatrixScores[i] = 8;
        }
    }
}

window.setMatrixCompetencyScore = function(compId, scoreVal) {
    ensureDefaultMatrixScores();
    AppState.currentMatrixScores[compId] = Number(scoreVal);

    // Update buttons UI in that row without re-rendering full DOM
    const rowEl = document.getElementById(`matrixCompRow_${compId}`);
    if (rowEl) {
        rowEl.querySelectorAll(".matrix-score-btn").forEach(btn => {
            const s = Number(btn.getAttribute("data-score"));
            btn.classList.toggle("active", s === Number(scoreVal));
        });
        const weight = Number(rowEl.getAttribute("data-weight") || 5);
        const weightedVal = ((Number(scoreVal) / 10) * weight).toFixed(2);
        const badgeEl = document.getElementById(`matrixCompWeighted_${compId}`);
        if (badgeEl) {
            badgeEl.textContent = `${weightedVal}% / ${weight}%`;
        }
    }

    calculateSimulationRubric();
};

window.setAllMatrixCompetencyScores = function(scoreVal) {
    ensureDefaultMatrixScores();
    for (let i = 1; i <= 19; i++) {
        AppState.currentMatrixScores[i] = Number(scoreVal);
    }
    renderXpertgateCompetencyMatrix();
    calculateSimulationRubric();
};

// ==============================================================================
// COMMITTEE RUBRIC CRITERIA LOADER (XG_COMMITTEE_MATRIX: 5 Criteria × 3 Items)
// Source: دليل مصفوفة الجدارات لتقييم المدربين XpertGate.docx
// ==============================================================================
// OFFICIAL PHYSICAL IN-PERSON TRAINER ASSESSMENT SHEET (100% - 15 MIN PRESENTATION)
// Rebuilt directly from: competencies matrix.docx
// 5 Criteria × 3 Sub-items (15 Items), Scale 1-5, Weights: 25% / 20% / 25% / 15% / 15%
// Strict Exclusion Rule: Any score ≤ 2 in Item 1.1 or Item 2.2 = DIRECT DISQUALIFICATION
// ==============================================================================

function renderPhysicalAssessmentSheet(cand) {
    const container = document.getElementById("xpertgateCompetencyMatrixContainer");
    if (!container) return;

    if (!cand) {
        cand = AppState.candidates.find(c => c.id === AppState.activeEvaluatingCandidateId) || AppState.candidates[0];
    }

    // Initialize scores for candidate if not already set
    if (!AppState.rubricScores) AppState.rubricScores = {};
    if (cand && cand.committeeRubricScores && typeof cand.committeeRubricScores === "object" && Object.keys(cand.committeeRubricScores).length > 0) {
        AppState.rubricScores = { ...cand.committeeRubricScores };
    } else {
        // Default benchmark scores
        const defScore = (cand && cand.compositeScore >= 90) ? 5 : (cand && cand.compositeScore >= 75 ? 4 : 3);
        if (typeof XG_COMMITTEE_MATRIX !== "undefined" && XG_COMMITTEE_MATRIX.criteria) {
            XG_COMMITTEE_MATRIX.criteria.forEach(c => c.items.forEach(it => {
                if (AppState.rubricScores[it.id] === undefined) {
                    AppState.rubricScores[it.id] = defScore;
                }
            }));
        }
    }

    const isAr = AppState.currentLang === "ar";
    const candName = cand ? (isAr ? cand.fullNameAr : cand.fullNameEn) : (isAr ? "لم يتم اختيار مرشح" : "No Candidate Selected");
    const candCode = cand ? cand.code : "XP-0000";
    const candCompany = cand ? cand.company : "ENPPI";

    // Build the 5 Criteria Sections
    let criteriaCardsHtml = "";
    if (typeof XG_COMMITTEE_MATRIX !== "undefined" && XG_COMMITTEE_MATRIX.criteria) {
        criteriaCardsHtml = XG_COMMITTEE_MATRIX.criteria.map((crit, cIdx) => {
            const critTitle = isAr ? crit.titleAr : crit.titleEn;
            const critNote = crit.noteEn ? (isAr ? ` (${crit.noteAr || crit.noteEn})` : ` (${crit.noteEn})`) : "";
            
            // Build 3 items for this criterion
            const itemsHtml = crit.items.map(it => {
                const itText = isAr ? it.textAr : it.textEn;
                const isCritical = (it.id === "1.1" || it.id === "2.2");
                const currentScore = Number(AppState.rubricScores[it.id] || 4);
                const itemWeightedVal = ((currentScore / 5) * (crit.weight / 3)).toFixed(2);
                const maxItemWeight = (crit.weight / 3).toFixed(1);

                // Rating buttons 1 to 5
                const buttonsHtml = [5, 4, 3, 2, 1].map(val => {
                    const activeClass = (currentScore === val) ? `active score-${val}` : "";
                    const label = (val === 5) ? (isAr ? "5 (يفوق)" : "5 (Exceeds)")
                                : (val === 4) ? (isAr ? "4 (بامتياز)" : "4 (Excellent)")
                                : (val === 3) ? (isAr ? "3 (يلبي)" : "3 (Meets)")
                                : (val === 2) ? (isAr ? "2 (جزئياً ⚠️)" : "2 (Partial ⚠️)")
                                : (isAr ? "1 (لا يلبي ⚠️)" : "1 (Fail ⚠️)");
                    return `
                        <button type="button" class="rubric-score-btn ${activeClass}" 
                                data-item="${it.id}" data-score="${val}"
                                onclick="setRubricItemScore('${it.id}', ${val})" 
                                title="${label}">
                            ${val}
                        </button>
                    `;
                }).join("");

                const criticalBadge = isCritical 
                    ? `<span style="background: rgba(239, 68, 68, 0.18); border: 1px solid rgba(239, 68, 68, 0.4); color: #FCA5A5; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.3rem;">
                         <i class="fa-solid fa-triangle-exclamation"></i> ${isAr ? 'بند إقصائي حرج (≤ 2 = استبعاد)' : 'Critical Exclusion (≤ 2 = Disqualify)'}
                       </span>` 
                    : "";

                return `
                    <tr id="rubricRow_${it.id}" data-criterion="${crit.id}" data-weight="${crit.weight}" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                        <td style="text-align: center; font-weight: 900; color: var(--gold-bright); font-size: 0.95rem; width: 60px;">
                            ${it.id}
                        </td>
                        <td style="padding: 0.85rem 1rem;">
                            <div style="font-weight: 700; color: #FFFFFF; font-size: 0.88rem; line-height: 1.5; margin-bottom: 0.25rem;">
                                ${itText}
                            </div>
                            <div>${criticalBadge}</div>
                        </td>
                        <td style="text-align: center; white-space: nowrap; padding: 0.85rem 0.5rem; width: 220px;">
                            <div style="display: inline-flex; gap: 0.35rem; align-items: center;">
                                ${buttonsHtml}
                            </div>
                        </td>
                        <td style="text-align: center; font-weight: 800; white-space: nowrap; width: 140px;">
                            <span id="rubricWeighted_${it.id}" style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); color: #34D399; padding: 0.25rem 0.65rem; border-radius: 6px; font-size: 0.82rem;">
                                ${itemWeightedVal}% / ${maxItemWeight}%
                            </span>
                        </td>
                    </tr>
                `;
            }).join("");

            return `
                <div class="rubric-criterion-card" style="margin-bottom: 1.5rem; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                    <div style="background: linear-gradient(90deg, rgba(212, 175, 55, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%); padding: 0.85rem 1.25rem; border-bottom: 1px solid rgba(212, 175, 55, 0.25); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <h4 style="margin: 0; font-size: 1rem; color: #FFFFFF; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-layer-group" style="color: var(--gold-bright);"></i>
                            <span>${crit.id}. ${critTitle}</span>
                            <span style="color: var(--gold-bright); font-size: 0.8rem;">${critNote}</span>
                        </h4>
                        <span id="critSubtotal_${crit.id}" style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--gold-bright); color: var(--gold-bright); padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 800; font-size: 0.82rem;">
                            ${crit.weight}% Total Weight
                        </span>
                    </div>

                    <div style="overflow-x: auto;">
                        <table class="screening-table" style="margin: 0; width: 100%; border-collapse: collapse;">
                            <thead style="background: rgba(5, 17, 36, 0.65);">
                                <tr>
                                    <th style="width: 60px; text-align: center;">#</th>
                                    <th>${isAr ? 'البند التقييمي المعتمد (دليل الجدارات)' : 'Official Assessment Criteria'}</th>
                                    <th style="text-align: center; width: 220px;">${isAr ? 'درجة التقييم (1 إلى 5)' : 'Evaluation Rating (1 to 5)'}</th>
                                    <th style="text-align: center; width: 140px;">${isAr ? 'الدرجة الموزونة' : 'Weighted Score'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }).join("");
    }

    container.innerHTML = `
        <!-- Evaluation Sheet Header & Candidate Identity Banner -->
        <div style="background: linear-gradient(135deg, rgba(14, 40, 73, 0.85) 0%, rgba(5, 17, 36, 0.95) 100%); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.85rem; margin-bottom: 1rem;">
                <div>
                    <span class="section-badge" style="margin-bottom: 0.25rem;">
                        <i class="fa-solid fa-stopwatch"></i> <span>15-Minute Live Presentation Assessment</span>
                    </span>
                    <h3 style="margin: 0.2rem 0; color: #FFFFFF; font-size: 1.25rem; font-weight: 800;">
                        ${isAr ? 'استمارة التقييم الحضوري المباشر للمدرب (100%) — العرض التقديمي (15 دقيقة)' : 'Physical In-Person Trainer Assessment Sheet (100%) — 15-Minute Live Presentation'}
                    </h3>
                    <p style="margin: 0; color: var(--text-muted); font-size: 0.82rem;">
                        ${isAr 
                            ? 'معاد بناؤها مباشرة وفق مصفوفة الجدارات المعتمدة (competencies matrix.docx) عبر 5 معايير (الرصانة 25%، العرض 20%، الإلقاء 25%، التفاعل 15%، الأثر 15%) وتطبيق قاعدة الإقصاء الصارمة.' 
                            : 'Rebuilt directly from official competencies matrix.docx: 5 Criteria (Soundness 25%, 15-Min Engineering 20%, Oratory 25%, Interaction 15%, Impact 15%) with strict exclusion rule.'}
                    </p>
                </div>
                <div style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--gold-bright); color: var(--gold-bright); padding: 0.45rem 1rem; border-radius: 999px; font-weight: 800; font-size: 0.85rem;">
                    <i class="fa-solid fa-user-tie"></i> <span>${candCode} — ${candName} (${candCompany})</span>
                </div>
            </div>

            <!-- Quick Preset & Testing Toolbar -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                <div style="font-size: 0.82rem; color: #CBD5E1; font-weight: 600;">
                    <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--gold-bright); margin-inline-end: 0.35rem;"></i>
                    <span>${isAr ? 'الضبط السريع وتجربة قاعدة الإقصاء:' : 'Quick Presets & Rule Verification:'}</span>
                </div>
                <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                    <button type="button" class="btn-primary-gold" onclick="setRubricPreset('elite')" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;">
                        <i class="fa-solid fa-crown"></i> <span>${isAr ? 'النخبة (الكل 5 = 100%)' : 'Elite (All 5s = 100%)'}</span>
                    </button>
                    <button type="button" class="btn-outline-gold" onclick="setRubricPreset('certified')" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;">
                        <i class="fa-solid fa-circle-check"></i> <span>${isAr ? 'خبير معتمد (الكل 4 = 80%)' : 'Certified (All 4s = 80%)'}</span>
                    </button>
                    <button type="button" class="btn-outline-gold" onclick="setRubricPreset('associate')" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;">
                        <i class="fa-solid fa-user-clock"></i> <span>${isAr ? 'مقبول (الكل 3 = 60%)' : 'Meets (All 3s = 60%)'}</span>
                    </button>
                    <button type="button" onclick="setRubricPreset('exclusion11')" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.45); color: #FCA5A5; padding: 0.35rem 0.75rem; border-radius: 999px; font-size: 0.76rem; font-weight: 700; cursor: pointer;">
                        <i class="fa-solid fa-triangle-exclamation"></i> <span>${isAr ? 'تجربة إقصاء 1.1 (درجة 2)' : 'Test Exclusion 1.1 (Score 2)'}</span>
                    </button>
                    <button type="button" onclick="setRubricPreset('exclusion22')" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.45); color: #FCA5A5; padding: 0.35rem 0.75rem; border-radius: 999px; font-size: 0.76rem; font-weight: 700; cursor: pointer;">
                        <i class="fa-solid fa-triangle-exclamation"></i> <span>${isAr ? 'تجربة إقصاء 2.2 (درجة 2)' : 'Test Exclusion 2.2 (Score 2)'}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Dynamic Live Exclusion Rule Warning Container -->
        <div id="rubricExclusionAlertBox"></div>

        <!-- 5 Criteria Cards (15 Items) -->
        ${criteriaCardsHtml}

        <!-- Official Accreditation Decision Matrix Reference -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; padding: 1.25rem; margin-top: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="margin: 0 0 0.75rem 0; font-size: 0.95rem; color: #FFFFFF; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-scale-balanced" style="color: var(--gold-bright);"></i>
                <span>${isAr ? 'مصفوفة قرار الاعتماد والتسكين الاستشاري (دليل الجدارات):' : 'Official Accreditation Decision Matrix (from Competencies Guide):'}</span>
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-size: 0.8rem;">
                <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 0.65rem 0.85rem;">
                    <div style="color: var(--gold-bright); font-weight: 800; margin-bottom: 0.2rem;">90% - 100%</div>
                    <strong style="color: #FFFFFF;">${isAr ? 'خبير نخبوي (Master Star)' : 'Elite Expert (Master)'}</strong>
                    <div style="color: var(--text-muted); font-size: 0.74rem; margin-top: 0.25rem;">اعتماد فوري + دعوة للتحكيم وبرامج الإدارة العليا</div>
                </div>
                <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 0.65rem 0.85rem;">
                    <div style="color: #38BDF8; font-weight: 800; margin-bottom: 0.2rem;">75% - 89%</div>
                    <strong style="color: #FFFFFF;">${isAr ? 'خبير معتمد (Senior)' : 'Certified Expert (Senior)'}</strong>
                    <div style="color: var(--text-muted); font-size: 0.74rem; margin-top: 0.25rem;">اعتماد للبرامج التخصصية المتقدمة وورش العمل</div>
                </div>
                <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 0.65rem 0.85rem;">
                    <div style="color: #34D399; font-weight: 800; margin-bottom: 0.2rem;">60% - 74%</div>
                    <strong style="color: #FFFFFF;">${isAr ? 'اعتماد مشروط (Associate)' : 'Conditional (Associate)'}</strong>
                    <div style="color: var(--text-muted); font-size: 0.74rem; margin-top: 0.25rem;">تدريب برامج تأسيسية مع إعادة عرض خلال 6 أشهر</div>
                </div>
                <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 0.65rem 0.85rem;">
                    <div style="color: #F87171; font-weight: 800; margin-bottom: 0.2rem;">أقل من 60%</div>
                    <strong style="color: #FFFFFF;">${isAr ? 'غير مؤهل لهذه الدورة' : 'Not Qualified for this Cycle'}</strong>
                    <div style="color: var(--text-muted); font-size: 0.74rem; margin-top: 0.25rem;">إلزام بمسار تدريبي تأهيلي قبل إعادة التقديم</div>
                </div>
            </div>
        </div>
    `;

    // Recalculate and synchronize with bottom box
    calculateRubricTotal();
}

// Interactive button score setter
window.setRubricItemScore = function(itemId, scoreVal) {
    if (!AppState.rubricScores) AppState.rubricScores = {};
    AppState.rubricScores[itemId] = Number(scoreVal);

    // Update active button classes in the UI
    document.querySelectorAll(`.rubric-score-btn[data-item="${itemId}"]`).forEach(btn => {
        const s = Number(btn.getAttribute("data-score"));
        btn.classList.toggle("active", s === Number(scoreVal));
        btn.className = (s === Number(scoreVal)) ? `rubric-score-btn active score-${scoreVal}` : "rubric-score-btn";
    });

    // Update weighted score badge in this row
    const row = document.getElementById(`rubricRow_${itemId}`);
    if (row) {
        const weight = Number(row.getAttribute("data-weight"));
        const weightedVal = ((Number(scoreVal) / 5) * (weight / 3)).toFixed(2);
        const badge = document.getElementById(`rubricWeighted_${itemId}`);
        if (badge) {
            badge.textContent = `${weightedVal}% / ${(weight / 3).toFixed(1)}%`;
        }
    }

    calculateRubricTotal();
};

// Preset applier
window.setRubricPreset = function(presetType) {
    if (!AppState.rubricScores) AppState.rubricScores = {};
    if (typeof XG_COMMITTEE_MATRIX === "undefined" || !XG_COMMITTEE_MATRIX.criteria) return;

    if (presetType === "elite") {
        XG_COMMITTEE_MATRIX.criteria.forEach(c => c.items.forEach(it => {
            AppState.rubricScores[it.id] = 5;
        }));
    } else if (presetType === "certified") {
        XG_COMMITTEE_MATRIX.criteria.forEach(c => c.items.forEach(it => {
            AppState.rubricScores[it.id] = 4;
        }));
    } else if (presetType === "associate") {
        XG_COMMITTEE_MATRIX.criteria.forEach(c => c.items.forEach(it => {
            AppState.rubricScores[it.id] = 3;
        }));
    } else if (presetType === "exclusion11") {
        XG_COMMITTEE_MATRIX.criteria.forEach(c => c.items.forEach(it => {
            AppState.rubricScores[it.id] = 5;
        }));
        AppState.rubricScores["1.1"] = 2; // Trigger strict exclusion!
    } else if (presetType === "exclusion22") {
        XG_COMMITTEE_MATRIX.criteria.forEach(c => c.items.forEach(it => {
            AppState.rubricScores[it.id] = 5;
        }));
        AppState.rubricScores["2.2"] = 2; // Trigger strict exclusion!
    }

    // Refresh the sheet UI
    const cand = AppState.candidates.find(c => c.id === AppState.activeEvaluatingCandidateId) || AppState.candidates[0];
    renderPhysicalAssessmentSheet(cand);

    const isAr = AppState.currentLang === "ar";
    if (presetType.startsWith("exclusion")) {
        showToast(isAr ? "⚠️ تم تفعيل قاعدة الإقصاء المباشر (درجة ≤ 2)" : "⚠️ Exclusion rule triggered (score ≤ 2)");
    } else {
        showToast(isAr ? "تم تطبيق الضبط السريع لدرجات التحكيم" : "Scoring preset applied successfully");
    }
};

// Comprehensive calculation function
function calculateRubricTotal() {
    if (!AppState.rubricScores) AppState.rubricScores = {};
    if (typeof XG_COMMITTEE_MATRIX === "undefined" || !XG_COMMITTEE_MATRIX.criteria) return { total: 0 };

    // Ensure all 15 items have a score
    XG_COMMITTEE_MATRIX.criteria.forEach(c => c.items.forEach(it => {
        if (AppState.rubricScores[it.id] === undefined) {
            AppState.rubricScores[it.id] = 4;
        }
    }));

    let total = 0;
    const criterionScores = {};

    XG_COMMITTEE_MATRIX.criteria.forEach(c => {
        let critSum = 0;
        c.items.forEach(it => {
            const score = Number(AppState.rubricScores[it.id] || 4);
            critSum += score;
        });
        const critWeighted = (critSum / 15) * c.weight;
        criterionScores[c.id] = critWeighted;
        total += critWeighted;

        // Update criterion subtotal badge in UI
        const critBadge = document.getElementById(`critSubtotal_${c.id}`);
        if (critBadge) {
            critBadge.textContent = `${critWeighted.toFixed(1)}% / ${c.weight}%`;
        }
    });

    // Strict Exclusion Rule: Any score ≤ 2 in item 1.1 or 2.2 = immediate disqualification!
    const score11 = Number(AppState.rubricScores["1.1"] || 4);
    const score22 = Number(AppState.rubricScores["2.2"] || 4);
    const isExcluded = (score11 <= 2) || (score22 <= 2);

    let exclusionReason = "";
    if (score11 <= 2 && score22 <= 2) {
        exclusionReason = "Score ≤ 2 in Item 1.1 (Scientific Soundness) AND Item 2.2 (15-Min Presentation Time Commitment)";
    } else if (score11 <= 2) {
        exclusionReason = "Score ≤ 2 in Item 1.1: Scientific Soundness & Content Recency (الرصانة العلمية وحداثة المحتوى)";
    } else if (score22 <= 2) {
        exclusionReason = "Score ≤ 2 in Item 2.2: 15-Minute Strict Time Adherence (الالتزام الصارم بالوقت المحدد)";
    }

    // Accreditation Decision
    let decision;
    if (isExcluded) {
        decision = {
            tierEn: "Disqualified (Exclusion Rule)",
            tierAr: "مستبعد مباشرة (قاعدة الإقصاء)",
            badgeClass: "badge-deferred",
            scopeEn: "Direct disqualification under the strict competencies matrix rule. Re-application required next cycle.",
            scopeAr: "استبعاد مباشر لمخالفة البند الإقصائي الحرج (≤ 2). لا يجوز الاعتماد في هذه الدورة.",
            isDisqualified: true
        };
    } else if (total >= 90) {
        decision = {
            tierEn: "Lead / Master Trainer",
            tierAr: "خبير نخبوي — اعتماد فوري + دعوة للتحكيم",
            badgeClass: "badge-master",
            scopeEn: "Elite Master Expert: Approved to lead senior executive leadership programs, strategic panels, and arbitration committee.",
            scopeAr: "خبير نخبوي: معتمد لقيادة برامج الإدارة العليا واللجان الاستراتيجية ومحكم رسمي في بوابة الخبراء.",
            isDisqualified: false
        };
    } else if (total >= 75) {
        decision = {
            tierEn: "Certified Senior Trainer",
            tierAr: "خبير معتمد",
            badgeClass: "badge-senior",
            scopeEn: "Approved for Advanced Specialized Courses, Technical Workshops & Coaching.",
            scopeAr: "معتمد لتقديم البرامج التخصصية المتقدمة وورش العمل الهندسية والإدارية.",
            isDisqualified: false
        };
    } else if (total >= 60) {
        decision = {
            tierEn: "Associate Trainer",
            tierAr: "اعتماد مشروط — إعادة عرض خلال 6 أشهر",
            badgeClass: "badge-associate",
            scopeEn: "Conditional Accreditation: Authorized for foundational operational courses. Re-presentation required within 6 months.",
            scopeAr: "اعتماد مشروط: تفويض لتدريب البرامج التأسيسية مع إعادة العرض التقديمي أمام اللجنة خلال 6 أشهر.",
            isDisqualified: false
        };
    } else {
        decision = {
            tierEn: "Development / Needs Coaching",
            tierAr: "غير مؤهل لهذه الدورة",
            badgeClass: "badge-deferred",
            scopeEn: "Below accreditation threshold (<60%). Recommended to join preparatory Train-the-Trainer program.",
            scopeAr: "أقل من حد التأهيل (<60%). يوصى بمسار تدريبي تأهيلي قبل التقدم مجدداً.",
            isDisqualified: false
        };
    }

    const isAr = AppState.currentLang === "ar";

    // Exclusion Alert Container
    const exclBanner = document.getElementById("rubricExclusionAlertBox");
    if (exclBanner) {
        if (isExcluded) {
            exclBanner.style.display = "block";
            exclBanner.innerHTML = `
                <div class="exclusion-alert-card">
                    <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; font-weight: 900; margin-bottom: 0.4rem; color: #EF4444;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem;"></i>
                        <span>${isAr ? '🚨 تم تطبيق قاعدة الإقصاء المباشر!' : '🚨 EXCLUSION RULE TRIGGERED!'}</span>
                    </div>
                    <div style="font-size: 0.9rem; line-height: 1.5; color: #FCA5A5;">
                        ${isAr 
                            ? `نص القاعدة: <strong>"أي درجة ≤ 2 في البند 1.1 (الرصانة العلمية) أو 2.2 (الالتزام بالوقت) = إقصاء مباشر مهما بلغ المجموع."</strong><br><strong>سبب الاستبعاد:</strong> ${exclusionReason}`
                            : `Rule: <strong>"Any score ≤ 2 in item 1.1 (Scientific Soundness) or 2.2 (Time Commitment) = immediate disqualification regardless of total."</strong><br><strong>Reason:</strong> ${exclusionReason}`
                        }
                    </div>
                </div>
            `;
        } else {
            exclBanner.style.display = "block";
            exclBanner.innerHTML = `
                <div class="exclusion-safe-badge">
                    <i class="fa-solid fa-circle-check" style="font-size: 1.1rem;"></i>
                    <span>${isAr 
                        ? 'قاعدة الإقصاء: مستوفاة (البند 1.1 والبند 2.2 أعلى من درجة 2 — المرشح مؤهل للاحتساب النهائي)' 
                        : 'Exclusion Rule: Satisfied (Critical items 1.1 and 2.2 are above score 2 — Candidate qualified for normal scoring)'}</span>
                </div>
            `;
        }
    }

    // Update Bottom Summary Card
    const calcCompEl = document.getElementById("calcCompositeScore");
    if (calcCompEl) {
        calcCompEl.textContent = total.toFixed(1);
        calcCompEl.style.color = isExcluded ? "#EF4444" : "var(--gold-bright)";
    }

    const calcTierEl = document.getElementById("calcTierTag");
    if (calcTierEl) {
        calcTierEl.className = `tier-tag ${decision.badgeClass}`;
        calcTierEl.textContent = isAr ? decision.tierAr : decision.tierEn;
    }

    const calcDescEl = document.getElementById("calcAssignmentDesc");
    if (calcDescEl) {
        calcDescEl.textContent = isAr ? decision.scopeAr : decision.scopeEn;
        calcDescEl.style.color = isExcluded ? "#FCA5A5" : "var(--gold-bright)";
    }

    const summaryTextEl = document.getElementById("calcPillarsSummaryText");
    if (summaryTextEl) {
        summaryTextEl.innerHTML = `
            <strong>${isAr ? 'تفصيل معايير التحكيم الخمسة (مجموع 100%):' : '5 Criteria Score Breakdown (Total 100%):'}</strong><br>
            ${isAr ? 'الرصانة العلمية' : 'Scientific Soundness'} (25%): <strong>${(criterionScores[1]||0).toFixed(1)}%</strong> |
            ${isAr ? 'هندسة العرض' : '15-Min Engineering'} (20%): <strong>${(criterionScores[2]||0).toFixed(1)}%</strong> |
            ${isAr ? 'فن الإلقاء' : 'Oratory & Presence'} (25%): <strong>${(criterionScores[3]||0).toFixed(1)}%</strong> |
            ${isAr ? 'التفاعل' : 'Interaction'} (15%): <strong>${(criterionScores[4]||0).toFixed(1)}%</strong> |
            ${isAr ? 'الأثر والقيمة' : 'Impact & Value'} (15%): <strong>${(criterionScores[5]||0).toFixed(1)}%</strong>
        `;
    }

    return {
        total: total,
        criterionScores: criterionScores,
        decision: decision,
        isExcluded: isExcluded,
        exclusionReason: exclusionReason
    };
}

// Aliases for seamless integration with existing callers
window.renderXpertgateCompetencyMatrix = renderPhysicalAssessmentSheet;
window.loadRubricCriteria = renderPhysicalAssessmentSheet;
window.calculateSimulationRubric = calculateRubricTotal;

function initSimulationRubric() {
    const btnSave = document.getElementById("btnSaveSimulationResult");
    if (btnSave) {
        btnSave.onclick = async () => {
            const cand = AppState.candidates.find(c => c.id === AppState.activeEvaluatingCandidateId) || AppState.candidates[0];
            if (!cand) {
                showToast(AppState.currentLang === "ar"
                    ? "يرجى تسجيل مرشح أو اختياره من جدول الفرز أولاً لحفظ التقييم."
                    : "Please select an applicant from the list first.");
                return;
            }

            const rubricResult = calculateRubricTotal();

            cand.compositeScore = Number(rubricResult.total.toFixed(1));
            cand.accreditedTier = rubricResult.decision.tierEn;
            cand.accreditedTierAr = rubricResult.decision.tierAr;
            cand.tierEn = rubricResult.decision.tierEn;
            cand.tierAr = rubricResult.decision.tierAr;
            cand.badgeClass = rubricResult.decision.badgeClass;
            cand.isDisqualified = rubricResult.isExcluded;
            cand.exclusionReason = rubricResult.exclusionReason;
            cand.committeeRubricScores = { ...AppState.rubricScores };
            cand.screeningStatus = rubricResult.isExcluded ? "Disqualified" : (rubricResult.total >= 75 ? "Accredited" : "Conditional");

            await DbService.updateCandidate(cand.id, {
                compositeScore: cand.compositeScore,
                accreditedTier: cand.accreditedTier,
                badgeClass: cand.badgeClass,
                committeeRubricScores: cand.committeeRubricScores,
                screeningStatus: cand.screeningStatus,
                isDisqualified: cand.isDisqualified
            });

            renderScreeningTable();
            renderSkillsBank();
            updateExecutiveKpiMetrics();
            renderLecturerAssessmentDashboard();

            const isAr = AppState.currentLang === "ar";
            showToast(isAr
                ? `تم حفظ قرار التحكيم للمرشح ${cand.code}: ${cand.accreditedTierAr}`
                : `Committee evaluation saved for ${cand.code}: ${cand.accreditedTier}`);
        };
    }
}


function populateDomainDropdowns() {
    const domainSelect = document.getElementById("appDomain");
    const subSelect = document.getElementById("appSubDiscipline");
    const certContainer = document.getElementById("disciplineCertContainer");
    const dossierContainer = document.getElementById("domainInteractiveDossier");
    if (!domainSelect || !subSelect) return;

    const isAr = AppState.currentLang === "ar";
    domainSelect.innerHTML = "";

    PETROLEUM_DOMAINS.forEach(domain => {
        const opt = document.createElement("option");
        opt.value = domain.id;
        opt.textContent = isAr ? domain.nameAr : domain.nameEn;
        domainSelect.appendChild(opt);
    });

    const renderDomainDossier = (domain, selectedSubId) => {
        if (!dossierContainer) return;

        const isAr = AppState.currentLang === "ar";
        const title = isAr ? domain.nameAr : domain.nameEn;
        const badge = isAr ? (domain.badgeAr || "مجال بترولي تخصصي") : (domain.badgeEn || "Training Area");
        const summary = isAr ? (domain.summaryAr || "") : (domain.summaryEn || "");
        const competencies = isAr ? (domain.competenciesAr || []) : (domain.competenciesEn || []);
        const priorityTopics = isAr ? (domain.priorityTopicsAr || []) : (domain.priorityTopicsEn || []);
        const icon = domain.icon || "fa-solid fa-layer-group";
        const certsList = domain.certs || [];

        // Generate clickable sub-disciplines pills
        const subPillsHtml = domain.subDisciplines.map(sub => {
            const subTitle = isAr ? sub.nameAr : sub.nameEn;
            const isActive = sub.id === selectedSubId ? "active" : "";
            return `
                <button type="button" class="sub-pill-btn ${isActive}" data-subid="${sub.id}">
                    <i class="fa-solid fa-tag"></i>
                    <span>${subTitle}</span>
                </button>
            `;
        }).join("");

        // Generate key competencies list
        const compListHtml = competencies.map(c => `
            <li>
                <i class="fa-solid fa-check-double"></i>
                <span>${c}</span>
            </li>
        `).join("");

        // Generate priority training topics list
        const topicsListHtml = priorityTopics.map(t => `
            <li>
                <i class="fa-solid fa-book-open"></i>
                <span>${t}</span>
            </li>
        `).join("");

        dossierContainer.innerHTML = `
            <div class="dossier-main-card">
                <div class="dossier-header-bar">
                    <div class="dossier-title-group">
                        <div class="dossier-icon-box">
                            <i class="${icon}"></i>
                        </div>
                        <div class="dossier-title-text">
                            <h4>${title}</h4>
                            <span class="dossier-badge">${badge}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--gold-bright); display: flex; align-items: center; gap: 0.4rem;">
                        <i class="fa-solid fa-hand-pointer"></i>
                        <span>${isAr ? 'انقر على أي تخصص فرعي لتحديده فورياً' : 'Click any specialty below to select it'}</span>
                    </div>
                </div>

                <p class="dossier-summary-p">${summary}</p>

                <div class="dossier-subdisciplines-label">
                    <i class="fa-solid fa-sitemap"></i>
                    <span>${isAr ? 'التخصصات الدقيقة المندرجة تحت هذا المجال (انقر للاختيار):' : 'Specific Specialties in This Area (Click to Select):'}</span>
                </div>
                <div class="dossier-subdisciplines-pills" id="dossierPillsWrap">
                    ${subPillsHtml}
                </div>

                <div class="dossier-blueprint-grid">
                    <div class="blueprint-col">
                        <div class="blueprint-col-header">
                            <i class="fa-solid fa-brain"></i>
                            <span>${isAr ? 'الجدارات والمعارف الفنية المستهدفة بالمجال:' : 'Key Skills & Knowledge Required:'}</span>
                        </div>
                        <ul class="blueprint-item-list">
                            ${compListHtml}
                        </ul>
                    </div>

                    <div class="blueprint-col">
                        <div class="blueprint-col-header">
                            <i class="fa-solid fa-graduation-cap"></i>
                            <span>${isAr ? 'أولويات البرامج التدريبية المعتمدة للمدربين:' : 'Priority Training Topics for This Area:'}</span>
                        </div>
                        <ul class="blueprint-item-list">
                            ${topicsListHtml}
                        </ul>
                    </div>
                </div>

                <!-- SPECIALTY REGISTRATION FILE + 120S VIDEO LINK + ALL ATTACHED FIELDS BAR INSIDE EVERY SPECIALTY -->
                <div style="margin-top: 1.25rem; background: linear-gradient(135deg, rgba(212, 175, 55, 0.14), rgba(15, 23, 42, 0.92)); border: 1px solid rgba(212, 175, 55, 0.45); border-radius: 12px; padding: 1.1rem 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div style="flex: 1; min-width: 260px;">
                            <div style="font-weight: 800; color: var(--gold-bright); font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                                <i class="fa-solid fa-file-signature"></i>
                                <span>${isAr ? `حقيبة واستمارة التسجيل الرسمية لتخصص (${title}) + رابط الفيديو التقديمي (120 ثانية)` : `Registration Package for (${title}) + 2-Minute Intro Video Link`}</span>
                            </div>
                            <p style="margin: 0; font-size: 0.8rem; color: #E2E8F0; line-height: 1.5;">
                                ${isAr
                                    ? `تتضمن هذه البطاقة ملف استمارة التسجيل الرسمي (Template Form for Expert Registration.docx)، ورابط الفيديو التقديمي المعتمد (120 ثانية)، والشهادات التخصصية (${certsList.slice(0, 3).join(' • ')})، وكافة الحقول الـ 10 المرفقة أدناه.`
                                    : `Download the official Word Registration Form, get the 2-minute sample video link, view recommended certificates (${certsList.slice(0, 3).join(' • ')}), or fill the 7 suggested courses below.`}
                            </p>
                        </div>

                        <div style="display: flex; gap: 0.55rem; flex-wrap: wrap; align-items: center;">
                            <a href="assets/Template%20Form%20for%20Expert%20Registration.docx" download="Template_Form_for_Expert_Registration.docx" class="btn-primary-gold" style="padding: 0.5rem 0.95rem; font-size: 0.78rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                                <i class="fa-solid fa-file-word"></i>
                                <span>${isAr ? 'تحميل فايل التسجيل للتخصص (DOCX)' : 'Download Registration Form (Word)'}</span>
                            </a>

                            <a href="video/sample-video.mp4" download="XpertGate_Pitch_120s.mp4" target="_blank" rel="noopener" class="btn-outline-gold" style="padding: 0.5rem 0.9rem; font-size: 0.78rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; color: #34D399; border-color: rgba(16, 185, 129, 0.5); background: rgba(16, 185, 129, 0.1);">
                                <i class="fa-solid fa-video"></i>
                                <span>${isAr ? 'رابط وتحميل فيديو الـ 120 ثانية' : '2-Min Sample Video Link & Download'}</span>
                            </a>

                            <button type="button" class="btn-outline-gold" style="padding: 0.5rem 0.9rem; font-size: 0.78rem;" onclick="fillSpecialtyProgramsAndScroll(true)">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                                <span>${isAr ? 'تعبئة البرامج الـ 7 والانتقال للحقول' : 'Fill 7 Courses & Go to Form'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind click events on sub-discipline pills to sync with dropdown
        const pillsWrap = document.getElementById("dossierPillsWrap");
        if (pillsWrap) {
            pillsWrap.querySelectorAll(".sub-pill-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const subId = btn.getAttribute("data-subid");
                    if (subSelect) {
                        subSelect.value = subId;
                    }
                    pillsWrap.querySelectorAll(".sub-pill-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    window.fillSpecialtyProgramsAndScroll(false);
                });
            });
        }
    };

    const updateSubDisciplinesAndCerts = () => {
        const currentIsAr = AppState.currentLang === "ar";
        const selectedDomainId = domainSelect.value;
        const domain = PETROLEUM_DOMAINS.find(d => d.id === selectedDomainId) || PETROLEUM_DOMAINS[0];
        
        // Update Sub-disciplines dropdown
        subSelect.innerHTML = "";
        domain.subDisciplines.forEach(sub => {
            const opt = document.createElement("option");
            opt.value = sub.id;
            opt.textContent = currentIsAr ? sub.nameAr : sub.nameEn;
            subSelect.appendChild(opt);
        });

        // Render the Interactive Domain Dossier
        renderDomainDossier(domain, domain.subDisciplines[0] ? domain.subDisciplines[0].id : "");

        // Update Dynamic Certifications specific to this Domain
        if (certContainer) {
            certContainer.innerHTML = "";
            const certsList = domain.certs || [
                "API Standards Specialist",
                "ASME Code Authority",
                "NEBOSH Professional Certification",
                "PMP Project Management Professional"
            ];

            certsList.forEach((certName, idx) => {
                const label = document.createElement("label");
                label.className = "cert-checkbox-label";
                label.innerHTML = `
                    <input type="checkbox" value="${certName}" class="app-cert" ${idx < 2 ? 'checked' : ''}>
                    <span>${certName}</span>
                `;
                certContainer.appendChild(label);
            });
        }

        // Pre-populate the 7 training programs with the selected specialty's priority topics
        window.fillSpecialtyProgramsAndScroll(false);
    };

    // When dropdown changes, also update the active pill in dossier
    subSelect.onchange = () => {
        const selectedSubId = subSelect.value;
        const pillsWrap = document.getElementById("dossierPillsWrap");
        if (pillsWrap) {
            pillsWrap.querySelectorAll(".sub-pill-btn").forEach(btn => {
                if (btn.getAttribute("data-subid") === selectedSubId) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        }
        window.fillSpecialtyProgramsAndScroll(false);
    };

    domainSelect.onchange = updateSubDisciplinesAndCerts;
    updateSubDisciplinesAndCerts();
}

function initApplicantIntakeForm() {
    populateDomainDropdowns();

    const form = document.getElementById("applicantIntakeForm");
    const expInput = document.getElementById("appExpYears");
    const degreeSelect = document.getElementById("appDegree");
    const customCertInput = document.getElementById("appCustomCert");
    const expertClassSelect = document.getElementById("appExpertClassification");
    const englishSelect = document.getElementById("appEnglishProficiency");
    const videoFileInput = document.getElementById("appVideoFile");
    const videoLinkInput = document.getElementById("appVideoLink");
    const videoUploadStatus = document.getElementById("videoUploadStatus");
    const cvFileInput = document.getElementById("appCvFile");
    const cvUploadedUrlInput = document.getElementById("appCvUploadedUrl");
    const cvUploadStatus = document.getElementById("cvUploadStatus");
    const btnAutoFillPrograms = document.getElementById("btnAutoFillPrograms");
    const fullNameInput = document.getElementById("appFullName");
    const declNameInput = document.getElementById("appDeclName");
    const signatureInput = document.getElementById("appSignature");

    if (btnAutoFillPrograms) {
        btnAutoFillPrograms.addEventListener("click", () => {
            window.fillSpecialtyProgramsAndScroll(false);
            showToast(AppState.currentLang === "ar"
                ? "تمت تعبئة البرامج التدريبية الـ 7 من أولويات التخصص المختار."
                : "7 suggested training courses filled for the selected specialty.");
        });
    }

    const btnQuickFillDemoApp = document.getElementById("btnQuickFillDemoApp");
    if (btnQuickFillDemoApp) {
        btnQuickFillDemoApp.addEventListener("click", () => {
            const isAr = AppState.currentLang === "ar";
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.value = val;
            };

            setVal("appFullName", isAr ? "د. سامح عبد الفتاح الشافعي" : "Dr. Sameh Abdelfattah El-Shafei");
            setVal("appEmail", "sameh.abdelfattah@enppi.com.eg");
            setVal("appPhone", "+20 100 234 5678");
            setVal("appLinkedIn", "https://www.linkedin.com/in/dr-sameh-process");
            setVal("appWebsite", "https://xpertgate.enppi.com/experts/dr-sameh");
            setVal("appCompany", "ENPPI");
            setVal("appDepartment", isAr ? "الإدارة العامة لهندسة العمليات والتحول الطاقي" : "General Directorate of Process & Energy Transition");
            setVal("appJobTitle", isAr ? "مدير عام هندسة العمليات واستشاري أول معتمد" : "General Manager of Process Engineering & Senior Advisor");
            setVal("appHrEmail", "hr@enppi.com.eg");
            setVal("appCareerPositions", isAr 
                ? "مهندس عمليات أول (2002-2010) -> مدير قسم المحاكاة المتقدمة (2010-2018) -> مدير عام هندسة العمليات والتحول الطاقي بإنبي (2018-الآن)" 
                : "Lead Process Engineer (2002-2010) -> Head of Simulation Section (2010-2018) -> General Manager of Process Engineering (2018-Present)");
            setVal("appCohort", "Cohort A");
            setVal("appAvailability", "Available");
            setVal("appExpYears", "22");
            setVal("appDegree", "PhD");
            setVal("bscField", isAr ? "هندسة كيميائية وبترول" : "Chemical & Petroleum Engineering");
            setVal("bscUniversity", isAr ? "جامعة القاهرة" : "Cairo University");
            setVal("bscYear", "2002");
            setVal("mscField", isAr ? "المحاكاة الديناميكية لوحدات التكرير" : "Dynamic Simulation of Refinery Units");
            setVal("mscUniversity", isAr ? "جامعة القاهرة" : "Cairo University");
            setVal("mscYear", "2007");
            setVal("phdField", isAr ? "كفاءة الطاقة وإزالة الكربون في مصانع الغاز" : "Energy Efficiency & Decarbonization in Gas Plants");
            setVal("phdUniversity", isAr ? "جامعة ليدز - المملكة المتحدة" : "University of Leeds, UK");
            setVal("phdYear", "2014");
            setVal("appExpertClassification", "international");
            setVal("appEnglishProficiency", "Fluent");
            setVal("appCustomCert", "PMP, API 570, Energy Auditor, SPE Certified");
            setVal("profCertYear", "2016, 2020");
            setVal("intlCertArea", isAr ? "تصميم وتطوير المحاكاة المتقدمة للعمليات" : "Advanced Process Simulation & Aspen HYSYS Master");
            setVal("intlCertInst", "AspenTech / SPE International");
            setVal("intlCertYear", "2018");
            setVal("sophCertArea", isAr ? "إدارة سلامة العمليات وإزالة الكربون" : "Process Safety Management & CCUS");
            setVal("sophCertInst", "AIChE / CCPS");
            setVal("sophCertYear", "2021");
            setVal("appVideoLink", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
            setVal("appBankAccount", "EG54 0002 0001 0000 0001 2345 6789");
            
            const declCheck = document.getElementById("appDeclarationCheck");
            if (declCheck) declCheck.checked = true;
            setVal("appDeclName", isAr ? "د. سامح عبد الفتاح الشافعي" : "Dr. Sameh Abdelfattah El-Shafei");
            setVal("appSignature", isAr ? "د. سامح عبد الفتاح الشافعي" : "Dr. Sameh Abdelfattah El-Shafei");

            // Fill 7 courses
            if (window.fillSpecialtyProgramsAndScroll) {
                window.fillSpecialtyProgramsAndScroll(false);
            }

            // Set simulated CV upload
            if (cvUploadedUrlInput) cvUploadedUrlInput.value = "/uploads/cv/Dr_Sameh_Petroleum_Advisor_CV.pdf";
            if (cvUploadStatus) {
                cvUploadStatus.style.display = "block";
                cvUploadStatus.style.color = "#34D399";
                cvUploadStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'تم إرفاق السيرة الذاتية النموذجية بنجاح:' : 'Sample CV attached:'} <strong>Dr_Sameh_Petroleum_Advisor_CV.pdf</strong><br><small style="color: var(--gold-bright);"><i class="fa-solid fa-check-double"></i> ${isAr ? 'تم ربط السيرة الذاتية والبيانات بنجاح! سيتم تطبيق التقييم الآلي الشامل فور الضغط على زر التقديم أدناه.' : 'CV and credentials linked! Automated evaluation will run instantly upon clicking Submit below.'}</small>`;
            }

            if (videoUploadStatus) {
                videoUploadStatus.style.display = "block";
                videoUploadStatus.style.color = "#34D399";
                videoUploadStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'تم تجهيز رابط فيديو العرض التجريبي بنجاح (120 ثانية)' : 'Demo 120s video link loaded successfully'}`;
            }

            showToast(isAr 
                ? "تمت تعبئة بيانات النموذج التجريبي وربط السيرة الذاتية! انقر على زر التقديم بأسفل الصفحة لاختبار التقييم الآلي فوراً." 
                : "Sample application & CV filled! Click the Submit button at the bottom to test automated evaluation instantly.");
        });
    }

    // Convenience sync: mirror Applicant Full Name into Declaration Name & Digital Signature unless manually edited
    if (fullNameInput) {
        fullNameInput.addEventListener("input", () => {
            const v = fullNameInput.value;
            if (declNameInput && (!declNameInput.dataset.edited || declNameInput.value === "")) {
                declNameInput.value = v;
            }
            if (signatureInput && (!signatureInput.dataset.edited || signatureInput.value === "")) {
                signatureInput.value = v;
            }
        });
    }
    if (declNameInput) {
        declNameInput.addEventListener("input", () => { declNameInput.dataset.edited = "1"; });
    }
    if (signatureInput) {
        signatureInput.addEventListener("input", () => { signatureInput.dataset.edited = "1"; });
    }

    // Mandatory Primary CV Upload Handler (PDF / DOC / DOCX)
    if (cvFileInput) {
        cvFileInput.addEventListener("change", async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            const isAr = AppState.currentLang === "ar";
            if (cvUploadStatus) {
                cvUploadStatus.style.display = "block";
                cvUploadStatus.style.color = "var(--gold-bright)";
                cvUploadStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? 'جاري رفع ملف السيرة الذاتية (CV)...' : 'Uploading your CV...'}`;
            }

            try {
                const res = await fetch(`/api/upload-cv`, {
                    method: "POST",
                    headers: {
                        "Content-Type": file.type || "application/pdf",
                        "X-File-Name": encodeURIComponent(file.name)
                    },
                    body: file
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.url && cvUploadedUrlInput) {
                        cvUploadedUrlInput.value = data.url;
                    }
                    if (cvUploadStatus) {
                        cvUploadStatus.style.color = "#34D399";
                        cvUploadStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'تم رفع السيرة الذاتية بنجاح (مرفق أساسي معتمد):' : 'CV uploaded successfully:'} <strong>${file.name}</strong> — <a href="${data.url}?download=1" download="${file.name}" style="color: var(--gold-bright); text-decoration: underline;">${isAr ? 'تحميل السي في المرفوع' : 'Download Uploaded CV'}</a><br><small style="color: var(--gold-bright);"><i class="fa-solid fa-check-double"></i> ${isAr ? 'تم ربط السيرة الذاتية بنجاح! سيتم تطبيق التقييم الآلي الشامل ومنح الدرجة المعتمدة فور الضغط على زر التقديم.' : 'CV linked successfully! Automated evaluation and accredited tier scoring will run immediately upon form submission.'}</small>`;
                    }
                } else {
                    throw new Error("CV upload failed");
                }
            } catch (err) {
                const blobUrl = URL.createObjectURL(file);
                if (cvUploadedUrlInput) cvUploadedUrlInput.value = blobUrl;
                if (cvUploadStatus) {
                    cvUploadStatus.style.color = "#34D399";
                    cvUploadStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'تم إرفاق السيرة الذاتية بنجاح:' : 'CV attached:'} <strong>${file.name}</strong><br><small style="color: var(--gold-bright);"><i class="fa-solid fa-check-double"></i> ${isAr ? 'تم ربط السيرة الذاتية بنجاح! سيتم تطبيق التقييم الآلي الشامل ومنح الدرجة المعتمدة فور الضغط على زر التقديم.' : 'CV linked successfully! Automated evaluation and accredited tier scoring will run immediately upon form submission.'}</small>`;
                }
            }
        });
    }

    // Direct Video File Upload Handler (Max 120 seconds)
    if (videoFileInput) {
        videoFileInput.addEventListener("change", async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            const isAr = AppState.currentLang === "ar";

            // Inspect video duration client-side to verify <= 120 seconds
            const checkDuration = () => new Promise((resolve) => {
                const tempVideo = document.createElement("video");
                tempVideo.preload = "metadata";
                tempVideo.onloadedmetadata = () => {
                    URL.revokeObjectURL(tempVideo.src);
                    resolve(tempVideo.duration || 0);
                };
                tempVideo.onerror = () => resolve(0);
                tempVideo.src = URL.createObjectURL(file);
            });

            const durationSec = await checkDuration();
            if (durationSec > 125) {
                showToast(isAr
                    ? `تنبيه: مدة الفيديو (${Math.round(durationSec)} ثانية) تتجاوز 120 ثانية. سيتم تقييم أول 120 ثانية فقط.`
                    : `Note: Video length (${Math.round(durationSec)}s) is over 2 minutes. Only the first 120 seconds will be reviewed.`);
            }

            if (videoUploadStatus) {
                videoUploadStatus.style.display = "block";
                videoUploadStatus.style.color = "var(--gold-bright)";
                videoUploadStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? 'جاري رفع ملف الفيديو إلى الخادم...' : 'Uploading video file...'}`;
            }

            try {
                const res = await fetch(`/api/upload-video`, {
                    method: "POST",
                    headers: {
                        "Content-Type": file.type || "video/mp4",
                        "X-File-Name": encodeURIComponent(file.name)
                    },
                    body: file
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.url && videoLinkInput) {
                        videoLinkInput.value = `${data.url}#t=0,120`;
                    }
                    if (videoUploadStatus) {
                        const durLabel = durationSec > 0 ? ` (${Math.min(120, Math.round(durationSec))}s)` : " (Max 120s)";
                        videoUploadStatus.style.color = "#34D399";
                        videoUploadStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'تم رفع الفيديو بنجاح وتفعيل رابط التحميل المباشر' : 'Video uploaded successfully'}${durLabel}: <a href="${data.url}?download=1" download style="color: var(--gold-bright); text-decoration: underline; margin-inline-start: 0.4rem;">${isAr ? 'تحميل الفيديو المرفوع' : 'Download Uploaded Video'}</a>`;
                    }
                } else {
                    throw new Error("Upload failed");
                }
            } catch (err) {
                // Fallback to local object URL if backend is unreachable
                const blobUrl = URL.createObjectURL(file);
                if (videoLinkInput) videoLinkInput.value = `${blobUrl}#t=0,120`;
                if (videoUploadStatus) {
                    videoUploadStatus.style.color = "#34D399";
                    videoUploadStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? 'تم تجهيز الفيديو محلياً للتحكيم (120 ثانية)' : 'Video file attached and ready for review (120s)'}`;
                }
            }
        });
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const isAr = AppState.currentLang === "ar";

            const val = (id) => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : "";
            };

            const fullName = val("appFullName");
            const email = val("appEmail");
            const phone = val("appPhone");
            const linkedIn = val("appLinkedIn");
            const website = val("appWebsite");

            const company = val("appCompany");
            const department = val("appDepartment");
            const jobTitle = val("appJobTitle");
            const hrEmail = val("appHrEmail");
            const careerPositions = val("appCareerPositions");
            const cohort = val("appCohort") || "Cohort A";
            const availability = val("appAvailability") || "Available";

            const expYears = parseInt(expInput ? expInput.value : "15", 10) || 15;
            const domainId = val("appDomain");
            const domainObj = PETROLEUM_DOMAINS.find(d => d.id === domainId);
            const subId = val("appSubDiscipline");
            const subObj = domainObj?.subDisciplines?.find(s => s.id === subId);

            // Academic Certificates (Section 4)
            const bsc = { field: val("bscField"), university: val("bscUniversity"), year: val("bscYear") };
            const msc = { field: val("mscField"), university: val("mscUniversity"), year: val("mscYear") };
            const phd = { field: val("phdField"), university: val("phdUniversity"), year: val("phdYear") };

            // Collect selected discipline-specific certs (Section 5)
            const selectedCerts = [];
            document.querySelectorAll(".app-cert:checked").forEach(cb => selectedCerts.push(cb.value));
            
            const customVal = customCertInput ? customCertInput.value.trim() : "";
            if (customVal) {
                selectedCerts.push(customVal);
            }
            const intlCertArea = val("intlCertArea");
            if (intlCertArea) selectedCerts.push(intlCertArea);
            const sophCertArea = val("sophCertArea");
            if (sophCertArea) selectedCerts.push(sophCertArea);

            // Mandatory validation for Certifications
            if (selectedCerts.length === 0) {
                showToast(isAr
                    ? "يرجى اختيار شهادة مهنية واحدة على الأقل أو كتابتها في حقل الشهادات (حقل إلزامي *)."
                    : "Please select or enter at least one professional certificate (Required *).");
                return;
            }

            // Collect 7 Training Programs (Section 7)
            const programs = [];
            for (let i = 1; i <= 7; i++) {
                const p = val(`prog${i}`);
                if (p) programs.push(p);
            }

            // Mandatory validation for Video Pitch (Section 8)
            const videoUrlVal = videoLinkInput ? videoLinkInput.value.trim() : "";
            if (!videoUrlVal) {
                showToast(isAr
                    ? "يرجى رفع فيديو العرض التقديمي (120 ثانية) أو وضع رابط الفيديو (حقل إلزامي *)."
                    : "Please upload a 2-minute intro video or paste a video link (Required *).");
                return;
            }

            // Required Attachments & Declaration (Sections 9 & 10)
            const getFileName = (id, fallback) => {
                const el = document.getElementById(id);
                return (el && el.files && el.files[0]) ? el.files[0].name : fallback;
            };
            const bankAccount = val("appBankAccount");
            const declCheck = document.getElementById("appDeclarationCheck");
            const declName = val("appDeclName") || fullName;
            const signature = val("appSignature") || fullName;

            if (declCheck && !declCheck.checked) {
                showToast(isAr
                    ? "يرجى الموافقة على الإقرار الرسمي بصحة البيانات للتقديم."
                    : "Please check the confirmation box at the bottom of the form to submit.");
                return;
            }

            // Calculate Gate 1 points (Out of 1000 Points):
            const expPoints = Math.min(expYears * 40, 600);
            const degreeVal = degreeSelect ? degreeSelect.value : (phd.field ? "PhD" : (msc.field ? "Master" : "Bachelor"));
            const degreeWeight = degreeVal === "PhD" ? 100 : (degreeVal === "Master" ? 70 : 40);
            const expertClassVal = expertClassSelect ? expertClassSelect.value : "local";
            const expertClassPts = expertClassVal === "international" ? 100 : (expertClassVal === "regional" ? 70 : 40);
            const certPoints = Math.min(100, selectedCerts.length * 50);
            const englishVal = englishSelect ? englishSelect.value : "Fluent";
            const englishPts = englishVal === "Fluent" ? 100 : (englishVal === "Intermediate" ? 70 : 40);

            const totalPoints = Math.min(1000, expPoints + degreeWeight + expertClassPts + certPoints + englishPts);
            const percentage = Math.min(100, Math.round(totalPoints / 10));

            const newId = `CAN-0${AppState.candidates.length + 1}`;
            const newCode = `XP-0${100 + AppState.candidates.length + 1}`;

            const gate1Breakdown = {
                expPoints,
                degreePts: degreeWeight,
                expertClassPts,
                certPts: certPoints,
                englishPts,
                totalPoints
            };

            const registrationDetails = {
                phone,
                linkedIn,
                website,
                department,
                hrEmail,
                careerPositions,
                availability,
                bsc,
                msc,
                phd,
                profCerts: { names: customVal, year: val("profCertYear") },
                intlCerts: { area: intlCertArea, institution: val("intlCertInst"), year: val("intlCertYear") },
                sophCerts: { area: sophCertArea, institution: val("sophCertInst"), year: val("sophCertYear") },
                programs,
                cvUrl: val("appCvUploadedUrl"),
                cvFileName: getFileName("appCvFile", "Applicant_CV.pdf"),
                certsFileName: getFileName("appCertsFile", "Certificates_Bundle.pdf"),
                idFileName: getFileName("appIdFile", "National_ID.pdf"),
                bankAccount,
                declarationAccepted: true,
                declarationName: declName,
                signature,
                submittedAt: new Date().toISOString()
            };

            const defaultMatrixScores = {};
            for (let i = 1; i <= 19; i++) {
                defaultMatrixScores[i] = totalPoints >= 850 ? 10 : 8;
            }

            const newCandidate = {
                id: newId,
                code: newCode,
                fullNameEn: fullName,
                fullNameAr: fullName,
                email: email,
                jobTitle: jobTitle,
                company: company,
                cohort: cohort,
                cohortDescEn: cohort === "Cohort A" ? "Group A: Current Sector Employee" : "Group B: Retired Expert / Consultant",
                cohortDescAr: cohort === "Cohort A" ? "الدفعة (أ): ممارس حالي بالخدمة" : "الدفعة (ب): خبير متقاعد / قامة استشارية",
                gender: "male",
                domainId: domainId,
                domainEn: domainObj ? domainObj.nameEn : "Engineering",
                domainAr: domainObj ? domainObj.nameAr : "هندسة",
                subDisciplineEn: subObj ? subObj.nameEn : "Specialized Field",
                subDisciplineAr: subObj ? subObj.nameAr : "تخصص ميداني معتمد",
                experienceYears: expYears,
                degreeEn: `${degreeVal} (${bsc.field || 'Engineering'})`,
                degreeAr: `${degreeVal} (${bsc.field || 'هندسة'})`,
                degreeLevel: degreeVal,
                expertClassification: expertClassVal,
                certs: selectedCerts,
                englishProficiency: englishVal,
                pitchVideoUrl: videoUrlVal,
                screeningStatus: totalPoints >= 750 ? "Qualified (Gate 1)" : "Under Review",
                gate1Points: totalPoints,
                gate1Percentage: percentage,
                gate1Breakdown: gate1Breakdown,
                registrationDetails: registrationDetails,
                competencyMatrixScores: defaultMatrixScores,
                blindScores: { demeanor: 8, clarity: 8, bodyLang: 8, decision: totalPoints >= 750 ? "Advance" : "Under Review" },
                liveScores: { cognitive: 8.5, technical: 8.5, interpersonal: 8.5 },
                compositeScore: totalPoints >= 850 ? 92.0 : 80.0,
                tierEn: totalPoints >= 850 ? "Master Trainer / Senior Advisor" : "Certified Senior Trainer",
                tierAr: totalPoints >= 850 ? "خبير معتمد / فئة النجوم (Master Star)" : "مدرب أول معتمد (Senior Trainer)",
                badgeClass: totalPoints >= 850 ? "badge-master" : "badge-senior",
                allowedAssignmentEn: totalPoints >= 850
                    ? "Approved for Senior Management Programs, Strategic Workshops & Major Projects"
                    : "Approved for Advanced Specialized Courses, Technical Workshops & Coaching",
                allowedAssignmentAr: totalPoints >= 850
                    ? "الإدارة العليا، اللجان التوجيهية ومشاريع الطاقة الرأسمالية الكبرى"
                    : "البرامج التخصصية المتقدمة وورش العمل الفنية والكوتشينغ",
                tqiScore: 4.85,
                coursesDelivered: 7,
                traineesCount: 140,
                seciCaseStudyEn: `Prepared 7 specialized training courses and practical field case studies in ${domainObj ? domainObj.nameEn : 'Petroleum Operations'}.`,
                seciCaseStudyAr: `توثيق ونمذجة 7 برامج تدريبية تخصصية وحلول ميدانية في مجال ${domainObj ? domainObj.nameAr : 'العمليات البترولية'}.`
            };

            // Apply Automated End-to-End Evaluation based on application data & lecturer assessment criteria
            evaluateCandidateEndToEnd(newCandidate);

            // Save to Persistent SQLite Database
            const savedCandidate = await DbService.saveCandidate(newCandidate);
            const activeCand = savedCandidate || newCandidate;

            AppState.candidates.unshift(activeCand);
            AppState.activeEvaluatingCandidateId = activeCand.id;

            renderLecturerAssessmentDashboard();
            renderScreeningTable();
            renderSkillsBank();
            updateExecutiveKpiMetrics();
            updateEvaluatingCandidateDisplay();
            DbService.updateDbStatusUi(AppState.isDbConnected, AppState.candidates.length);
            form.reset();
            if (declNameInput) delete declNameInput.dataset.edited;
            if (signatureInput) delete signatureInput.dataset.edited;
            if (videoUploadStatus) videoUploadStatus.style.display = "none";
            populateDomainDropdowns(); // Re-sync domain, certs, and 7 specialty programs
            showToast("toastSubmitted");
            setTimeout(() => {
                if (window.switchRoleView) {
                    window.switchRoleView("screeningView");
                }
            }, 1000);
        });
    }
}

// ==============================================================================
// 6. SKILLS BANK REPOSITORY & MODAL DOSSIER
// ==============================================================================
function renderSkillsBank() {
    const container = document.getElementById("expertsGrid");
    if (!container) return;

    const isAr = AppState.currentLang === "ar";
    container.innerHTML = "";

    // Filter Candidates based on active filter & search query
    const filtered = AppState.candidates.filter(c => {
        // Filter Chip Match
        let filterMatch = true;
        if (AppState.activeSearchFilter === "Cohort B") {
            filterMatch = c.cohort === "Cohort B";
        } else if (AppState.activeSearchFilter === "master") {
            filterMatch = c.compositeScore >= 90;
        } else if (AppState.activeSearchFilter !== "all") {
            filterMatch = c.domainId === AppState.activeSearchFilter;
        }

        // Search Query Match
        let queryMatch = true;
        if (AppState.searchQuery) {
            const q = AppState.searchQuery.toLowerCase();
            const fullNameEn = (c.fullNameEn || "").toLowerCase();
            const fullNameAr = (c.fullNameAr || "").toLowerCase();
            const comp = (c.company || "").toLowerCase();
            const domEn = (c.domainEn || "").toLowerCase();
            const domAr = (c.domainAr || "").toLowerCase();
            const subEn = (c.subDisciplineEn || "").toLowerCase();
            const subAr = (c.subDisciplineAr || "").toLowerCase();

            queryMatch = fullNameEn.includes(q) || fullNameAr.includes(q) || 
                         comp.includes(q) || domEn.includes(q) || domAr.includes(q) ||
                         subEn.includes(q) || subAr.includes(q);
        }

        return filterMatch && queryMatch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fa-solid fa-users-slash" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--gold-bright);"></i>
                <div style="font-size: 1.1rem; font-weight: 600; color: #FFFFFF; margin-bottom: 0.35rem;">
                    ${isAr ? 'لا يوجد خبراء أو مدربون مسجلون في بنك المهارات حالياً' : 'No Approved Trainers Listed Yet'}
                </div>
                <div style="font-size: 0.85rem;">
                    ${isAr 
                        ? 'يرجى تسجيل مرشح جديد من بوابة المتقدمين أو مراجعة معايير البحث والفلترة.' 
                        : 'Please register an applicant in the Trainer Registration page or change your search filter.'}
                </div>
            </div>
        `;
        return;
    }

    filtered.forEach(cand => {
        const card = document.createElement("div");
        card.className = "expert-card";

        const name = isAr ? cand.fullNameAr : cand.fullNameEn;
        const tier = isAr ? cand.tierAr : cand.tierEn;
        const domain = isAr ? cand.domainAr : cand.domainEn;
        const sub = isAr ? cand.subDisciplineAr : cand.subDisciplineEn;
        const jobLine = cand.jobTitle ? `<div style="font-size: 0.78rem; color: #E2E8F0; margin-bottom: 0.2rem;">${cand.jobTitle}</div>` : "";

        card.innerHTML = `
            <div>
                <div class="expert-card-top">
                    <span class="expert-tier-badge ${cand.badgeClass || 'badge-master'}">${tier}</span>
                    <span class="cohort-tag ${cand.cohort === 'Cohort A' ? 'cohort-a' : 'cohort-b'}">${cand.cohort}</span>
                </div>
                <div class="expert-info-main">
                    <div class="expert-name">${name}</div>
                    ${jobLine}
                    <div class="expert-company-discipline">
                        <strong>${cand.company}</strong> &bull; ${domain}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--gold-bright); margin-top: 0.25rem;">
                        <i class="fa-solid fa-certificate"></i> ${sub}
                    </div>
                </div>
            </div>

            <div>
                <div class="expert-card-metrics">
                    <div class="mini-metric-item">
                        <div class="val">${cand.experienceYears} Yrs</div>
                        <div class="lbl">${isAr ? 'الخبرة' : 'Experience'}</div>
                    </div>
                    <div class="mini-metric-item">
                        <div class="val">${cand.tqiScore || 4.9}</div>
                        <div class="lbl">${isAr ? 'مؤشر TQI' : 'Quality Rating'}</div>
                    </div>
                    <div class="mini-metric-item">
                        <div class="val">${cand.compositeScore || 90}%</div>
                        <div class="lbl">${isAr ? 'التقييم العام' : 'Total Score'}</div>
                    </div>
                </div>

                <button class="btn-view-dossier" onclick="openExpertDossier('${cand.id}')">
                    <i class="fa-solid fa-address-card"></i>
                    <span>${isAr ? 'عرض الملف التفصيلي والخارطة' : 'View Trainer Profile'}</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function initSkillsFilterAndSearch() {
    const searchInput = document.getElementById("skillsSearchInput");
    const chips = document.querySelectorAll(".filter-chip");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            AppState.searchQuery = e.target.value.trim();
            renderSkillsBank();
        });
    }

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            AppState.activeSearchFilter = chip.getAttribute("data-filter");
            renderSkillsBank();
        });
    });
}

// Dossier Modal
function initDossierModal() {
    const modal = document.getElementById("dossierModal");
    const closeBtn = document.getElementById("modalCloseBtn");
    const reqBtn = document.getElementById("btnRequestTrainerSecondment");

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("active");
        });
    }

    if (reqBtn) {
        reqBtn.addEventListener("click", () => {
            showToast("toastSecondmentRequested");
            if (modal) modal.classList.remove("active");
        });
    }
}

window.openExpertDossier = function(candidateId) {
    const cand = AppState.candidates.find(c => c.id === candidateId);
    if (!cand) return;

    const isAr = AppState.currentLang === "ar";
    const modal = document.getElementById("dossierModal");

    document.getElementById("modalExpertCode").textContent = cand.code;
    document.getElementById("modalExpertName").textContent = isAr ? cand.fullNameAr : cand.fullNameEn;
    const jobPrefix = cand.jobTitle ? `${cand.jobTitle} | ` : "";
    document.getElementById("modalExpertMeta").textContent = `${jobPrefix}${cand.company} | ${isAr ? cand.domainAr : cand.domainEn} • ${isAr ? cand.subDisciplineAr : cand.subDisciplineEn}`;
    
    const tierTag = document.getElementById("modalExpertTier");
    tierTag.className = `tier-tag ${cand.badgeClass || 'badge-master'}`;
    tierTag.textContent = isAr ? cand.tierAr : cand.tierEn;

    document.getElementById("modalExpertCohort").textContent = isAr ? cand.cohortDescAr : cand.cohortDescEn;
    document.getElementById("modalExpYears").textContent = `${cand.experienceYears} ${isAr ? 'سنة خبرة' : 'Years Experience'}`;
    document.getElementById("modalTqiScore").textContent = `${cand.tqiScore || 4.9} / 5.0`;
    document.getElementById("modalCoursesDelivered").textContent = `${cand.coursesDelivered || 12} Courses (${cand.traineesCount || 300} Trainees)`;

    // Tripartite Progress Bars
    const cogPct = Math.round((cand.liveScores?.cognitive || 9.5) * 10);
    const techPct = Math.round((cand.liveScores?.technical || 9.3) * 10);
    const interPct = Math.round((cand.liveScores?.interpersonal || 9.2) * 10);

    document.getElementById("modalCognitivePct").textContent = `${cogPct}%`;
    document.getElementById("modalCognitiveBar").style.width = `${cogPct}%`;

    document.getElementById("modalTechnicalPct").textContent = `${techPct}%`;
    document.getElementById("modalTechnicalBar").style.width = `${techPct}%`;

    document.getElementById("modalInterpersonalPct").textContent = `${interPct}%`;
    document.getElementById("modalInterpersonalBar").style.width = `${interPct}%`;

    // SECI Case Study
    document.getElementById("modalSeciCaseStudy").textContent = isAr ? cand.seciCaseStudyAr : cand.seciCaseStudyEn;

    if (modal) modal.classList.add("active");
};

// ==============================================================================
// 7. CSV TABULAR EXPORT UTILITY
// ==============================================================================
function initCsvExport() {
    const btnExport = document.getElementById("btnExportCsv");
    if (!btnExport) return;

    btnExport.addEventListener("click", () => {
        exportSkillsBankToCSV();
    });
}

function exportSkillsBankToCSV() {
    const headers = [
        "Trainer ID",
        "Full Name (EN)",
        "Full Name (AR)",
        "Job Title",
        "Email",
        "Company",
        "Group",
        "Training Area",
        "Specialty",
        "Years of Experience",
        "University Degree",
        "Gate 1 Score",
        "Final Evaluation Score (%)",
        "Approved Trainer Level",
        "Quality Rating (TQI)",
        "Courses Delivered",
        "Proposed Courses Summary"
    ];

    const rows = AppState.candidates.map(c => [
        `"${c.code}"`,
        `"${c.fullNameEn}"`,
        `"${c.fullNameAr}"`,
        `"${c.jobTitle || ''}"`,
        `"${c.email || ''}"`,
        `"${c.company}"`,
        `"${c.cohort}"`,
        `"${c.domainEn}"`,
        `"${c.subDisciplineEn}"`,
        c.experienceYears,
        `"${c.degreeEn}"`,
        c.gate1Points,
        c.compositeScore,
        `"${c.tierEn}"`,
        c.tqiScore,
        c.coursesDelivered,
        `"${(c.seciCaseStudyEn || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ENPPI_XpertGate_Approved_Trainers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("toastExported");
}

// ==============================================================================
// 120-SECOND CINEMATIC PROMOTIONAL VIDEO THEATER CONTROLLER
// High-Tech Cinematic Engine, Web Audio Synthesizer & Speech Sync
// ==============================================================================
const PromoVideoPlayer = {
    duration: 120, // 120 seconds (2:00)
    currentTime: 0,
    isPlaying: false,
    isMuted: false,
    intervalId: null,
    audioCtx: null,
    ambientGain: null,
    pulseTimer: null,
    currentSceneIndex: 1,
    lastSpokenIndex: -1,

    captions: [
        { start: 0, end: 6, scene: 1, ar: "في قطاعٍ يصنع طاقة الوطن.. المعرفة قوة، والخبرة التراكمية هي أثمن ما نملك.", en: "In an industry powering our nation.. knowledge is strength, and practical experience is our greatest asset." },
        { start: 7, end: 13, scene: 1, ar: "كم من خبرة استثنائية بُنيت عبر عقود وسط الحقول ومواقع الإنتاج؟", en: "Decades of extraordinary wisdom were forged amidst operating fields and production sites." },
        { start: 14, end: 19, scene: 1, ar: "العلم والمعرفة، الخبرة الميدانية، وشغف نقل الأثر.. ثالوث يصنع قادة الغد!", en: "Science, field know-how, and passion for delivery: the triad shaping tomorrow's leaders!" },
        { start: 20, end: 27, scene: 2, ar: "برعاية وزارة البترول والثروة المعدنية.. تطلق إنبي منصة: ENPPI XpertGate", en: "Under the Auspices of the Ministry of Petroleum: ENPPI proudly launches ENPPI XpertGate." },
        { start: 28, end: 36, scene: 2, ar: "مجمع الخبراء والمدربين المعتمدين.. يجمع الدفعة (أ) ممارسي الخدمة النشطين، والدفعة (ب) كبار الخبراء المتقاعدين.", en: "A certified pool uniting active sector cadres (Cohort A) and senior retired industry legends (Cohort B)." },
        { start: 37, end: 44, scene: 2, ar: "في 13 تخصصاً استراتيجياً.. لنحقق أكثر من 70% اكتفاء ذاتياً من احتياجاتنا التدريبية محلياً.", en: "Spanning 13 strategic disciplines to achieve over 70% self-sufficiency in specialized training." },
        { start: 45, end: 54, scene: 3, ar: "محرك فرز ذكي ومحايد بالكامل.. يبدأ بـ 1000 نقطة فحص آلي للسيرة الذاتية وسنوات الخبرة والشهادات.", en: "A smart objective evaluation engine starting with 1000 Gate 1 points scanning CVs, experience, and certificates." },
        { start: 55, end: 64, scene: 3, ar: "ثم منصة التقييم المعياري لعرض الـ 120 ثانية الحيادي دون انحياز.", en: "Followed by the 120-second blind presentation platform, ensuring 100% merit-based assessment." },
        { start: 65, end: 74, scene: 3, ar: "3 معايير صارمة: المعرفة 35%، كفاءة التدريب والعرض 35%، والوقار والحضور 30%.", en: "Three rigorous pillars: Knowledge (35%), Delivery (35%), and Executive Presence (30%)." },
        { start: 75, end: 86, scene: 4, ar: "اعتماد رسمي يحمل هيبة وريادة قطاع البترول المصري.. بدرجات Master Star و Senior و Associate.", en: "Official prestige accredited across Master Star, Senior Trainer, and Associate tiers." },
        { start: 87, end: 99, scene: 4, ar: "تكليف رسمي بمكافآت تدريبية مجزية.. واستثمار ملايين الدولارات في عقول وكفاءات أبناء الوطن.", en: "Rewarded training assignments saving millions in hard currency by investing directly in our national talent." },
        { start: 100, end: 110, scene: 5, ar: "مهندس، جيولوجي، أو خبير إدارة.. خبرتك الميدانية هي ثروة هذا الوطن وأثمن ما تقدمه للأجيال.", en: "Engineer, geologist, or management expert: your field wisdom is a national treasure for future generations." },
        { start: 111, end: 120, scene: 5, ar: "بوابتك مفتوحة الآن! انضم لصفوة مدربي قطاع البترول المصري.. سجّل بياناتك عبر إنبي إكسبرت جيت.", en: "Your gateway is open! Join the elite certified trainers of the Egyptian petroleum sector today." }
    ],

    init() {
        this.updateTimeDisplay();
        this.updateSceneState();
    },

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    play() {
        if (this.currentTime >= this.duration) {
            this.currentTime = 0;
            this.lastSpokenIndex = -1;
        }

        this.isPlaying = true;
        this.updatePlayBtnUi(true);

        const visualizer = document.getElementById("promoAudioVisualizer");
        if (visualizer) visualizer.classList.remove("paused");

        this.initAudioContext();
        this.startAmbientMusic();

        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.currentTime += 1;
            if (this.currentTime > this.duration) {
                this.currentTime = this.duration;
                this.pause();
                return;
            }
            this.tick();
        }, 1000);

        this.tick(); // Immediate first tick
    },

    pause() {
        this.isPlaying = false;
        clearInterval(this.intervalId);
        this.updatePlayBtnUi(false);
        this.stopAmbientMusic();

        const visualizer = document.getElementById("promoAudioVisualizer");
        if (visualizer) visualizer.classList.add("paused");

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    },

    restart() {
        this.pause();
        this.currentTime = 0;
        this.lastSpokenIndex = -1;
        this.seekTo(0);
        this.play();
    },

    seekTo(seconds) {
        this.currentTime = Math.min(this.duration, Math.max(0, parseInt(seconds, 10)));
        this.lastSpokenIndex = -1;
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        this.tick();
    },

    jumpToTime(seconds) {
        this.seekTo(seconds);
        if (!this.isPlaying) {
            this.play();
        }
    },

    tick() {
        this.updateTimeDisplay();
        this.updateScrubberUi();
        this.updateSceneState();
        this.syncCaptionsAndVoice();
    },

    updateTimeDisplay() {
        const curMin = Math.floor(this.currentTime / 60);
        const curSec = this.currentTime % 60;
        const durMin = Math.floor(this.duration / 60);
        const durSec = this.duration % 60;

        const timeStr = `${String(curMin).padStart(2, "0")}:${String(curSec).padStart(2, "0")} / ${String(durMin).padStart(2, "0")}:${String(durSec).padStart(2, "0")}`;

        const display = document.getElementById("promoElapsedDisplay");
        if (display) display.textContent = timeStr;
    },

    updateScrubberUi() {
        const scrubber = document.getElementById("promoScrubber");
        if (scrubber) scrubber.value = this.currentTime;

        // Update active markers
        document.querySelectorAll(".scrubber-scenes-markers .marker").forEach(m => {
            const t = parseInt(m.getAttribute("data-time") || "0", 10);
            if (this.currentTime >= t) {
                m.classList.add("active");
            } else {
                m.classList.remove("active");
            }
        });
    },

    updateSceneState() {
        let activeScene = 1;
        if (this.currentTime >= 100) activeScene = 5;
        else if (this.currentTime >= 75) activeScene = 4;
        else if (this.currentTime >= 45) activeScene = 3;
        else if (this.currentTime >= 20) activeScene = 2;
        else activeScene = 1;

        if (activeScene !== this.currentSceneIndex) {
            this.playTransitionSound();
            this.currentSceneIndex = activeScene;
        }

        // Toggle scene DOM active states
        for (let i = 1; i <= 5; i++) {
            const sceneEl = document.getElementById(`promoScene${i}`);
            if (sceneEl) {
                if (i === activeScene) sceneEl.classList.add("active");
                else sceneEl.classList.remove("active");
            }
        }

        // Update pills active states
        document.querySelectorAll(".scene-pills-quick .scene-pill-btn").forEach(btn => {
            const s = parseInt(btn.getAttribute("data-s") || "1", 10);
            if (s === activeScene) btn.classList.add("active");
            else btn.classList.remove("active");
        });
    },

    syncCaptionsAndVoice() {
        const captionObj = this.captions.find(c => this.currentTime >= c.start && this.currentTime <= c.end);
        const captionIdx = this.captions.findIndex(c => this.currentTime >= c.start && this.currentTime <= c.end);

        const elAr = document.getElementById("promoCaptionAr");
        const elEn = document.getElementById("promoCaptionEn");

        if (captionObj) {
            if (elAr) elAr.textContent = captionObj.ar;
            if (elEn) elEn.textContent = captionObj.en;

            // Trigger Voiceover if not yet spoken for this segment and not muted
            if (this.isPlaying && !this.isMuted && captionIdx !== this.lastSpokenIndex) {
                this.lastSpokenIndex = captionIdx;
                this.speakNarratorLine(captionObj.ar);
            }
        }
    },

    speakNarratorLine(text) {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel(); // Cancel previous utterance

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ar-EG";
        utterance.rate = 1.05; // Lively radio broadcast pace
        utterance.pitch = 1.0;

        // Try finding an Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes("ar"));
        if (arVoice) utterance.voice = arVoice;

        window.speechSynthesis.speak(utterance);
    },

    updatePlayBtnUi(isPlaying) {
        const icon = document.getElementById("promoPlayIcon");
        if (icon) {
            icon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
        }
    },

    toggleAudio() {
        this.isMuted = !this.isMuted;
        const icon = document.getElementById("promoAudioIcon");
        const label = document.getElementById("promoAudioLabel");
        const toggleBtn = document.getElementById("btnPromoAudioToggle");

        if (this.isMuted) {
            if (icon) icon.className = "fa-solid fa-volume-xmark";
            if (label) label.textContent = AppState.currentLang === "ar" ? "الصوت مكتوم" : "Sound Muted";
            if (toggleBtn) toggleBtn.classList.add("muted");
            if (this.ambientGain) this.ambientGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        } else {
            if (icon) icon.className = "fa-solid fa-volume-high";
            if (label) label.textContent = AppState.currentLang === "ar" ? "الصوت مفعل (VO & FX)" : "Sound On (VO & FX)";
            if (toggleBtn) toggleBtn.classList.remove("muted");
            if (this.ambientGain) this.ambientGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            // Resume speech for current caption
            this.lastSpokenIndex = -1;
            this.syncCaptionsAndVoice();
        }
    },

    initAudioContext() {
        if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioCtx = new AudioContextClass();
            }
        }
        if (this.audioCtx && this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }
    },

    startAmbientMusic() {
        if (!this.audioCtx || this.isMuted) return;

        try {
            // Ambient drone pad (Low frequency harmonic oscillators)
            const osc1 = this.audioCtx.createOscillator();
            const osc2 = this.audioCtx.createOscillator();
            const filter = this.audioCtx.createBiquadFilter();
            this.ambientGain = this.audioCtx.createGain();

            osc1.type = "sine";
            osc1.frequency.setValueAtTime(65.41, this.audioCtx.currentTime); // C2

            osc2.type = "triangle";
            osc2.frequency.setValueAtTime(130.81, this.audioCtx.currentTime); // C3

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

            this.ambientGain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.audioCtx.destination);

            osc1.start();
            osc2.start();

            this.oscNodes = [osc1, osc2];

            // Rhythm pulse / heartbeat
            this.pulseTimer = setInterval(() => {
                if (this.isPlaying && !this.isMuted) {
                    this.playPulseKick();
                }
            }, 3000);

        } catch (e) {
            console.warn("Web Audio ambient synth init note:", e);
        }
    },

    stopAmbientMusic() {
        if (this.pulseTimer) {
            clearInterval(this.pulseTimer);
            this.pulseTimer = null;
        }
        if (this.oscNodes) {
            this.oscNodes.forEach(osc => {
                try { osc.stop(); } catch (e) {}
            });
            this.oscNodes = null;
        }
    },

    playPulseKick() {
        if (!this.audioCtx || this.isMuted) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.frequency.setValueAtTime(55, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.6);
            gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.6);
        } catch (e) {}
    },

    playTransitionSound() {
        if (!this.audioCtx || this.isMuted) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(1174.66, this.audioCtx.currentTime + 0.4); // D6
            gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.4);
        } catch (e) {}
    },

    toggleFullscreen() {
        const screen = document.getElementById("cinemaScreen");
        if (!screen) return;
        if (!document.fullscreenElement) {
            screen.requestFullscreen().catch(err => {
                console.warn("Fullscreen request error:", err);
            });
        } else {
            document.exitFullscreen();
        }
    },

    jumpToRegister() {
        closePromoVideoModal();
        switchRoleView("applicantView");
        const form = document.getElementById("applicantIntakeForm");
        if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
};

// Global Launchers
function openPromoVideoModal() {
    const modal = document.getElementById("promoVideoModal");
    if (!modal) return;
    modal.style.display = "flex";
    PromoVideoPlayer.init();
    PromoVideoPlayer.play();
}

function closePromoVideoModal() {
    const modal = document.getElementById("promoVideoModal");
    if (modal) modal.style.display = "none";
    PromoVideoPlayer.pause();
}


