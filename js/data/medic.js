const EM_STAFF=[
  {role:'Basic First Aider',qual:'EFAW / FAW / FREC 3',rate:'\xa335',unit:'per hour',
   desc:'Essential clinical cover for low-risk community events. FREC 3-qualified with full patient documentation and incident reporting.',
   tags:['Community Events','Fetes','Low-Risk','Indoor']},
  {role:'Experienced Event First Aider',qual:'Higher-Level Qualified',rate:'\xa345',unit:'per hour',
   desc:'Festival and sports event qualified. Experienced in crowd medicine, dynamic environments, and mass casualty awareness.',
   tags:['Festivals','Sports Events','Concerts','Public Events']},
  {role:'Advanced First Aider',qual:'FREC 4 / IHCD Equivalent',rate:'\xa360',unit:'per hour',
   desc:'Higher acuity clinical capability. Complex trauma, extended assessment, and intermediate interventions. Suitable as clinical lead for medium events.',
   tags:['Sports Events','Corporate','Higher Risk','Clinical Lead']},
  {role:'Event Medical Commander',qual:'FREC 3 EAC + Command Experience',rate:'\xa3120',unit:'per hour',
   desc:'Full command of a medical deployment. Clinical governance, NWAS liaison, mass casualty response, team coordination, and post-event documentation. Peter\'s primary deployment role.',
   tags:['Large Events','Festivals','Multi-Team','EAC Level']}
];

const EM_EQ=[
  {cat:'First Aid Kits',items:[
    {n:'Basic First Aid Kit',p:'\xa320'},{n:'Workplace FAW Kit',p:'\xa340'},
    {n:'Outdoor Trauma Kit',p:'\xa380'},{n:'Advanced Response Bag',p:'\xa3150'},
    {n:'Major Incident Grab Bag',p:'\xa3300'},{n:'Burns Kit',p:'\xa350'},
    {n:'Eye Wash Kit',p:'\xa320'},{n:'Sports Pitch Kit',p:'\xa340'},
    {n:'Paediatric First Aid Kit',p:'\xa330'},{n:'Tourniquet Kit',p:'\xa325'},
    {n:'Haemostatic Dressing Pack',p:'\xa340'},{n:'Biohazard Spill Kit',p:'\xa315'},
    {n:'Instant Ice Packs (box)',p:'\xa330'}
  ]},
  {cat:'Airway & Clinical',items:[
    {n:'Airway Adjunct Set',p:'\xa315'},{n:'Bag Valve Mask',p:'\xa315'},
    {n:'Suction Unit',p:'\xa315'},{n:'Cervical Collar Set',p:'\xa330'},
    {n:'Scoop Stretcher',p:'\xa3100'},{n:'Wheelchair',p:'\xa330'}
  ]},
  {cat:'Monitoring & Defibrillation',items:[
    {n:'AED with Pads & Ready Kit',p:'\xa3150'},{n:'Spare AED Pads',p:'\xa340'},
    {n:'ECG Monitor / Defib',p:'\xa3500'}
  ]},
  {cat:'Medications',items:[
    {n:'Basic GSL Medication Pack',p:'\xa340'},{n:'Advanced OTC Medication Bag',p:'\xa3120'},
    {n:'Anaphylaxis Kit',p:'\xa380'},{n:'Hypoglycaemia Kit',p:'\xa330'},
    {n:'Burns Gel Pack',p:'\xa320'},{n:'Rehydration Supplies',p:'\xa340'}
  ]},
  {cat:'Infrastructure & Comms',items:[
    {n:'Small Gazebo (3\xd73m)',p:'\xa3120'},{n:'Treatment Couch',p:'\xa380'},
    {n:'Folding Chairs / Table Set',p:'\xa340'},{n:'Ground Matting',p:'\xa3100'},
    {n:'Handheld Radio',p:'\xa315'},{n:'Event Radio Control Setup',p:'\xa3500'},
    {n:'Golf Buggy Medical Unit',p:'\xa3300'}
  ]}
];

