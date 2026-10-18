// ==============================================================================
// ENPPI XPERTGATE: TRAINERS & EXPERTS POOL
// Official Initial Dataset, Petroleum Knowledge Taxonomy & Master Operational Workflow
// ==============================================================================

const PETROLEUM_DOMAINS = [
    {
        id: "upstream",
        nameEn: "Upstream (Exploration & Production)",
        nameAr: "الاستكشاف والإنتاج (Upstream)",
        icon: "fa-solid fa-oil-well",
        badgeAr: "قطاع المنبع والاستكشاف",
        badgeEn: "E&P Core Discipline",
        summaryAr: "سلسلة القيمة الأساسية لاستكشاف المكامن الهيدروكربونية، المسح الجيوفيزيائي، حفر الآبار العميقة والإنتاج السطحي والمحاكاة المتقدمة.",
        summaryEn: "Core value chain encompassing petroleum geology, geophysics, well petrophysics, reservoir simulation, drilling engineering, and production optimization.",
        subDisciplines: [
            { id: "exp_geo", nameEn: "Exploration - Geology", nameAr: "الاستكشاف - الجيولوجيا" },
            { id: "exp_geophys", nameEn: "Exploration - Geophysics", nameAr: "الاستكشاف - الجيوفيزياء" },
            { id: "exp_petrophys", nameEn: "Exploration - Petrophysics", nameAr: "الاستكشاف - البتروفيزياء" },
            { id: "pet_drilling", nameEn: "Petroleum Eng - Drilling", nameAr: "هندسة البترول - الحفر" },
            { id: "pet_reservoir", nameEn: "Petroleum Eng - Reservoir", nameAr: "هندسة البترول - المكامن" },
            { id: "prod_eng", nameEn: "Production Engineering", nameAr: "هندسة الإنتاج" },
            { id: "prod_tech", nameEn: "Production Technology", nameAr: "تكنولوجيا الإنتاج" },
            { id: "sim_training", nameEn: "Simulator-Based Training", nameAr: "التدريب القائم على المحاكاة" }
        ],
        certs: [
            "SPE Certified Petroleum Professional",
            "AAPG Certified Petroleum Geologist",
            "IWCF Well Control Level 4/5",
            "IADC WellSharp Supervisor",
            "EAGE Professional Member",
            "Reservoir Simulation & Eclipse Certified"
        ],
        competenciesAr: [
            "تفسير السيزميك ومحاكاة النماذج الجيولوجية ثلاثية الأبعاد",
            "إدارة عمليات التحكم في ضغوط الآبار (Well Control) والمخاطر الميدانية",
            "هندسة حقن المياه والغاز والاستخلاص الإضافي للنفط (EOR)",
            "تشغيل أجهزة المحاكاة المتقدمة لمنصات الحفر والإنتاج"
        ],
        competenciesEn: [
            "3D Seismic Interpretation & Geological Modeling",
            "Advanced Well Control & Drilling Hazard Mitigation",
            "Enhanced Oil Recovery (EOR) & Reservoir Management",
            "Drilling & Production Dynamic Simulator Operation"
        ],
        priorityTopicsAr: [
            "تحليل تسجيلات الآبار المفتوحة والمغلفة (Well Logging)",
            "تطوير استراتيجيات نضوب المكامن المعقدة وغير التقليدية",
            "تكامل نظم الرفع الاصطناعي (Gas Lift / ESP Systems)",
            "تقنيات الحفر الأفقي والموجه الذكي (Directional Drilling)"
        ],
        priorityTopicsEn: [
            "Open-hole & Cased-hole Well Log Petrophysics",
            "Unconventional & Complex Reservoir Depletion Strategy",
            "Artificial Lift Engineering & Optimization (ESP/Gas Lift)",
            "Directional & Horizontal High-Angle Well Trajectory Drilling"
        ]
    },
    {
        id: "midstream",
        nameEn: "Midstream (Transportation & Storage)",
        nameAr: "النقل والتوزيع والمعالجة (Midstream)",
        icon: "fa-solid fa-arrows-split-up-and-left",
        badgeAr: "شبكات النقل والأنابيب",
        badgeEn: "Pipeline & Logistics Discipline",
        summaryAr: "منظومة النقل الهيدروليكي للمنتجات البترولية والغاز الطبيعي، سلامة شبكات الأنابيب القومية، ومحطات الضغط ومستودعات التخزين الاستراتيجي.",
        summaryEn: "Hydraulic transportation of crude and natural gas, national pipeline integrity management, compressor/pumping stations, and strategic storage systems.",
        subDisciplines: [
            { id: "mid_prep", nameEn: "Midstream Preparation", nameAr: "تجهيز خطوط وعمليات النقل" },
            { id: "mat_corr_insp", nameEn: "Material & Corrosion & Inspection", nameAr: "المواد والتآكل والتفتيش الفني" },
            { id: "pipe_system", nameEn: "Pipeline & Piping System", nameAr: "شبكات وخطوط الأنابيب والمحطات" }
        ],
        certs: [
            "API 1169 Pipeline Inspector",
            "NACE/AMPP CP-4 Cathodic Protection Specialist",
            "ASME B31.4 / B31.8 Pipeline Design",
            "CSWIP 3.1 Welding & Pipeline Inspection",
            "API 570 Piping Inspector"
        ],
        competenciesAr: [
            "تصميم ومطابقة خطوط النقل وفق كودات ASME B31.4 / B31.8",
            "هندسة الحماية المهبطية وتحليل التآكل النزفي في الخطوط المدفونة",
            "إدارة سلامة الأنابيب (PIMS) وتقنيات القشط الذكي (Intelligent Pigging)",
            "إدارة محطات تقوية الضغط والقياس المالي (Custody Transfer)"
        ],
        competenciesEn: [
            "Pipeline Hydraulics & Code Compliance (ASME B31.4 / B31.8)",
            "Cathodic Protection Design & Metallurgical Corrosion Control",
            "Pipeline Integrity Management Systems (PIMS) & Smart Pigging",
            "Compressor Station Operation & Custody Transfer Metering"
        ],
        priorityTopicsAr: [
            "فحص اللحامات بالموجات فوق الصوتية وتصنيف العيوب الميكانيكية",
            "إدارة مخاطر التعديات والتسريبات (Leak Detection Systems)",
            "تأهيل صمامات العزل السريع (ESD Valves) وغرف الاستقبال والإرسال",
            "كيمياء معالجة ونقل الغاز الطبيعي المضغوط"
        ],
        priorityTopicsEn: [
            "Ultrasonic & Radiographic Weld Defect Evaluation",
            "Pipeline Leak Detection & Emergency Response Automation",
            "Pig Launcher/Receiver Station Operations & ESD Systems",
            "Natural Gas Dehydration, Sweetening & Transmission Logistics"
        ]
    },
    {
        id: "downstream",
        nameEn: "Downstream & Engineering",
        nameAr: "التكرير والبتروكيماويات والهندسة (Downstream)",
        icon: "fa-solid fa-industry",
        badgeAr: "التكرير والهندسة البتروكيماوية",
        badgeEn: "Refining & Petrochemicals",
        summaryAr: "العمليات الصناعية لتحويل النفط الخام إلى مشتقات بترولية عالية القيمة، الهندسة الميكانيكية والكهربائية والمدنية، وتصميم المنشآت البحرية.",
        summaryEn: "Chemical and physical refining operations, petrochemical synthesis, civil/structural engineering, instrumentation, rotating machinery, and offshore platforms.",
        subDisciplines: [
            { id: "civil_eng", nameEn: "Civil Engineering", nameAr: "الهندسة المدنية والإنشائية" },
            { id: "const_qc", nameEn: "Construction & QC", nameAr: "إدارة التشييد ومراقبة الجودة" },
            { id: "elec_equip", nameEn: "Electrical Equipment & Loads", nameAr: "المعدات والأحمال الكهربائية" },
            { id: "elec_power_gen", nameEn: "Electrical Power Generation", nameAr: "توليد الطاقة الكهربائية" },
            { id: "power_sys_prot", nameEn: "Power System Protection", nameAr: "وقاية نظم القوى الكهربائية" },
            { id: "power_sys_stud", nameEn: "Power System Studies", nameAr: "دراسات استقرار نظم القوى" },
            { id: "hyd_pneu", nameEn: "Hydraulic & Pneumatic", nameAr: "الأنظمة الهيدروليكية والنيوماتيكية" },
            { id: "ei_systems", nameEn: "E&I", nameAr: "الكهرباء والأجهزة الدقيقة (E&I)" },
            { id: "lab_testing", nameEn: "Laboratory", nameAr: "المختبرات والتحاليل البترولية" },
            { id: "inst_control", nameEn: "Instrumentation & Control", nameAr: "أجهزة القياس والتحكم الآلي (DCS/PLC)" },
            { id: "proc_oper", nameEn: "Process Operation", nameAr: "تشغيل العمليات والوحدات الإنتاجية" },
            { id: "proc_design", nameEn: "Process Design", nameAr: "التصميم الهندسي للعمليات" },
            { id: "proc_tech", nameEn: "Process Technology", nameAr: "تكنولوجيا العمليات والتكرير" },
            { id: "proc_safety", nameEn: "Process Safety & Loss Prevention", nameAr: "سلامة العمليات ومنع الخسائر" },
            { id: "rot_stat_equip", nameEn: "Rotating & Static Equipment", nameAr: "المعدات الدوارة والثابتة" },
            { id: "wire_telecom", nameEn: "Wireless & Telecom", nameAr: "الاتصالات اللاسلكية والشبكات الصناعية" },
            { id: "offshore_eng", nameEn: "Offshore Engineering", nameAr: "الهندسة البحرية والمنصات" }
        ],
        certs: [
            "API 510 Pressure Vessel Inspector",
            "API 653 Aboveground Storage Tank Inspector",
            "CCPS Certified Process Safety Professional (CCPSC)",
            "IChemE Chartered Chemical Engineer",
            "ISA-CAP Certified Automation Professional",
            "ASME Section VIII Div 1 & 2 Design Specialist"
        ],
        competenciesAr: [
            "نمذجة وتصميم العمليات الكيميائية ومحاكاة Aspen HYSYS",
            "التفتيش على أوعية الضغط والمفاعلات وخزانات التخزين الكبرى",
            "إدارة نظم التحكم الآلي الموزع (DCS) وبروتوكولات الأمان الصناعي SIS/SIL",
            "تشخيص اهتزازات وعيوب التوربينات والمضخات والضواغط الترددية"
        ],
        competenciesEn: [
            "Chemical Process Design & Steady-State HYSYS Simulation",
            "Pressure Vessel & Column Integrity Audit (API 510/653)",
            "DCS Automation, Fieldbus Architecture & Safety Instrumented Systems (SIL)",
            "Vibration Diagnostics for Heavy Centrifugal & Gas Turbines"
        ],
        priorityTopicsAr: [
            "تقنيات التكسير الهيدروجيني والأزمرة والتكرير النظيف",
            "دراسات استقرار شبكات الكهرباء الصناعية ووقاية المحولات (ETAP)",
            "تصميم المنصات البحرية المقاومة للأمواج والتيارات العميقة",
            "دراسات المخاطر وقابلية التشغيل (HAZOP & LOPA Studies)"
        ],
        priorityTopicsEn: [
            "Hydrocracking, Catalytic Reforming & Clean Fuels Refining",
            "Industrial Power System Transient Stability & Relay Protection (ETAP)",
            "Offshore Jacket & Topside Structural Analysis",
            "Hazard & Operability Studies (HAZOP) and Layer of Protection Analysis (LOPA)"
        ]
    },
    {
        id: "hse",
        nameEn: "HSE (Health, Safety & Environment)",
        nameAr: "السلامة والصحة المهنية والبيئة (HSE)",
        icon: "fa-solid fa-shield-heart",
        badgeAr: "السلامة والبيئة والوقاية",
        badgeEn: "Occupational Safety Discipline",
        summaryAr: "المعايير الميدانية لحماية الأرواح والأصول والبيئة الطبيعية في المواقع البترولية البرية والبحرية، وإدارة المخاطر التشغيلية الكبرى.",
        summaryEn: "Rigorous standards for personnel safety, occupational health, loss prevention, emergency response, and emissions stewardship across field operations.",
        subDisciplines: [
            { id: "occ_health", nameEn: "Occupational Health", nameAr: "الصحة المهنية والطب الوقائي" },
            { id: "ind_safety", nameEn: "Safety", nameAr: "السلامة الصناعية ومكافحة الحرائق" },
            { id: "environment", nameEn: "Environment", nameAr: "حماية البيئة وإدارة الانبعاثات" }
        ],
        certs: [
            "NEBOSH International Diploma (IDip)",
            "CSP Certified Safety Professional (BCSP)",
            "OSHA Master Instructor",
            "IOSH Chartered Member (CMIOSH)",
            "NFPA Certified Fire Protection Specialist (CFPS)"
        ],
        competenciesAr: [
            "تقييم المخاطر الميدانية الشامل وتطبيق نظام تصاريح العمل (PTW)",
            "إدارة حوادث تسرب الغازات السامة (H2S) وإجراءات الإخلاء الفوري",
            "هندسة مكافحة الحرائق البترولية وتصميم شبكات الرغوة والمياه",
            "رصد الانبعاثات الكربونية وتقييم الأثر البيئي للمشاريع (EIA)"
        ],
        competenciesEn: [
            "Job Safety Analysis (JSA) & Integrated Permit to Work (PTW)",
            "H2S Breathing Apparatus Safety & Toxic Gas Emergency Protocol",
            "Petroleum Foam & Deluge Firefighting System Engineering",
            "Environmental Impact Assessment (EIA) & Decarbonization Audits"
        ],
        priorityTopicsAr: [
            "التحقيق في الحوادث الكبرى بطريقة شجرة الأسباب (Root Cause Analysis)",
            "معايير السلامة في الأماكن المغلقة والعمل على ارتفاعات",
            "إدارة السلامة السلوكية (BBS) وثقافة السلامة المؤسسية",
            "إدارة المخلفات الخطرة والانسكابات النفطية في المياه الإقليمية"
        ],
        priorityTopicsEn: [
            "Incident Investigation & TapRooT / RCA Methodologies",
            "Confined Space Entry & Offshore Working at Heights Standards",
            "Behavior-Based Safety (BBS) & Just Safety Culture Transformation",
            "Hazardous Waste Treatment & Tier 1/2/3 Oil Spill Containment"
        ]
    },
    {
        id: "qehs",
        nameEn: "QEHS Management Systems",
        nameAr: "نظم إدارة الجودة والبيئة والسلامة (QEHS)",
        icon: "fa-solid fa-certificate",
        badgeAr: "أنظمة الإدارة المتكاملة",
        badgeEn: "Quality & Integrated Standards",
        summaryAr: "تطبيق وتدقيق المواصفات القياسية العالمية (ISO 9001 / ISO 14001 / ISO 45001) لضمان اتساق العمليات والامتثال الرقابي.",
        summaryEn: "Design, deployment, and auditing of global integrated management frameworks ensuring operational excellence, compliance, and continual improvement.",
        subDisciplines: [
            { id: "qehs_sys", nameEn: "QEHS Integrated Systems", nameAr: "أنظمة الإدارة المتكاملة QEHS" },
            { id: "qual_sys", nameEn: "Quality Systems & ISO", nameAr: "نظم الجودة ومواصفات الأيزو" },
            { id: "env_audit", nameEn: "Environmental Auditing", nameAr: "المراجعة والتدقيق البيئي" },
            { id: "ind_health_safe", nameEn: "Industrial Health & Safety", nameAr: "الصحة الصناعية والسلامة المهنية" }
        ],
        certs: [
            "IRCA Lead Auditor ISO 9001 / 14001 / 45001",
            "ASQ Certified Quality Engineer (CQE)",
            "ASQ Certified Quality Manager (CMQ/OE)",
            "IEMA Environmental Auditor"
        ],
        competenciesAr: [
            "قيادة عمليات التدقيق الداخلي والخارجي وفق متطلبات IRCA",
            "تصميم وثائق وإجراءات أنظمة الجودة المتكاملة (IMS)",
            "تحليل عدم المطابقة والإجراءات التصحيحية والوقائية (CAPA)",
            "قياس مؤشرات الأداء التشغيلي وضمان استمرارية الأعمال (BCM)"
        ],
        competenciesEn: [
            "IRCA Certified Lead Auditing & Compliance Gap Analysis",
            "Integrated Management System (IMS) Architecture & Manual Drafting",
            "Corrective & Preventive Action (CAPA) Root Cause Resolution",
            "Quality KPI Dashboards & ISO 22301 Business Continuity Planning"
        ],
        priorityTopicsAr: [
            "إدارة المخاطر المؤسسية المبنية على مواصفة ISO 31000",
            "تطوير أدلة الجودة لموردي ومقاولي قطاع البترول",
            "إدارة التدقيق البيئي المتقدم ومراجعة استهلاك الطاقة (ISO 50001)",
            "أدوات الجودة السبعة وتطبيقات Six Sigma في التميز التشغيلي"
        ],
        priorityTopicsEn: [
            "Enterprise Risk-Based Thinking (ISO 31000 Framework)",
            "Vendor & Contractor Quality Surveillance & Pre-qualification",
            "Energy Management Auditing & Efficiency (ISO 50001 Standard)",
            "Statistical Quality Control & Six Sigma Process Capability (Cp/Cpk)"
        ]
    },
    {
        id: "digital_tech",
        nameEn: "Digital Transformation & Emerging Tech",
        nameAr: "التحول الرقمي والتقنيات الناشئة",
        icon: "fa-solid fa-microchip",
        badgeAr: "التقنيات الحديثة والذكاء الاصطناعي",
        badgeEn: "Digital Oilfield & AI",
        summaryAr: "تسخير حلول الذكاء الاصطناعي، إنترنت الأشياء الصناعي (IIoT)، الحقول الرقمية الذكية (Digital Oilfield)، والأمن السيبراني لحماية المنشآت الحيوية.",
        summaryEn: "Deployment of Big Data analytics, machine learning predictive models, Industrial IoT, smart field automation, and critical infrastructure cybersecurity.",
        subDisciplines: [
            { id: "big_data", nameEn: "Big Data & Analytics", nameAr: "تحليلات البيانات الضخمة في الطاقة" },
            { id: "ai_ml", nameEn: "AI & Machine Learning in Oil & Gas", nameAr: "الذكاء الاصطناعي وتعلم الآلة في البترول" },
            { id: "scada_auto", nameEn: "SCADA Automation & IoT", nameAr: "أنظمة التحكم الإشرافي سكادا وإنترنت الأشياء" }
        ],
        certs: [
            "AWS Certified Solutions Architect Energy",
            "Microsoft Certified Azure AI Engineer",
            "NVIDIA Deep Learning Institute (DLI) Specialist",
            "CISSP / ISA/IEC 62443 Cybersecurity Specialist",
            "TOGAF Enterprise Architecture"
        ],
        competenciesAr: [
            "بناء نماذج الصيانة التنبؤية للمعدات البترولية باستخدام خوارزميات ML",
            "تطوير توأم رقمي (Digital Twin) للمنشآت والمكامن البترولية",
            "تأمين شبكات التحكم الصناعي SCADA وفق معيار ISA/IEC 62443",
            "هندسة خطوط معالجة وتدفق البيانات الضخمة لمنصات الإنتاج"
        ],
        competenciesEn: [
            "Predictive Maintenance Modeling via Machine Learning Algorithms",
            "Digital Twin Architecture for Plants & Upstream Reservoirs",
            "Industrial Cybersecurity (OT Security) under ISA/IEC 62443",
            "Real-Time Data Pipelines for Drilling & Telemetry Analytics"
        ],
        priorityTopicsAr: [
            "تطبيقات الذكاء الاصطناعي التوليدي في دعم القرارات الهندسية",
            "إنترنت الأشياء الصناعي واستشعار الاهتزازات والحرارة اللاسلكي",
            "التحكم الذاتي في صمامات ومحطات الغاز عن بعد",
            "حماية البيانات الحساسة والامتثال للأمن السيبراني الوطني"
        ],
        priorityTopicsEn: [
            "Generative AI & LLM Systems for Petroleum Engineering Documents",
            "Industrial Wireless Sensor Networks (WirelessHART / IIoT)",
            "Autonomous Remote Terminal Unit (RTU) Optimization",
            "OT Threat Hunting & National Petroleum Critical Infrastructure Defense"
        ]
    },
    {
        id: "finance_gov",
        nameEn: "Finance, Governance & Compliance",
        nameAr: "المالية والحوكمة والامتثال",
        icon: "fa-solid fa-scale-balanced",
        badgeAr: "الإدارة المالية والرقابة",
        badgeEn: "Energy Finance & Governance",
        summaryAr: "الإدارة المالية المتقدمة للمشاريع البترولية الكبرى، اتفاقيات امتياز التنقيب والإنتاج (PSC)، المراجعة الداخلية، والامتثال لحوكمة الشركات.",
        summaryEn: "Capex fiscal modeling, production sharing contracts (PSCs), petroleum taxation, internal controls, and enterprise compliance across sector companies.",
        subDisciplines: [
            { id: "corp_gov", nameEn: "Corporate Governance", nameAr: "الحوكمة المؤسسية والنزاهة" },
            { id: "int_audit", nameEn: "Internal Audit", nameAr: "المراجعة الداخلية وإدارة المخاطر المالية" },
            { id: "pet_econ", nameEn: "Petroleum Economics & Finance", nameAr: "اقتصاديات البترول والاتفاقيات البترولية" }
        ],
        certs: [
            "CMA Certified Management Accountant",
            "CFA Chartered Financial Analyst",
            "CIA Certified Internal Auditor",
            "AIPN Certified Petroleum Negotiator",
            "CRMA Risk Management Assurance"
        ],
        competenciesAr: [
            "النمذجة المالية ودراسات الجدوى الاقتصادية لمشاريع Mega Capex",
            "هندسة اتفاقيات اقتسام الإنتاج (Production Sharing Contracts)",
            "تطبيق معايير المراجعة الداخلية وإطار COSO للرقابة والامتثال",
            "إدارة التحوط المالي ضد تقلبات أسعار خام برنت والعملات"
        ],
        competenciesEn: [
            "DCF Capital Budgeting & Economic Feasibility for Mega Capex",
            "Petroleum Fiscal Regimes & Production Sharing Contracts (PSCs)",
            "Internal Audit Execution under COSO Internal Control Framework",
            "Commodity Hedging & Foreign Exchange Exposure Management"
        ],
        priorityTopicsAr: [
            "محاسبة التكاليف البترولية المشتركة (Joint Venture Accounting)",
            "مراجعة المشتريات والعقود وكشف وتفادي الاحتيال المالي",
            "إدارة وتوزيع التدفقات النقدية واسترداد التكاليف (Cost Recovery)",
            "حوكمة مجالس الإدارات وإفصاحات الاستدامة والحوكمة (ESG)"
        ],
        priorityTopicsEn: [
            "Joint Interest Billing (JIB) & Operating Committee Audits",
            "Fraud Examination, Forensic Auditing & Anti-Corruption Controls",
            "Cost Oil Recovery Accounting & Profit Oil Split Formulations",
            "Board Governance, Transparency & ESG Petroleum Reporting"
        ]
    },
    {
        id: "hr",
        nameEn: "Human Resources & Organizational Development",
        nameAr: "الموارد البشرية والتطوير التنظيمي",
        icon: "fa-solid fa-people-roof",
        badgeAr: "رأس المال البشري والتعاقب",
        badgeEn: "Strategic HR & Talent",
        summaryAr: "استراتيجيات استقطاب وتأهيل وتمكين الكفاءات البترولية، إدارة التعاقب الوظيفي لمنع هجرة العقول، ونمذجة إدارة المعرفة وتطوير المنظمات.",
        summaryEn: "Competency-based talent acquisition, career development, succession planning, brain-drain mitigation, SECI knowledge transfer, and organizational culture.",
        subDisciplines: [
            { id: "rec_select", nameEn: "Recruitment & Selection", nameAr: "الاستقطاب والاختيار المبني على الجدارات" },
            { id: "train_od", nameEn: "Training & OD", nameAr: "التدريب والتطوير التنظيمي" },
            { id: "strat_hr", nameEn: "Strategic HR", nameAr: "إدارة الموارد البشرية الاستراتيجية" },
            { id: "succ_talent", nameEn: "Succession & Talent Retention", nameAr: "إدارة التعاقب وحفظ المواهب" },
            { id: "hr_analytics", nameEn: "HR Analytics", nameAr: "تحليلات الموارد البشرية والإنتاجية" }
        ],
        certs: [
            "SHRM-SCP Senior Certified Professional",
            "CIPD Level 7 Chartered Fellow",
            "ATD Master Trainer & Instructional Designer",
            "Korn Ferry Assessment Specialist"
        ],
        competenciesAr: [
            "بناء وتطبيق قواميس الجدارات الفنية والقيادية لقطاع الطاقة",
            "تصميم خطط التعاقب الوظيفي ونقل الخبرات الضمنية (SECI Model)",
            "تصميم برامج إعداد وتأهيل المدربين المحترفين (TTT Programs)",
            "تحليلات رأس المال البشري وقياس عائد الاستثمار في التدريب (ROI)"
        ],
        competenciesEn: [
            "Technical & Leadership Competency Dictionary Formulation",
            "Succession Pipeline & Tacit Knowledge Transfer (SECI Architecture)",
            "Advanced Instructional Design & Train-the-Trainer (TTT) Delivery",
            "Human Capital Analytics & Phillips ROI Training Evaluation"
        ],
        priorityTopicsAr: [
            "استراتيجيات حفظ الذاكرة المؤسسية والتعامل مع تقاعد الخبراء",
            "تقييم الأداء بزاوية 360 درجة وخطط التطوير الفردية (IDP)",
            "إدارة التغيير المؤسسي والثقافة المهنية عالية الإنتاجية",
            "حوكمة لوائح العمل والامتثال لقوانين العمل والتأمينات المصرية"
        ],
        priorityTopicsEn: [
            "Retirement Knowledge Harvest & Institutional Memory Retention",
            "360-Degree Feedback Systems & Individual Development Plans (IDPs)",
            "Prosci ADKAR Change Management in Restructuring Programs",
            "Labor Law Compliance, Employee Relations & Collective Agreements"
        ]
    },
    {
        id: "operations",
        nameEn: "Operations & Asset Management",
        nameAr: "العمليات وإدارة الأصول الصناعية",
        icon: "fa-solid fa-gears",
        badgeAr: "سلامة الأصول والاعتمادية",
        badgeEn: "Asset Integrity & Reliability",
        summaryAr: "استراتيجيات الصيانة المرتكزة على الاعتمادية (RCM)، التفتيش القائم على المخاطر (RBI)، وإدارة دورة حياة الأصول البترولية وفق ISO 55000.",
        summaryEn: "Reliability-centered maintenance (RCM), risk-based inspection (RBI), shutdown/turnaround planning, and lifecycle physical asset management (ISO 55000).",
        subDisciplines: [
            { id: "fac_mgmt", nameEn: "Facilities Management", nameAr: "إدارة وتكامل المرافق البترولية" },
            { id: "maint_rel", nameEn: "Maintenance, Reliability & Asset Integrity", nameAr: "الصيانة والاعتمادية وسلامة الأصول" }
        ],
        certs: [
            "CMRP Certified Maintenance & Reliability Professional",
            "CAMA Certified Asset Management Assessor (ISO 55000)",
            "RCM2 Certified Facilitator",
            "Mobius Vibration Analysis Cat III/IV"
        ],
        competenciesAr: [
            "تطبيق منهجية RCM2 لتحديد استراتيجيات الصيانة المثلى للمعدات الحرجة",
            "إدارة دورة حياة الأصول البترولية وتطبيق مواصفة ISO 55001",
            "تخطيط وجدولة العمرات الجسيمة والتوقفات المجدولة (Turnarounds / Overhauls)",
            "تحليل أنماط الأعطال وتأثيراتها (FMEA) لتفادي التوقفات غير المخططة"
        ],
        competenciesEn: [
            "RCM2 Implementation for Critical Machinery Failure Avoidance",
            "Physical Asset Lifecycle Management & ISO 55001 Assessment",
            "Plant Turnaround & Major Overhaul Project Scheduling (Primavera)",
            "Failure Mode, Effects & Criticality Analysis (FMECA) Application"
        ],
        priorityTopicsAr: [
            "التفتيش القائم على المخاطر وفق كود API 580 / 581 (RBI)",
            "إدارة نظم الصيانة المحوسبة (CMMS / SAP PM)",
            "تحليل الزيوت والتزييت ومراقبة الحالة الفنية بالحرارة والأشعة",
            "إدارة قطع الغيار الحرجة وتحسين مستودعات الصيانة"
        ],
        priorityTopicsEn: [
            "Risk-Based Inspection (RBI) Modeling per API 580 / 581 Standards",
            "Computerized Maintenance Management System (SAP PM Optimization)",
            "Tribology, Lube Oil Analysis & Infrared Thermography Monitoring",
            "Critical Spares Optimization & Warehouse Redundancy Control"
        ]
    },
    {
        id: "projects_scm",
        nameEn: "Projects, Contracts & Supply Chain",
        nameAr: "إدارة المشاريع والعقود وسلاسل الإمداد",
        icon: "fa-solid fa-diagram-project",
        badgeAr: "المشاريع الكبرى والمشتريات",
        badgeEn: "Project Controls & Procurement",
        summaryAr: "إدارة المشروعات الهندسية الرأسمالية (EPC Projects)، عقود الفيديك الدولية، فض المنازعات والمطالبات، وسلاسل الإمداد اللوجستية الاستراتيجية.",
        summaryEn: "Turnkey EPC energy project lifecycle, FIDIC contract administration, claims defense, dispute resolution, international logistics, and strategic procurement.",
        subDisciplines: [
            { id: "contracts_claims", nameEn: "Contracts & Claims", nameAr: "عقود فيديك والمطالبات والنزاعات" },
            { id: "proc_scm", nameEn: "Procurement & Supply Chain", nameAr: "سلاسل الإمداد والمشتريات الاستراتيجية" },
            { id: "pmp_controls", nameEn: "Project Management & Controls (PMP)", nameAr: "إدارة ومراقبة المشروعات الرأسمالية" }
        ],
        certs: [
            "PMP Project Management Professional",
            "PMI-RMP Risk Management Professional",
            "FIDIC Certified Adjudicator / Claims Specialist",
            "CIPS Chartered Procurement Specialist (MCIPS)"
        ],
        competenciesAr: [
            "إدارة عقود EPC والمقاولات الهندسية وفق شروط FIDIC (الكتاب الفضي/الأصفر)",
            "صياغة وتحليل المطالبات الزمنية والمالية (Extension of Time & Claims)",
            "مراقبة المشاريع باستخدام القيمة المكتسبة (Earned Value Management - EVM)",
            "المشتريات الاستراتيجية للمعدات طويلة الأجل (Long Lead Items)"
        ],
        competenciesEn: [
            "FIDIC EPC/Turnkey Contract Administration (Silver/Yellow Books)",
            "Contractual Claim Drafting, Dispute Adjudication & Forensic Delay Analysis",
            "Earned Value Management (EVM) & Schedule Performance Indexing",
            "Strategic Sourcing & Critical Long Lead Item (LLI) Logistics"
        ],
        priorityTopicsAr: [
            "إدارة المخاطر الكمية للمشاريع باستخدام محاكاة Monte Carlo",
            "مراجعة عطاءات التوريد واختيار المقاولين وفق معايير الحوكمة",
            "التفاوض وإبرام الاتفاقيات الإطارية وسلاسل التوريد المرنة",
            "إجراءات إغلاق وتسليم المشاريع الهندسية (Commissioning & Handover)"
        ],
        priorityTopicsEn: [
            "Quantitative Risk Analysis & Monte Carlo Cost-Schedule Modeling",
            "Competitive Tender Evaluation & Transparent Supplier Selection",
            "Framework Agreement Negotiations & Resilient SCM Vendor Alliances",
            "Plant Mechanical Completion, Pre-commissioning & Facility Handover"
        ]
    },
    {
        id: "communication",
        nameEn: "Communication & Corporate Relations",
        nameAr: "التواصل والعلاقات المؤسسية",
        icon: "fa-solid fa-comments",
        badgeAr: "التواصل والمراسم الدولية",
        badgeEn: "Executive Communications",
        summaryAr: "استراتيجيات التواصل المؤسسي الفعال، إدارة السمعة المؤسسية، المراسم والبروتوكولات الدولية، وتنظيم المؤتمرات والأحداث البترولية الكبرى.",
        summaryEn: "Corporate reputation management, public relations, international diplomatic protocol, crisis communication, and world-class energy summit facilitation.",
        subDisciplines: [
            { id: "workplace_skills", nameEn: "Corporate Workplace Skills", nameAr: "مهارات التواصل المؤسسي والقيادي" },
            { id: "pr_protocol", nameEn: "Public Relations, Protocol & International Events", nameAr: "العلاقات العامة والمراسم والمؤتمرات الدولية" }
        ],
        certs: [
            "CIPR Chartered Public Relations Practitioner",
            "Certified International Protocol Specialist",
            "ATD Master Instructional Facilitator"
        ],
        competenciesAr: [
            "إدارة الاتصال في الأزمات وحماية السمعة المؤسسية لشركات الطاقة",
            "تطبيق قواعد البروتوكول والمراسم الدولية مع كبار الشخصيات والوزراء",
            "تصميم وتنظيم الملتقيات والمعارض البترولية العالمية (مثل EGYPES)",
            "تيسير الحوار ومهارات العرض والتفاوض الإقناعي عالي التأثير"
        ],
        competenciesEn: [
            "Crisis Communications & High-Stakes Reputation Safeguarding",
            "International Diplomatic & Ministerial Protocol Management",
            "Mega Energy Summit Organization & Press Relations (e.g., EGYPES)",
            "Executive Presentation Mastery & High-Impact Persuasive Facilitation"
        ],
        priorityTopicsAr: [
            "استراتيجيات الإعلام الرقمي وإبراز الهوية الوطنية لقطاع البترول",
            "التواصل الداخلي وبناء بيئة عمل تشاركية محفزة",
            "إعداد البيانات الصحفية والبيانات الرسمية تحت الأزمات",
            "مهارات الإلقاء أمام الجمهور والتعامل مع وسائل الإعلام"
        ],
        priorityTopicsEn: [
            "Digital Corporate Storytelling & Sector Brand Elevation",
            "Internal Strategic Communications & Workforce Engagement",
            "Press Release Drafting & Rapid Crisis Spokesperson Protocols",
            "C-Suite Media Training, Broadcast Interviews & Public Speaking"
        ]
    },
    {
        id: "leadership",
        nameEn: "Leadership, Management & Development",
        nameAr: "القيادة والإدارة والتميز المؤسسي",
        icon: "fa-solid fa-crown",
        badgeAr: "القيادة وصناعة القرار",
        badgeEn: "Executive Leadership & Excellence",
        summaryAr: "بناء قادة المستقبل لقطاع الطاقة، إدارة التغيير والتميز المؤسسي وفق معايير EFQM، قيادة الفرق عالية الأداء، وصنع القرارات في بيئات المخاطر.",
        summaryEn: "Executive leadership cultivation, strategic decision-making in volatile markets, EFQM organizational excellence, high-performing team dynamics, and coaching.",
        subDisciplines: [
            { id: "strat_lead", nameEn: "Strategic Leadership", nameAr: "القيادة الاستراتيجية وصناعة القرار" },
            { id: "org_excel", nameEn: "Organizational Excellence", nameAr: "التميز المؤسسي وإدارة التغيير" },
            { id: "exec_prod", nameEn: "Executive Productivity", nameAr: "الإنتاجية التنفيذية والفرق عالية الأداء" }
        ],
        certs: [
            "EFQM Certified Assessor & Excellence Specialist",
            "ICF Professional Certified Coach (PCC)",
            "Lean Six Sigma Black Belt (LSSBB)",
            "Executive Leadership Fellow (CMI)"
        ],
        competenciesAr: [
            "صياغة الرؤى الاستراتيجية وترجمتها إلى خطط تشغيلية وبطاقات أداء متوازن",
            "تقييم التميز المؤسسي وتطبيق معايير النموذج الأوروبي EFQM",
            "ممارسة الكوتشينغ القيادي التنفيذي والتوجيه الفردي للكوادر الواعدة",
            "إدارة الأزمات والتفاوض الاستراتيجي في ظروف السوق غير المستقرة"
        ],
        competenciesEn: [
            "Strategic Vision Formulation & Balanced Scorecard Cascading",
            "EFQM Global Excellence Assessment & Transformational Audits",
            "Executive Coaching & One-on-One High-Potential Mentoring (ICF)",
            "High-Stakes Crisis Leadership & Volatile Market Negotiation"
        ],
        priorityTopicsAr: [
            "القيادة التكيفية (Adaptive Leadership) في مواجهة تحول الطاقة",
            "بناء وإلهام الفرق متعدّدة التخصصات والثقافات",
            "أدوات Lean وAgile في رفع الكفاءة والإنتاجية التنفيذية",
            "الذكاء العاطفي القيادي وتفادي الاحتراق الوظيفي للمديرين"
        ],
        priorityTopicsEn: [
            "Adaptive Leadership Amid Global Energy Transition Realities",
            "Cross-Functional Team Inspiration & Psychological Safety",
            "Lean Executive Thinking & Agile Operational Governance",
            "Emotional Intelligence (EQ) & Executive Resilience under Stress"
        ]
    },
    {
        id: "it_software",
        nameEn: "IT & Software Systems",
        nameAr: "تكنولوجيا المعلومات والبرمجيات (IT & Software)",
        icon: "fa-solid fa-laptop-code",
        badgeAr: "البنية التحتية والبرمجيات",
        badgeEn: "IT & Software Infrastructure",
        summaryAr: "برمجيات التصميم الهندسي المتخصصة، إدارة نظم مراكز البيانات والشبكات المؤسسية، أنظمة تخطيط الموارد ERP (SAP/Oracle)، وحوكمة تكنولوجيا المعلومات.",
        summaryEn: "Engineering 2D/3D design CAD packages, corporate networking infrastructure, enterprise ERP applications (SAP/Oracle), virtualization, and IT governance.",
        subDisciplines: [
            { id: "graphic_media", nameEn: "Graphic & Media Software", nameAr: "برمجيات التصميم والميديا والجرافيك" },
            { id: "design_2d_3d", nameEn: "2D & 3D Engineering Design Software", nameAr: "برمجيات التصميم الهندسي ثنائي وثلاثي الأبعاد (AutoCAD / PDMS / SP3D)" },
            { id: "ms_apps", nameEn: "Microsoft Enterprise Applications", nameAr: "تطبيقات وحلول مايكروسوفت المؤسسية" },
            { id: "mobile_apps", nameEn: "Mobile Applications Development", nameAr: "تطوير تطبيقات الهواتف المحمولة الذكية" },
            { id: "cisco_nets", nameEn: "CISCO Networking Systems", nameAr: "شبكات سيسكو والربط الشبكي المتقدم (CCNA / CCNP)" },
            { id: "comptia_infra", nameEn: "CompTIA Infrastructure & Hardware", nameAr: "البنية التحتية وصيانة الأنظمة (CompTIA A+ / Network+)" },
            { id: "iso_standards", nameEn: "ISO & IT Standards (ISO 27001 / 20000)", nameAr: "مواصفات الأيزو وحوكمة تكنولوجيا المعلومات" },
            { id: "sec_cyber", nameEn: "Cybersecurity & Information Security", nameAr: "الأمن السيبراني وحماية البنية المعلوماتية" },
            { id: "vmware_cloud", nameEn: "VMWare & Cloud Virtualization", nameAr: "الحوسبة السحابية والمحاكاة الافتراضية VMWare" },
            { id: "erp_systems", nameEn: "ERP & Enterprise Business Systems (SAP / Oracle)", nameAr: "أنظمة تخطيط الموارد المؤسسية (SAP / Oracle ERP)" }
        ],
        certs: [
            "CISCO Certified Network Professional (CCNP)",
            "Microsoft Certified Solutions Expert (MCSE)",
            "Certified Information Systems Security Professional (CISSP)",
            "VMware Certified Professional (VCP)",
            "SAP Certified Technology Associate",
            "Oracle Certified Professional (OCP)",
            "CompTIA Security+ / Network+"
        ],
        competenciesAr: [
            "إتقان برمجيات التصميم الهندسي ثلاثي الأبعاد SP3D / PDMS وتكامل المخططات P&ID",
            "إدارة وتصميم شبكات سيسكو المؤسسية ومراكز البيانات الافتراضية (VMware)",
            "تخصيص وإدارة وحدات أنظمة SAP ERP البترولية (PM / MM / FICO)",
            "تطبيق معايير أمن المعلومات وحوكمة خدمات تكنولوجيا المعلومات (ISO 27001 / ITIL)"
        ],
        competenciesEn: [
            "3D Plant Design Modeling (SmartPlant 3D / AVEVA PDMS) & P&ID Integration",
            "Enterprise Cisco Network Routing & VMware ESXi Datacenter Virtualization",
            "SAP Oil & Gas ERP Modules Customization & Support (PM / MM / FICO)",
            "IT Service Management (ITIL 4) & ISO/IEC 27001 Security Implementation"
        ],
        priorityTopicsAr: [
            "النمذجة ثلاثية الأبعاد للمحطات وتفادي التعارضات الهندسية (Clash Detection)",
            "إدارة الخوادم السحابية الهجينة والنسخ الاحتياطي والتعافي من الكوارث (DR)",
            "تطوير البرمجيات وتطبيقات الموبايل لفرق العمل الميدانية",
            "إدارة رخص البرمجيات الهندسية والامتثال القانوني"
        ],
        priorityTopicsEn: [
            "Plant Walkthrough 3D Simulation & Navisworks Clash Resolution",
            "Hybrid Cloud Infrastructure, High Availability & Disaster Recovery (DRP)",
            "Field Operations Mobile App Integration & Offline Synchronization",
            "Engineering Software License Server Administration & Compliance"
        ]
    }
];


