export interface FAQItem {
  id: string;
  _id: string;
  category: string;
  question: string;
  answer: string;
  views: string;
  votes: number;
  time: string;
  author: string;
  reviewStatus?: 'verified' | 'pending_review' | 'update_requested';
  source?: 'faq' | 'community';
  categoryNumber?: number;
  [key: string]: unknown;
}


const getMetrics = () => ({
  views: `${(Math.random() * 2 + 0.1).toFixed(1)}k`,
  votes: Math.floor(Math.random() * 150) + 10,
  time: `${Math.floor(Math.random() * 10) + 1}d ago`,
  author: ["Rahul S.", "Ananya V.", "Aman Singh", "Neha P.", "Rohit K.", "System Admin"][Math.floor(Math.random() * 6)]
});

const createFAQ = (id: string, category: string, question: string, answer: string): FAQItem => ({
  id,
  _id: id,
  category,
  question,
  answer: answer.trim(),
  ...getMetrics()
});

export const faqData: FAQItem[] = [
  // --- 1. About the internship ---
  createFAQ("1.1", "About the internship", "What is the Vicharanashala internship?", "A two-month, full-time engagement at the Vicharanashala Lab, a research lab at IIT Ropar. You will work on a real open-source project under a mentor, after a short training phase tailored to where you already are. The internship is free — we do not charge, and the work is real.[cite: 21]"),
  createFAQ("1.2", "About the internship", "What is VINS?", "VINS is the Vicharanashala Internship — an online programme open to anyone who clears our interview. The work is real open-source contribution under a mentor, the certificate is from the Vicharanashala Lab for Education Design at IIT Ropar, and the programme itself is free (we charge nothing). There is no stipend. If you are seeing a yellow VINS panel on your result page, you are selected.[cite: 21]"),
  createFAQ("1.3", "About the internship", "What are the phases of VINS, and what do the badges mean?", "VINS is structured as four phases. Bronze (Phase 1) — a short training period. Silver (Phase 2) — the main work on a real open-source project. Gold (Phase 3) — recognition awarded if your contribution stands on its own. Platinum (Phase 4) — a standing invitation to visit the lab.[cite: 21]"),
  createFAQ("1.4", "About the internship", "Who is the internship for? Are alumni eligible?", "The internship is for currently-enrolled students at any college or university — undergraduate, postgraduate, or doctoral. Candidates who have already graduated and are not currently enrolled in any programme are not eligible for this cycle.[cite: 21]"),
  createFAQ("1.5", "About the internship", "Is this the same as IIT Ropar's official Summer Research Internship?", "No. Summership 2026 is a VLED Lab initiative. The certificate is issued by the Vicharanashala Lab for Education Design, not centrally by the institute.[cite: 21]"),
  createFAQ("1.6", "About the internship", "I have to attend my class tomorrow/today/some day — can I take leave?", "Leave is not permitted. If you are also attending classes or exams, you will be relieved from the internship immediately and will need to join the next batch when it starts.[cite: 21]"),

  // --- 2. Timing and dates ---
  createFAQ("2.1", "Timing and dates", "When can I start?", "You can start any time in 2026 — VINS is flexible on the start date. The hard rule: Your internship must finish by 31 December 2026. That date is non-negotiable. We strongly recommend starting as soon as possible to catch the main May–July cohort.[cite: 21]"),
  createFAQ("2.2", "Timing and dates", "How long is the internship?", "Two months from your chosen start date, with an optional one-month grace period if you need it. End must land on or before 31 December 2026.[cite: 21]"),
  createFAQ("2.3", "Timing and dates", "Can I start in July, August or later if I have exams now?", "Yes — but only if your exams genuinely make an earlier start impossible. Wait until your exams are done, then opt in and start. Do not attempt to juggle this internship with ongoing exams.[cite: 21]"),
  createFAQ("2.4", "Timing and dates", "Can I start with the cohort and take a relaxation during my exam window?", "No. This is not an arrangement we offer. VINS is a full-attention internship — six to ten hours a day, sometimes more.[cite: 21]"),
  createFAQ("2.5", "Timing and dates", "Can I take leave or get an exemption during the internship for an exam scheduled in June?", "The attendance rule is firm — the 55-day continuous window is a non-negotiable part of the internship, and we cannot offer an exemption for an exam during this period.[cite: 21]"),
  createFAQ("2.6", "Timing and dates", "Are orientation session recordings shared with interns, and can project or group assignments be changed after watching them?", "Recordings of the sessions will not be provided. However, we may provide access to an abridged version of a talk or session if we consider it important.[cite: 21]"),

  // --- 3. NOC (No Objection Certificate) ---
  createFAQ("3.1", "NOC (No Objection Certificate)", "What dates do I put on the NOC?", "Default: your chosen start date → your start + 2 months (with up to 1 month grace), ensuring the end date is on or before 31 December 2026.[cite: 21]"),
  createFAQ("3.2", "NOC (No Objection Certificate)", "Who can sign the NOC?", "Any authorised signatory at your college: HOD, Acting HOD, Principal, Dean, Director, or Training & Placement Officer.[cite: 21]"),
  createFAQ("3.3", "NOC (No Objection Certificate)", "When do I submit the NOC? Is the deadline hard?", "There is no specific calendar cut-off date by which the NOC must be uploaded — but your internship cannot formally begin until your official institutional NOC has been uploaded and validated by us.[cite: 21]"),
  createFAQ("3.4", "NOC (No Objection Certificate)", "What format should I use? Do I need to design it myself?", "No — we provide a printable NOC format. Once your result is out and you log in to samagama.in, you will see a Download blank NOC button on your dashboard.[cite: 21]"),
  createFAQ("3.5", "NOC (No Objection Certificate)", "What if my college / Program Chair gives me an NOC in their own format?", "A college's own NOC format is acceptable, as long as all of the required entries are present on it, including the signing authority's handwritten signature, official details, your details, and your signature.[cite: 21]"),
  createFAQ("3.6", "NOC (No Objection Certificate)", "Does it need to be signed by hand?", "Yes. Digital signatures are not accepted. The only path is a physically-signed printout uploaded by you from the dashboard.[cite: 21]"),
  createFAQ("3.7", "NOC (No Objection Certificate)", "Can my HOD email the NOC instead of uploading it?", "No. Your NOC must be uploaded by you, the student, from your dashboard — we no longer accept NOCs sent by email.[cite: 21]"),
  createFAQ("3.8", "NOC (No Objection Certificate)", "How do I download and upload the NOC?", "Both happen on your dashboard at samagama.in once your result is out. Use the 'Download blank NOC' and 'Upload signed NOC' buttons.[cite: 21]"),
  createFAQ("3.9", "NOC (No Objection Certificate)", "What if my NOC is not formally verified?", "NOC verification takes time — typically anywhere between an hour and one full working day from the moment you upload. Your offer letter is issued automatically once validated.[cite: 21]"),
  createFAQ("3.10", "NOC (No Objection Certificate)", "My online course won't issue an NOC. What do I do?", "The internship is open only to candidates currently enrolled in a full-time degree programme at a recognised college or university. Online-only courses do not by themselves make a candidate eligible.[cite: 21]"),
  createFAQ("3.11", "NOC (No Objection Certificate)", "My HOD/college official wants written confirmation before signing my NOC. What do I show them?", "Your selection is already confirmed the moment your yellow VINS result panel appears on your samagama.in dashboard — show them this as evidence.[cite: 21]"),
  createFAQ("3.12", "NOC (No Objection Certificate)", "Can Prof. Sudarshan Iyengar or a faculty member from IIT Ropar sign my NOC?", "Your NOC must be signed by an authorised signatory at the institution where you are enrolled as a student. Faculty members cannot sign in a personal capacity.[cite: 21]"),

  // --- 4. Selection, offer letter, and certificate ---
  createFAQ("4.1", "Selection, offer letter, and certificate", "How do I know I am selected?", "If you can see your yellow VINS result panel on samagama.in, you are selected. There is no separate selection step or confirmation email.[cite: 21]"),
  createFAQ("4.2", "Selection, offer letter, and certificate", "How do I opt into VINS?", "Tell Yaksha in the chat: 'I want to take up the online internship without stipend.' Yaksha will confirm.[cite: 21]"),
  createFAQ("4.3", "Selection, offer letter, and certificate", "When do I get the offer letter?", "Your offer letter is issued automatically once you upload your signed institutional NOC (and have confirmed your start and end dates) and we validate it.[cite: 21]"),
  createFAQ("4.4", "Selection, offer letter, and certificate", "Will I get a certificate?", "Yes — every intern who completes the internship gets a certificate from Vicharanashala, IIT Ropar.[cite: 21]"),
  createFAQ("4.5", "Selection, offer letter, and certificate", "How do I confirm my internship dates?", "Log in to samagama.in. On the dashboard, you will see a yellow card titled '🗓️ Confirm your internship dates'. Edit them to your earliest realistic start.[cite: 21]"),
  createFAQ("4.6", "Selection, offer letter, and certificate", "I am a minor/major in AI student, can I join the programme?", "Minor/Major in AI course from IIT Ropar is a certification course and there will be a different track of internship equivalent to them. Kindly write to us separately for this.[cite: 21]"),
  createFAQ("4.7", "Selection, offer letter, and certificate", "How do I accept the offer letter?", "Acceptance happens entirely on your dashboard at samagama.in. Download the offer letter, sign it, accept the terms, sign the honor code, and upload all PDFs.[cite: 21]"),
  createFAQ("4.8", "Selection, offer letter, and certificate", "Can I change my internship dates?", "Before the offer letter is issued: yes. After the offer letter is issued: no. Dates are final and will not be changed.[cite: 21]"),
  createFAQ("4.9", "Selection, offer letter, and certificate", "My NOC is not ready but my start date is approaching. What do I do?", "Get your signed institutional NOC uploaded as soon as you can. Your start date cannot be honoured until your official NOC is uploaded and validated.[cite: 21]"),
  createFAQ("4.10", "Selection, offer letter, and certificate", "When does my internship actually begin? Will I receive a notification on the day?", "Your internship begins on the start date you confirmed on the dashboard, provided your NOC has been validated by then. On the morning of your start date, Yaksha will guide you.[cite: 21]"),
  createFAQ("4.11", "Selection, offer letter, and certificate", "Can I switch from VINS (online) to VISE (offline) after being selected?", "The two tracks are finalised at the interview stage, and we do not move candidates between them. VINS is not a consolation track.[cite: 21]"),
  createFAQ("4.12", "Selection, offer letter, and certificate", "Can I change my internship dates after the offer letter?", "No. Once your offer letter has been issued, the dates you confirmed are final. They will not be changed at this stage.[cite: 21]"),

  // --- 5. Work and projects ---
  createFAQ("5.1", "Work and projects", "What will I work on?", "A real open-source project from Vicharanashala's portfolio — assigned based on your background and the lab's current needs.[cite: 21]"),
  createFAQ("5.2", "Work and projects", "How many hours per day?", "Plan for 6 to 10 hours a day, sometimes more during the build phase. This is a full-time internship for the two-month window.[cite: 21]"),
  createFAQ("5.3", "Work and projects", "Who is my mentor?", "You will work with the lab's research and engineering team. The exact mentor depends on the project.[cite: 21]"),
  createFAQ("5.4", "Work and projects", "Is there a stipend?", "No. The internship is unpaid. Stellar performers may be recognised with a discretionary stipend at the lab's option, but this is not promised or expected.[cite: 21]"),
  createFAQ("5.5", "Work and projects", "Do I need my own laptop? Should I preload any software?", "Yes — a personal laptop is required. We prefer that you bring a laptop running Linux or macOS.[cite: 21]"),
  createFAQ("5.6", "Work and projects", "I am using a different email on GitHub / Zoom / the learning platform. Is that okay?", "No. Your registered email is your sole identifier across all programme platforms. Progress tracking, course completion, and certificate issuance are all tied to it.[cite: 21]"),
  createFAQ("5.7", "Work and projects", "When will I be assigned a mentor?", "Mentors are not assigned at the start of the internship. You will be assigned a mentor when you move on to the project phase of VINS, which comes later in the timeline.[cite: 21]"),

  // --- 6. Code of conduct ---
  createFAQ("6.1", "Code of conduct", "What are the official communication channels?", "Official channels only: Announcements section on samagama.in, Zoom breakout rooms, the Discussion forum, and Yaksha chat. Unofficial WhatsApp/Discord groups are strictly prohibited.[cite: 21]"),

  // --- 7. Interviews Related ---
  createFAQ("7.1", "Interviews Related", "My interview is not marked as complete on the dashboard — what do I do?", "A data-sync issue sometimes occurs. The team will check your record and manually mark it as complete if needed. You will be unblocked within 1–2 hours.[cite: 21]"),

  // --- 8. Certificate ---
  createFAQ("8.1", "Certificate", "Does Vicharanashala send a grade report or evaluation to my university for internship credit?", "Vicharanashala does not send formal evaluation or grade reports to universities — that process is between you and your college.[cite: 21]"),
  createFAQ("8.2", "Certificate", "Does the Vicharanashala internship certificate specify whether it was completed online or offline?", "The certificate you receive on completing the internship is the same for both tracks. It records only that you completed the internship; the mode is not called out.[cite: 21]"),
  createFAQ("8.3", "Certificate", "Will the completion certificate be a physical hardcopy or an e-certificate?", "The completion certificate is issued as an e-certificate — you download it from your dashboard on samagama.in. We do not print and mail physical copies.[cite: 21]"),
  createFAQ("8.4", "Certificate", "Is there a WhatsApp group for candidates during the internship?", "No. See §6.1 for the official communication channels.[cite: 21]"),

  // --- 9. Rosetta ---
  createFAQ("9.1", "Rosetta — your internship journal", "What is Rosetta?", "Rosetta is your internship journal — a 65-day document, one entry per day, every day, for the full duration of Summership 2026.[cite: 21]"),
  createFAQ("9.2", "Rosetta — your internship journal", "Why does this exist? Is it just busywork?", "No. It exists to help you process your intense experience and articulate what you learned, and it gives us qualitative insight into your experience to improve the programme.[cite: 21]"),
  createFAQ("9.3", "Rosetta — your internship journal", "What is a 'thinking routine'?", "Each day in Rosetta has a thinking routine — a short framework that gives your reflection a specific shape (e.g., 3-2-1, Muddy/Clear).[cite: 21]"),
  createFAQ("9.4", "Rosetta — your internship journal", "How do I get my Rosetta journal?", "Open the template link provided, go to File → Make a copy, save it to your own Google Drive, and rename it Rosetta — [Your Name] — Summership 2026.[cite: 21]"),
  createFAQ("9.5", "Rosetta — your internship journal", "How do I use it day to day?", "Open your Google Doc, scroll to today's entry, fill in the date, read the prompt, and answer the three questions. It should take 10 to 20 minutes.[cite: 21]"),
  createFAQ("9.6", "Rosetta — your internship journal", "How long should each entry be?", "There is no minimum or maximum word count. Three to five sentences per prompt is usually enough. Do not use one-word answers or AI tools.[cite: 21]"),
  createFAQ("9.7", "Rosetta — your internship journal", "What is the one rule?", "Write what is true. Not what sounds impressive, or what you think we want to read. The journal only counts if it is genuinely yours.[cite: 21]"),
  createFAQ("9.8", "Rosetta — your internship journal", "Can I use ChatGPT or any AI tool to write my entries?", "No. This is the one firm rule of Rosetta. Entries that read as AI-generated will not be counted toward your completion requirement.[cite: 21]"),
  createFAQ("9.9", "Rosetta — your internship journal", "What if I miss a day?", "Fill it in as soon as you can. Write the actual date you are filling it in. A late honest entry is always better than no entry.[cite: 21]"),
  createFAQ("9.10", "Rosetta — your internship journal", "Will anyone read my journal during the internship?", "No. We will not access your journal during the 65 days. The only time we read it is after you submit it at the end of the internship.[cite: 21]"),
  createFAQ("9.11", "Rosetta — your internship journal", "Can the prompts change mid-internship?", "Occasionally we may update a prompt. When this happens, we will announce it in the Announcements section on samagama.in.[cite: 21]"),
  createFAQ("9.12", "Rosetta — your internship journal", "How do I submit Rosetta at the end?", "On or before Day 65, share your Rosetta Google Doc with the programme coordinator's email address and set the sharing permission to Viewer.[cite: 21]"),
  createFAQ("9.13", "Rosetta — your internship journal", "I have a question about Rosetta that is not answered here. What do I do?", "Ask Yaksha first. If Yaksha cannot answer it, escalate to your programme coordinator.[cite: 21]"),
  createFAQ("9.14", "Rosetta — your internship journal", "My college requires a written confirmation that the internship is self-paced...", "This is not a self paced internship, but a very rigorous one which is time demanding. It is not permitted for one to be part of any other activity during this period.[cite: 21]"),

  // --- 10. Phase 1 ---
  createFAQ("10.1", "Phase 1", "I've already completed a course with you in an earlier cohort — am I exempt from repeating it?", "Yes. If your progress is above 95%, submit the exemption form. However, live sessions and stand-ups remain mandatory for everyone.[cite: 21]"),
  createFAQ("10.2", "Phase 1", "How do I register for the AI Fundamentals course on Vibe?", "Click the link in Announcements, sign into Vibe using your Samagama Gmail, click the link again to enrol, and submit the form.[cite: 21]"),
  createFAQ("10.3", "Phase 1", "I registered on Vibe with a different email than my Samagama email — is that OK?", "Please use the same email on both platforms. If your Samagama email is not Gmail, register on Vibe with a Gmail and tell Yaksha using #vibe-email to link them.[cite: 21]"),
  createFAQ("10.4", "Phase 1", "Are live sessions mandatory if I'm on the viva route?", "Yes — live sessions are mandatory for every intern, regardless of path.[cite: 21]"),
  createFAQ("10.5", "Phase 1", "When and how do I get the Zoom link for the kickoff meeting?", "The link is sent via email and is available in your Yaksha chat portal for the main summer cohort.[cite: 21]"),
  createFAQ("10.6", "Phase 1", "How do I get the link for the daily Zoom standups? Are they mandatory?", "Daily Zoom standup links are posted in the Announcements section on your samagama.in dashboard. Yes, attending is strictly mandatory.[cite: 21]"),
  createFAQ("10.7", "Phase 1", "How do I provide my Zoom ID, and why does it matter?", "Enter the exact email address linked to your Zoom account on your dashboard. We match your live-session attendance using this email.[cite: 21]"),
  createFAQ("10.8", "Phase 1", "I saved the wrong Zoom ID — can I change it?", "Yes — go to your dashboard, click the lock icon next to your Zoom ID, update it, and save.[cite: 21]"),
  createFAQ("10.9", "Phase 1", "Can we register and start the vibe courses before our internship date formally starts?", "You will receive the viBE course link only after your internship starts.[cite: 21]"),
  createFAQ("10.10", "Phase 1", "What are the attendance and participation rules?", "Tracked over a rolling 5-day window: Live attendance (85%+), Live poll participation (85%+), and Quizzes attempted & passed (50%+ score).[cite: 21]"),
  createFAQ("10.11", "Phase 1", "What are Spurti Points (SP)? Do they affect my internship?", "Spurti Points are a platform feature that tracks engagement. They are in an early beta phase and not used for decisions about your standing.[cite: 21]"),
  createFAQ("10.12", "Phase 1", "What are the live-session (Zoom) participation and conduct rules?", "Keep video on, face visible, dress professionally, no multitasking, use your full name, and respond to polls. Repeated non-compliance results in removal.[cite: 21]"),
  createFAQ("10.13", "Phase 1", "I got 'Failed to submit poll. Error: 100035000' — what does it mean?", "This error appears when the poll closed before your response submitted. Try submitting as soon as the poll appears and use the Zoom app instead of browser.[cite: 21]"),
  createFAQ("10.14", "Phase 1", "I was moved to the waiting room — what should I do if I think it was a mistake?", "If you believe it was a mistake, share a complete screen recording of the session showing you were following guidelines and submit it to the Core Team.[cite: 21]"),
  createFAQ("10.15", "Phase 1", "How do I submit my Phase 1 (CSFAQ) project?", "Use the Submit Project button on your dashboard. Submit your assigned official GitHub repo link (or a PR to a public repo), product documentation, and a project report PDF.[cite: 21]"),

  // --- 11. Spurti Points ---
  createFAQ("11.1", "Spurti Points", "What are Spurti Points?", "Spurti Points, or SP, are a points layer on the platform that reflects your overall engagement with the programme.[cite: 21]"),
  createFAQ("11.2", "Spurti Points", "Is SP a finished system?", "No. Spurti Points are still being actively built and refined.[cite: 21]"),
  createFAQ("11.3", "Spurti Points", "How much importance should I give to my SP number?", "Please do not read too much into the number. It is an early beta feature.[cite: 21]"),
  createFAQ("11.4", "Spurti Points", "Can I be terminated or excused because of low SP?", "No. The programme team will not terminate or excuse any intern on the basis of Spurti Points alone.[cite: 21]"),
  createFAQ("11.5", "Spurti Points", "What if my SP shows as zero or even negative?", "There is genuinely no cause for concern. Because SP is in an early beta phase, the number may not always reflect your actual effort accurately.[cite: 21]"),
  createFAQ("11.6", "Spurti Points", "Does a higher SP bring any benefits?", "Yes, interns who build up higher Spurti Points may become eligible for small perks or recognition from the programme team.[cite: 21]"),
  createFAQ("11.7", "Spurti Points", "If SP does not determine outcomes, what does?", "Your attendance and live participation are what the programme watches closely and tracks strictly.[cite: 21]"),
  createFAQ("11.8", "Spurti Points", "What are the participation requirements tracked strictly?", "Over the most recent 5 working days: 85% Zoom session time, 85% poll participation, and attempting all quizzes with at least a 50% pass rate.[cite: 21]"),
  createFAQ("11.9", "Spurti Points", "What does 'rolling basis' mean?", "It looks at your most recent five working days at any given point in time. As each new working day passes, the oldest drops out and the newest is added.[cite: 21]"),
  createFAQ("11.10", "Spurti Points", "What happens if I fall below the required participation level?", "You will be moved from the current batch into a later batch. To rejoin, you must upload revised documents (like a new NOC) reflecting your new dates.[cite: 21]"),
  createFAQ("11.11", "Spurti Points", "How are Spurti Points calculated?", "You start with a base of 100 SP. Points are earned per session based on attendance percentage (up to +10 SP) and poll participation percentage (up to +10 SP).[cite: 21]"),
  createFAQ("11.12", "Spurti Points", "Can the programme team award or deduct SP directly?", "Yes. Team members can manually award SP for good behavior or deduct SP for non-compliant behavior.[cite: 21]"),

  // --- 12. Yaksha Chat Related ---
  createFAQ("12.1", "Yaksha Chat Related", "I'm unable to type in the chat after clicking 'Interact with Yaksha' — what should I do?", "Scroll up to the top of the page — the button may be above the visible area. Click it once, and the chat field will become active.[cite: 21]"),

  // --- 13. ViBe Platform ---
  createFAQ("13.1", "ViBe Platform", "How do I log in to ViBe?", "Sign up as a student with your registered email, check the Notifications tab, and accept the course invite.[cite: 21]"),
  createFAQ("13.2", "ViBe Platform", "Invite accepted but shows 'No course enrolled'?", "Ensure you're logged in with the registered email. If issues persist, allow third-party cookies, change DNS to Google DNS (8.8.8.8), and flush your DNS cache.[cite: 21]"),
  createFAQ("13.3", "ViBe Platform", "Why are videos stuck or repeating?", "Videos must be watched fully. Camera/mic permissions must be enabled. Switching tabs or staying idle may restart the video.[cite: 21]"),
  createFAQ("13.4", "ViBe Platform", "Can I use a mobile or tablet?", "No, only desktop/laptop is supported.[cite: 21]"),
  createFAQ("13.5", "ViBe Platform", "I'm experiencing video issues (stuck, looping). How do I troubleshoot?", "Refresh page, check browser console for errors, re-login, use a different browser, or clear cache. If it persists, report it to Yaksha.[cite: 21]"),
  createFAQ("13.6", "ViBe Platform", "I have completed all videos, but progress is less than 100%. What should I do?", "This might be a skip made due to a penalty score. Verify that you've completed all course items. Refresh or clear cache and retry missed contents.[cite: 21]"),
  createFAQ("13.7", "ViBe Platform", "Can I request an exception or bypass the system?", "If a learner feels the flow doesn't reflect their understanding, they can opt for a rigorous 3-hour proctored examination instead. Most find the standard workflow faster.[cite: 21]"),
  createFAQ("13.8", "ViBe Platform", "Is the ViBe consent form compulsory?", "Yes — it is compulsory to enable proctoring via webcam/microphone. ViBe does not continuously record videos; it operates via real-time monitoring.[cite: 21]"),
  createFAQ("13.9", "ViBe Platform", "What are penalty scores on the ViBe platform?", "They are generated when anomalies are detected. If high, you may need to rewatch the video and retake the quiz. They do not impact HP or evaluation scoring.[cite: 21]"),
  createFAQ("13.10", "ViBe Platform", "When should I use the Flag option?", "Use it only for course content-related issues. For technical or login issues, contact Yaksha.[cite: 21]"),
  createFAQ("13.11", "ViBe Platform", "What is Linear Progression on ViBe?", "Learners must watch videos and attempt quizzes in the exact order. Skipping is not allowed.[cite: 21]"),
  createFAQ("13.12", "ViBe Platform", "Can I use the left navigation panel to jump ahead?", "No. The left panel is just a progress map. You must use 'Next Quiz' or 'Next Lesson'.[cite: 21]"),
  createFAQ("13.13", "ViBe Platform", "I am seeing a red 'Access Restricted' banner. Is this a bug?", "No, it appears when you try to open an item before completing all previous items. ViBe will automatically return you to previous valid content.[cite: 21]"),
  createFAQ("13.14", "ViBe Platform", "How do I resolve the 'Access Restricted' error?", "Scroll through the left panel, find any item without a completion tick, complete it, and refresh the page.[cite: 21]"),
  createFAQ("13.15", "ViBe Platform", "Why does ViBe sometimes make me re-watch a clip?", "If your answer was incorrect, ViBe takes you back to try again. This helps the idea stick and is not recorded as a penalty.[cite: 21]"),
  createFAQ("13.16", "ViBe Platform", "What kinds of quiz questions will I see?", "Formats include MCQ, MSQ (Select all that apply), NAT (Type a number), and True or False.[cite: 21]"),
  createFAQ("13.17", "ViBe Platform", "Are the same proctoring rules applied to every course?", "No, proctoring is modular. The instructor decides which checks (face visibility, lighting, etc.) are active for a specific course.[cite: 21]"),
  createFAQ("13.18", "ViBe Platform", "What does the 'quiet helper' on ViBe actually do?", "It checks in real-time that a face is visible, only one face is in frame, lighting is adequate, the room is quiet, and you are looking at the screen.[cite: 21]"),
  createFAQ("13.19", "ViBe Platform", "Does ViBe record long videos of me?", "No. The camera/mic are used for real-time presence checks only. Long recordings are not stored.[cite: 21]"),
  createFAQ("13.20", "ViBe Platform", "What is the single most common avoidable mistake?", "Sitting with a window directly behind you. The camera only sees a dark silhouette. Keep light in front of you.[cite: 21]"),
  createFAQ("13.21", "ViBe Platform", "Why does the lesson keep pausing or restarting?", "Usually due to your environment: face too dark, out of frame, background voices, or switching tabs.[cite: 21]"),
  createFAQ("13.22", "ViBe Platform", "Can I read the quiz questions aloud or mutter?", "It's best not to. The mic listens for sustained voices, which can be picked up as anomalies.[cite: 21]"),
  createFAQ("13.23", "ViBe Platform", "Can I study with a friend on camera?", "No. Only you should be in the camera frame. The helper checks that exactly one face is visible.[cite: 21]"),
  createFAQ("13.24", "ViBe Platform", "Will I lose my progress if I clear my browser?", "No. Progress is saved on the server tied to your registered email, not on your local browser.[cite: 21]"),
  createFAQ("13.25", "ViBe Platform", "Is there a recommended daily learning rhythm?", "Small, regular sessions work best. Aim for daily consistency, take breaks between clips, and meet progress targets (usually 3.33% per day).[cite: 21]"),
  createFAQ("13.26", "ViBe Platform", "What should my study corner look like?", "Light in front of your face, just you in the frame, and a reasonably quiet room.[cite: 21]"),
  createFAQ("13.27", "ViBe Platform", "I'm facing a technical issue. Is there live support?", "Yes. A Live Support Breakout Session is held every day at 2:00 PM for real-time assistance.[cite: 21]"),

  // --- 14. Team Formation ---
  createFAQ("14.1", "Team Formation", "Is team formation compulsory?", "Yes. All projects in Phase 2 and Phase 3 must be completed in teams.[cite: 21]"),
  createFAQ("14.2", "Team Formation", "What is the size of a team?", "The team size is fixed at four members. This is mandatory.[cite: 21]"),
  createFAQ("14.3", "Team Formation", "How are teams formed?", "For May 15/16 starters: through a structured activity. For later starters: randomly assigned by administration.[cite: 21]"),
  createFAQ("14.4", "Team Formation", "I started on May 15/16 but couldn't form a team. What happens now?", "You will be randomly assigned to a team.[cite: 21]"),
  createFAQ("14.5", "Team Formation", "There was a typo in our email addresses. Can we fix it?", "No action is required. Admin will verify and match email IDs before finalising.[cite: 21]"),
  createFAQ("14.6", "Team Formation", "I formed a team with only two members. Will it be considered?", "No. Teams with fewer than four members will be expanded by adding additional members.[cite: 21]"),
  createFAQ("14.7", "Team Formation", "What if a team member leaves during Phase 1?", "Admin will attempt to assign a replacement. If none is found, you continue as a team of three. Inform admin immediately.[cite: 21]"),
  createFAQ("14.8", "Team Formation", "Can I form a team with someone from my own college?", "No. Teams must consist of members from different institutions.[cite: 21]"),
  createFAQ("14.9", "Team Formation", "Can I form a team with students from my IIT MBS cohort?", "No. You are encouraged to collaborate with participants outside your existing cohort.[cite: 21]"),
  createFAQ("14.10", "Team Formation", "Can we change our team name after submission?", "Yes, they are tentative. However, frequent changes are discouraged due to operational constraints.[cite: 21]"),
  createFAQ("14.11", "Team Formation", "What if multiple teams choose the same name?", "Teams will be distinguished using suffixes (e.g., Team X-1, Team X-2).[cite: 21]"),
  createFAQ("14.12", "Team Formation", "What should I do if I face issues within my team?", "Report any concerns immediately to your assigned scholar/mentor.[cite: 21]"),
  createFAQ("14.13", "Team Formation", "How will I know who my mentor is?", "Your mentor will be the scholar assigned to the project your team is working on.[cite: 21]"),
  createFAQ("14.14", "Team Formation", "When will I know my team details?", "Team details are announced in the Announcements section on samagama.in.[cite: 21]"),
  createFAQ("14.15", "Team Formation", "I received a team list email but my name is not included.", "Team announcements are phased. If your whole cohort moved and you are unassigned, raise the issue on Yaksha.[cite: 21]"),
  createFAQ("14.16", "Team Formation", "We selected Project X but were assigned Project Y. Can we change it?", "No. Project assignments are final and cannot be changed.[cite: 21]"),
  createFAQ("14.17", "Team Formation", "I just started the internship. Can I form my own team now?", "No. For later cohorts, teams will be randomly assigned.[cite: 21]"),
  createFAQ("14.18", "Team Formation", "When do team activities begin?", "Team-based work begins in Phase 2. Phase 1 is for online coursework.[cite: 21]"),
  createFAQ("14.19", "Team Formation", "Can I request a specific teammate after assignments?", "No. Team assignments are final.[cite: 21]"),
  createFAQ("14.20", "Team Formation", "What happens if a team member is inactive?", "Report the issue to your mentor early. Prolonged inactivity leads to administrative intervention.[cite: 21]"),
  createFAQ("14.21", "Team Formation", "Can I switch teams if there are conflicts?", "Team switches are not allowed except in exceptional, admin-approved cases.[cite: 21]"),
  createFAQ("14.22", "Team Formation", "Will team performance affect individual evaluation?", "Yes. Team deliverables are a key part of evaluation.[cite: 21]"),
  createFAQ("14.23", "Team Formation", "How will communication happen within teams?", "Self-organise over LinkedIn or email. WhatsApp groups are prohibited.[cite: 21]"),
  createFAQ("14.24", "Team Formation", "What if I miss the team allocation announcement?", "All updates are posted in Announcements on samagama.in. Check it regularly.[cite: 21]"),
  createFAQ("14.25", "Team Formation", "Can a team be dissolved and reformed?", "No. Once finalized, teams are locked.[cite: 21]"),
  createFAQ("14.26", "Team Formation", "What happens if I drop out?", "Your team will be adjusted; they may continue as three or receive a replacement.[cite: 21]"),
  createFAQ("14.27", "Team Formation", "Will we get time to get to know teammates before Phase 2?", "Yes. There is a buffer period before Phase 2 where teams can connect.[cite: 21]"),

  // --- 15. Spurti Levels, Trophy Leagues ---
  createFAQ("15.1", "Spurti Levels, Trophy Leagues & Feedback Survey", "What is this survey that appears when I open Spurti?", "It is a short feedback survey about your experience with the Spurti Points system to help us improve.[cite: 21]"),
  createFAQ("15.2", "Spurti Levels, Trophy Leagues & Feedback Survey", "Do I have to fill the feedback survey?", "Yes. It is mandatory and must be completed before you continue.[cite: 21]"),
  createFAQ("15.3", "Spurti Levels, Trophy Leagues & Feedback Survey", "Until when is the feedback survey available?", "Until 30 June, 11:59 PM IST.[cite: 21]"),
  createFAQ("15.4", "Spurti Levels, Trophy Leagues & Feedback Survey", "Will I keep seeing the survey every time I log in?", "No. Once you submit, it never appears again.[cite: 21]"),
  createFAQ("15.5", "Spurti Levels, Trophy Leagues & Feedback Survey", "I submitted the survey but it did not close.", "Ensure you pressed Submit while signed into Google. If it persists, click 'I've submitted — continue' and refresh.[cite: 21]"),
  createFAQ("15.6", "Spurti Levels, Trophy Leagues & Feedback Survey", "Is the survey anonymous?", "It is confidential, not anonymous. Responses are linked to your engagement data but answers are not shared publicly.[cite: 21]"),
  createFAQ("15.7", "Spurti Levels, Trophy Leagues & Feedback Survey", "Which email should I use for the survey?", "Use the email you registered with for the programme.[cite: 21]"),
  createFAQ("15.8", "Spurti Levels, Trophy Leagues & Feedback Survey", "Why is my Spurti dashboard hidden behind the survey?", "This is intentional for a short window to capture feedback. Once submitted, your dashboard returns to normal.[cite: 21]"),
  createFAQ("15.9", "Spurti Levels, Trophy Leagues & Feedback Survey", "What is a Level?", "Your Level is a lifetime achievement marker reflecting the highest SP you have ever reached.[cite: 21]"),
  createFAQ("15.10", "Spurti Levels, Trophy Leagues & Feedback Survey", "How is my Level calculated?", "Level = highest-ever SP ÷ 100 (rounded down).[cite: 21]"),
  createFAQ("15.11", "Spurti Levels, Trophy Leagues & Feedback Survey", "Can my Level go down if my current SP drops?", "No. Level is based on your highest-ever SP, so it never decreases.[cite: 21]"),
  createFAQ("15.12", "Spurti Levels, Trophy Leagues & Feedback Survey", "What is a Trophy League?", "Your Trophy League shows your current standing based on your current SP balance and can move up or down.[cite: 21]"),
  createFAQ("15.13", "Spurti Levels, Trophy Leagues & Feedback Survey", "What are the Trophy League bands?", "Ranges from Bronze III (0–99 SP) up to Legend (1500+ SP).[cite: 21]"),
  createFAQ("15.14", "Spurti Levels, Trophy Leagues & Feedback Survey", "What is the difference between Level and Trophy League?", "Level is your lifetime best that never goes down. Trophy League is your current standing that rises and falls.[cite: 21]"),
  createFAQ("15.15", "Spurti Levels, Trophy Leagues & Feedback Survey", "What is Legend?", "Legend is the top Trophy League, reached when your current SP is 1500 or more.[cite: 21]"),
  createFAQ("15.16", "Spurti Levels, Trophy Leagues & Feedback Survey", "What is the Legend Badge, and is it permanent?", "Once your highest-ever SP reaches 1500, you permanently unlock the Legend Badge, even if your SP drops later.[cite: 21]"),
  createFAQ("15.17", "Spurti Levels, Trophy Leagues & Feedback Survey", "There are two leaderboards — what is the difference?", "Overall is everyone ranked by SP. 'My Onboarding Group' only compares you with students who started around the same time.[cite: 21]"),
  createFAQ("15.18", "Spurti Levels, Trophy Leagues & Feedback Survey", "Why is there an onboarding-group leaderboard?", "It provides a fairer like-for-like comparison for recent joiners against those who started in the same two-week window.[cite: 21]"),
  createFAQ("15.19", "Spurti Levels, Trophy Leagues & Feedback Survey", "How are onboarding groups decided?", "By the half-month you started: 1st–15th is one group, 16th–end of month is the next.[cite: 21]")
];