const EM_PKGS=[
  {tier:'Package A',name:'Village Fete',sub:'Low-risk community events',feat:false,
   note:'Staff costs based on 6-hour deployment at shopping list rates',
   rows:[
    {i:'2 \xd7 Basic First Aider @ \xa335/hr \xd7 6\u202fhrs',v:'\xa3420'},
    {i:'Basic First Aid Kit',v:'\xa320'},
    {i:'AED with Pads & Ready Kit',v:'\xa3150'},
    {i:'Small Gazebo (3\xd73m)',v:'\xa3120'},
    {i:'Handheld Radio \xd7 2',v:'\xa330'},
    {i:'Consumables',v:'\xa320'}
   ],total:'\xa3760'},
  {tier:'Package B',name:'Sports Event',sub:'Medium-risk sporting events',feat:true,
   note:'Staff based on 8-hour day. EMT role billed at Advanced FA rate',
   rows:[
    {i:'2 \xd7 Advanced FA @ \xa360/hr \xd7 8\u202fhrs',v:'\xa3960'},
    {i:'1 \xd7 Advanced FA (EMT role) \xd7 8\u202fhrs',v:'\xa3480'},
    {i:'Advanced Response Bag',v:'\xa3150'},
    {i:'Oxygen Setup',v:'\xa380'},
    {i:'AED \xd7 2',v:'\xa3300'},
    {i:'Medical Tent',v:'\xa3350'},
    {i:'Handheld Radio \xd7 6',v:'\xa390'},
    {i:'Response Vehicle',v:'\xa3200'}
   ],total:'\xa32,610'},
  {tier:'Package C',name:'Large Festival',sub:'Major events &mdash; 1,000+ attendance',feat:false,
   note:'Staff based on 12-hour day. Festival director billed at Commander rate',
   rows:[
    {i:'6 \xd7 Basic FA @ \xa335/hr \xd7 12\u202fhrs',v:'\xa32,520'},
    {i:'2 \xd7 Advanced FA @ \xa360/hr \xd7 12\u202fhrs',v:'\xa31,440'},
    {i:'1 \xd7 Commander @ \xa3120/hr \xd7 12\u202fhrs',v:'\xa31,440'},
    {i:'Ambulance (third-party)',v:'\xa31,200'},
    {i:'Treatment Tent',v:'\xa3800'},
    {i:'AED \xd7 4',v:'\xa3600'},
    {i:'Handheld Radio \xd7 12',v:'\xa3180'},
    {i:'Welfare Area',v:'\xa3300'},
    {i:'Lighting / Power',v:'\xa3250'},
    {i:'Consumables',v:'\xa3200'}
   ],total:'\xa38,930+'}
];

const EM_WELFARE=[
  {n:'Welfare Tent',p:'\xa3300',desc:'Full welfare tent setup and basic staffing for the event duration.'},
  {n:'Mental Health Welfare Staff',p:'\xa343/hr',desc:'Qualified MH-aware welfare support staff for attendee wellbeing.'},
  {n:'Drinking Water Point',p:'\xa385',desc:'Potable water station setup and supply for event duration.'},
  {n:'Cooling Station',p:'\xa3150',desc:'Fans, cool towels, and shade structure. Heat management for outdoor events.'},
  {n:'Blankets & Warm Packs',p:'\xa345',desc:'Foil blankets and warmth packs for cold-weather events.'},
  {n:'Sunscreen Station',p:'\xa338',desc:'Sunscreen dispensers and station setup for outdoor summer events.'},
  {n:'Earplug Distribution',p:'\xa318',desc:'Foam earplugs for music events. Protects attendee hearing.'}
];

const EM_OPS=[
  {i:'Event Medical Plan',p:'\xa3275',note:'Pre-event document covering medical provision, staffing, and escalation.'},
  {i:'Medical Needs Assessment',p:'\xa3425',note:'Full Purple Guide-aligned assessment of your event\'s medical requirements.'},
  {i:'Risk Assessment Review',p:'\xa3150',note:'Clinical review of client-supplied risk assessment.'},
  {i:'Clinical Governance Fee',p:'\xa3175',note:'Applicable to multi-clinician deployments requiring clinical oversight.'},
  {i:'Insurance Uplift',p:'\xa3110',note:'Additional cover for high-risk or large-scale deployments.'},
  {i:'Controlled Drug Governance',p:'\xa3300',note:'Governance and documentation where controlled medications are deployed.'},
  {i:'Travel Charge',p:'\xa30.75/mile',note:'Beyond 10-mile radius. Calculated door to door.'},
  {i:'Accommodation (crew)',p:'\xa3140/night',note:'For multi-day deployments requiring overnight stays.'},
  {i:'Fuel Surcharge',p:'\xa355',note:'Applicable to deployments with significant equipment load.'},
  {i:'Consumables Charge',p:'\xa3110',note:'Covers disposables used during the deployment.'}
];