// Official Benchmark Sector Candidates Pool across 13 Specialized Disciplines
const BENCHMARK_SECTOR_CANDIDATES = [
    {
        id: "CAN-0101",
        code: "XP-0101",
        fullNameEn: "Eng. Tarek Mahmoud Hassan",
        fullNameAr: "م. طارق محمود حسن",
        email: "tarek.mahmoud@gupco.net",
        jobTitle: "General Manager of Deepwater Exploration",
        company: "GUPCO",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "upstream",
        domainEn: "Upstream (Exploration & Production)",
        domainAr: "الاستكشاف والإنتاج (Upstream)",
        subDisciplineEn: "Exploration - Geology",
        subDisciplineAr: "الاستكشاف - الجيولوجيا",
        experienceYears: 22,
        degreeEn: "PhD (Petroleum Geophysics, Cairo Univ, 2012)",
        degreeAr: "دكتوراه (جيوفيزياء البترول، جامعة القاهرة، 2012)",
        degreeLevel: "PhD",
        expertClassification: "international",
        certs: ["SPE Certified Petroleum Professional", "AAPG Certified Petroleum Geologist", "IWCF Well Control Level 4/5"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 100 123 4567",
            department: "Exploration & Subsurface Directorate",
            programs: [
                "Advanced 3D Seismic Interpretation & Deepwater Deposition",
                "Subsurface Well Log Petrophysics & Pore Pressure Prediction",
                "Reservoir Geological Modeling & Uncertainty Mitigation",
                "Offshore Structural Traps & Basin Analysis",
                "Deep Exploration Risk Assessment & Resource Auditing"
            ]
        }
    },
    {
        id: "CAN-0102",
        code: "XP-0102",
        fullNameEn: "Eng. Ahmed Mansour El-Fiqi",
        fullNameAr: "م. أحمد منصور الفقي",
        email: "ahmed.mansour@gasco.com.eg",
        jobTitle: "Operations Director - National Gas Grid",
        company: "GASCO",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "midstream",
        domainEn: "Midstream (Pipelines & Gas Processing)",
        domainAr: "النقل ومعالجة الغاز (Midstream)",
        subDisciplineEn: "Gas Processing & Sweetening",
        subDisciplineAr: "معالجة وتحلية الغاز الطبيعي",
        experienceYears: 18,
        degreeEn: "MSc (Chemical Engineering, Alexandria Univ, 2010)",
        degreeAr: "ماجستير (الهندسة الكيميائية، جامعة الإسكندرية، 2010)",
        degreeLevel: "Master",
        expertClassification: "regional",
        certs: ["GPA Midstream Professional Certification", "PMP Project Management Professional"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 101 234 5678",
            department: "Gas Processing & Transmission",
            programs: [
                "Natural Gas Amine Treating & Sweetening Systems",
                "NGL Recovery & Cryogenic Expander Operations",
                "Gas Pipeline Hydraulic Transients & Surge Control",
                "Compressor Station Dispatching & SCADA Integration"
            ]
        }
    },
    {
        id: "CAN-0103",
        code: "XP-0103",
        fullNameEn: "Eng. Khaled Abdel-Rahman",
        fullNameAr: "م. خالد عبد الرحمن سلام",
        email: "khaled.abdelrahman@midor.com.eg",
        jobTitle: "Senior Refining Technology Consultant",
        company: "MIDOR",
        cohort: "Cohort B",
        cohortDescEn: "Group B: Retired Expert / Consultant",
        cohortDescAr: "الدفعة (ب): خبير متقاعد / قامة استشارية",
        gender: "male",
        domainId: "downstream",
        domainEn: "Downstream (Refining & Petrochemicals)",
        domainAr: "التكرير والبتروكيماويات (Downstream)",
        subDisciplineEn: "Hydroprocessing & Catalytic Reforming",
        subDisciplineAr: "التكسير الهيدروجيني والمعالجة الحفزية",
        experienceYears: 26,
        degreeEn: "BSc (Petroleum Refining Engineering, Suez Canal Univ, 1998)",
        degreeAr: "بكالوريوس (هندسة تكرير البترول، جامعة قناة السويس، 1998)",
        degreeLevel: "Bachelor",
        expertClassification: "international",
        certs: ["API 510 Pressure Vessel Inspector", "API 570 Piping Inspector", "NPRA Refining Technology Authority"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 102 345 6789",
            department: "Operations & Technical Services",
            programs: [
                "Catalytic Hydrocracker Operations & Catalyst Management",
                "Crude Distillation Unit (CDU) Optimization & Energy Efficiency",
                "Delayed Coking Technology & High-Temperature Safety",
                "Refinery Margin Maximization & LP Modeling"
            ]
        }
    },
    {
        id: "CAN-0104",
        code: "XP-0104",
        fullNameEn: "Eng. Mona El-Sayed Ibrahim",
        fullNameAr: "م. منى السيد إبراهيم",
        email: "mona.elsayed@enppi.com",
        jobTitle: "Lead Process Simulation Engineer",
        company: "ENPPI",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "female",
        domainId: "process_eng",
        domainEn: "Process Engineering & Simulation",
        domainAr: "هندسة العمليات والتصميم والمحاكاة",
        subDisciplineEn: "Dynamic Process Simulation (HYSYS)",
        subDisciplineAr: "المحاكاة الديناميكية للعمليات (HYSYS)",
        experienceYears: 15,
        degreeEn: "MSc (Process Engineering, Cairo Univ, 2014)",
        degreeAr: "ماجستير (هندسة العمليات، جامعة القاهرة، 2014)",
        degreeLevel: "Master",
        expertClassification: "regional",
        certs: ["Aspen HYSYS Certified Process Expert", "IChemE Chartered Chemical Engineer"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: false,
        registrationDetails: {
            phone: "+20 103 456 7890",
            department: "Process Engineering Division",
            programs: [
                "Steady-State & Dynamic Aspen HYSYS Modeling",
                "P&ID Development & Hydraulic Relief Sizing (API 520/521)",
                "Gas Processing Plant Debottlenecking Case Studies",
                "Flare Network Simulation & Blowdown Depressurization"
            ]
        }
    },
    {
        id: "CAN-0105",
        code: "XP-0105",
        fullNameEn: "Eng. Mostafa Salem Gad",
        fullNameAr: "م. مصطفى سالم جاد",
        email: "mostafa.salem@petrobel.org",
        jobTitle: "Rotating Equipment Maintenance Superintendent",
        company: "Petrobel",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "mechanical_eng",
        domainEn: "Mechanical & Rotating Equipment",
        domainAr: "المعدات الميكانيكية والآلات الدوارة",
        subDisciplineEn: "Centrifugal Gas Compressors",
        subDisciplineAr: "ضواغط الغاز الطاردة المركزية وتوربينات الغاز",
        experienceYears: 13,
        degreeEn: "BSc (Mechanical Engineering, Ain Shams Univ, 2011)",
        degreeAr: "بكالوريوس (الهندسة الميكانيكية، جامعة عين شمس، 2011)",
        degreeLevel: "Bachelor",
        expertClassification: "local",
        certs: ["CMRP Certified Maintenance & Reliability Professional", "Vibration Analyst ISO Cat III"],
        englishProficiency: "Intermediate",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: false,
        registrationDetails: {
            phone: "+20 104 567 8901",
            department: "Offshore Mechanical Maintenance",
            programs: [
                "Centrifugal Compressor Surge & Anti-Surge Control",
                "Gas Turbine Aeroderivative Fleet Maintenance",
                "Mechanical Seal Reliability & API 682 Flush Plans",
                "Root Cause Failure Analysis (RCFA) for Rotating Assets"
            ]
        }
    },
    {
        id: "CAN-0106",
        code: "XP-0106",
        fullNameEn: "Eng. Hesham Zaki El-Naggar",
        fullNameAr: "م. هشام زكي النجار",
        email: "hesham.zaki@rashpetco.com",
        jobTitle: "Subsea Electrical & Instrumentation Advisor",
        company: "Rashpetco",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "electrical_instrument",
        domainEn: "Electrical Power & Instrumentation",
        domainAr: "القوى الكهربائية والآلات الدقيقة والتحكم",
        subDisciplineEn: "SIS & Safety Instrumented Systems",
        subDisciplineAr: "أنظمة الآلات والتحكم وأنظمة السلامة (SIS / SIL)",
        experienceYears: 17,
        degreeEn: "MSc (Electrical Control Systems, Alexandria Univ, 2013)",
        degreeAr: "ماجستير (نظم التحكم الكهربائي، جامعة الإسكندرية، 2013)",
        degreeLevel: "Master",
        expertClassification: "regional",
        certs: ["TÜV Rheinland Functional Safety Engineer (FS Eng)", "IEEE Senior Member"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 105 678 9012",
            department: "Electrical & Instrumentation Directorate",
            programs: [
                "Safety Instrumented Systems (SIS) Lifecycle & SIL Verification",
                "Offshore HV/MV Power Distribution & Protection Coordination",
                "DCS & PLC Fault-Tolerant Architectures (Yokogawa / Honeywell)",
                "Hazardous Area Equipment Classification (ATEX / IECEx)"
            ]
        }
    },
    {
        id: "CAN-0107",
        code: "XP-0107",
        fullNameEn: "Eng. Omar Farouk Hegazy",
        fullNameAr: "م. عمر فاروق حجازي",
        email: "omar.farouk@pmsoffshore.com",
        jobTitle: "Chief Marine & Offshore Structural Consultant",
        company: "PMS",
        cohort: "Cohort B",
        cohortDescEn: "Group B: Retired Expert / Consultant",
        cohortDescAr: "الدفعة (ب): خبير متقاعد / قامة استشارية",
        gender: "male",
        domainId: "civil_offshore",
        domainEn: "Civil, Offshore & Marine Structures",
        domainAr: "الهندسة المدنية والمنصات البحرية (Offshore)",
        subDisciplineEn: "Offshore Jacket Platform Design",
        subDisciplineAr: "تصميم المنصات البحرية الثابتة وخطوط الأنابيب",
        experienceYears: 24,
        degreeEn: "PhD (Offshore Structural Dynamics, Imperial College London, 2005)",
        degreeAr: "دكتوراه (ديناميكا المنشآت البحرية، إمبريال كوليدج، 2005)",
        degreeLevel: "PhD",
        expertClassification: "international",
        certs: ["API RP 2A Structural Authority", "DNV Certified Marine Warranty Surveyor", "ICE Fellow"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 106 789 0123",
            department: "Marine Engineering & Deepwater Structures",
            programs: [
                "Offshore Fixed Jacket Platform Dynamic SACS Analysis",
                "Subsea Pipeline Stability & Free Span Rectification",
                "Offshore Heavy Lift & Float-Over Installation Engineering",
                "Structural Integrity Re-assessment & Platform Life Extension"
            ]
        }
    },
    {
        id: "CAN-0108",
        code: "XP-0108",
        fullNameEn: "Eng. Samer Nabil El-Kordy",
        fullNameAr: "م. سامر نبيل الكردي",
        email: "samer.nabil@bapetco.net",
        jobTitle: "Corporate HSE & Process Safety General Manager",
        company: "BAPETCO",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "hse_loss_prev",
        domainEn: "HSE & Process Safety (Loss Prevention)",
        domainAr: "السلامة والصحة المهنية والبيئة (HSE)",
        subDisciplineEn: "Process Safety & QRA Modeling",
        subDisciplineAr: "سلامة العمليات والتحليل الكمي للمخاطر (QRA)",
        experienceYears: 16,
        degreeEn: "MSc (Environmental & Industrial Safety, Cairo Univ, 2012)",
        degreeAr: "ماجستير (السلامة البيئية والصناعية، جامعة القاهرة، 2012)",
        degreeLevel: "Master",
        expertClassification: "regional",
        certs: ["NEBOSH International Diploma in OHS", "CSP Certified Safety Professional (BCSP)", "CCPS Process Safety Professional"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: false,
        registrationDetails: {
            phone: "+20 107 890 1234",
            department: "Corporate HSE General Directorate",
            programs: [
                "Process Safety Management (PSM 14 Elements) Implementation",
                "HAZOP & LOPA Leadership & Consequence Modeling",
                "Quantitative Risk Assessment (QRA) & ALARP Demonstration",
                "Emergency Response Planning for Major Hydrocarbon Incidents"
            ]
        }
    },
    {
        id: "CAN-0109",
        code: "XP-0109",
        fullNameEn: "Eng. Yasser Fouad Badran",
        fullNameAr: "م. ياسر فؤاد بدران",
        email: "yasser.fouad@agiba.com",
        jobTitle: "Asset Integrity & Corrosion Section Head",
        company: "Agiba",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "asset_integrity",
        domainEn: "Maintenance & Asset Integrity",
        domainAr: "إدارة الصيانة وسلامة الأصول (Asset Integrity)",
        subDisciplineEn: "Risk-Based Inspection (RBI)",
        subDisciplineAr: "الفحص المبني على المخاطر ومكافحة التآكل",
        experienceYears: 10,
        degreeEn: "BSc (Metallurgical & Materials Engineering, Cairo Univ, 2014)",
        degreeAr: "بكالوريوس (هندسة الفلزات والمواد، جامعة القاهرة، 2014)",
        degreeLevel: "Bachelor",
        expertClassification: "local",
        certs: ["API 580 Risk-Based Inspection", "AMPP Senior Corrosion Technologist"],
        englishProficiency: "Intermediate",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: false,
        registrationDetails: {
            phone: "+20 108 901 2345",
            department: "Asset Integrity Management",
            programs: [
                "API 580/581 Risk-Based Inspection (RBI) Program Setup",
                "Oilfield Cathodic Protection & Corrosion Inhibitor Audits",
                "Non-Destructive Testing (NDT) Advanced Phased Array UT",
                "Fitness-For-Service (FFS API 579) Flaw Evaluation"
            ]
        }
    },
    {
        id: "CAN-0110",
        code: "XP-0110",
        fullNameEn: "Eng. Nader Shawky El-Sayed",
        fullNameAr: "م. نادر شوقي السيد",
        email: "nader.shawky@enppi.com",
        jobTitle: "Senior Projects Director & EPC Contract Authority",
        company: "ENPPI",
        cohort: "Cohort B",
        cohortDescEn: "Group B: Retired Expert / Consultant",
        cohortDescAr: "الدفعة (ب): خبير متقاعد / قامة استشارية",
        gender: "male",
        domainId: "project_management",
        domainEn: "Project Management & EPC Execution",
        domainAr: "إدارة المشاريع البترولية والعقود (EPC)",
        subDisciplineEn: "EPC Mega Project Management",
        subDisciplineAr: "إدارة مشاريع EPC الكبرى والمطالبات التعاقدية",
        experienceYears: 28,
        degreeEn: "PhD (Construction Management & Contracts, Cairo Univ, 2008)",
        degreeAr: "دكتوراه (إدارة عقود التشييد، جامعة القاهرة، 2008)",
        degreeLevel: "PhD",
        expertClassification: "international",
        certs: ["PMI-PMP Project Management Professional", "PMI-PfMP Portfolio Management Professional", "FIDIC Certified Contract Adjudicator"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 109 012 3456",
            department: "Project Management Directorate",
            programs: [
                "EPC Turnkey Contract Administration & FIDIC Silver Book",
                "Earned Value Management (EVM) & Mega Project Schedule Control",
                "Petroleum Project Risk Allocation & Dispute Adjudication",
                "Commissioning & Operational Handover of Hydrocarbon Plants"
            ]
        }
    },
    {
        id: "CAN-0111",
        code: "XP-0111",
        fullNameEn: "Dr. Hoda Adel Mansy",
        fullNameAr: "د. هدى عادل منسي",
        email: "hoda.adel@egpc.com.eg",
        jobTitle: "General Manager of Energy Transition & Economic Analysis",
        company: "EGPC",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "female",
        domainId: "petro_econ",
        domainEn: "Petroleum Economics & Energy Transition",
        domainAr: "اقتصاديات البترول والطاقة والتحول الأخضر",
        subDisciplineEn: "Energy Transition & ESG Strategy",
        subDisciplineAr: "اقتصاديات مشاريع الطاقة والتحول الأخضر (ESG)",
        experienceYears: 18,
        degreeEn: "PhD (Energy Economics, Paris Dauphine University, 2011)",
        degreeAr: "دكتوراه (اقتصاديات الطاقة، جامعة باريس دوفين، 2011)",
        degreeLevel: "PhD",
        expertClassification: "regional",
        certs: ["IAEE Certified Energy Economist", "GARP Sustainability and Climate Risk (SCR)", "CFA Institute ESG Investing"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 110 123 4567",
            department: "Strategic Planning & International Agreements",
            programs: [
                "Petroleum Concession Agreement Economics (PSC / PSA)",
                "Carbon Capture, Utilization & Storage (CCUS) Feasibility",
                "Hydrogen Economy & Low-Carbon Ammonia Project Finance",
                "ESG Reporting & Decarbonization Frameworks for Oil & Gas"
            ]
        }
    },
    {
        id: "CAN-0112",
        code: "XP-0112",
        fullNameEn: "Eng. Karim Wagdy Zaki",
        fullNameAr: "م. كريم وجدي زكي",
        email: "karim.wagdy@enppi.com",
        jobTitle: "Head of Digital Oilfield & AI Solutions",
        company: "ENPPI",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "digital_oilfield",
        domainEn: "Digital Oilfield & Industrial Automation",
        domainAr: "التحول الرقمي والحقول الذكية (Digital Oilfield)",
        subDisciplineEn: "Predictive Analytics & Industrial AI",
        subDisciplineAr: "الذكاء الاصطناعي الصناعي والصيانة التنبؤية",
        experienceYears: 12,
        degreeEn: "MSc (Data Science & Intelligent Systems, Cairo Univ, 2018)",
        degreeAr: "ماجستير (علوم البيانات والنظم الذكية، جامعة القاهرة، 2018)",
        degreeLevel: "Master",
        expertClassification: "local",
        certs: ["Microsoft Certified Azure AI Engineer", "ISA-95 Enterprise-Control Integration Certified", "AWS Certified Machine Learning Specialist"],
        englishProficiency: "Fluent",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: true,
        registrationDetails: {
            phone: "+20 111 234 5678",
            department: "Digital Transformation & Technology",
            programs: [
                "Industrial IoT & Real-Time Well Telemetry Integration",
                "Predictive Maintenance Machine Learning for Rotating Assets",
                "Digital Twin Modeling of Hydrocarbon Processing Plants",
                "Cybersecurity Architectures for Operational Technology (OT / SCADA)"
            ]
        }
    },
    {
        id: "CAN-0113",
        code: "XP-0113",
        fullNameEn: "Eng. Essam Helmy Mostafa",
        fullNameAr: "م. عصام حلمي مصطفى",
        email: "essam.helmy@khalda-eg.com",
        jobTitle: "Senior Drilling Rig Superintendent",
        company: "Khalda",
        cohort: "Cohort A",
        cohortDescEn: "Group A: Current Sector Employee",
        cohortDescAr: "الدفعة (أ): ممارس حالي بالخدمة",
        gender: "male",
        domainId: "drilling_well",
        domainEn: "Drilling Operations & Well Intervention",
        domainAr: "عمليات الحفر والآبار والتدخلات الميدانية",
        subDisciplineEn: "HPHT Drilling & Well Control",
        subDisciplineAr: "حفر آبار الضغط والحرارة العالية (HPHT)",
        experienceYears: 9,
        degreeEn: "BSc (Petroleum Engineering, Cairo Univ, 2015)",
        degreeAr: "بكالوريوس (هندسة البترول، جامعة القاهرة، 2015)",
        degreeLevel: "Bachelor",
        expertClassification: "local",
        certs: ["IWCF Well Control Level 4 Supervisor", "IADC WellSharp Rig Pass Certified"],
        englishProficiency: "Basic",
        pitchVideoUrl: "video/sample-video.mp4",
        rareKnowledge: false,
        registrationDetails: {
            phone: "+20 112 345 6789",
            department: "Drilling Operations Western Desert",
            programs: [
                "Advanced Well Control for HPHT & Deep Gas Reservoirs",
                "Managed Pressure Drilling (MPD) Surface Systems",
                "Drill String Fatigue & Directional BHA Design",
                "Rig Floor Crew Leadership & Dynamic Kick Response"
            ]
        }
    }
];

// Benchmark sector candidates pool pre-populated across all 13 specialized disciplines
const initialCandidates = [...BENCHMARK_SECTOR_CANDIDATES];

// ==============================================================================
// MASTER OPERATIONAL WORKFLOW: 5 STRATEGIC PHASES WITH DETAILED STAGES (نظم العمل التفصيلية)
// ==============================================================================
const WORKFLOW_PHASES = [
    {
        phaseId: 1,
        phaseNumber: "PHASE 01",
        titleEn: "Project Setup & Online Registration Launch",
        titleAr: "الحوكمة، التأسيس والبنية الرقمية واستقبال الطلبات",
        subtitleEn: "Setting up the evaluation committee, securing the online portal, and opening applications across the sector",
        subtitleAr: "تأسيس المرجعية الإدارية للجنة، بروتوكولات الأمان السيبراني، وإطلاق الاستقبال القطاعي",
        icon: "fa-landmark-dome",
        colorVar: "--gold-bright",
        status: "Completed",
        statusAr: "مكتملة بنجاح",
        stages: [
            {
                stageCode: "Stage 1.1",
                titleEn: "Forming the Steering Committee & Official Announcement",
                titleAr: "تشكيل اللجنة العليا للتوجيه والإعلان الرسمي على مستوى القطاع",
                descriptionEn: "Forming the project steering committee and announcing the initiative across all sister and affiliated petroleum companies.",
                descriptionAr: "تشكيل اللجنة العليا وتدشين الحملة الترويجية الرسمية عبر كافة الشركات الشقيقة والمشتركة بالقطاع.",
                deliverableEn: "Approved Project Charter & Official Sector Announcement",
                deliverableAr: "الميثاق المعتمد للمشروع والتعميم القطاعي المعتمد",
                raci: "Steering Committee / HR & Training Leadership",
                badge: "Management"
            },
            {
                stageCode: "Stage 1.2",
                titleEn: "Approving the Work Plan & Team Responsibilities",
                titleAr: "اعتماد المخطط العام ومصفوفة المسؤوليات التفصيلية (RACI Matrix)",
                descriptionEn: "Approving the project timeline, key milestones, and assigning clear responsibilities to each department.",
                descriptionAr: "الاعتماد الكامل للمخطط الزمني ومحددات الإنجاز وتوزيع أدوار RACI على الإدارات المعنية.",
                deliverableEn: "Approved Work Plan & Standard Operating Procedures",
                deliverableAr: "مصفوفة RACI المعتمدة وأدلة الإجراءات التشغيلية",
                raci: "Project Steering Committee",
                badge: "Planning"
            },
            {
                stageCode: "Stage 1.3",
                titleEn: "Launching the Online Portal & Data Protection",
                titleAr: "اعتماد منصة ENPPI XpertGate وتأمين البيانات وسرية المتقدمين",
                descriptionEn: "Launching the bilingual online portal with full data protection to ensure complete privacy for all applicants.",
                descriptionAr: "تشغيل المنصة الرقمية ثنائية اللغة وتطبيق بروتوكولات الأمان السيبراني لحماية سرية المتقدمين.",
                deliverableEn: "Official Online Portal & Data Security Approval",
                deliverableAr: "المنصة الرقمية المعتمدة وشهادات الأمان السيبراني",
                raci: "IT & Digital Transformation Team",
                badge: "Online Portal"
            },
            {
                stageCode: "Stage 1.4",
                titleEn: "Publishing Selection Criteria & Receiving Applications",
                titleAr: "نشر كتيبات المعايير التخصصية واستقبال السير الذاتية وفيديوهات 120 ثانية",
                descriptionEn: "Publishing the requirements for all 12 training areas and opening registration to receive CVs and 2-minute intro videos.",
                descriptionAr: "إصدار الكتيبات التخصصية للمجالات الـ 12 وبدء تلقي طلبات المتقدمين مصحوبة بفيديو العرض التقديمي.",
                deliverableEn: "Applicant Records & Intro Video Library",
                deliverableAr: "قاعدة بيانات المتقدمين ومستودع الفيديوهات المرئية",
                raci: "Corporate Communications / Registration Office",
                badge: "Registration"
            }
        ]
    },
    {
        phaseId: 2,
        phaseNumber: "PHASE 02",
        titleEn: "Initial Screening & Practical Trainer Evaluation",
        titleAr: "منظومة الفرز الذكي والتقييم المعياري المحايد والعروض التطبيقية",
        subtitleEn: "Initial qualification check (Gate 1), objective video review, and 20-minute live training presentation",
        subtitleAr: "شروط بوابة 1، التقييم المعياري المحايد، وتقييم العروض التطبيقية",
        icon: "fa-scale-balanced",
        colorVar: "--color-info",
        status: "Active",
        statusAr: "جارية حالياً",
        stages: [
            {
                stageCode: "Stage 2.1",
                titleEn: "Initial Qualification Check (Gate 1) & Specialty Matching",
                titleAr: "شروط القبول المبدئي ومطابقة التخصصات الـ 12",
                descriptionEn: "Reviewing years of experience, university degrees, and professional certificates against the requirements of the 12 specialties.",
                descriptionAr: "حساب النقاط الآلية لسنوات الخبرة (40 نقطة/سنة حتى 800) ودرجات الماجستير/الدكتوراه والمؤهلات الإلزامية.",
                deliverableEn: "Gate 1 Review Results & Shortlisted Candidates",
                deliverableAr: "محاضر الفرز الآلي وقوائم المرشحين المؤهلين لبوابة 2",
                raci: "Screening System / Review Panel",
                badge: "Initial Check"
            },
            {
                stageCode: "Stage 2.2",
                titleEn: "Objective Review of the 2-Minute Intro Video",
                titleAr: "التقييم المعياري المحايد لفيديو الـ 120 ثانية للمرشحين",
                descriptionEn: "Unbiased committee review (hiding applicant name, photo, and company) to evaluate presentation style, clarity, and confidence.",
                descriptionAr: "حجب الاسم والصورة والشركة وتقييم المظهر التنفيذي، لغة الجسد، والقدرة على تبسيط المفهوم.",
                deliverableEn: "Objective Video Scorecards & Shortlist Decisions",
                deliverableAr: "بطاقات تقييم التحكيم الأعمى وقرارات الترشيح للمحاكاة",
                raci: "Expert Evaluation Committee",
                badge: "Unbiased Review"
            },
            {
                stageCode: "Stage 2.3",
                titleEn: "Personal Interviews & Technical Knowledge Assessment",
                titleAr: "المقابلات السلوكية المبنية على الجدارات والاختبار التحريري التخصصي",
                descriptionEn: "Conducting structured personal interviews and specialized technical tests to verify deep industry knowledge.",
                descriptionAr: "إجراء المقابلات السلوكية المقننة واختبار العمق المعرفي التخصصي في سلاسل القيمة البترولية.",
                deliverableEn: "Interview & Technical Assessment Reports",
                deliverableAr: "سجلات المقابلات وتقارير الاختبارات التحريرية",
                raci: "Subject Matter Experts / HR Panel",
                badge: "Interviews"
            },
            {
                stageCode: "Stage 2.4",
                titleEn: "15–20 Minute Live Training Presentation (100% Evaluation Matrix)",
                titleAr: "المحاكاة التدريبية الحية (15-20 دقيقة) وفق المصفوفة الثلاثية (100%)",
                descriptionEn: "Live training demo evaluated across Subject Knowledge (35%), Training Delivery (35%), and Personal Presence (30%) to set the trainer's level.",
                descriptionAr: "جلسة محاكاة تدريبية حية يتم تقييمها: معرفية وعقلية 35%، تدريبية وتقنية 35%، وإنسانية وحضور 30%.",
                deliverableEn: "Final Evaluation Scorecard & Approved Trainer Level",
                deliverableAr: "استمارات التقييم الثلاثية وقرار الاعتماد الفئوي",
                raci: "Evaluation Committee",
                badge: "Live Demo"
            }
        ]
    },
    {
        phaseId: 3,
        phaseNumber: "PHASE 03",
        titleEn: "Certificate Verification, Partner Sponsorship & Trainer Preparation (TTT)",
        titleAr: "التدقيق المرجعي، تمويل الشركاء الدوليين ومعسكر TTT المتقدم",
        subtitleEn: "Verifying certificates, awarding partner scholarships for the top 50, and TTT certification program",
        subtitleAr: "التدقيق الأكاديمي، منحة الـ 50 خبيراً بتمويل الشركات الأجنبية، ومعسكر TTT المعتمد",
        icon: "fa-certificate",
        colorVar: "--gold-bright",
        status: "Upcoming",
        statusAr: "مجدولة قريباً",
        stages: [
            {
                stageCode: "Stage 3.1",
                titleEn: "Verifying Academic Degrees & Professional Certificates",
                titleAr: "التدقيق المرجعي المباشر للشهادات الأكاديمية والمهنية الصادرة",
                descriptionEn: "Checking university degrees, Syndicate memberships, and international certificates (API, ASME, NEBOSH, PMP) for shortlisted candidates.",
                descriptionAr: "التحقق المباشر من صحة الشهادات الأكاديمية ونقابة المهندسين والشهادات الدولية المعتمدة للمتأهلين.",
                deliverableEn: "Verified Credentials Report",
                deliverableAr: "تقرير التدقيق المرجعي وصحة الوثائق الثبوتية",
                raci: "Verification & Compliance Team",
                badge: "Verification"
            },
            {
                stageCode: "Stage 3.2",
                titleEn: "Announcing Top 50 Trainers & Partner Scholarships",
                titleAr: "اعتماد قائمة الـ 50 خبيراً الأوائل وتوزيع منح الرعاية من الشركاء (IOCs)",
                descriptionEn: "Approving the top 50 candidates and awarding full international Train-the-Trainer (TTT) scholarships funded by international partners.",
                descriptionAr: "اعتماد قرار الفائزين بالمراتب الخمسين الأولى وتوزيع منح TTT الممولة من الشركاء الدوليين.",
                deliverableEn: "Official Top 50 List & Sponsorship Agreements",
                deliverableAr: "قرار اعتماد المتأهلين الأوائل وعقود تمويل الرعايات",
                raci: "Senior Management / International Partners",
                badge: "Sponsorship"
            },
            {
                stageCode: "Stage 3.3",
                titleEn: "International Train-the-Trainer (TTT) Certification Program",
                titleAr: "معسكر إعداد المدربين الدولي المكثف (International TTT Master Camp)",
                descriptionEn: "Training qualified experts on modern course design, adult training methods, interactive tools, and presentation skills.",
                descriptionAr: "تنفيذ برنامج إعداد وتأهيل المدربين وفق أحدث المعايير العالمية لتصميم الحقائب وتدريب الكبار.",
                deliverableEn: "International Certified Trainer Certificates",
                deliverableAr: "شهادات الاعتماد الدولية لمدربي قطاع البترول",
                raci: "ENPPI Training Center / International TTT Partner",
                badge: "TTT Program"
            }
        ]
    },
    {
        phaseId: 4,
        phaseNumber: "PHASE 04",
        titleEn: "Approved Trainers Directory & Annual Accreditation Guide",
        titleAr: "تفعيل بنك المهارات والدليل السنوي للمدربين المعتمدين",
        subtitleEn: "Publishing the trainers directory, hosting the graduation ceremony, and issuing the certified trainers guide",
        subtitleAr: "المستودع الرقمي التفاعلي، حفل التخرج السنوي، وإصدار الدليل السنوي للمدربين المعتمدين",
        icon: "fa-database",
        colorVar: "--color-success",
        status: "Upcoming",
        statusAr: "مجدولة قريباً",
        stages: [
            {
                stageCode: "Stage 4.1",
                titleEn: "Publishing Approved Profiles in the Trainers Directory",
                titleAr: "تدشين ملفات الخبراء المعتمدين ببنك المهارات ومؤشرات الجدارات",
                descriptionEn: "Publishing approved trainer profiles across all 12 training areas with their evaluation scores, specialties, and trainer level.",
                descriptionAr: "نشر ملفات الخبراء المعتمدين كاملة برادارات الجدارات الثلاثية ومؤشرات TQI عبر البوابة التفاعلية.",
                deliverableEn: "Online Approved Trainers Directory",
                deliverableAr: "قاعدة بيانات بنك المهارات المركزية المفهرسة",
                raci: "Training Center / Directory Management",
                badge: "Directory"
            },
            {
                stageCode: "Stage 4.2",
                titleEn: "Annual Graduation Ceremony & Top 50 Recognition",
                titleAr: "حفل التخرج السنوي وتكريم الخمسين خبيراً والشركاء الأجانب",
                descriptionEn: "Hosting the annual graduation ceremony to award certificates to approved trainers and recognize partner companies.",
                descriptionAr: "تنظيم حفل التخرج السنوي بحضور قيادات القطاع وتكريم نخبة الخبراء والشركاء الممولين للبرنامج.",
                deliverableEn: "Graduation Honor List & Official Accreditation Badges",
                deliverableAr: "سجل الشرف للخريجين وأوسمة الاعتماد التنفيذي",
                raci: "Public Relations / Event Committee",
                badge: "Graduation"
            },
            {
                stageCode: "Stage 4.3",
                titleEn: "Issuing the Annual ENPPI Certified Trainers Guide",
                titleAr: "إصدار وتوزيع الدليل الرسمي لمدربي إنبي المعتمدين لشركات القطاع",
                descriptionEn: "Sharing the official annual guide of Master, Senior, and Associate trainers with all training managers across the sector.",
                descriptionAr: "طباعة وتوزيع الدليل السنوي لمدربي إنبي متضمناً تصنيفات الخبراء وسجل تخصصاتهم لكافة مديري التدريب.",
                deliverableEn: "Official Certified Trainers Guide (Digital & Print)",
                deliverableAr: "دليل مدربي إنبي المعتمدين (رقمي ومطبوع)",
                raci: "ENPPI Training Center",
                badge: "Trainer Guide"
            }
        ]
    },
    {
        phaseId: 5,
        phaseNumber: "PHASE 05",
        titleEn: "Training Delivery, Quality Tracking & Financial Return (ROI)",
        titleAr: "تحقيق القيمة، قياس العائد المالي (ROI)، وضمان جودة التدريب",
        subtitleEn: "Delivering training courses, measuring trainee satisfaction, and tracking ROI",
        subtitleAr: "مؤشر TQI، تقارير الجودة، وحساب العائد على الاستثمار (ROI)",
        icon: "fa-chart-pie",
        colorVar: "--gold-bright",
        status: "Upcoming",
        statusAr: "مجدولة قريباً",
        stages: [
            {
                stageCode: "Stage 5.1",
                titleEn: "Delivering Training Courses Across Sector Training Centers",
                titleAr: "التشغيل الميداني لبرامج التدريب بمراكز وأكاديميات القطاع",
                descriptionEn: "Assigning certified national trainers to deliver specialized courses across petroleum companies, field sites, and ENPPI Training Centers.",
                descriptionAr: "بدء تنفيذ البرامج التدريبية الميدانية بقيادة المدربين الوطنيين المعتمدين في مواقع العمل ومجمعات البترول.",
                deliverableEn: "Delivered Courses Log & Trainee Attendance Records",
                deliverableAr: "سجل البرامج المنفذة وقوائم المتدربين الميدانيين",
                raci: "ENPPI Training Centers / Course Coordinators",
                badge: "Delivery"
            },
            {
                stageCode: "Stage 5.2",
                titleEn: "Trainee Feedback Surveys & Trainer Quality Rating (TQI)",
                titleAr: "التقييم الرقمي المستمر واحتساب مؤشر جودة المدرب (TQI Index)",
                descriptionEn: "Collecting post-course trainee feedback to calculate each trainer's Quality Rating (out of 5.0) and maintain high training standards.",
                descriptionAr: "تطبيق استبيانات التقييم الرقمية اللحظية واحتساب مؤشر TQI لجودة المدرب لضمان التميز المستمر.",
                deliverableEn: "Trainer Quality Reports & Trainee Satisfaction Scores",
                deliverableAr: "تقارير مؤشر الجودة TQI ومستوى رضا المتدربين",
                raci: "Training Quality Assurance Team",
                badge: "Quality Rating"
            },
            {
                stageCode: "Stage 5.3",
                titleEn: "ROI",
                titleAr: "العائد على الاستثمار (ROI)",
                descriptionEn: "Comparing course rates across each specialty between the average daily training fee of external providers and internal sector trainers after project implementation and operational rollout.",
                descriptionAr: "المقارنة لسعر الكورس بكل تخصص مابين متوسط تكلفة اليوم التدريبي للمدرب للمدربين الخارجيين والمدربين الداخليين من القطاع بعد تنفيذ المشروع وبدء العمل.",
                deliverableEn: "Training Cost Comparison & ROI Report",
                deliverableAr: "تقرير المقارنة المالية لتكلفة التدريب والعائد على الاستثمار (ROI)",
                raci: "Finance & Training Management",
                badge: "ROI Report"
            }
        ]
    }
];

// Fallback compatibility alias
const ROADMAP_STAGES = WORKFLOW_PHASES.map(phase => ({
    stageNumber: phase.phaseId,
    titleEn: `${phase.phaseNumber}: ${phase.titleEn}`,
    titleAr: `${phase.phaseNumber}: ${phase.titleAr}`,
    phases: phase.stages.map((stg, idx) => ({
        phaseNumber: idx + 1,
        nameEn: `${stg.stageCode}: ${stg.titleEn}`,
        nameAr: `${stg.stageCode}: ${stg.titleAr}`,
        deliverableEn: stg.deliverableEn,
        deliverableAr: stg.deliverableAr,
        raci: stg.raci,
        statusEn: phase.status,
        statusAr: phase.statusAr
    }))
}));

// ==============================================================================
// OFFICIAL XPERTGATE TRAINER COMPETENCY MATRIX GUIDE
// Source: دليل مصفوفة الجدارات لتقييم المدربين XpertGate.docx
// ==============================================================================
const XPERTGATE_COMPETENCY_MATRIX = {
    pillars: [
        {
            id: "cognitive",
            number: 1,
            icon: "fa-brain",
            weight: 35.0,
            weightTotal: 35.0,
            titleAr: "1. المحور الأول: الجدارات العقلية والمعرفية التخصصية (Cognitive & Domain)",
            titleEn: "1. Section 1: Subject Knowledge & Analytical Skills",
            subtitleAr: "يرتبط ببيانات المؤهلات الأكاديمية والتخصص الدقيق في استمارة التسجيل، ويقيس معيار \"إظهار المعرفة بالمادة العلمية\" (Standard 1).",
            subtitleEn: "Linked to academic qualifications and specialty in the registration form; measures deep understanding of the subject matter (Standard 1).",
            descAr: "يرتبط هذا المحور ببيانات المؤهلات الأكاديمية والتخصص الدقيق في استمارة التسجيل، ويقيس معيار \"إظهار المعرفة بالمادة العلمية\" (Standard 1).",
            descEn: "Linked to academic qualifications and specialty in the registration form; measures deep understanding of the subject matter (Standard 1).",
            competencies: [
                {
                    id: 1,
                    num: 1,
                    nameAr: "عمق المعرفة التخصصية بسلاسل القيمة (Subject-Matter Expertise)",
                    nameEn: "In-Depth Subject Knowledge",
                    titleAr: "عمق المعرفة التخصصية بسلاسل القيمة (Subject-Matter Expertise)",
                    titleEn: "In-Depth Subject Knowledge",
                    indicatorsAr: "تدريس معلومات دقيقة ومحدثة وتغطية شاملة لمخرجات التعلم وفق التخصص المسجل (بترول، حوكمة، رقمية).",
                    indicatorsEn: "Presents accurate, up-to-date information and covers all key learning points for the selected specialty.",
                    importanceAr: "بالغ الأهمية",
                    importanceEn: "Essential",
                    weight: 8.0
                },
                {
                    id: 2,
                    num: 2,
                    nameAr: "التفكير الاستراتيجي والتحليلي (Strategic & Analytical Thinking)",
                    nameEn: "Strategic & Analytical Thinking",
                    titleAr: "التفكير الاستراتيجي والتحليلي (Strategic & Analytical Thinking)",
                    titleEn: "Strategic & Analytical Thinking",
                    indicatorsAr: "ربط المحتوى التدريبي برؤية القطاع والتطلعات المستقبلية للجهات المستفيدة وسياق العمل التنفيذي.",
                    indicatorsEn: "Connects training topics to overall business goals, sector priorities, and real workplace needs.",
                    importanceAr: "مرتفع جداً",
                    importanceEn: "Very High",
                    weight: 7.0
                },
                {
                    id: 3,
                    num: 3,
                    nameAr: "حل المشكلات وصنع القرارات (Problem-Solving & Decision-Making)",
                    nameEn: "Problem-Solving & Decision-Making",
                    titleAr: "حل المشكلات وصنع القرارات (Problem-Solving & Decision-Making)",
                    titleEn: "Problem-Solving & Decision-Making",
                    indicatorsAr: "معالجة السيناريوهات المعقدة في بيئات العمل غير المستقرة ودمج وجهات النظر متعددة التخصصات.",
                    indicatorsEn: "Handles complex work scenarios effectively and considers perspectives from different departments.",
                    importanceAr: "مرتفع",
                    importanceEn: "High",
                    weight: 6.0
                },
                {
                    id: 4,
                    num: 4,
                    nameAr: "التطبيق العملي وحلول الواقع (Real-World Practical Translation)",
                    nameEn: "Practical Real-World Application",
                    titleAr: "التطبيق العملي وحلول الواقع (Real-World Practical Translation)",
                    titleEn: "Practical Real-World Application",
                    indicatorsAr: "استخدام أمثلة توضيحية واقعية لربط النظريات بحلول تطبيقية هندسية وإدارية ملموسة.",
                    indicatorsEn: "Uses clear, real-life examples from the field to turn theoretical concepts into practical workplace solutions.",
                    importanceAr: "جوهري",
                    importanceEn: "Core",
                    weight: 5.0
                },
                {
                    id: 5,
                    num: 5,
                    nameAr: "مواكبة المعايير والأكواد العالمية والرقمنة (Industry Trends & Codes)",
                    nameEn: "International Standards & Modern Practices",
                    titleAr: "مواكبة المعايير والأكواد العالمية والرقمنة (Industry Trends & Codes)",
                    titleEn: "International Standards & Modern Practices",
                    indicatorsAr: "دمج أحدث الممارسات الدولية، كودات السلامة العالمية، وتقنيات الذكاء الاصطناعي ذات الصلة بالتخصص.",
                    indicatorsEn: "Includes current international standards (such as API/ASME), safety rules, and modern digital tools.",
                    importanceAr: "تخصصي",
                    importanceEn: "Specialized",
                    weight: 4.0
                },
                {
                    id: 6,
                    num: 6,
                    nameAr: "الابتكار وتوليد الأفكار التدريبية (Innovation & Creative Thinking)",
                    nameEn: "Creative Thinking & Practical Exercises",
                    titleAr: "الابتكار وتوليد الأفكار التدريبية (Innovation & Creative Thinking)",
                    titleEn: "Creative Thinking & Practical Exercises",
                    indicatorsAr: "تحفيز التفكير الإبداعي لدى المتدربين وتوليد سيناريوهات محاكاة وتمارين تدريبية غير تقليدية.",
                    indicatorsEn: "Encourages trainees to think creatively using engaging case studies and practical exercises.",
                    importanceAr: "تطويري",
                    importanceEn: "Developmental",
                    weight: 5.0
                }
            ]
        },
        {
            id: "technical",
            number: 2,
            icon: "fa-chalkboard-user",
            weight: 35.0,
            weightTotal: 35.0,
            titleAr: "2. المحور الثاني: الجدارات التقنية والتدريبية (Technical & Instructional Delivery)",
            titleEn: "2. Section 2: Training Delivery & Course Organization Skills",
            subtitleAr: "يرتبط بمحفظة البرامج السبعة والشهادات الاحترافية، ويقيس معايير \"تصميم وتخطيط التدريس\" و\"التنفيذ والإدارة\" و\"التقييم\" (Standards 2, 3, 5).",
            subtitleEn: "Linked to the 7 proposed training courses and professional certificates; measures course planning, delivery, and trainee evaluation (Standards 2, 3 & 5).",
            descAr: "يرتبط هذا المحور بمحفظة البرامج السبعة والشهادات الاحترافية، ويقيس معايير \"تصميم وتخطيط التدريس\" و\"التنفيذ والإدارة\" و\"التقييم\" (Standards 2, 3, 5).",
            descEn: "Linked to the 7 proposed training courses and professional certificates; measures course planning, delivery, and trainee evaluation (Standards 2, 3 & 5).",
            competencies: [
                {
                    id: 7,
                    num: 7,
                    nameAr: "مهارات التنفيذ وتطبيق نظريات تعليم الكبار (Adult Learning & Andragogy)",
                    nameEn: "Adult Training & Facilitation Skills",
                    titleAr: "مهارات التنفيذ وتطبيق نظريات تعليم الكبار (Adult Learning & Andragogy)",
                    titleEn: "Adult Training & Facilitation Skills",
                    indicatorsAr: "تنويع الاستراتيجيات التعليمية بما يناسب أنماط التعلم المختلفة وإشراك المتدربين فردياً وجماعياً.",
                    indicatorsEn: "Uses varied training methods suited for adult professionals and involves trainees in individual and group activities.",
                    importanceAr: "بالغ الأهمية",
                    importanceEn: "Essential",
                    weight: 8.0
                },
                {
                    id: 8,
                    num: 8,
                    nameAr: "التسلسل المنطقي وهيكلة أهداف التعلم (Content Organization & Objectives)",
                    nameEn: "Clear Learning Objectives & Logical Flow",
                    titleAr: "التسلسل المنطقي وهيكلة أهداف التعلم (Content Organization & Objectives)",
                    titleEn: "Clear Learning Objectives & Logical Flow",
                    indicatorsAr: "إعلان أهداف التعلم، والربط بين الجلسات السابقة والقادمة، وتقديم المحتوى بتسلسل منطقي متدرج.",
                    indicatorsEn: "States clear learning goals, connects topics smoothly, and presents material in an easy-to-follow order.",
                    importanceAr: "مرتفع جداً",
                    importanceEn: "Very High",
                    weight: 6.0
                },
                {
                    id: 9,
                    num: 9,
                    nameAr: "إدارة الدورات كمشاريع وكفاءة المادة العلمية (Course Project Management)",
                    nameEn: "Course Preparation & Material Quality",
                    titleAr: "إدارة الدورات كمشاريع وكفاءة المادة العلمية (Course Project Management)",
                    titleEn: "Course Preparation & Material Quality",
                    indicatorsAr: "الالتزام بالمنهج المعتمد، إعداد مواد علمية رصينة، وإتاحة فرص التطبيق الفعلي لما تم تعلمه.",
                    indicatorsEn: "Follows the approved course outline, prepares well-structured material, and gives trainees time for hands-on practice.",
                    importanceAr: "مرتفع",
                    importanceEn: "High",
                    weight: 6.0
                },
                {
                    id: 10,
                    num: 10,
                    nameAr: "إدارة الوقت وضبط إيقاع الجلسة (Time Management & Pacing)",
                    nameEn: "Time Management & Session Pacing",
                    titleAr: "إدارة الوقت وضبط إيقاع الجلسة (Time Management & Pacing)",
                    titleEn: "Time Management & Session Pacing",
                    indicatorsAr: "الالتزام الصارم بالإطار الزمني لكل محور، وتوزيع الوقت بتوازن بين الشرح والتطبيق العملي.",
                    indicatorsEn: "Respects session time limits and balances time effectively between explanation, discussion, and practical exercises.",
                    importanceAr: "تنفيذي جوهري",
                    importanceEn: "Core",
                    weight: 5.0
                },
                {
                    id: 11,
                    num: 11,
                    nameAr: "توظيف الوسائط التفاعلية والتقنيات (EdTech & Training Aids)",
                    nameEn: "Effective Use of Presentation & Training Tools",
                    titleAr: "توظيف الوسائط التفاعلية والتقنيات (EdTech & Training Aids)",
                    titleEn: "Effective Use of Presentation & Training Tools",
                    indicatorsAr: "الاحتراف في استخدام الشاشات الذكية، البرمجيات التفاعلية، وأدوات العرض الحديثة.",
                    indicatorsEn: "Uses slides, visual aids, smart boards, and interactive tools clearly and effectively.",
                    importanceAr: "داعم",
                    importanceEn: "Supportive",
                    weight: 5.0
                },
                {
                    id: 12,
                    num: 12,
                    nameAr: "أساليب التقييم وقياس الاستيعاب (Assessment & Comprehension Checks)",
                    nameEn: "Checking Trainee Understanding & Feedback",
                    titleAr: "أساليب التقييم وقياس الاستيعاب (Assessment & Comprehension Checks)",
                    titleEn: "Checking Trainee Understanding & Feedback",
                    indicatorsAr: "استخدام أدوات تقييم ملائمة للمحتوى، ورصد المفاهيم الخاطئة وتصويبها وتقديم نتائج واضحة للمتدرب.",
                    indicatorsEn: "Checks that trainees understand the material, clarifies misunderstandings, and gives helpful feedback.",
                    importanceAr: "قياسي إلزامي",
                    importanceEn: "Required Standard",
                    weight: 5.0
                }
            ]
        },
        {
            id: "interpersonal",
            number: 3,
            icon: "fa-users-rays",
            weight: 30.0,
            weightTotal: 30.0,
            titleAr: "3. المحور الثالث: الجدارات الإنسانية والوجدانية والمظهر العام (Human, Interpersonal & Demeanor)",
            titleEn: "3. Section 3: Communication, Professional Presence & Classroom Management",
            subtitleAr: "يقيس معيار \"توفير بيئة تعلم داعمة وجاذبة\" والتفاعل الصفي (Standard 4)، وأبعاد الذكاء العاطفي والمظهر التنفيذي.",
            subtitleEn: "Measures creating a positive learning environment (Standard 4), professional appearance, communication skills, and audience engagement.",
            descAr: "يقيس هذا المحور معيار \"توفير بيئة تعلم داعمة وجاذبة\" والتفاعل الصفي (Standard 4)، وأبعاد الذكاء العاطفي والمظهر التنفيذي.",
            descEn: "Measures creating a positive learning environment (Standard 4), professional appearance, communication skills, and audience engagement.",
            competencies: [
                {
                    id: 13,
                    num: 13,
                    nameAr: "المظهر العام والحضور التنفيذي (Executive Demeanor & Appearance)",
                    nameEn: "Professional Appearance & Confidence",
                    titleAr: "المظهر العام والحضور التنفيذي (Executive Demeanor & Appearance)",
                    titleEn: "Professional Appearance & Confidence",
                    indicatorsAr: "الهندام التنفيذي الراقي، المظهر اللائق لبيئة الأعمال، الحضور القيادي، والثقة والاتزان التام تحت الملاحظة.",
                    indicatorsEn: "Maintains neat business attire, strong professional presence, self-confidence, and calm composure.",
                    importanceAr: "قيادي رمزي",
                    importanceEn: "Key Leadership",
                    weight: 6.0
                },
                {
                    id: 14,
                    num: 14,
                    nameAr: "الوضوح الصوتي والتنغيم والتوقف الهادف (Vocal Variety & Communication)",
                    nameEn: "Voice Clarity & Engaging Tone",
                    titleAr: "الوضوح الصوتي والتنغيم والتوقف الهادف (Vocal Variety & Communication)",
                    titleEn: "Voice Clarity & Engaging Tone",
                    indicatorsAr: "سلامة النطق ومخارج الحروف، التلوين الصوتي لجذب الانتباه، وإعطاء تعليمات واضحة لا لبس فيها.",
                    indicatorsEn: "Speaks clearly with an engaging tone of voice, uses pauses effectively, and gives clear instructions.",
                    importanceAr: "اتصالي جوهري",
                    importanceEn: "Core Communication",
                    weight: 5.0
                },
                {
                    id: 15,
                    num: 15,
                    nameAr: "الذكاء العاطفي والمرونة والاحتواء (Emotional Intelligence & Empathy)",
                    nameEn: "Active Listening & Positive Attitude",
                    titleAr: "الذكاء العاطفي والمرونة والاحتواء (Emotional Intelligence & Empathy)",
                    titleEn: "Active Listening & Positive Attitude",
                    indicatorsAr: "الإنصات للمشاركين بفهم وعناية، إظهار الشغف والحيوية، وتكييف الأسلوب وفق استجابات القاعة.",
                    indicatorsEn: "Listens attentively to participants, shows enthusiasm for the topic, and adjusts style to match the group's needs.",
                    importanceAr: "سلوكي مرتفع",
                    importanceEn: "High Interpersonal",
                    weight: 5.0
                },
                {
                    id: 16,
                    num: 16,
                    nameAr: "لغة الجسد والتواصل البصري (Body Language & Eye Contact)",
                    nameEn: "Body Language & Eye Contact",
                    titleAr: "لغة الجسد والتواصل البصري (Body Language & Eye Contact)",
                    titleEn: "Body Language & Eye Contact",
                    indicatorsAr: "استخدام لغة جسد منفتحة وواثقة، الاتزان الحركي بالقاعة، وتوزيع التواصل البصري بعدالة على الحضور.",
                    indicatorsEn: "Maintains open, confident body language, natural movement, and steady eye contact with all participants.",
                    importanceAr: "اتصالي غير لفظي",
                    importanceEn: "Non-Verbal Core",
                    weight: 4.0
                },
                {
                    id: 17,
                    num: 17,
                    nameAr: "ديناميكيات القاعة وبناء الفرق (Group Dynamics & Engagement)",
                    nameEn: "Group Interaction & Discussion Management",
                    titleAr: "ديناميكيات القاعة وبناء الفرق (Group Dynamics & Engagement)",
                    titleEn: "Group Interaction & Discussion Management",
                    indicatorsAr: "إدارة الأنشطة الجماعية، تحفيز النقاش الإيجابي، والقدرة على تغيير ترتيب مقاعد القاعة بما يخدم الهدف التدريبي.",
                    indicatorsEn: "Encourages active participation, leads constructive group discussions, and organizes team activities smoothly.",
                    importanceAr: "تيسيري تشاركي",
                    importanceEn: "Team Facilitation",
                    weight: 4.0
                },
                {
                    id: 18,
                    num: 18,
                    nameAr: "إدارة الضغوط والمواقف الحساسة (Handling Challenges Under Pressure)",
                    nameEn: "Handling Difficult Questions & Situations",
                    titleAr: "إدارة الضغوط والمواقف الحساسة (Handling Challenges Under Pressure)",
                    titleEn: "Handling Difficult Questions & Situations",
                    indicatorsAr: "الرد باحترافية على التساؤلات المعقدة، ووضع ضوابط واضحة للسلوك، والتعامل الحازم والدبلوماسي مع المقاطعات.",
                    indicatorsEn: "Answers challenging questions professionally, keeps discussions on track, and handles interruptions politely and firmly.",
                    importanceAr: "تفاوضي حرج",
                    importanceEn: "Important",
                    weight: 3.0
                },
                {
                    id: 19,
                    num: 19,
                    nameAr: "النزاهة، العدالة، وتقبل التطوير (Fairness, Integrity & Feedback)",
                    nameEn: "Fairness, Professionalism & Constructive Feedback",
                    titleAr: "النزاهة، العدالة، وتقبل التطوير (Fairness, Integrity & Feedback)",
                    titleEn: "Fairness, Professionalism & Constructive Feedback",
                    indicatorsAr: "إظهار النزاهة والانضباط الذاتي، التعامل بعدالة ومساواة مع كافة المتدربين، وتقديم الثناء والتغذية الراجعة البناءة.",
                    indicatorsEn: "Shows professionalism and respect, treats all participants equally, and offers encouraging, helpful feedback.",
                    importanceAr: "أخلاقي مؤسسي",
                    importanceEn: "Professional Ethics",
                    weight: 3.0
                }
            ]
        }
    ],
    directMapping: [
        {
            formItemAr: "Official Academic Certificates (BSc, MSc, PhD)",
            formItemEn: "University Degrees (Bachelor's, Master's, PhD)",
            objectiveAr: "Standard 1: Breadth of content knowledge",
            objectiveEn: "Standard 1: Strong academic foundation in the specialty",
            linkedCompetenciesAr: "البكالوريوس متطلب إلزامي، الماجستير والدكتوراه نقاط نضج معرفي",
            linkedCompetenciesEn: "Bachelor's degree is required; Master's & PhD add extra qualification points",
            verificationToolAr: "فحص مكتبي في Gate 1 + ينعكس في جدارة عمق التخصص (8%) في Gate 2.",
            verificationToolEn: "Reviewed in Gate 1 + evaluated under In-Depth Subject Knowledge (8%) in Gate 2."
        },
        {
            formItemAr: "Professional & International Certificates",
            formItemEn: "Professional & International Certificates",
            objectiveAr: "Standard 1: Connect content to real applications",
            objectiveEn: "Standard 1: Connecting knowledge to international industry standards",
            linkedCompetenciesAr: "شهادات تخصصية (PMP, NEBOSH, API, etc.)",
            linkedCompetenciesEn: "Recognized certificates (PMP, NEBOSH, API, ASME, etc.)",
            verificationToolAr: "فحص مكتبي في Gate 1 + ينعكس في جدارات حل المشكلات والأكواد العالمية (10%).",
            verificationToolEn: "Reviewed in Gate 1 + evaluated under Problem-Solving & International Standards (10%)."
        },
        {
            formItemAr: "Type of Experts & Experience (Local/Regional/Advisor)",
            formItemEn: "Years of Experience & Expert Level (Local / Regional / International)",
            objectiveAr: "Standard 3 & 4: Relate content to prior knowledge, Self-discipline",
            objectiveEn: "Standards 3 & 4: Practical field experience & professional maturity",
            linkedCompetenciesAr: "سنوات الخبرة وتصنيف الخبير (محلي / إقليمي / دولي)",
            linkedCompetenciesEn: "Total years of experience and expert level classification",
            verificationToolAr: "تحديد الفئة الاستشارية وتغذية جدارات الحضور التنفيذي والتعامل مع الضغوط.",
            verificationToolEn: "Helps determine trainer level and supports Professional Presence & Handling Difficult Questions."
        },
        {
            formItemAr: "Area of Expertise (Upstream, Midstream, HSE, etc.)",
            formItemEn: "Selected Training Specialty (12 Specialized Areas)",
            objectiveAr: "Standard 1: Accurate and up-to-date information",
            objectiveEn: "Standard 1: Accurate and up-to-date technical content",
            linkedCompetenciesAr: "عمق المعرفة بالتخصص في سلاسل القيمة",
            linkedCompetenciesEn: "In-Depth Subject Knowledge in the selected specialty",
            verificationToolAr: "قياس دقة وحداثة المعلومات الفنية المطروحة أثناء العرض التقديمي.",
            verificationToolEn: "Verified by assessing the accuracy of technical information during the live presentation."
        },
        {
            formItemAr: "List of 7 Training Programs",
            formItemEn: "Proposed List of 7 Training Courses",
            objectiveAr: "Standard 2: Follow prescribed curriculum, choose relevant activities",
            objectiveEn: "Standard 2: Clear course structure and relevant practical activities",
            linkedCompetenciesAr: "الوعي بالأهداف وهيكلة المحتوى وإدارة الدورة كمشروع",
            linkedCompetenciesEn: "Clear Learning Objectives, Logical Flow & Course Preparation",
            verificationToolAr: "تقييم جودة الحقيبة التدريبية المصغرة وتسلسل خطة الجلسة (12%).",
            verificationToolEn: "Evaluated by reviewing the sample training material and session plan (12%)."
        },
        {
            formItemAr: "Contact, Availability & Conduct",
            formItemEn: "Availability, Commitment & Professional Conduct",
            objectiveAr: "Standard 3 & 4: Time management, Fairness, Classroom behavior",
            objectiveEn: "Standards 3 & 4: Time management, fairness, and classroom management",
            linkedCompetenciesAr: "الانضباط الذاتي، إدارة الوقت، الهندام التنفيذي، والنزاهة",
            linkedCompetenciesEn: "Time Management, Professional Appearance, Fairness & Integrity",
            verificationToolAr: "تقييم سلوكي وتواصلي خلال المحاكاة الميدانية للعرض التقديمي.",
            verificationToolEn: "Observed directly during the personal interview and live training presentation."
        }
    ],
    scoringAnchors: [
        {
            score: 10,
            levelAr: "المستوى المتقدم (10 نقاط)",
            levelEn: "Excellent / Role Model (10 Points)",
            descAr: "حضور باهر، إتقان تخصصي تام، وقدرة استثنائية على قيادة الحوار وإدارة تحديات القاعة.",
            descEn: "Strong professional presence, deep subject mastery, and outstanding ability to engage participants and answer tough questions."
        },
        {
            score: 8,
            levelAr: "المستوى المتمكن (8 نقاط)",
            levelEn: "Very Good / Capable (8 Points)",
            descAr: "مظهر مهني مناسب، إلمام تخصصي متين، إجابات واضحة، وتفاعل جيد مع المتدربين.",
            descEn: "Professional appearance, solid grasp of the subject, clear explanations, and good interaction with trainees."
        },
        {
            score: 6,
            levelAr: "المستوى الأساسي (6 نقاط)",
            levelEn: "Basic / Needs Improvement (6 Points)",
            descAr: "شرح تقليدي يغلب عليه التلقين، ارتباك نسبي تحت الضغط، ويحتاج إلى تطوير وتوجيه.",
            descEn: "Traditional lecture style with limited interaction, some hesitation under pressure, and needs further coaching."
        }
    ],
    deploymentMatrix: [
        {
            minScore: 90,
            range: "90% – 100%",
            rangeAr: "90% فأكثر",
            rangeEn: "90% and Above",
            decisionAr: "خبير دولي / استشاري أول (Master / Star)",
            decisionEn: "Master Trainer / Senior Advisor",
            scopeAr: "يُعتمد لقيادة برامج الإدارة العليا، واللجان الاستراتيجية، ومشاريع الطاقة الكبرى.",
            scopeEn: "Approved to lead senior management programs, strategic workshops, and major sector training initiatives.",
            badgeClass: "badge-master"
        },
        {
            minScore: 80,
            range: "80% – 89%",
            rangeAr: "80% إلى 89%",
            rangeEn: "80% to 89%",
            decisionAr: "مدرب وميسر محترف معتمد (Senior Trainer)",
            decisionEn: "Certified Senior Trainer",
            scopeAr: "يُعتمد لقيادة البرامج التخصصية المتقدمة وورش العمل وتيسير جلسات الكوتشينغ التوجيهي.",
            scopeEn: "Approved to deliver advanced specialized courses, technical workshops, and professional coaching sessions.",
            badgeClass: "badge-senior"
        },
        {
            minScore: 70,
            range: "70% – 79%",
            rangeAr: "70% إلى 79%",
            rangeEn: "70% to 79%",
            decisionAr: "مدرب ممارس (Associate Trainer)",
            decisionEn: "Associate Trainer",
            scopeAr: "يُعتمد لتدريب الكوادر التشغيلية والبرامج التأسيسية تحت إشراف خبير أول (وهو ما يتقاطع مع حد النجاح الأدنى البالغ 75% في نموذج الملاحظة الميدانية).",
            scopeEn: "Approved to deliver foundational and operational courses under the guidance of a Senior or Master Trainer.",
            badgeClass: "badge-associate"
        },
        {
            minScore: 0,
            range: "< 70%",
            rangeAr: "أقل من 70%",
            rangeEn: "Below 70%",
            decisionAr: "مسار تطويري (Deferred / Development)",
            decisionEn: "Needs Further Development (Not Yet Approved)",
            scopeAr: "يُرفض الطلب أو يُلزم بدخول برنامج صقل المهارات وإعادة التقييم بعد 6 أشهر.",
            scopeEn: "Recommended to join a trainer preparation program and reapply for evaluation after 6 months.",
            badgeClass: "badge-deferred"
        }
    ]
};

// ==============================================================================
// COMMITTEE EVALUATION MATRIX (المصفوفة الجدارية لتقييم المدربين XpertGate)
// Source: دليل مصفوفة الجدارات لتقييم المدربين XpertGate.docx
// 5 Criteria × 3 Sub-items (15 Items), Scale 1–5, Weights 25/20/25/15/15
// ==============================================================================
const XG_COMMITTEE_MATRIX = {
    scale: { min: 1, max: 5, labelEn: "Evaluation Scale (1–5 per item)", labelAr: "مقياس التقييم (1–5 لكل بند)" },
    scoreLabels: [
        { value: 5, labelEn: "Exceeds International Standards", labelAr: "يفوق المعايير الدولية" },
        { value: 4, labelEn: "Meets Standards with Excellence", labelAr: "يلبي المعايير بامتياز" },
        { value: 3, labelEn: "Meets Standards", labelAr: "يلبي المعايير" },
        { value: 2, labelEn: "Partially Meets", labelAr: "يلبيها جزئياً" },
        { value: 1, labelEn: "Does Not Meet", labelAr: "لا يلبيها" }
    ],
    decisionMatrix: [
        { min: 90, labelEn: "Elite Expert — Immediate Accreditation + Invitation to Arbitration", labelAr: "خبير نخبوي — اعتماد فوري + دعوة للتحكيم" },
        { min: 75, labelEn: "Certified Expert", labelAr: "خبير معتمد" },
        { min: 60, labelEn: "Conditional Accreditation — Re-presentation within 6 Months", labelAr: "اعتماد مشروط — إعادة عرض خلال 6 أشهر" },
        { min: 0, labelEn: "Not Qualified for This Cycle", labelAr: "غير مؤهل لهذه الدورة" }
    ],
    exclusionRuleEn: "Exclusion Rule: Any score ≤ 2 in item 1.1 (Scientific Soundness) or 2.2 (Time Commitment) = immediate disqualification regardless of total.",
    exclusionRuleAr: "قاعدة الإقصاء: أي درجة ≤2 في البند 1.1 (الرصانة العلمية) أو 2.2 (الالتزام بالوقت) = إقصاء مباشر مهما بلغ المجموع.",
    criteria: [
        {
            id: 1,
            titleEn: "Scientific Soundness & Professionalism",
            titleAr: "الرصانة العلمية والاحترافية",
            weight: 25,
            items: [
                { id: "1.1", textEn: "Depth of content, recency, and alignment with latest developments and global references in the specialty", textAr: "عمق المحتوى وحداثته ومواكبته لأحدث المستجدات والمراجع العالمية في التخصص" },
                { id: "1.2", textEn: "Explicit distinction between personal experience and evidence-based scientific support (with citations)", textAr: "التمييز الصريح بين خبرته الشخصية والأدلة العلمية المؤيدة (مع ذكر المصادر)" },
                { id: "1.3", textEn: "Linking content to implementable real-world applications in trainee's work environment", textAr: "ربط المحتوى بتطبيقات واقعية قابلة للتنفيذ في بيئة عمل المتدرب" }
            ]
        },
        {
            id: 2,
            titleEn: "15-Minute Presentation Engineering",
            titleAr: "هندسة العرض في 15 دقيقة",
            weight: 20,
            items: [
                { id: "2.1", textEn: "Structured presentation: engaging opening in first 2 minutes, logical development, impactful conclusion", textAr: "بنية عرض محكمة: مدخل جاذب في أول دقيقتين، تطور منطقي، وخاتمة مؤثرة" },
                { id: "2.2", textEn: "Strict time adherence (15 minutes) with pace management without compromising content", textAr: "الالتزام الصارم بالوقت (15 دقيقة) مع إدارة الإيقاع دون إخلال بالمحتوى" },
                { id: "2.3", textEn: "Professional visual design: concise slides, illustrative graphics, and efficient technical tools", textAr: "تصميم بصري احترافي: شرائح موجزة، رسوم توضيحية، وأدوات تقنية تعمل بكفاءة" }
            ]
        },
        {
            id: 3,
            titleEn: "Oratory & Live Performance Art",
            titleAr: "فن الإلقاء والأداء الحضوري",
            weight: 25,
            noteEn: "Heaviest weight",
            noteAr: "الأثقل وزناً",
            items: [
                { id: "3.1", textEn: "Clear language and precise terminology suitable for multidisciplinary audience without oversimplification or dull sterilization", textAr: "لغة واضحة ومصطلحات دقيقة تناسب جمهوراً متعدد التخصصات دون تبسيط مخل أو تعقيم ممل" },
                { id: "3.2", textEn: "Effective non-verbal communication: body language, eye contact distribution, and stage presence", textAr: "تواصل غير لفظي مؤثر: لغة جسد، توزيع نظرات، واستخدام مسرحية للقاعة" },
                { id: "3.3", textEn: "Leadership and mental presence: responding to committee questions with confidence and accuracy during Q&A session", textAr: "حضور قيادي وحضور ذهني: الاستجابة لأسئلة اللجنة بثقة ودقة خلال جلسة الأسئلة" }
            ]
        },
        {
            id: 4,
            titleEn: "Interaction & Room Management",
            titleAr: "التفاعل وإدارة القاعة",
            weight: 15,
            items: [
                { id: "4.1", textEn: "Smart interaction points (targeted question, quick poll, mini exercise) despite time constraints", textAr: "افتعال نقاط تفاعلية ذكية (سؤال موجّه، استطلاع سريع، تمرين مصغر) رغم محدودية الوقت" },
                { id: "4.2", textEn: "Reading room energy and immediately adjusting style when attention is lost", textAr: "قراءة طاقة القاعة وتعديل الأسلوب فوراً عند فقدان الانتباه" },
                { id: "4.3", textEn: "Engaging committee and attendees without turning into a side discussion wasting time", textAr: "إشراك اللجنة والحضور دون أن يتحول العرض إلى نقاش جانبي يهدر الوقت" }
            ]
        },
        {
            id: 5,
            titleEn: "Impact & Added Value",
            titleAr: "الأثر والقيمة المضافة",
            weight: 15,
            items: [
                { id: "5.1", textEn: "Leaving trainee with tangible outputs: framework, tools, or implementation plan usable immediately", textAr: "ترك المتدرب بمخرجات ملموسة: إطار عمل، أدوات، أو خطة تطبيق يمكن استخدامها فوراً" },
                { id: "5.2", textEn: "Proving unique added value distinguishing expert from others (special vision or innovative methodology)", textAr: "إثبات قيمة مضافة فريدة تميز الخبير عن غيره (رؤية خاصة أو منهجية مبتكرة)" },
                { id: "5.3", textEn: "Answering the essential question: \"What will I do differently tomorrow after this presentation?\"", textAr: "الإجابة عن السؤال الجوهري: \"ماذا سأفعل مختلفاً غداً بعد هذا العرض؟\"" }
            ]
        }
    ]
};

if (typeof window !== 'undefined') {
    window.BENCHMARK_SECTOR_CANDIDATES = BENCHMARK_SECTOR_CANDIDATES;
    window.initialCandidates = initialCandidates;
    window.WORKFLOW_PHASES = WORKFLOW_PHASES;
    window.ROADMAP_STAGES = ROADMAP_STAGES;
    window.XG_COMMITTEE_MATRIX = XG_COMMITTEE_MATRIX;
}
