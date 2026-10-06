/**
 * Crop Lifecycle & Action Guide Data Source
 * Provides stage-by-stage agronomic timeline, daily checklists, nutrient schedules, 
 * and pest/disease warnings for crops allocated in the Multi-Crop Acreage Planner.
 */

export const CROP_LIFECYCLE_DATA = {
  Paddy: {
    cropKey: 'Paddy',
    name: 'Paddy / Rice (Oryza sativa)',
    durationDays: 120,
    icon: '🌾',
    stages: [
      {
        id: 'paddy-1',
        name: 'Land Preparation & Nursery Seedbed',
        dayRange: 'Day 1–7',
        startDay: 1,
        endDay: 7,
        actions: [
          'Plough field twice to achieve fine tilth and level soil uniform surface.',
          'Prepare raised nursery beds of 1 meter width with 30cm drainage channels.',
          'Soak seeds in water for 24 hours and incubate for 48 hours until sprouting.'
        ],
        waterReq: 'Saturated nursery soil (maintain thin 1cm film of water after germination).',
        nutrientActions: 'Apply 10 kg FYM (Farm Yard Manure), 1 kg Urea, 1.5 kg SSP per cent (40 sq.m) nursery.',
        pestMonitoring: 'Scout for Green Leaf Hopper and Armyworm larvae in nursery beds.',
        diseaseMonitoring: 'Check for Seedling Blight and Damping Off symptoms.',
        warnings: 'Avoid stagnant deep water over sprouted seeds as it suffocates young radicals.',
        checklist: [
          { id: 'paddy-1-1', task: 'Perform nursery seed treatment with Carbendazim (2g/kg seed)' },
          { id: 'paddy-1-2', task: 'Inspect nursery drainage channels for free water flow' },
          { id: 'paddy-1-3', task: 'Maintain thin 1 cm water layer in nursery bed' },
          { id: 'paddy-1-4', task: 'Apply basal FYM compost during field preparation' }
        ]
      },
      {
        id: 'paddy-2',
        name: 'Seedling Nursery Growth & Hardening',
        dayRange: 'Day 8–20',
        startDay: 8,
        endDay: 20,
        actions: [
          'Drain nursery water 2 days before pulling seedlings to harden seedling roots.',
          'Pull seedlings gently at 20-25 days age for transplanting.',
          'Prepare main field by puddling and leveling thoroughly.'
        ],
        waterReq: 'Maintain 2 cm water level in nursery; drain before pulling.',
        nutrientActions: 'Top-dress 500g Urea in nursery 7 days before pulling if seedlings show yellowing.',
        pestMonitoring: 'Scout for Thrips and Rice Hispa leaf scraping.',
        diseaseMonitoring: 'Scout for Brown Leaf Spot on young seedling leaves.',
        warnings: 'Do not pull seedlings without pre-soaking soil to prevent root damage.',
        checklist: [
          { id: 'paddy-2-1', task: 'Check seedling height (optimal 15-20 cm)' },
          { id: 'paddy-2-2', task: 'Scout nursery leaves for Thrips discoloration' },
          { id: 'paddy-2-3', task: 'Drain nursery water 48 hours prior to pulling' },
          { id: 'paddy-2-4', task: 'Flood main field for puddling operation' }
        ]
      },
      {
        id: 'paddy-3',
        name: 'Transplanting & Root Establishment',
        dayRange: 'Day 21–40',
        startDay: 21,
        endDay: 40,
        actions: [
          'Transplant 2-3 seedlings per hill at a shallow depth of 2-3 cm.',
          'Maintain 20cm x 15cm hill spacing for optimal tiller density.',
          'Gap-fill dead hills within 7-10 days of transplanting.'
        ],
        waterReq: 'Maintain shallow 2-3 cm standing water during transplanting and establishment.',
        nutrientActions: 'Basal Dose: Apply 50% N (40kg Urea), 100% P (40kg DAP), 50% K (20kg MOP) per acre.',
        pestMonitoring: 'Scout for Stem Borer dead hearts and Gall Midge onion shoot symptoms.',
        diseaseMonitoring: 'Scout for Bacterial Leaf Blight on leaf margins.',
        warnings: 'Avoid deep transplanting (>5 cm) as it delays tillering.',
        checklist: [
          { id: 'paddy-3-1', task: 'Verify hill spacing (20cm x 15cm density)' },
          { id: 'paddy-3-2', task: 'Apply basal N-P-K fertilizer mix before transplanting' },
          { id: 'paddy-3-3', task: 'Perform gap filling for missing hills' },
          { id: 'paddy-3-4', task: 'Inspect field for Stem Borer egg masses' }
        ]
      },
      {
        id: 'paddy-4',
        name: 'Active Tillering & Canopy Expansion',
        dayRange: 'Day 41–65',
        startDay: 41,
        endDay: 65,
        actions: [
          'Conduct weeding using cono-weeder or manual hand weeding at 30 & 45 days.',
          'Top-dress second dose of Nitrogen fertilizer at maximum tillering.',
          'Allow alternate wetting and drying (AWD) to strengthen root anchoring.'
        ],
        waterReq: 'Alternate Wetting & Drying (AWD): Irrigates when soil surface develops hairline cracks.',
        nutrientActions: 'Top-Dress: Apply 30 kg Urea per acre at active tillering phase.',
        pestMonitoring: 'Monitor Brown Plant Hopper (BPH) at base of tillers and Leaf Folder webs.',
        diseaseMonitoring: 'Scout for Paddy Blast spindle-shaped leaf lesions.',
        warnings: 'Do not keep deep standing water during tillering as it inhibits tiller production.',
        checklist: [
          { id: 'paddy-4-1', task: 'Apply 2nd top-dressing Urea (30 kg/acre)' },
          { id: 'paddy-4-2', task: 'Inspect tiller bases for BPH hopper insects' },
          { id: 'paddy-4-3', task: 'Run cono-weeder for soil aeration' },
          { id: 'paddy-4-4', task: 'Monitor leaf tips for Paddy Blast lesions' }
        ]
      },
      {
        id: 'paddy-5',
        name: 'Panicle Initiation & Flowering',
        dayRange: 'Day 66–90',
        startDay: 66,
        endDay: 90,
        actions: [
          'Maintain continuous 3-5 cm standing water layer during boot leaf and flowering.',
          'Spray Boron (0.2%) at boot stage to enhance grain filling and pollen fertility.',
          'Scout daily for rice gundhi bug during milky grain stage.'
        ],
        waterReq: 'CRITICAL STAGE: Continuous 3-5 cm standing water mandatory. Moisture stress causes sterility.',
        nutrientActions: 'Apply final 25% N (15 kg Urea) + 50% K (20 kg MOP) at panicle initiation.',
        pestMonitoring: 'Scout for Rice Bug (Gundhi Bug) feeding on milky grains.',
        diseaseMonitoring: 'Monitor Sheath Blight and False Smut yellow spore balls.',
        warnings: 'Never let soil dry out during panicle initiation and flowering.',
        checklist: [
          { id: 'paddy-5-1', task: 'Maintain 3-5 cm standing water level in field' },
          { id: 'paddy-5-2', task: 'Apply final Potash (MOP 20 kg/acre) top-dressing' },
          { id: 'paddy-5-3', task: 'Scout milky grains for Gundhi Bug foul odor/insects' },
          { id: 'paddy-5-4', task: 'Foliar spray Micronutrient Boron 0.2%' }
        ]
      },
      {
        id: 'paddy-6',
        name: 'Grain Formation & Ripening',
        dayRange: 'Day 91–110',
        startDay: 91,
        endDay: 110,
        actions: [
          'Allow water to naturally recede as grains harden into dough stage.',
          'Drain all field standing water 10-14 days before target harvest date.',
          'Protect field perimeter from rodents and bird damage.'
        ],
        waterReq: 'Drain field completely 10-15 days prior to harvest to promote uniform ripening.',
        nutrientActions: 'No soil fertilizer application required during dough/maturation stage.',
        pestMonitoring: 'Monitor for late-season rodent burrows along bunds.',
        diseaseMonitoring: 'Check for False Smut and Grain Discoloration.',
        warnings: 'Do not irrigate within 10 days of harvest to prevent lodge lodging.',
        checklist: [
          { id: 'paddy-6-1', task: 'Completely drain field water 10 days before harvest' },
          { id: 'paddy-6-2', task: 'Check grain hardness (dough stage transition)' },
          { id: 'paddy-6-3', task: 'Place rodent bait traps along field bunds' }
        ]
      },
      {
        id: 'paddy-7',
        name: 'Harvest & Post-Harvest Storage',
        dayRange: 'Day 111–120',
        startDay: 111,
        endDay: 120,
        actions: [
          'Harvest when 85% of panicles turn golden yellow and grain moisture drops to 20%.',
          'Thresh and winnow harvested paddy immediately.',
          'Sun-dry grains on tarpaulins to 14% moisture before bag storage.'
        ],
        waterReq: 'Dry soil condition required for combine harvester mobility.',
        nutrientActions: 'Incorporate paddy straw back into soil with Trichoderma for organic enrichment.',
        pestMonitoring: 'Scout grain bags for Rice Weevil (Sitophilus oryzae) in storage.',
        diseaseMonitoring: 'Ensure grain moisture <14% to prevent Aspergillus fungal storage rot.',
        warnings: 'Avoid delayed harvest as it leads to grain shattering and lodging in wind.',
        checklist: [
          { id: 'paddy-7-1', task: 'Verify 85% golden panicle color maturity' },
          { id: 'paddy-7-2', task: 'Sun-dry harvested grains to 14% moisture level' },
          { id: 'paddy-7-3', task: 'Store in gunny bags over wooden pallets' }
        ]
      }
    ]
  },
  Cotton: {
    cropKey: 'Cotton',
    name: 'Cotton (Gossypium hirsutum)',
    durationDays: 150,
    icon: '🌱',
    stages: [
      {
        id: 'cotton-1',
        name: 'Land Preparation & Sowing',
        dayRange: 'Day 1–15',
        startDay: 1,
        endDay: 15,
        actions: [
          'Deep plough black cotton soil during summer to kill hibernating pink bollworm pupae.',
          'Sow Bt cotton seeds at 90 cm x 60 cm spacing on ridges.',
          'Dibble 1 seed per hill at 3-5 cm soil depth.'
        ],
        waterReq: 'Pre-sowing irrigation required; moist soil bed for uniform germination.',
        nutrientActions: 'Basal Dose: Apply FYM 5 tons/acre + 20kg N, 50kg P2O5, 25kg K2O per acre.',
        pestMonitoring: 'Check for cutworms damaging young seedlings.',
        diseaseMonitoring: 'Check for Seedling Rot and Root Rot.',
        warnings: 'Do not sow in waterlogged ridges.',
        checklist: [
          { id: 'cotton-1-1', task: 'Treat seeds with Imidacloprid for sucking pest protection' },
          { id: 'cotton-1-2', task: 'Ensure 90cm x 60cm row spacing' },
          { id: 'cotton-1-3', task: 'Apply basal FYM and Phosphorus' }
        ]
      },
      {
        id: 'cotton-2',
        name: 'Vegetative Growth & Branching',
        dayRange: 'Day 16–45',
        startDay: 16,
        endDay: 45,
        actions: [
          'Perform thinning to retain 1 healthy seedling per hill at 15 days.',
          'Inter-cultivate with blade hoe at 30 & 45 days to control weeds.',
          'Earthing-up along plant rows at 45 days.'
        ],
        waterReq: 'Irrigate every 12-15 days depending on rainfall.',
        nutrientActions: '1st Top Dressing: Apply 40 kg Urea + 25 kg MOP per acre at 45 days.',
        pestMonitoring: 'Scout for Sucking Pests (Aphids, Jassids, Thrips, Whitefly).',
        diseaseMonitoring: 'Scout for Bacterial Leaf Blight and Cercospora Leaf Spot.',
        warnings: 'Avoid excessive early nitrogen application that causes vegetative rank growth.',
        checklist: [
          { id: 'cotton-2-1', task: 'Thin seedlings to 1 plant per hill' },
          { id: 'cotton-2-2', task: 'Scout yellow sticky traps for Whitefly' },
          { id: 'cotton-2-3', task: 'Apply 1st top dressing Urea' },
          { id: 'cotton-2-4', task: 'Perform earthing up along plant rows' }
        ]
      },
      {
        id: 'cotton-3',
        name: 'Square Formation & Flowering',
        dayRange: 'Day 46–90',
        startDay: 46,
        endDay: 90,
        actions: [
          'Maintain clean weed-free crop canopy.',
          'Foliar spray MgSO4 (1%) + 19-19-19 (1%) to prevent reddening of cotton leaves.',
          'Install Pink Bollworm Pheromone traps (5 traps/acre).'
        ],
        waterReq: 'CRITICAL STAGE: Flowering requires steady moisture. Moisture deficit causes square drop.',
        nutrientActions: '2nd Top Dressing: Apply 40 kg Urea per acre at peak flowering stage.',
        pestMonitoring: 'CRITICAL: Install Pheromone traps for Pink Bollworm & American Bollworm.',
        diseaseMonitoring: 'Monitor Leaf Curl Virus (transmitted by Whitefly).',
        warnings: 'Avoid water stress during square formation as it induces heavy flower drop.',
        checklist: [
          { id: 'cotton-3-1', task: 'Install Pink Bollworm pheromone traps (5/acre)' },
          { id: 'cotton-3-2', task: 'Spray 1% Magnesium Sulphate to prevent leaf reddening' },
          { id: 'cotton-3-3', task: 'Apply 2nd top dressing Urea (40 kg/acre)' },
          { id: 'cotton-3-4', task: 'Check flower rosettes for Pink Bollworm larvae' }
        ]
      },
      {
        id: 'cotton-4',
        name: 'Boll Development & Bursting',
        dayRange: 'Day 91–130',
        startDay: 91,
        endDay: 130,
        actions: [
          'Maintain moderate soil hydration as bolls expand.',
          'Spray Ethrel if uniform boll opening is desired late season.',
          'Prepare clean storage yard for cotton picking.'
        ],
        waterReq: 'Light irrigation during boll expansion; stop irrigation when 20% bolls burst.',
        nutrientActions: 'Foliar spray Potassium Nitrate (13-0-45) @ 1% for boll filling.',
        pestMonitoring: 'Scout for Spodoptera litura defoliator and Pink Bollworm in green bolls.',
        diseaseMonitoring: 'Monitor Boll Rot under humid canopy conditions.',
        warnings: 'Do not spray pesticides directly on open cotton lint.',
        checklist: [
          { id: 'cotton-4-1', task: 'Foliar spray 1% Potassium Nitrate for boll weight' },
          { id: 'cotton-4-2', task: 'Stop irrigation when boll bursting reaches 20%' },
          { id: 'cotton-4-3', task: 'Inspect opened bolls for boll rot fungus' }
        ]
      },
      {
        id: 'cotton-5',
        name: 'Boll Picking & Harvest',
        dayRange: 'Day 131–150',
        startDay: 131,
        endDay: 150,
        actions: [
          'Pick clean kapas in sunny morning hours after dew dries.',
          'Store clean white cotton separate from stained/damaged bolls.',
          'Perform 2-3 pickings at 15-day intervals.'
        ],
        waterReq: 'No irrigation during picking phase.',
        nutrientActions: 'Post-harvest plant stalk shredding with rotavator for soil organic matter.',
        pestMonitoring: 'Destroy leftover green bolls after final picking to break pink bollworm cycle.',
        diseaseMonitoring: 'Ensure cotton lint moisture is under 8% before bundling.',
        warnings: 'Never pick wet cotton with morning dew as it causes lint yellowing in storage.',
        checklist: [
          { id: 'cotton-5-1', task: 'Pick kapas after morning dew has evaporated' },
          { id: 'cotton-5-2', task: 'Separate stained cotton from grade A white lint' },
          { id: 'cotton-5-3', task: 'Shred remaining cotton stalks with rotavator' }
        ]
      }
    ]
  },
  Chilli: {
    cropKey: 'Chilli',
    name: 'Chilli (Capsicum annuum)',
    durationDays: 150,
    icon: '🌶️',
    stages: [
      {
        id: 'chilli-1',
        name: 'Nursery & Transplanting',
        dayRange: 'Day 1–30',
        startDay: 1,
        endDay: 30,
        actions: [
          'Raise seedlings in pro-trays using coco-peat mixed with Pseudomonas.',
          'Transplant 35-40 day old seedlings on raised ridges at 60cm x 45cm spacing.',
          'Drench seedling roots with Carbendazim before field planting.'
        ],
        waterReq: 'Light micro-drip irrigation daily during establishment.',
        nutrientActions: 'Basal Dose: FYM 10 tons/acre + 30kg N, 60kg P, 40kg K + Neem Cake 100kg.',
        pestMonitoring: 'Scout for Thrips curling young tender leaves upward.',
        diseaseMonitoring: 'Scout for Damping Off in seedling trays.',
        warnings: 'Avoid heavy flood irrigation that causes collar rot in young seedlings.',
        checklist: [
          { id: 'chilli-1-1', task: 'Dip seedling roots in Pseudomonas bio-fungicide solution' },
          { id: 'chilli-1-2', task: 'Transplant on raised beds with drip lateral lines' },
          { id: 'chilli-1-3', task: 'Apply Neem Cake 100 kg/acre basal' }
        ]
      },
      {
        id: 'chilli-2',
        name: 'Vegetative Canopy & Flowering',
        dayRange: 'Day 31–70',
        startDay: 31,
        endDay: 70,
        actions: [
          'Staking plants with bamboo sticks to prevent lodging under heavy crop load.',
          'Spray Planofix (α-NAA) @ 1 ml / 4.5 L water to control flower drop.',
          'Install blue sticky traps for Thrips and yellow traps for Whitefly.'
        ],
        waterReq: 'Drip irrigation 2 hours every alternate day based on soil moisture.',
        nutrientActions: 'Fertigation: Weekly N-P-K (19-19-19) 3 kg/acre via drip fertigation.',
        pestMonitoring: 'Scout for Chilli Thrips (boat-shaped leaf curling) and Mites (downward curling).',
        diseaseMonitoring: 'Monitor Powdery Mildew white dust under leaves.',
        warnings: 'Do not over-drench nitrogen fertilizer as it promotes excessive leafy growth and flower drop.',
        checklist: [
          { id: 'chilli-2-1', task: 'Install blue sticky traps (10/acre) for Thrips' },
          { id: 'chilli-2-2', task: 'Foliar spray Planofix to prevent flower drop' },
          { id: 'chilli-2-3', task: 'Stake plant branches with bamboo sticks' }
        ]
      },
      {
        id: 'chilli-3',
        name: 'Fruit Set & Green Chilli Picking',
        dayRange: 'Day 71–110',
        startDay: 71,
        endDay: 110,
        actions: [
          'First picking of green pods at 75-80 days.',
          'Spray Micronutrient mix (Zn, Fe, B, Mn) @ 2.5g/L during peak pod load.',
          'Maintain regular harvesting every 10-12 days.'
        ],
        waterReq: 'Uniform drip moisture essential during pod development.',
        nutrientActions: 'Fertigation: Calcium Nitrate 3kg + Boron 500g per acre via drip.',
        pestMonitoring: 'Scout for Tobacco Caterpillar (Spodoptera litura) boring into green fruits.',
        diseaseMonitoring: 'CRITICAL: Scout for Anthracnose / Dieback (black sunken spots on pods).',
        warnings: 'Never let pods touch wet soil surface; spray Copper Oxychloride if Anthracnose appears.',
        checklist: [
          { id: 'chilli-3-1', task: 'Perform 1st green chilli pod harvest' },
          { id: 'chilli-3-2', task: 'Fertigate Calcium Nitrate + Boron' },
          { id: 'chilli-3-3', task: 'Inspect green pods for Anthracnose dark circular spots' }
        ]
      },
      {
        id: 'chilli-4',
        name: 'Red Harvest & Drying',
        dayRange: 'Day 111–150',
        startDay: 111,
        endDay: 150,
        actions: [
          'Harvest fully ripe deep red chilli pods.',
          'Spread red chillies on cement drying yard or clean poly-sheets.',
          'Turn pods twice daily until moisture drops to 10% for dark red color retention.'
        ],
        waterReq: 'Reduce drip irrigation frequency to trigger uniform pod ripening.',
        nutrientActions: 'Final Potassium Sulphate (0-0-50) fertigation for pod color intensity.',
        pestMonitoring: 'Check dried chillies for storage pests.',
        diseaseMonitoring: 'Prevent rain exposure during drying to avoid Aflatoxin contamination.',
        warnings: 'Do not heap wet harvested red chillies overnight as heating causes bleaching.',
        checklist: [
          { id: 'chilli-4-1', task: 'Pick deep red ripe chilli pods' },
          { id: 'chilli-4-2', task: 'Spread pods on clean tarpaulin for solar drying' },
          { id: 'chilli-4-3', task: 'Test dried pods for 10% moisture (snapping sound)' }
        ]
      }
    ]
  },
  Maize: {
    cropKey: 'Maize',
    name: 'Maize / Corn (Zea mays)',
    durationDays: 110,
    icon: '🌽',
    stages: [
      {
        id: 'maize-1',
        name: 'Sowing & Germination',
        dayRange: 'Day 1–15',
        startDay: 1,
        endDay: 15,
        actions: [
          'Sow seeds at 60cm x 20cm spacing at a depth of 4-5 cm.',
          'Apply pre-emergence herbicide Atrazine 500g/acre within 48 hours of sowing.',
          'Ensure uniform soil moisture for rapid seedling emergence.'
        ],
        waterReq: 'Light irrigation immediately after sowing.',
        nutrientActions: 'Basal Dose: Apply 25kg Urea, 50kg DAP, 25kg MOP + 10kg Zinc Sulphate per acre.',
        pestMonitoring: 'Scout for Fall Armyworm (FAW) egg masses under leaves.',
        diseaseMonitoring: 'Check for Seed Rot in cold damp soils.',
        warnings: 'Do not omit Zinc Sulphate as maize is highly sensitive to zinc deficiency (White Bud).',
        checklist: [
          { id: 'maize-1-1', task: 'Sow hybrid seeds at 60cm x 20cm spacing' },
          { id: 'maize-1-2', task: 'Spray Atrazine herbicide within 48 hours' },
          { id: 'maize-1-3', task: 'Apply basal N-P-K + Zinc Sulphate' }
        ]
      },
      {
        id: 'maize-2',
        name: 'Knee-High Stage & FAW Defense',
        dayRange: 'Day 16–45',
        startDay: 16,
        endDay: 45,
        actions: [
          'Perform manual weeding and earthing-up at knee-high stage (30 days).',
          'Drop Emamectin Benzoate granules into leaf whorls for Fall Armyworm control.',
          'Top-dress 2nd dose of Urea at knee-high stage.'
        ],
        waterReq: 'Irrigate at 10-12 day intervals.',
        nutrientActions: 'Top-Dress: Apply 35 kg Urea per acre at 30 days (Knee-high).',
        pestMonitoring: 'CRITICAL: Inspect central leaf whorls for Fall Armyworm pinholes & frass.',
        diseaseMonitoring: 'Check for Turcicum Leaf Blight long elliptical brown spots.',
        warnings: 'Direct pesticide spray into leaf whorl funnel where FAW larvae hide.',
        checklist: [
          { id: 'maize-2-1', task: 'Inspect central leaf whorls for Fall Armyworm frass' },
          { id: 'maize-2-2', task: 'Apply 2nd dose Urea (35 kg/acre) at knee-high stage' },
          { id: 'maize-2-3', task: 'Perform earthing up around plant bases' }
        ]
      },
      {
        id: 'maize-3',
        name: 'Tasseling & Silking',
        dayRange: 'Day 46–75',
        startDay: 46,
        endDay: 75,
        actions: [
          'CRITICAL WATER PHASE: Tasseling and silking determine cob kernel set.',
          'Foliar spray Boron (0.2%) during tassel emergence for pollination.',
          'Scout cob tips for corn earworm larvae.'
        ],
        waterReq: 'MOST CRITICAL STAGE: Moisture stress during silking reduces kernel yield by up to 40%.',
        nutrientActions: 'Final Top-Dress: Apply 25 kg Urea + 15 kg MOP at tassel emergence.',
        pestMonitoring: 'Scout for Corn Earworm and Stem Borer.',
        diseaseMonitoring: 'Monitor Banded Leaf and Sheath Blight.',
        warnings: 'Never let soil dry out during tasseling and silking week.',
        checklist: [
          { id: 'maize-3-1', task: 'Ensure full irrigation flooding during tassel emergence' },
          { id: 'maize-3-2', task: 'Apply final Urea + MOP top-dressing' },
          { id: 'maize-3-3', task: 'Inspect silk threads for earworm feeding' }
        ]
      },
      {
        id: 'maize-4',
        name: 'Grain Filling & Harvest',
        dayRange: 'Day 76–110',
        startDay: 76,
        endDay: 110,
        actions: [
          'Monitor grain milk to dough stage progression.',
          'Harvest when husk covers dry out into paper-like brown color.',
          'Shell grains using power thresher and sun-dry to 12% moisture.'
        ],
        waterReq: 'Light irrigation during milk stage; stop irrigation at black layer formation.',
        nutrientActions: 'No fertilizer needed.',
        pestMonitoring: 'Scout stored cobs for Angoumois Grain Moth.',
        diseaseMonitoring: 'Ensure grain moisture <12% to prevent Aflatoxin contamination.',
        warnings: 'Harvest when black layer forms at kernel attachment point.',
        checklist: [
          { id: 'maize-4-1', task: 'Check kernel base for black layer maturity mark' },
          { id: 'maize-4-2', task: 'Harvest dry brown cobs' },
          { id: 'maize-4-3', task: 'Dry shelled corn grains to 12% moisture' }
        ]
      }
    ]
  }
};

