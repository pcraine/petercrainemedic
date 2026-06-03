window.GATED_CODES = {
  trainer: ['TRAINER2026'],
  medic:   ['MEDIC2026']
};

window.RHYTHM_NAMES = ['NSR 60bpm','AFib','V-Tach','PVC','A-Flutter','VFib'];

window.DEPLOYMENTS = [
  '2026-04-19','2026-04-16','2026-04-15','2026-04-11','2026-04-10',
  '2026-04-05','2026-04-04','2026-03-31','2026-03-28','2026-03-25',
  '2026-03-22','2026-03-15','2026-03-08','2026-03-07','2026-02-28',
  '2026-02-14','2026-02-07','2026-01-31','2026-01-24','2026-01-10',
  '2025-12-14','2025-12-07','2025-11-30','2025-11-23','2025-11-15',
  '2025-11-09','2025-10-26','2025-10-12','2025-09-28','2025-09-14',
  '2025-09-01','2025-08-01','2026-09-01','2027-01-01','2027-06-01'
];

window.TICKER_MESSAGES = [
  'FREC 3 Certified \u00b7 19 Medications in Scope \u00b7 EAC Pre-Hospital Clinician',
  'Heysham NPP Exercise \u00b7 Nuclear site multi-agency \u00b7 JESIP \u00b7 Army EOD \u00b7 April 2026',
  'Grand National \u00b7 25 patients \u00b7 Zone Lead Clinician \u00b7 Aintree \u00b7 April 2026',
  'Organ Donor Commemorative Service \u00b7 Formal SJA representative \u00b7 Family engagement \u00b7 April 2026',
  'Scaffolding RTC \u00b7 KED applied at 25m \u00b7 Multi-agency fire service \u00b7 Scoop and transport \u00b7 April 2026',
  'SJA NW Management Conference \u00b7 New Volunteer Journey \u00b7 Recruitment & Retention \u00b7 Leeds \u00b7 April 2026',
  'Community EAC \u00b7 Suspected MI \u00b7 12-Lead ECG \u00b7 Pre-Alert to A&E \u00b7 ATMIST handover \u00b7 April 2026',
  'Network Lead \u00b7 East Lancashire \u00b7 7 Roles Simultaneously \u00b7 12 Months \u00b7 Commissioner Commended \u00d72',
  'First Aid Trainer \u00b7 CTLLS Level 4 \u00b7 AAVRA Assessor \u00b7 208+ Learners \u00b7 FAW \u00b7 EFAW \u00b7 BLS \u00b7 AED',
  'CERAD Level 3 Blue Light \u00b7 PCV / D1 \u00b7 Category C \u00b7 Enhanced DBS Current \u00b7 Available Immediately',
  'HART Multi-Agency RTC \u00b7 Motorbike v pedestrian \u00b7 Entrapped patient \u00b7 JESIP command \u00b7 November 2025',
  'AFC Fylde v AFC Marine \u00b7 Dual role \u00b7 No team doctor \u00b7 Full EAC scope \u00b7 March 2026'
];


// Helpers
window.jP = function(text) { return '<p class="jpa-p">' + text + '</p>'; };
window.jH = function(text) { return '<div class="jpa-h2">' + text + '</div>'; };
window.jLine = function()  { return '<div class="jpa-divider"></div>'; };
window.jAnon = function()  { return '<p class="jpa-anon">All patient details have been anonymised in accordance with SJA clinical governance requirements and patient confidentiality obligations. No identifying information has been retained or published.</p>'; };
window.jPull = function(quote, attr) { return '<div class="jpa-pull"><p>\u201c' + quote + '\u201d</p><cite>\u2014 ' + attr + '</cite></div>'; };
