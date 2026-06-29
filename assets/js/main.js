window.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL STATE ---

    let db = null; // Local copy of courses data

    let dbOriginal = null; // Unmodified copy for change tracking

    let userRole = 'student'; // 'student' or 'admin'

    let isDbModified = false;



    // --- DESIGN THEME STATE ---

    const initTheme = () => {

        const themeBtn = document.getElementById('theme-toggle');

        const currentTheme = localStorage.getItem('theme') || 'dark';

        

        document.documentElement.setAttribute('data-theme', currentTheme);

        updateThemeIcon(currentTheme);

        

        if (themeBtn) {

            themeBtn.addEventListener('click', () => {

                const activeTheme = document.documentElement.getAttribute('data-theme');

                const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);

                localStorage.setItem('theme', newTheme);

                updateThemeIcon(newTheme);

            });

        }

    };

    

    const updateThemeIcon = (theme) => {

        const iconSpan = document.querySelector('#theme-toggle span');

        if (iconSpan) {

            iconSpan.innerHTML = theme === 'dark' ? '☀️' : '🌙';

        }

    };



    // --- MAIN ROUTER & TAB NAVIGATION ---

    const navLinks = document.querySelectorAll('.nav-link');

    const pages = document.querySelectorAll('.page-content');

    const mobileMenuBtn = document.getElementById('mobile-nav-toggle');

    const navMenu = document.getElementById('nav-menu');



    const switchTab = (targetId) => {

        navLinks.forEach(link => link.classList.remove('active'));

        pages.forEach(page => page.classList.remove('active'));



        const targetLink = document.querySelector(`.nav-link[href="${targetId}"]`);

        if (targetLink) targetLink.classList.add('active');



        const targetPage = document.querySelector(targetId);

        if (targetPage) {

            targetPage.classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });

        }



        // Classroom specific checks

        if (targetId === '#classroom') {

            checkClassroomAccess();

        }



        // Close mobile menu on switch

        if (navMenu && navMenu.classList.contains('mobile-open')) {

            navMenu.classList.remove('mobile-open');

        }

    };



    navLinks.forEach(link => {

        link.addEventListener('click', (e) => {

            e.preventDefault();

            const targetId = link.getAttribute('href');

            if (window.location.hash !== targetId) {

                history.pushState(null, null, targetId);

            }

            switchTab(targetId);

        });

    });



    if (mobileMenuBtn && navMenu) {

        mobileMenuBtn.addEventListener('click', () => {

            navMenu.classList.toggle('mobile-open');

        });

    }



    const handleHashChange = () => {

        const hash = window.location.hash || '#home';

        switchTab(hash);

    };



    window.addEventListener('popstate', handleHashChange);

    window.addEventListener('hashchange', handleHashChange);



    // --- DEFAULT FALLBACK DATA FOR LOCAL / OFFLINE USE ---

    const DEFAULT_COURSES_DATA = {
    "courses": {
        "23mat106": {
            "code": "23MAT106",
            "title": "Mathematics for Intelligent Systems - I",
            "semester": "Fall 2025",
            "credits": 4,
            "students": "BTech AID, Batch A and B (Total: 133 Students) First Year, First Semester",
            "timeline": "6 Aug - 5 Dec, 2025",
            "roomInfo": "Rooms: Section A (LH 310) \u00b7 Section B (LH 314)",
            "schedule": [
                {
                    "slot": "08:50 - 09:40",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": "Section A"
                },
                {
                    "slot": "09:40 - 10:30",
                    "monday": "Section B",
                    "tuesday": "",
                    "wednesday": "Section A",
                    "thursday": "Section B",
                    "friday": ""
                },
                {
                    "slot": "10:30 - 10:45",
                    "break": true
                },
                {
                    "slot": "11:35 - 12:25",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": "Section B"
                },
                {
                    "slot": "12:25 - 01:15",
                    "monday": "Section A",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": "Project B"
                },
                {
                    "slot": "01:15 - 02:05",
                    "break": true
                },
                {
                    "slot": "02:05 - 03:45",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "Section B (Lab)",
                    "thursday": "Section A (Lab)",
                    "friday": ""
                },
                {
                    "slot": "03:45 - 04:35",
                    "monday": "Project A",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                }
            ],
            "syllabus": [
                {
                    "unit": "Unit 1: Basics of Linear Algebra",
                    "content": "Gaussian elimination, vector spaces, rank, CR matrix decompositions, rotations, eigenvalues/eigenvectors, and introductory singular value decomposition (SVD). Computational experiments using Matlab/Excel/Simulink."
                },
                {
                    "unit": "Unit 2: Ordinary Linear Differential Equations",
                    "content": "Formulating ODEs, impulse responses, numerical integrations in Simulink/MATLAB, Taylor series, and optimization boundaries. Examples of ODE modeling in falling objects, satellites, planetary motion, electrical and mechanical systems."
                },
                {
                    "unit": "Unit 3: Probability & Random Variables",
                    "content": "Introduction to random variables (continuous and discrete), mean, standard deviation, variance, sum of independent random variables, convolution, sum of convolution integral, probability distributions."
                },
                {
                    "unit": "Unit 4: Quantum Computing Foundations",
                    "content": "Dirac bra-ket notations, inner/outer matrix products, state vector systems, and computational maps for the National Quantum Mission."
                }
            ],
            "lectures": [
                {
                    "title": "Lecture 01: Introduction to Linear Algebra for AI",
                    "date": "06/08/2025",
                    "url": "https://drive.google.com/file/d/1iQD5Idz2AqHFS5tHxHp9FYU0DpuDQ2t2/view?usp=sharing"
                },
                {
                    "title": "Lecture 02: Pseudoinverse in Action: Left and Right Inverses",
                    "date": "08/08/2025",
                    "url": "https://drive.google.com/file/d/1QxHKnfaHpDvrX1Q6f9Q9I8hQ8eetbBaU/view?usp=sharing"
                },
                {
                    "title": "Lecture 03: Pseudoinverse : Guide to your first AI application",
                    "date": "11/08/2025",
                    "url": "https://drive.google.com/file/d/1tWhlRsK2VE4cyas4OhLAwnjNwyOfuxrR/view?usp=sharing"
                },
                {
                    "title": "Lecture 04: Complex Data Processing",
                    "date": "13/08/2025",
                    "url": "https://drive.google.com/file/d/1xMa106_qIavA7vq0Un-bNcqrSbn4ItBr/view?usp=sharing"
                },
                {
                    "title": "Lecture 05-06: Advanced Optimization and Physics-Informed Approaches",
                    "date": "18/08/2025",
                    "url": "https://drive.google.com/file/d/1Cex5xgXujKA76VS8t02WuPzfFm4i7vMf/view?usp=sharing"
                },
                {
                    "title": "Lecture 07: Linear Algebra Behind LLMs and Generative AI",
                    "date": "21/08/2025",
                    "url": "https://drive.google.com/file/d/1rwP78U60kntlpxxYTe5jD12t332jRt1s/view?usp=sharing"
                },
                {
                    "title": "Lecture 08-10: Symmetries and Principal Axes of Transformations",
                    "date": "01-05/09/2025",
                    "url": "https://drive.google.com/file/d/1MkGZUF9IKAIYxBv7noBz9B3FnrgaPJc5/view?usp=sharing"
                },
                {
                    "title": "Lecture 11-12: Introduction to Ordinary Differential Equations",
                    "date": "08-10/09/2025",
                    "url": "https://drive.google.com/file/d/1MkGZUF9IKAIYxBv7noBz9B3FnrgaPJc5/view?usp=sharing"
                },
                {
                    "title": "Lecture 13-15: Impulse Response and Convolution",
                    "date": "10-13/09/2025",
                    "url": "https://drive.google.com/file/d/1_PaitQ1drWka5PChDg8cy8fRMGuFMhA2/view?usp=sharing"
                },
                {
                    "title": "Lecture S1: An Introduction to Python for Linear Algebra",
                    "date": "17/09/2025",
                    "url": "https://drive.google.com/file/d/1pRwjpohrF_t-iULyS0VWk7NBpHGEKWqo/view?usp=sharing"
                },
                {
                    "title": "Lecture 16-17: Modeling Falling Objects, Satellites, and Planetary Motion",
                    "date": "03-04/10/2025",
                    "url": "https://drive.google.com/file/d/1hlK77sH8cevDB_e4i1mbi67cYOawG7hw/view?usp=sharing"
                },
                {
                    "title": "Lecture 18: Ordinary Differential Equations Model",
                    "date": "06/10/2025",
                    "url": "https://drive.google.com/file/d/1oe9eS-2PNsJ_ms5_4UgoKinqTAhAeGID/view?usp=sharing"
                },
                {
                    "title": "Lecture 19: Complex RLC Circuit Analysis",
                    "date": "08/10/2025",
                    "url": "https://drive.google.com/file/d/15vP6HRE0uMPYSHGrdb1SOZZ2CLl9UuaU/view?usp=sharing"
                },
                {
                    "title": "Lecture 20-21: Solving Ordinary Differential Equations in Python with SciPy",
                    "date": "08/10/2025",
                    "url": "https://drive.google.com/file/d/1mkCa3YYbM5Y04IAdMoVx39nBrDEsV5sR/view?usp=sharing"
                },
                {
                    "title": "Lecture 22: Numerical Solution of ODEs",
                    "date": "11/10/2025",
                    "url": "https://drive.google.com/file/d/1C-MSVKh_8QVNJtfayCFyjBGn_F1A2To5/view?usp=sharing"
                },
                {
                    "title": "Lecture 23-26: Probability and Random Variables",
                    "date": "24/10/2025",
                    "url": "https://drive.google.com/file/d/1iRcFYW5_NAFJNh9FnoA9uo16n-Cv5R8c/view?usp=sharing"
                },
                {
                    "title": "Hybrid Lecture-1: Building your first AI model",
                    "date": "05/11/2025",
                    "url": "https://drive.google.com/file/d/1qLYkZweb2UPk8yMq9tnCXjYJoxhnoDSO/view?usp=sharing"
                },
                {
                    "title": "Hybrid Lecture-2: Building your second AI model",
                    "date": "06/11/2025",
                    "url": "https://drive.google.com/file/d/1qPFETANADVHdJYmeeauB-VWI1uOieIvr/view?usp=sharing"
                },
                {
                    "title": "Hybrid Lecture-3: Polynomial Regression via Design Matrix Modification",
                    "date": "07/11/2025",
                    "url": "https://drive.google.com/file/d/1JhTzCXodJKlXThSbIfQH9Wt4rWrv4WA1/view?usp=sharing"
                },
                {
                    "title": "Hybrid Lecture-4: Finding the Pseudoinverse via CR Decomposition",
                    "date": "11/11/2025",
                    "url": "https://drive.google.com/file/d/1HwdJjU6YZwOnGfQAE5U_FlKCwx0ZBiwr/view?usp=sharing"
                },
                {
                    "title": "Hybrid Lecture-5: SVD Applications in Intelligent Systems",
                    "date": "12/11/2025",
                    "url": "https://drive.google.com/file/d/1o-EyZnoYgP5XWq7N9jYSVEB9K5tOGHDT/view?usp=sharing"
                },
                {
                    "title": "Hybrid Lecture-6: SVD and Stochastic Analysis",
                    "date": "14/11/2025",
                    "url": "https://drive.google.com/file/d/1ZmoDHKNj4rgpQNUL0a5F4NBmyQDESGfY/view?usp=sharing"
                },
                {
                    "title": "Summary and Revision Unit-I-II-III (Theory)",
                    "date": "17/11/2025",
                    "url": "https://drive.google.com/file/d/1AH3pcCV2Y20UcjFV1GsWdiEphSNxoSeG/view?usp=sharing"
                },
                {
                    "title": "Summary and Revision Unit-I-II-III (Coding)",
                    "date": "19/11/2025",
                    "url": "https://drive.google.com/file/d/1H00roWBC8HzWcGgA-pDbqYawVBSGjIwY/view?usp=sharing"
                },
                {
                    "title": "SmartLab1: Linear Regression on the Edge",
                    "date": "27/11/2025",
                    "url": "https://drive.google.com/file/d/1odIEqeeOxx4CVEQcGZPm_qSWesh43KN_/view?usp=sharing"
                },
                {
                    "title": "Lecture 27: Introduction to Quantum Computing",
                    "date": "28/11/2025",
                    "url": "https://drive.google.com/file/d/1_WMGs493n6NF6MFzfg_KIoJpky-3X1ex/view?usp=sharing"
                },
                {
                    "title": "Lecture 28-30: Quantum Computing (Extended)",
                    "date": "29/11/2025",
                    "url": "https://drive.google.com/file/d/1TDx-ZVSEYl2dRAufjnGKXv9N5GwKH0rJ/view?usp=sharing"
                }
            ],
            "assignments": [
                {
                    "title": "Assignment 1: Linear Algebra and ML",
                    "due": "18/08/2025",
                    "url": "https://drive.google.com/file/d/1rkGgMks5BO0PGgv5f-wHzubaMnZHBIxF/view?usp=sharing"
                },
                {
                    "title": "Assignment 2: Differential Equations and Modeling",
                    "due": "11/10/2025",
                    "url": "https://drive.google.com/file/d/1yReUaF3pPoDgymTmBLUbRtqrZP40dzlW/view?usp=sharing"
                }
            ],
            "projects": [
                {
                    "title": "Summary of Topical Projects",
                    "url": "https://drive.google.com/file/d/1kfk44ClGk1CHYdp4oH3HK4MVGU5g_oYK/view?usp=drive_link"
                }
            ]
        },
        "23chy115": {
            "code": "23CHY115",
            "title": "Introduction to Material Informatics",
            "semester": "Spring 2026",
            "credits": 3,
            "students": "BTech AID, Batch A and B (Total: 129 Students) First Year, Second Semester",
            "timeline": "5 Jan - 4 May, 2026",
            "roomInfo": "Rooms: Section A (LH 310) \u00b7 Section B (LH 314)",
            "schedule": [
                {
                    "slot": "08:50 - 09:40",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": "Section A"
                },
                {
                    "slot": "09:40 - 10:30",
                    "monday": "Section B",
                    "tuesday": "",
                    "wednesday": "Section A",
                    "thursday": "Section B",
                    "friday": ""
                },
                {
                    "slot": "10:30 - 10:45",
                    "break": true
                },
                {
                    "slot": "11:35 - 12:25",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": "Section B"
                },
                {
                    "slot": "12:25 - 01:15",
                    "monday": "Section A",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                },
                {
                    "slot": "01:15 - 02:05",
                    "break": true
                },
                {
                    "slot": "02:05 - 03:45",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "Section B (Lab)",
                    "thursday": "",
                    "friday": ""
                },
                {
                    "slot": "03:45 - 04:35",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "Section A (Lab)",
                    "friday": ""
                }
            ],
            "syllabus": [
                {
                    "unit": "Unit 1: Introduction to Material Science & Force Fields",
                    "content": "Structure, properties, and process spaces; process-structure-property linkages. Monte Carlo, Molecular Dynamics simulations, Normal Mode Analysis, and Density Functional Theory (DFT) using Gaussian/Gauss view."
                },
                {
                    "unit": "Unit 2: Screening & Property Predictions",
                    "content": "Quantification and screening of materials properties. Property prediction and optimization using AI. Materials design and discovery using AI. Handling small, sparse, and low-quality datasets."
                },
                {
                    "unit": "Unit 3: Catastrophe Science & Inverse Design",
                    "content": "Materials failure and sustainability analysis. Inverse materials design concepts. Solving inverse design via AI. Cost-effectiveness optimization. Quantum computing concepts in material informatics."
                },
                {
                    "unit": "Unit 4: Case Studies & Ethical Limits",
                    "content": "Case studies of material informatics (AI) in different fields (e.g. energy, aerospace, biomedical, etc.). Ethical considerations, data boundaries, and future directions."
                }
            ],
            "lectures": [
                {
                    "title": "Lecture 01-03: Overview of Material Informatics",
                    "date": "12/01/2026",
                    "url": "https://drive.google.com/file/d/10rcKnWqmk5Hy0MSTJqXo8-H74M2xk72T/view?usp=sharing"
                },
                {
                    "title": "Lecture S1: Generative Prediction using Koopman Theory",
                    "date": "19/01/2026",
                    "url": "https://drive.google.com/file/d/1cZaj16h_Sk6r1eZzc-ZFUbtcTkD7J-z2/view?usp=sharing"
                },
                {
                    "title": "Lecture 4-5: Koopman Operator & Simple DMD",
                    "date": "22/01/2026",
                    "url": "https://drive.google.com/file/d/1hfJNXZGG6GfeTdLZS3ALU6GrzoUQhBdy/view?usp=sharing"
                },
                {
                    "title": "Lecture 6-7: Koopman Prediction in Material Informatics",
                    "date": "26/01/2026",
                    "url": "https://drive.google.com/file/d/1lz4Ddp6zURVGcWDvydx6Za-LBiv1wt7c/view?usp=sharing"
                },
                {
                    "title": "Lecture 8: Single Variable Time-Series Prediction (Hankel-DMD)",
                    "date": "02/02/2026",
                    "url": "https://drive.google.com/file/d/1uW-H33hAH_Th4Y_Ejim6yngpuo9gq43a/view?usp=sharing"
                },
                {
                    "title": "Lecture S2: Data-Driven Model Engineering",
                    "date": "09/02/2026",
                    "url": "https://drive.google.com/file/d/1zUQ6BYGaNtxK2LeCS5pzdL0czc-1aZHG/view?usp=sharing"
                },
                {
                    "title": "DMD Slides: Data-Driven Model Engineering",
                    "date": "09/02/2026",
                    "url": "https://drive.google.com/file/d/1zUQ6BYGaNtxK2LeCS5pzdL0czc-1aZHG/view?usp=drive_link"
                },
                {
                    "title": "Lecture 9-10: Analytical Data-Driven Koopman",
                    "date": "12/02/2026",
                    "url": "https://drive.google.com/file/d/10btQz3_e2ZYVLppxqe5Zqhg0wxUBOAZY/view?usp=drive_link"
                },
                {
                    "title": "Lecture 11-12: Introduction to Molecular Dynamics",
                    "date": "16/02/2026",
                    "url": "https://drive.google.com/file/d/1I54B2QkDEIKDU_1Vk8Or9NcVrmtz-gaw/view?usp=drive_link"
                },
                {
                    "title": "Lecture 13: Basic Molecular Dynamics",
                    "date": "23/02/2026",
                    "url": "https://drive.google.com/file/d/1hnKFxWve7AYl4j8dOCd-JzC-rZAyxlYu/view?usp=drive_link"
                },
                {
                    "title": "Lecture 14-15: Catastrophic Algorithms (Sandpile vs. CBO Earthquake Model)",
                    "date": "02/03/2026",
                    "url": "https://drive.google.com/file/d/1t1njTsSTpOiqRU6bVZCJHe98pCBcKfsM/view?usp=drive_link"
                },
                {
                    "title": "Lecture 14-18: Catastrophic Algorithms (Extended Study)",
                    "date": "09/03/2026",
                    "url": "https://drive.google.com/file/d/1BSzk1M6NML5LYN_KgRYH-GUJco4YDLPv/view?usp=sharing"
                },
                {
                    "title": "Lecture 22: Massively Parallel Material Simulations LAMMPS and OVITO",
                    "date": "23/03/2026",
                    "url": "https://drive.google.com/file/d/1X1Cv0vV0pIWJsyU0P-M8dduBeOsBiz-I/view?usp=sharing"
                },
                {
                    "title": "Lecture 24: Agent-Based Simulations using LAMMPS",
                    "date": "30/03/2026",
                    "url": "https://drive.google.com/file/d/1-ZvtPiX5y_kmptXihOqa5jQbOkfN724e/view?usp=sharing"
                },
                {
                    "title": "Lecture 26: Post Processing LAMMPS Data Sets",
                    "date": "06/04/2026",
                    "url": "https://drive.google.com/file/d/1SXG6P7WjXRF_BbrG1r8ix1ya77g1PmKw/view?usp=sharing"
                },
                {
                    "title": "Lecture 27: Tutorial: Material Discovery with AI",
                    "date": "13/04/2026",
                    "url": "https://drive.google.com/file/d/1x02_HxmbctBWNH9JE-QyohEowLdpwCw6/view?usp=sharing"
                },
                {
                    "title": "Lecture 26-30: Material Discovery by AI (Extended Slides)",
                    "date": "20/04/2026",
                    "url": "https://drive.google.com/file/d/1-ZvtPiX5y_kmptXihOqa5jQbOkfN724e/view?usp=sharing"
                },
                {
                    "title": "Lecture 31: Vibrational Dynamics, Normal Mode Analysis (NMA)",
                    "date": "27/04/2026",
                    "url": "https://drive.google.com/file/d/1lmd9snw_9iXnuwFd-jeRUOTeB5SqjVov/view?usp=sharing"
                },
                {
                    "title": "Lecture 32-34: Ethical Considerations, Limitations, and Future Directions",
                    "date": "04/05/2026",
                    "url": "https://drive.google.com/file/d/1znn-zVH3Ciy3cJJHQO3Tiuo-i4yUdGIt/view?usp=sharing"
                },
                {
                    "title": "Extensive Summary Note",
                    "date": "04/05/2026",
                    "url": "https://drive.google.com/file/d/1Is5xz_s14I5ROZDtmghbUwJOtNb5wAZT/view?usp=sharing"
                }
            ],
            "assignments": [
                {
                    "title": "Assignment 01: Coding MD & Property Screenings",
                    "due": "31/01/2026",
                    "url": "https://drive.google.com/file/d/1DHuBZ-bzmekvveB4S0OiRT2LBufMDDvi/view?usp=sharing"
                }
            ],
            "projects": [
                {
                    "title": "Summary of Project Review",
                    "url": "https://drive.google.com/file/d/13OLMqsd1L7j0Fj4esVj72-NellyJjNn9/view?usp=sharing"
                }
            ]
        },
        "23mat204": {
            "code": "23MAT204",
            "title": "Mathematics for Intelligent Systems 3",
            "semester": "Fall 2025",
            "credits": 4,
            "students": "BTech AID",
            "timeline": "TBD",
            "roomInfo": "Rooms: Section A (Academic Block 4 - LH 15) \u00b7 Section B (Academic Block 4 - LH 16)",
            "schedule": [
                {
                    "slot": "08:50 - 09:40",
                    "monday": "Section A",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                },
                {
                    "slot": "09:40 - 10:30",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "Section B",
                    "thursday": "",
                    "friday": "Section A"
                },
                {
                    "slot": "10:30 - 10:45",
                    "break": true
                },
                {
                    "slot": "10:45 - 11:35",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                },
                {
                    "slot": "11:35 - 12:25",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": "Section B"
                },
                {
                    "slot": "12:25 - 01:15",
                    "monday": "",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                },
                {
                    "slot": "01:15 - 02:05",
                    "break": true
                },
                {
                    "slot": "02:05 - 02:55",
                    "monday": "Section B",
                    "tuesday": "",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                },
                {
                    "slot": "02:55 - 03:45",
                    "monday": "Section B",
                    "tuesday": "Section A",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                },
                {
                    "slot": "03:45 - 04:35",
                    "monday": "",
                    "tuesday": "Section A",
                    "wednesday": "",
                    "thursday": "",
                    "friday": ""
                }
            ],
            "syllabus": [
                {
                    "unit": "Unit 1: Optimization and Linear Algebra",
                    "content": "Direct methods for convex functions - sparsity inducing penalty functions- Constrained Convex Optimization problems - Krylov subspace -Conjugate gradient method - formulating problems as LP and QP - Lagrangian multiplier method-KKT conditions - support vector machines- solving by packages (CVXOPT) - Introduction to RKS - Introduction to DMD-Tensor and HoSVD- Linear algebra for AI."
                },
                {
                    "unit": "Unit 2: PDEs and Computational Experiments",
                    "content": "Introduction to PDEs - Formulation and numerical solution methods (Finite difference and Fourier) for PDEs in Physics and Engineering- Computational experiments using Matlab/Excel/Simulink."
                },
                {
                    "unit": "Unit 3: Stochastic Processes",
                    "content": "Multivariate Gaussian and weighted least squares - Markov chains - Markov decision Process"
                },
                {
                    "unit": "Unit 4: Quantum Computing",
                    "content": "Introduction to quantum computing-Bells inequality-Quantum gates"
                }
            ],
            "lectures": [],
            "assignments": [],
            "projects": []
        }
    }
};



    const loadDatabase = async () => {

        try {

            const response = await fetch('assets/data/courses_data.json?t=' + new Date().getTime());

            if (!response.ok) throw new Error('Failed to load courses data.');

            db = await response.json();

            dbOriginal = JSON.parse(JSON.stringify(db)); // Deep clone

            renderClassroom();

        } catch (error) {

            console.warn('Could not fetch course configuration via HTTP/CORS. Utilizing embedded fallback data:', error);

            db = JSON.parse(JSON.stringify(DEFAULT_COURSES_DATA));

            dbOriginal = JSON.parse(JSON.stringify(db));

            renderClassroom();

        }

    };



    const renderClassroom = () => {

        if (!db || !db.courses) return;

        

        renderCourseDetail('23mat106');

        renderCourseDetail('23chy115');
        renderCourseDetail('23mat204');

    };



    const renderCourseDetail = (courseKey) => {

        const course = db.courses[courseKey];

        if (!course) return;



        const view = document.getElementById(`course-${courseKey}`);

        if (!view) return;



        if (!course.announcements) {

            course.announcements = [];

        }



        // 0. Render Announcements noticeboard

        const announcementsContainer = document.getElementById(`announcements-${courseKey}`);

        if (announcementsContainer) {

            let html = '';

            

            // Render uploader form if admin

            if (userRole === 'admin') {

                html += `

                    <div class="announcement-publisher-card">

                        <h3>📢 Publish Notice & Handout Link (Dr. Suman Dutta Only)</h3>

                        <form onsubmit="addAnnouncement(event, '${courseKey}')" style="display:flex; flex-direction:column; gap:12px;">

                            <div class="form-row">

                                <div class="form-group">

                                    <label>Notice / Message Text</label>

                                    <input type="text" id="ann-text-${courseKey}" placeholder="e.g. Slide notes for Unit 2 are now uploaded. Mid-term quiz on Monday!" required>

                                </div>

                                <div class="form-group">

                                    <label>Link / Drive URL (Optional)</label>

                                    <input type="url" id="ann-url-${courseKey}" placeholder="https://drive.google.com/...">

                                </div>

                            </div>

                            <button type="submit" class="btn-submit-form" style="align-self: flex-end;">Publish Notice & Link</button>

                        </form>

                    </div>

                `;

            }

            

            if (course.announcements.length === 0) {

                if (userRole === 'admin') {

                    html += '<p style="font-size:13.5px; color:var(--text-muted); padding: 8px 0;">No active notices published yet.</p>';

                }

            } else {

                html += `

                    <div class="announcements-list-wrapper">

                        ${course.announcements.map((item, index) => `

                            <div class="announcement-card">

                                <div class="announcement-content-side">

                                    <span class="announcement-tag-badge">Notice</span>

                                    <p class="announcement-txt">${item.text}</p>

                                </div>

                                <div class="announcement-actions">

                                    ${item.url ? `

                                        <a href="${item.url}" target="_blank" class="btn-announcement-link">

                                            📂 Access Resource

                                        </a>

                                    ` : ''}

                                    ${userRole === 'admin' ? `

                                        <button class="delete-btn" onclick="deleteAnnouncement('${courseKey}', ${index})" style="position:static; margin-left:8px;">×</button>

                                    ` : ''}

                                </div>

                            </div>

                        `).join('')}

                    </div>

                `;

            }

            announcementsContainer.innerHTML = html;

        }



        // 1. Render Syllabus Accordions

        const syllabusContainer = view.querySelector('.syllabus-accordion');

        if (syllabusContainer) {

            syllabusContainer.innerHTML = course.syllabus.map((item, index) => `

                <div class="accordion-item ${index === 0 ? 'open' : ''}">

                    <div class="accordion-header">

                        <span>${item.unit}</span>

                        <span class="accordion-icon">▼</span>

                    </div>

                    <div class="accordion-content" style="${index === 0 ? 'max-height: 500px; padding: 16px;' : ''}">

                        <p>${item.content}</p>

                    </div>

                </div>

            `).join('');

        }



        // 2. Render Lecture Notes Directory (Tabular searchable view)

        const lecturesContainer = view.querySelector('.lecture-list');

        if (lecturesContainer) {

            lecturesContainer.innerHTML = `

                <div class="lecture-index-header">

                    <div class="lecture-search-wrapper">

                        <span class="search-input-icon">🔍</span>

                        <input type="text" class="lecture-search-input" placeholder="Search lectures by topic or date..." oninput="window.filterLectureIndex(event)">

                    </div>

                </div>

                <div class="lecture-table-scroll">

                    <table class="lecture-index-table">

                        <thead>

                            <tr>

                                <th>Lecture Topic / Slide Name</th>

                                <th>Date</th>

                                <th style="text-align: right;">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            ${course.lectures.map((item, index) => `

                                <tr class="lecture-row" data-title="${item.title.toLowerCase()}" data-date="${item.date.toLowerCase()}">

                                    <td class="lecture-title-cell">

                                        <a href="${item.url}" target="_blank" class="lecture-table-link">

                                            <span class="file-icon">📄</span>

                                            <span class="lecture-row-title">${item.title}</span>

                                        </a>

                                    </td>

                                    <td class="lecture-date-cell">

                                        <span class="lecture-row-date">${item.date}</span>

                                    </td>

                                    <td class="lecture-actions-cell" style="text-align: right;">

                                        <div class="lecture-actions-flex">

                                            <a href="${item.url}" target="_blank" class="btn-table-action btn-view-note">View Notes</a>

                                            ${userRole === 'admin' ? `

                                                <button class="btn-table-action btn-delete-note" onclick="deleteItem('${courseKey}', 'lectures', ${index})">Delete</button>

                                            ` : ''}

                                        </div>

                                    </td>

                                </tr>

                            `).join('') || `

                                <tr>

                                    <td colspan="3" class="no-data-cell">No lectures uploaded.</td>

                                </tr>

                            `}

                        </tbody>

                    </table>

                </div>

            `;

        }



        // 3. Render Assignments Links

        const assignmentsContainer = view.querySelector('.assignments-list');

        if (assignmentsContainer) {

            assignmentsContainer.innerHTML = course.assignments.map((item, index) => `

                <li class="assignment-item-row delete-btn-wrapper">

                    ${userRole === 'admin' ? `<button class="delete-btn" onclick="deleteItem('${courseKey}', 'assignments', ${index})">×</button>` : ''}

                    <div class="assignment-info">

                        <span class="assignment-icon">📂</span>

                        <a href="${item.url}" target="_blank" class="assignment-link">

                            ${item.title}

                        </a>

                    </div>

                    <span class="assignment-due-badge">Due: ${item.due}</span>

                </li>

            `).join('') || '<p style="font-size:13.5px; color:var(--text-muted); padding: 8px 16px;">No current assignments.</p>';

        }



        // 4. Render Project Links

        const projectsContainer = view.querySelector('.projects-list');

        if (projectsContainer) {

            projectsContainer.innerHTML = course.projects.map((item, index) => `

                <li class="assignment-item-row delete-btn-wrapper">

                    ${userRole === 'admin' ? `<button class="delete-btn" onclick="deleteItem('${courseKey}', 'projects', ${index})">×</button>` : ''}

                    <div class="assignment-info">

                        <span class="assignment-icon">💻</span>

                        <a href="${item.url}" target="_blank" class="assignment-link">

                            ${item.title}

                        </a>

                    </div>

                </li>

            `).join('') || '<p style="font-size:13.5px; color:var(--text-muted); padding: 8px 16px;">No current project files.</p>';

        }



        // Render Add Forms if Admin

        const formContainer = view.querySelector('.admin-forms-placeholder');

        if (formContainer) {

            if (userRole === 'admin') {

                formContainer.classList.remove('hidden');

                formContainer.innerHTML = `

                    <div class="admin-form-container">

                        <h4>📝 Add New Lecture Slide Note</h4>

                        <form onsubmit="addLecture(event, '${courseKey}')" class="admin-form">

                            <div class="form-row">

                                <div class="form-group">

                                    <label>Note Title</label>

                                    <input type="text" placeholder="e.g. Lecture 08: Principle Axis" required id="form-note-title-${courseKey}">

                                </div>

                                <div class="form-group">

                                    <label>Publish Date</label>

                                    <input type="text" placeholder="e.g. 05/09/2025" required id="form-note-date-${courseKey}">

                                </div>

                            </div>

                            <div class="form-row">

                                <div class="form-group">

                                    <label>Drive / Resource URL</label>

                                    <input type="url" placeholder="https://drive.google.com/..." required id="form-note-url-${courseKey}">

                                </div>

                                <button type="submit" class="btn-submit-form">Insert Handout</button>

                            </div>

                        </form>

                    </div>



                    <div class="admin-form-container">

                        <h4>📅 Add Assignment Link</h4>

                        <form onsubmit="addAssignment(event, '${courseKey}')" class="admin-form">

                            <div class="form-row">

                                <div class="form-group">

                                    <label>Assignment Name</label>

                                    <input type="text" placeholder="e.g. Assignment 1: Vector Spaces" required id="form-ass-title-${courseKey}">

                                </div>

                                <div class="form-group">

                                    <label>Due Date</label>

                                    <input type="text" placeholder="e.g. 18/08/2025" required id="form-ass-due-${courseKey}">

                                </div>

                            </div>

                            <div class="form-row">

                                <div class="form-group">

                                    <label>Resource URL</label>

                                    <input type="url" placeholder="https://drive.google.com/..." required id="form-ass-url-${courseKey}">

                                </div>

                                <button type="submit" class="btn-submit-form">Add Assignment</button>

                            </div>

                        </form>

                    </div>

                `;

            } else {

                formContainer.classList.add('hidden');

                formContainer.innerHTML = '';

            }

        }

    };



    // --- CMS EDIT OPERATIONS ---

    window.addAnnouncement = (event, courseKey) => {

        event.preventDefault();

        const textEl = document.getElementById(`ann-text-${courseKey}`);

        const urlEl = document.getElementById(`ann-url-${courseKey}`);

        

        if (textEl) {

            const text = textEl.value.trim();

            const url = urlEl ? urlEl.value.trim() : '';

            

            if (!db.courses[courseKey].announcements) {

                db.courses[courseKey].announcements = [];

            }

            

            db.courses[courseKey].announcements.unshift({ text, url });

            

            textEl.value = '';

            if (urlEl) urlEl.value = '';

            

            trackDatabaseModifications();

            renderCourseDetail(courseKey);

            showToast('Notice published successfully!', 'success');

        }

    };

    

    window.deleteAnnouncement = (courseKey, index) => {

        if (confirm('Are you sure you want to delete this notice?')) {

            db.courses[courseKey].announcements.splice(index, 1);

            trackDatabaseModifications();

            renderCourseDetail(courseKey);

            showToast('Notice removed.', 'success');

        }

    };



    window.deleteItem = (courseKey, type, index) => {

        if (confirm('Are you sure you want to remove this item?')) {

            db.courses[courseKey][type].splice(index, 1);

            trackDatabaseModifications();

            renderCourseDetail(courseKey);

        }

    };



    window.filterLectureIndex = (event) => {

        const query = event.target.value.toLowerCase();

        const detailView = event.target.closest('.course-detail-view');

        if (!detailView) return;

        const rows = detailView.querySelectorAll('.lecture-row');

        let visibleCount = 0;

        rows.forEach(row => {

            const title = row.getAttribute('data-title') || '';

            const date = row.getAttribute('data-date') || '';

            if (title.includes(query) || date.includes(query)) {

                row.style.display = '';

                visibleCount++;

            } else {

                row.style.display = 'none';

            }

        });

        

        let noResultsRow = detailView.querySelector('.no-results-row');

        if (visibleCount === 0 && rows.length > 0) {

            if (!noResultsRow) {

                const tbody = detailView.querySelector('.lecture-index-table tbody');

                if (tbody) {

                    noResultsRow = document.createElement('tr');

                    noResultsRow.className = 'no-results-row';

                    noResultsRow.innerHTML = `<td colspan="3" style="text-align:center; padding: 24px; color: var(--text-muted); font-size: 13.5px; border:none; background:transparent;">No matching lecture notes found.</td>`;

                    tbody.appendChild(noResultsRow);

                }

            }

        } else {

            if (noResultsRow) {

                noResultsRow.remove();

            }

        }

    };



    window.addLecture = (event, courseKey) => {

        event.preventDefault();

        const titleEl = document.getElementById(`form-note-title-${courseKey}`);

        const dateEl = document.getElementById(`form-note-date-${courseKey}`);

        const urlEl = document.getElementById(`form-note-url-${courseKey}`);



        if (titleEl && dateEl && urlEl) {

            db.courses[courseKey].lectures.push({

                title: titleEl.value.trim(),

                date: dateEl.value.trim(),

                url: urlEl.value.trim()

            });



            titleEl.value = '';

            dateEl.value = '';

            urlEl.value = '';



            trackDatabaseModifications();

            renderCourseDetail(courseKey);

            showToast('Lecture slide note inserted successfully!', 'success');

        }

    };



    window.addAssignment = (event, courseKey) => {

        event.preventDefault();

        const titleEl = document.getElementById(`form-ass-title-${courseKey}`);

        const dueEl = document.getElementById(`form-ass-due-${courseKey}`);

        const urlEl = document.getElementById(`form-ass-url-${courseKey}`);



        if (titleEl && dueEl && urlEl) {

            db.courses[courseKey].assignments.push({

                title: titleEl.value.trim(),

                due: dueEl.value.trim(),

                url: urlEl.value.trim()

            });



            titleEl.value = '';

            dueEl.value = '';

            urlEl.value = '';



            trackDatabaseModifications();

            renderCourseDetail(courseKey);

            showToast('Assignment linkage inserted successfully!', 'success');

        }

    };



    const trackDatabaseModifications = () => {

        isDbModified = JSON.stringify(db) !== JSON.stringify(dbOriginal);

        const floatBar = document.getElementById('admin-float-bar');

        const statusText = document.getElementById('admin-status-text');

        const statusContainer = document.getElementById('admin-status-container');



        if (floatBar) {

            if (userRole === 'admin') {

                floatBar.classList.remove('hidden');

                if (isDbModified) {

                    statusContainer.classList.remove('clean');

                    statusText.innerHTML = 'Unsaved course database alterations detected';

                } else {

                    statusContainer.classList.add('clean');

                    statusText.innerHTML = 'All edits committed to local session';

                }

            } else {

                floatBar.classList.add('hidden');

            }

        }

    };



    // --- CLASSROOM PASSWORD PROTECTION & ROLES ---

    const CLASSROOM_PASSCODE = '23MAT106';

    const ADMIN_PASSCODE = '23MAT106-ADMIN';

    const passwordForm = document.getElementById('password-form');

    const passcodeVal = document.getElementById('passcode-input');

    const passwordError = document.getElementById('password-error-message');

    const passwordPrompt = document.getElementById('password-prompt-container');

    const classroomContent = document.getElementById('classroom-content');



    const checkClassroomAccess = () => {

        const sessionState = sessionStorage.getItem('classroomAccessGranted');

        const sessionRole = sessionStorage.getItem('classroomUserRole');



        if (sessionState === 'true') {

            userRole = sessionRole || 'student';

            passwordPrompt.classList.add('hidden');

            classroomContent.classList.remove('hidden');

            renderClassroom();

            trackDatabaseModifications();

            closeCourse();

        } else {

            passwordPrompt.classList.remove('hidden');

            classroomContent.classList.add('hidden');

            const floatBar = document.getElementById('admin-float-bar');

            if (floatBar) floatBar.classList.add('hidden');

        }

    };



    if (passwordForm) {

        passwordForm.addEventListener('submit', (e) => {

            e.preventDefault();

            const inputVal = passcodeVal.value.trim();



            if (inputVal === ADMIN_PASSCODE) {

                sessionStorage.setItem('classroomAccessGranted', 'true');

                sessionStorage.setItem('classroomUserRole', 'admin');

                userRole = 'admin';

                passwordError.textContent = '';

                passcodeVal.value = '';

                checkClassroomAccess();

                showToast('Welcome, Dr. Suman Dutta. Administrator Access Granted.', 'success');

            } else if (inputVal === CLASSROOM_PASSCODE) {

                sessionStorage.setItem('classroomAccessGranted', 'true');

                sessionStorage.setItem('classroomUserRole', 'student');

                userRole = 'student';

                passwordError.textContent = '';

                passcodeVal.value = '';

                checkClassroomAccess();

            } else {

                passwordError.textContent = 'Incorrect passcode. Please try again.';

                passcodeVal.classList.add('error-shake');

                setTimeout(() => passcodeVal.classList.remove('error-shake'), 400);

                passcodeVal.value = '';

            }

        });

    }



    // Logout / Relock

    window.relockPortal = () => {

        sessionStorage.removeItem('classroomAccessGranted');

        sessionStorage.removeItem('classroomUserRole');

        userRole = 'student';

        isDbModified = false;

        checkClassroomAccess();

        showToast('Logged out of classroom portal.', 'success');

    };



    // --- CMS SYNCING CONNECTORS (DOWNLOAD & GIT) ---

    // 1. Download updated courses_data.json file locally

    window.downloadDbConfig = () => {

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));

        const dlAnchorElem = document.createElement('a');

        dlAnchorElem.setAttribute("href", dataStr);

        dlAnchorElem.setAttribute("download", "courses_data.json");

        dlAnchorElem.click();

        showToast('JSON config generated. Move it into assets/data/ to verify locally.', 'success');

    };



    // 2. Open Git Settings modal

    window.openGitSettings = () => {

        const modal = document.getElementById('git-modal');

        if (modal) {

            modal.classList.remove('hidden');

            

            // Populate inputs if saved in local storage

            const patVal = localStorage.getItem('git_pat') || '';

            const repoVal = localStorage.getItem('git_repo') || 'aids-a-b/Website';

            

            document.getElementById('git-pat-input').value = patVal;

            document.getElementById('git-repo-input').value = repoVal;

        }

    };



    window.closeGitSettings = () => {

        const modal = document.getElementById('git-modal');

        if (modal) modal.classList.add('hidden');

    };



    // 3. Commit changes to GitHub Pages repository using REST API

    window.syncDatabaseToGit = async (e) => {

        e.preventDefault();

        const pat = document.getElementById('git-pat-input').value.trim();

        const repo = document.getElementById('git-repo-input').value.trim();

        const filePath = 'assets/data/courses_data.json';

        const commitMsg = 'CMS Update: Modified course schedule & note files';

        

        if (!pat || !repo) {

            showToast('GitHub Token and Repository details are required.', 'error');

            return;

        }



        // Save preferences

        localStorage.setItem('git_pat', pat);

        localStorage.setItem('git_repo', repo);



        showToast('Connecting to GitHub API...', 'success');

        closeGitSettings();



        const [owner, repoName] = repo.split('/');

        if (!owner || !repoName) {

            showToast('Repository path must be in standard Owner/Repo format (e.g. sd3ph/sd3ph.github.io)', 'error');

            return;

        }



        const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`;



        try {

            // Step 1: Retrieve the existing file hash (SHA)

            const getRes = await fetch(url, {

                headers: {

                    'Authorization': `Bearer ${pat}`,

                    'Accept': 'application/vnd.github.v3+json'

                }

            });



            let fileSha = null;

            if (getRes.ok) {

                const fileData = await getRes.json();

                fileSha = fileData.sha;

            } else if (getRes.status !== 404) {

                throw new Error(`Failed to retrieve configuration metadata: status ${getRes.status}`);

            }



            // Step 2: Push the base64 encoded payload back

            const jsonPayload = JSON.stringify(db, null, 2);

            const bodyData = {

                message: commitMsg,

                content: btoa(unescape(encodeURIComponent(jsonPayload))),

                sha: fileSha

            };



            const putRes = await fetch(url, {

                method: 'PUT',

                headers: {

                    'Authorization': `Bearer ${pat}`,

                    'Accept': 'application/vnd.github.v3+json',

                    'Content-Type': 'application/json'

                },

                body: JSON.stringify(bodyData)

            });



            if (putRes.ok) {

                showToast('Site Database updated on GitHub! Pages will rebuild in ~30s.', 'success');

                dbOriginal = JSON.parse(JSON.stringify(db)); // Update original baseline

                trackDatabaseModifications();

            } else {

                const errData = await putRes.json();

                throw new Error(errData.message || 'Error updating target file.');

            }



        } catch (err) {

            console.error('Git integration failure:', err);

            showToast(`GitHub commit failed: ${err.message}`, 'error');

        }

    };



    // --- INTERACTIVE ACTIVE MATTER BACKGROUND ---

    const initCanvasBackground = () => {

        const canvas = document.getElementById('bg-canvas');

        if (!canvas) return;

        

        const ctx = canvas.getContext('2d');

        let width = (canvas.width = window.innerWidth);

        let height = (canvas.height = window.innerHeight);



        const particles = [];

        // LIVELY, GOATED particle count (42 max)

        const particleCount = Math.min(42, Math.floor((width * height) / 32000));

        

        let mouse = { x: null, y: null, radius: 120 };



        window.addEventListener('mousemove', (e) => {

            mouse.x = e.x;

            mouse.y = e.y;

        });



        window.addEventListener('mouseout', () => {

            mouse.x = null;

            mouse.y = null;

        });



        window.addEventListener('resize', () => {

            width = canvas.width = window.innerWidth;

            height = canvas.height = window.innerHeight;

        });



        class Particle {

            constructor() {

                this.x = Math.random() * width;

                this.y = Math.random() * height;

                // Active, non-distracting speeds

                this.vx = (Math.random() - 0.5) * 0.80;

                this.vy = (Math.random() - 0.5) * 0.80;

                // Slightly larger, premium visual density

                this.radius = Math.random() * 1.8 + 0.8;

            }



            update() {

                if (mouse.x !== null && mouse.y !== null) {

                    const dx = this.x - mouse.x;

                    const dy = this.y - mouse.y;

                    const dist = Math.sqrt(dx * dx + dy * dy);

                    

                    if (dist < mouse.radius) {

                        const force = (mouse.radius - dist) / mouse.radius;

                        const angle = Math.atan2(dy, dx);

                        this.vx += Math.cos(angle) * force * 0.08;

                        this.vy += Math.sin(angle) * force * 0.08;

                    }

                }



                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

                // Balanced velocity limit (0.80 max)

                if (speed > 0.80) {

                    this.vx = (this.vx / speed) * 0.80;

                    this.vy = (this.vy / speed) * 0.80;

                }



                this.x += this.vx;

                this.y += this.vy;



                if (this.x < 0 || this.x > width) this.vx *= -1;

                if (this.y < 0 || this.y > height) this.vy *= -1;

                

                this.x = Math.max(0, Math.min(width, this.x));

                this.y = Math.max(0, Math.min(height, this.y));

            }



            draw() {

                const theme = document.documentElement.getAttribute('data-theme');

                ctx.beginPath();

                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

                ctx.fillStyle = theme === 'dark' ? 'rgba(34, 211, 238, 0.35)' : 'rgba(2, 132, 199, 0.25)';

                ctx.fill();

            }

        }



        for (let i = 0; i < particleCount; i++) {

            particles.push(new Particle());

        }



        const animate = () => {

            const theme = document.documentElement.getAttribute('data-theme');

            ctx.clearRect(0, 0, width, height);



            for (let i = 0; i < particles.length; i++) {

                particles[i].update();

                particles[i].draw();



                for (let j = i + 1; j < particles.length; j++) {

                    const dx = particles[i].x - particles[j].x;

                    const dy = particles[i].y - particles[j].y;

                    const dist = Math.sqrt(dx * dx + dy * dy);



                    // Vibrant, high-fidelity connectivities

                    if (dist < 105) {

                        const alpha = (105 - dist) / 105 * 0.09;

                        ctx.beginPath();

                        ctx.moveTo(particles[i].x, particles[i].y);

                        ctx.lineTo(particles[j].x, particles[j].y);

                        ctx.strokeStyle = theme === 'dark' 

                            ? `rgba(99, 102, 241, ${alpha})` 

                            : `rgba(79, 70, 229, ${alpha})`;

                        ctx.lineWidth = 0.6;

                        ctx.stroke();

                    }

                }

            }

            requestAnimationFrame(animate);

        };



        animate();

    };



    // --- LIST FILTERS ---

    const initListFilters = () => {

        const pubSearch = document.getElementById('pub-search');

        if (pubSearch) {

            pubSearch.addEventListener('input', function() {

                filterPublications();

            });

        }



        const newsSearch = document.getElementById('news-search');

        if (newsSearch) {

            newsSearch.addEventListener('input', function() {

                filterNews();

            });

        }

    };



    window.filterPublications = (yearVal) => {

        const query = (document.getElementById('pub-search')?.value || '').toLowerCase();

        const items = document.querySelectorAll('.pub-item');

        const filterBtns = document.querySelectorAll('.filter-btn');



        if (yearVal !== undefined) {

            filterBtns.forEach(btn => {

                btn.classList.remove('active');

                if (btn.getAttribute('onclick') === `filterPublications('${yearVal}')` || 

                    (yearVal === 'all' && btn.getAttribute('onclick') === "filterPublications('all')")) {

                    btn.classList.add('active');

                }

            });

        }



        let activeYear = 'all';

        const activeBtn = document.querySelector('.filter-btn.active');

        if (activeBtn) {

            const attr = activeBtn.getAttribute('onclick');

            const match = attr.match(/'([^']+)'/);

            if (match) activeYear = match[1];

        }



        items.forEach(item => {

            const txt = item.textContent.toLowerCase();

            const yr = item.getAttribute('data-year');

            

            const matchQuery = txt.includes(query);

            const matchYear = activeYear === 'all' || yr === activeYear;



            if (matchQuery && matchYear) {

                item.classList.remove('hidden');

            } else {

                item.classList.add('hidden');

            }

        });

    };



    const filterNews = () => {

        const query = (document.getElementById('news-search')?.value || '').toLowerCase();

        const items = document.querySelectorAll('.timeline-item');



        items.forEach(item => {

            const txt = item.textContent.toLowerCase();

            if (txt.includes(query)) {

                item.classList.remove('hidden');

            } else {

                item.classList.add('hidden');

            }

        });

    };



    // --- ACCORDIONS ---

    const initAccordions = () => {

        document.body.addEventListener('click', (e) => {

            const header = e.target.closest('.accordion-header');

            if (!header) return;



            const item = header.parentElement;

            const content = item.querySelector('.accordion-content');

            

            if (item.classList.contains('open')) {

                item.classList.remove('open');

                content.style.maxHeight = '0';

                content.style.padding = '0';

            } else {

                const container = item.closest('.syllabus-accordion');

                if (container) {

                    container.querySelectorAll('.accordion-item').forEach(sib => {

                        sib.classList.remove('open');

                        const sibContent = sib.querySelector('.accordion-content');

                        if (sibContent) {

                            sibContent.style.maxHeight = '0';

                            sibContent.style.padding = '0';

                        }

                    });

                }

                item.classList.add('open');

                content.style.padding = '16px';

                content.style.maxHeight = content.scrollHeight + 32 + 'px'; // Add padding offsets

            }

        });

    };



    // --- TOAST NOTIFICATIONS ---

    window.showToast = (msg, type = 'success') => {

        const toast = document.createElement('div');

        toast.className = `toast-msg toast-${type}`;

        toast.textContent = msg;

        document.body.appendChild(toast);



        setTimeout(() => {

            toast.style.animation = 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse';

            setTimeout(() => toast.remove(), 300);

        }, 3200);

    };



    // --- SCROLL REVEAL SYSTEM ---

    const initScrollReveal = () => {

        const revealElements = document.querySelectorAll('.reveal');

        

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('active');

                    observer.unobserve(entry.target); // Reveal once

                }

            });

        }, {

            threshold: 0.05,

            rootMargin: '0px 0px -40px 0px'

        });

        

        revealElements.forEach(el => observer.observe(el));

    };



    // --- STATISTICS COUNTER ANIMATIONS ---

    const initStatCounters = () => {

        const stats = document.querySelectorAll('.profile-stats [data-target]');

        if (stats.length === 0) return;



        const countUp = (el) => {

            const target = parseInt(el.getAttribute('data-target'), 10);

            const duration = 1500; // 1.5 seconds

            const stepTime = Math.max(Math.floor(duration / target), 15);

            let current = 0;



            const timer = setInterval(() => {

                current += 1;

                el.textContent = current;

                if (current >= target) {

                    el.textContent = target;

                    clearInterval(timer);

                }

            }, stepTime);

        };



        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    countUp(entry.target);

                    observer.unobserve(entry.target);

                }

            });

        }, { threshold: 0.2 });



        stats.forEach(stat => observer.observe(stat));

    };



    // --- TIMETABLE COLUMN & ROW HOVER HIGHLIGHTING ---

    const initTimetableHighlight = () => {

        document.body.addEventListener('mouseover', (e) => {

            const cell = e.target.closest('.schedule-table td:not(.break-cell)');

            if (!cell) return;



            const table = cell.closest('.schedule-table');

            const row = cell.parentElement;

            const cellsInRow = Array.from(row.children);

            const colIndex = cellsInRow.indexOf(cell);



            const rowHeader = row.querySelector('td:first-child');

            if (rowHeader) rowHeader.classList.add('timetable-header-highlight');



            const ths = table.querySelectorAll('thead th');

            if (ths[colIndex]) ths[colIndex].classList.add('timetable-header-highlight');



            cell.classList.add('timetable-cell-highlight');

        });



        document.body.addEventListener('mouseout', (e) => {

            const cell = e.target.closest('.schedule-table td:not(.break-cell)');

            if (!cell) return;



            const table = cell.closest('.schedule-table');

            const row = cell.parentElement;

            const cellsInRow = Array.from(row.children);

            const colIndex = cellsInRow.indexOf(cell);



            const rowHeader = row.querySelector('td:first-child');

            if (rowHeader) rowHeader.classList.remove('timetable-header-highlight');



            const ths = table.querySelectorAll('thead th');

            if (ths[colIndex]) ths[colIndex].classList.remove('timetable-header-highlight');



            cell.classList.remove('timetable-cell-highlight');

        });

    };



    // --- FLOATING BACK TO TOP BUTTON ---

    const initBackToTop = () => {

        const btn = document.getElementById('back-to-top');

        if (!btn) return;



        window.addEventListener('scroll', () => {

            if (window.scrollY > 300) {

                btn.classList.add('visible');

            } else {

                btn.classList.remove('visible');

            }

        });



        btn.addEventListener('click', () => {

            window.scrollTo({ top: 0, behavior: 'smooth' });

        });

    };



    // Initialize all systems

    initTheme();

    loadDatabase();

    handleHashChange();

    initCanvasBackground();

    initListFilters();

    initAccordions();

    initStatCounters();

    initTimetableHighlight();

    initBackToTop();

    setTimeout(initScrollReveal, 100); // Small delay to let items render

});



// --- CLASSROOM NAV OPEN/CLOSE ---

window.openCourse = (courseId) => {

    document.getElementById('classroom-dashboard').classList.add('hidden');

    const views = document.querySelectorAll('.course-detail-view');

    views.forEach(view => view.classList.add('hidden'));



    const target = document.getElementById(courseId);

    if (target) {

        target.classList.remove('hidden');

        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });

    }

};



window.closeCourse = () => {

    const views = document.querySelectorAll('.course-detail-view');

    views.forEach(view => view.classList.add('hidden'));

    document.getElementById('classroom-dashboard').classList.remove('hidden');

};



// --- AADRI INTERACTIVE SIMULATOR HANDLERS ---

window.askAadriQuick = (promptText) => {

    const input = document.getElementById('chat-input');

    if (input) {

        input.value = promptText;

        window.handleAadriSubmit(new Event('submit'));

    }

};



window.handleAadriSubmit = (e) => {

    if (e) e.preventDefault();

    const input = document.getElementById('chat-input');

    const container = document.getElementById('chat-messages');

    if (!input || !container) return;



    const query = input.value.trim();

    if (!query) return;



    // Append user message

    const userMsg = document.createElement('div');

    userMsg.className = 'chat-msg user';

    userMsg.innerHTML = `<span class="user-avatar">👤</span><div class="msg-bubble">${query}</div>`;

    container.appendChild(userMsg);

    input.value = '';

    container.scrollTop = container.scrollHeight;



    // Generate response based on RAG knowledge

    setTimeout(() => {

        const botMsg = document.createElement('div');

        botMsg.className = 'chat-msg bot';

        

        let reply = "I am trained on Dr. Suman Dutta's research portfolio. Please feel free to ask about active matter, publication DOIs, or classroom lecture handouts!";

        const qLower = query.toLowerCase();



        if (qLower.includes('research') || qLower.includes('focus') || qLower.includes('matter') || qLower.includes('intelligence')) {

            reply = "Dr. Suman Dutta's group focuses on <strong>Intelligent Complex Systems</strong>, active matter physics, collective intelligence, and material failure precursor predictions using statistical mechanics and deep learning.";

        } else if (qLower.includes('course') || qLower.includes('taught') || qLower.includes('teach') || qLower.includes('2025') || qLower.includes('2026')) {

            reply = "Key courses include <strong>Mathematics for Intelligent Systems - I (23MAT106)</strong> in Fall 2025 (133 students) and <strong>Introduction to Material Informatics (23CHY115)</strong> in Spring 2026 (129 students). Passcode for portal access is <code>23MAT106</code>.";

        } else if (qLower.includes('publication') || qLower.includes('paper') || qLower.includes('2026') || qLower.includes('article')) {

            reply = "Recent 2026 milestone: <em>Persistently Non-Gaussian Metastable Liquids</em> by V. Vaibhav, T. Das & S. Dutta*, published in Ann. Phys. (Berlin) 538 (4), e00247 (2026). Check the Academic Publications tab for direct publisher DOI links!";

        } else if (qLower.includes('contact') || qLower.includes('join') || qLower.includes('email') || qLower.includes('apply') || qLower.includes('intern')) {

            reply = "You can reach Dr. Dutta via email at <code>sumandutta.avvcb@gmail.com</code>. The lab is actively seeking passionate PhD candidates, Postdoctoral fellows, and undergraduate research interns!";

        } else if (qLower.includes('aadri') || qLower.includes('who are you') || qLower.includes('hello') || qLower.includes('hi')) {

            reply = "Hello! I am <strong>Aadri 2.0</strong>, engineered using Google Gemini and RAG architecture to articulate Dr. Suman Dutta's research and teaching portfolio. How can I help you today?";

        }



        botMsg.innerHTML = `<span class="bot-avatar">🤖</span><div class="msg-bubble">${reply}</div>`;

        container.appendChild(botMsg);

        container.scrollTop = container.scrollHeight;

    }, 400);

};

function saveLocalChanges() { alert('Changes saved locally successfully!'); closeGitSettings(); }