export function getCropLifecycleData(cropName) {
  if (!cropName) return CROP_LIFECYCLE_DATA.Paddy;
  
  const keys = Object.keys(CROP_LIFECYCLE_DATA);
  const match = keys.find(k => k.toLowerCase() === String(cropName).trim().toLowerCase());
  if (match) {
    return CROP_LIFECYCLE_DATA[match];
  }

  const cleanName = String(cropName).trim();
  return {
    cropKey: cleanName,
    name: `${cleanName} Production Cycle`,
    durationDays: 120,
    icon: '🌱',
    stages: [
      {
        id: `${cleanName.toLowerCase()}-1`,
        name: 'Field Preparation & Sowing / Planting',
        dayRange: 'Day 1–15',
        startDay: 1,
        endDay: 15,
        actions: [
          `Prepare soil to fine tilth and level bed for ${cleanName}.`,
          `Treat seeds / planting material with bio-fungicide prior to sowing.`,
          `Incorporate basal FYM compost and primary nutrients into root zone.`
        ],
        waterReq: 'Light pre-sowing irrigation for uniform germination and root establishment.',
        nutrientActions: `Basal Application: Organic compost + N-P-K balanced fertilizer mix for ${cleanName}.`,
        pestMonitoring: `Scout field for soil cutworms and seedling pests during emergence of ${cleanName}.`,
        diseaseMonitoring: 'Monitor for damping-off and root rot symptoms in young seedlings.',
        warnings: 'Avoid waterlogging during early germination phase.',
        checklist: [
          { id: `${cleanName.toLowerCase()}-1-1`, task: `Prepare land tilth for ${cleanName} planting` },
          { id: `${cleanName.toLowerCase()}-1-2`, task: `Apply basal compost and seedling root treatment` },
          { id: `${cleanName.toLowerCase()}-1-3`, task: `Inspect field irrigation channels` }
        ]
      },
      {
        id: `${cleanName.toLowerCase()}-2`,
        name: 'Vegetative Growth & Canopy Establishment',
        dayRange: 'Day 16–45',
        startDay: 16,
        endDay: 45,
        actions: [
          `Perform inter-cultivation and weeding to keep ${cleanName} canopy clean.`,
          `Apply top-dressing Nitrogen fertilizer to encourage robust vegetative branching.`,
          `Monitor leaf health and install sticky traps for sucking pests.`
        ],
        waterReq: 'Regular scheduled irrigation aligned with evapotranspiration and soil type.',
        nutrientActions: `1st Top-Dressing: Nitrogen boost (Urea) for ${cleanName} canopy growth.`,
        pestMonitoring: `Scout foliage for sucking insects (aphids, thrips, whiteflies) on ${cleanName}.`,
        diseaseMonitoring: 'Inspect leaf undersides for foliar spots and mildew.',
        warnings: 'Avoid weed competition during early vegetative development.',
        checklist: [
          { id: `${cleanName.toLowerCase()}-2-1`, task: `Apply 1st top-dressing fertilizer for ${cleanName}` },
          { id: `${cleanName.toLowerCase()}-2-2`, task: `Perform inter-culture weeding around plants` },
          { id: `${cleanName.toLowerCase()}-2-3`, task: `Install yellow/blue sticky pest traps` }
        ]
      },
      {
        id: `${cleanName.toLowerCase()}-3`,
        name: 'Flowering & Reproductive Phase',
        dayRange: 'Day 46–85',
        startDay: 46,
        endDay: 85,
        actions: [
          `Maintain continuous soil hydration during critical flowering stage of ${cleanName}.`,
          `Apply Potassium and Micronutrient foliar sprays to boost fruit/grain set.`,
          `Scout regularly for crop-specific borers and leaf-feeding larvae.`
        ],
        waterReq: 'CRITICAL STAGE: Adequate moisture mandatory to prevent flower/fruit drop.',
        nutrientActions: `2nd Top-Dressing: Potassium + Boron micronutrient spray for ${cleanName}.`,
        pestMonitoring: `Monitor flower buds and young fruits of ${cleanName} for borer damage.`,
        diseaseMonitoring: 'Check for blights, rusts, or wilts in foliage.',
        warnings: 'Never expose crop to moisture stress during peak flowering.',
        checklist: [
          { id: `${cleanName.toLowerCase()}-3-1`, task: `Maintain consistent irrigation moisture during flowering` },
          { id: `${cleanName.toLowerCase()}-3-2`, task: `Foliar spray Boron micronutrient` },
          { id: `${cleanName.toLowerCase()}-3-3`, task: `Scout reproductive organs for borer larvae` }
        ]
      },
      {
        id: `${cleanName.toLowerCase()}-4`,
        name: 'Fruit / Grain Maturation Phase',
        dayRange: 'Day 86–110',
        startDay: 86,
        endDay: 110,
        actions: [
          `Monitor pod/fruit/grain expansion and color maturity in ${cleanName}.`,
          `Reduce irrigation frequency as crop approaches full maturity.`,
          `Prepare harvest machinery, drying yard, and storage containers.`
        ],
        waterReq: 'Taper off irrigation 10-14 days prior to target harvest date.',
        nutrientActions: 'No soil fertilizer required during final ripening phase.',
        pestMonitoring: 'Scout for late-season pests and rodent activity.',
        diseaseMonitoring: 'Prevent damp canopy conditions that promote fruit/grain rots.',
        warnings: 'Drain field before harvest to avoid lodging and harvest delay.',
        checklist: [
          { id: `${cleanName.toLowerCase()}-4-1`, task: `Taper off irrigation 10 days before harvest` },
          { id: `${cleanName.toLowerCase()}-4-2`, task: `Verify crop maturity indices for ${cleanName}` }
        ]
      },
      {
        id: `${cleanName.toLowerCase()}-5`,
        name: 'Harvesting & Post-Harvest Handling',
        dayRange: 'Day 111–120',
        startDay: 111,
        endDay: 120,
        actions: [
          `Harvest ${cleanName} at peak physiological maturity under clear weather conditions.`,
          `Sun-dry or grade harvested produce to optimal safe moisture percentage.`,
          `Store in clean, moisture-proof storage bags on elevated pallets.`
        ],
        waterReq: 'Dry soil condition required for harvest operation.',
        nutrientActions: 'Incorporate crop residue into soil for organic recycling.',
        pestMonitoring: 'Monitor storage facility for grain or produce pests.',
        diseaseMonitoring: 'Ensure safe moisture levels to prevent storage mold/fungi.',
        warnings: 'Do not harvest during rainfall or heavy morning dew.',
        checklist: [
          { id: `${cleanName.toLowerCase()}-5-1`, task: `Harvest ${cleanName} produce at optimal maturity` },
          { id: `${cleanName.toLowerCase()}-5-2`, task: `Dry and grade produce for market sale` },
          { id: `${cleanName.toLowerCase()}-5-3`, task: `Store produce in clean, dry storage` }
        ]
      }
    ]
  };
}
