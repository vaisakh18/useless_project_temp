// contextEngine.js
// Generates context-aware scores, verdicts, and profiles. Still 0% real.

import { getContent, pickRandom } from './contextContent.js'

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const getSeverity = (score) => {
  if (score <= 30) return 'Low'
  if (score <= 60) return 'Moderate'
  if (score <= 80) return 'High'
  return 'Critical'
}

// ── Score schemas per context ────────────────────────────────
const SCORE_SCHEMAS = {
  human: [
    { key: 'relationshipStrength', label: 'Relationship Strength', emoji: '❤️', invert: true },
    { key: 'breakupProbability',   label: 'Breakup Probability',   emoji: '💔', invert: false },
    { key: 'dramaPotential',       label: 'Drama Potential',        emoji: '🎭', invert: false },
    { key: 'ghostingRisk',         label: 'Ghosting Risk',          emoji: '👻', invert: false },
    { key: 'vibeCompatibility',    label: 'Vibe Compatibility',     emoji: '✨', invert: true },
    { key: 'communicationScore',   label: 'Communication Score',    emoji: '💬', invert: true },
  ],
  animal: [
    { key: 'friendshipStrength', label: 'Friendship Strength', emoji: '🐾', invert: true },
    { key: 'chaosLevel',         label: 'Chaos Level',         emoji: '🌀', invert: false },
    { key: 'snackMotivation',    label: 'Snack Motivation',    emoji: '🦴', invert: false },
    { key: 'napCompatibility',   label: 'Nap Compatibility',   emoji: '😴', invert: true },
    { key: 'loyalty',            label: 'Loyalty',             emoji: '💛', invert: true },
    { key: 'zoomiesPotential',   label: 'Zoomies Potential',   emoji: '💨', invert: false },
  ],
  fruit: [
    { key: 'juiciness',       label: 'Juiciness',       emoji: '💧', invert: false },
    { key: 'sweetness',       label: 'Sweetness',       emoji: '🍯', invert: false },
    { key: 'ripeness',        label: 'Ripeness',        emoji: '🍎', invert: false },
    { key: 'snackPotential',  label: 'Snack Potential', emoji: '🍽️', invert: false },
    { key: 'chaos',           label: 'Chaos',           emoji: '🌀', invert: false },
    { key: 'shelfLifeEnergy', label: 'Shelf-Life Energy',emoji: '⏳', invert: true },
  ],
  food: [
    { key: 'flavor',         label: 'Flavor',          emoji: '🔥', invert: false },
    { key: 'spice',          label: 'Spice',           emoji: '🌶️', invert: false },
    { key: 'crunch',         label: 'Crunch',          emoji: '💥', invert: false },
    { key: 'messiness',      label: 'Messiness',       emoji: '🍕', invert: false },
    { key: 'snackPotential', label: 'Snack Potential', emoji: '🍽️', invert: false },
    { key: 'comfortLevel',   label: 'Comfort Level',   emoji: '🛋️', invert: false },
  ],
  pet: [
    { key: 'cuteness',         label: 'Cuteness',           emoji: '🌸', invert: false },
    { key: 'loyalty',          label: 'Loyalty',            emoji: '💛', invert: true },
    { key: 'chaos',            label: 'Chaos',              emoji: '🌀', invert: false },
    { key: 'snackMotivation',  label: 'Snack Motivation',   emoji: '🦴', invert: false },
    { key: 'napPotential',     label: 'Nap Potential',      emoji: '😴', invert: false },
    { key: 'attentionSeeking', label: 'Attention Seeking',  emoji: '👀', invert: false },
  ],
  nature: [
    { key: 'calmness', label: 'Calmness', emoji: '🌿', invert: true },
    { key: 'chaos',    label: 'Chaos',    emoji: '⛈️', invert: false },
    { key: 'beauty',   label: 'Beauty',   emoji: '🌸', invert: false },
    { key: 'energy',   label: 'Energy',   emoji: '⚡', invert: false },
    { key: 'mood',     label: 'Mood',     emoji: '🌤️', invert: true },
    { key: 'drama',    label: 'Drama',    emoji: '🌩️', invert: false },
  ],
  vehicle: [
    { key: 'speed',         label: 'Speed',          emoji: '💨', invert: false },
    { key: 'reliability',   label: 'Reliability',    emoji: '🔧', invert: true },
    { key: 'style',         label: 'Style',          emoji: '✨', invert: false },
    { key: 'roadRage',      label: 'Road Rage',      emoji: '🚗', invert: false },
    { key: 'fuelEnergy',    label: 'Fuel Energy',    emoji: '⛽', invert: false },
    { key: 'parkingAbility',label: 'Parking Ability',emoji: '🅿️', invert: true },
  ],
  plant: [
    { key: 'growthEnergy',    label: 'Growth Energy',    emoji: '🌱', invert: false },
    { key: 'waterDependency', label: 'Water Dependency', emoji: '💧', invert: false },
    { key: 'sunlightNeed',    label: 'Sunlight Need',    emoji: '☀️', invert: false },
    { key: 'calmness',        label: 'Calmness',         emoji: '🌿', invert: false },
    { key: 'drama',           label: 'Leaf Drama',       emoji: '🍂', invert: false },
    { key: 'beauty',          label: 'Beauty',           emoji: '🌸', invert: false },
  ],
  object: [
    { key: 'usefulness',         label: 'Usefulness',          emoji: '🔧', invert: false },
    { key: 'chaos',              label: 'Chaos',               emoji: '🌀', invert: false },
    { key: 'durability',         label: 'Durability',          emoji: '💪', invert: false },
    { key: 'style',              label: 'Style',               emoji: '✨', invert: false },
    { key: 'confusion',          label: 'Confusion',           emoji: '❓', invert: false },
    { key: 'mainCharacterEnergy',label: 'Main Character Energy',emoji: '🌟', invert: false },
  ],
  unknown: [
    { key: 'mystery',           label: 'Mystery',            emoji: '🌫️', invert: false },
    { key: 'confusion',         label: 'Confusion',          emoji: '❓', invert: false },
    { key: 'personality',       label: 'Personality',        emoji: '✨', invert: false },
    { key: 'chaosLevel',        label: 'Chaos Level',        emoji: '🌀', invert: false },
    { key: 'mainCharacterEnergy',label:'Main Character Energy',emoji:'🌟', invert: false },
    { key: 'unexplainability',  label: 'Unexplainability',   emoji: '🔮', invert: false },
  ],
}

// Metric jokes per context key
const METRIC_JOKES = {
  // human (kept from predictionEngine.js pool, duplicated here for context engine)
  relationshipStrength: ["Held together with vibes and questionable hope.", "Structurally sound, spiritually suspicious.", "Like WiFi — strong near the router, drops everywhere else.", "Somehow still standing."],
  breakupProbability:   ["Our algorithm is sweating.", "The exit signs are quietly illuminated.", "Statistically: yikes.", "Lower than expected. Suspiciously lower."],
  dramaPotential:       ["Emmy-winning potential.", "Reality TV producers are circling.", "Could be weaponized.", "Somewhere between telenovela and Reddit post."],
  ghostingRisk:         ["Last seen: emotionally unavailable.", "Delivered. Not opened. Never mentioned.", "The read receipts tell a story.", "Disappearing act probability: elevated."],
  vibeCompatibility:    ["Vibes: present. Mostly.", "Technically compatible. Jury's out.", "Strong vibe alignment. Source: trust me.", "Same energy, different frequencies."],
  communicationScore:   ["They talk. Sometimes about the actual problem.", "Communication happening. Effectiveness: classified.", "One listens. The other waits to talk.", "Meanings are being lost in transit."],
  // animal
  friendshipStrength: ["Based primarily on treat availability.", "Strong as long as snacks are provided.", "Unconditional. Except near food.", "Very strong. Suspiciously strong."],
  chaosLevel:         ["Zoomies imminent.", "The couch has already been claimed.", "Chaos is the plan.", "Managed chaos. Mostly."],
  snackMotivation:    ["This is the primary motivation for everything.", "Will do anything for a treat.", "Snack drive: maximum.", "The algorithm detects treat obsession."],
  napCompatibility:   ["Outstanding nap scores detected.", "Napping is their primary language.", "Sleep compatibility: excellent.", "They nap together. That's the relationship."],
  loyalty:            ["Treat-dependent loyalty confirmed.", "Would follow you anywhere. For snacks.", "Deeply loyal. Mostly.", "Loyalty: real. Also treat-related."],
  zoomiesPotential:   ["Zoomies are inevitable.", "High zoomies energy detected.", "3am zoomies: scheduled.", "Uncontrollable burst probability: very high."],
  // fruit
  juiciness:       ["Dangerously juicy.", "Juiciness levels: impressive.", "May require napkins.", "Handle with care."],
  sweetness:       ["Sweetness: real.", "Natural sweetness detected.", "The sweetest one gets eaten first.", "Sweet but unstable."],
  ripeness:        ["Ripeness window: closing.", "Peak ripeness incoming.", "Act now or regret it.", "The ripeness is a choice."],
  snackPotential:  ["Excellent snack candidate.", "Snack potential: very high.", "Could become a smoothie.", "Prime snack energy."],
  shelfLifeEnergy: ["Act fast.", "The clock is ticking.", "Shelf life: optimistic.", "Best consumed immediately."],
  // food
  flavor:         ["Flavor: present.", "Taste profile: controversial.", "Needs more seasoning. Always.", "The flavor is strong with this one."],
  spice:          ["Spice level undisclosed.", "Spicier than expected.", "Handling required.", "The spice is not negotiable."],
  crunch:         ["Satisfying crunch detected.", "Crunch levels: adequate.", "Structural integrity: solid.", "The crunch is half the experience."],
  messiness:      ["Messier than advertised.", "Napkins required.", "The mess is worth it.", "Accept the mess. It's part of the deal."],
  comfortLevel:   ["Extremely comforting under pressure.", "Comfort food energy: maximum.", "This is what comfort feels like.", "Strong warm blanket energy."],
  // nature/plant/vehicle/object/unknown
  calmness:           ["Suspiciously peaceful.", "Zero drama detected.", "The most unbothered thing here.", "Calm in a way that's almost threatening."],
  chaos:              ["Chaos is the natural state.", "Manageable chaos. For now.", "The chaos has its own logic.", "Entropy detected."],
  beauty:             ["Objectively beautiful.", "No notes on aesthetics.", "Hard to argue with.", "Beautiful without trying."],
  energy:             ["High energy. Handle with care.", "Energy levels: impressive.", "The energy is present.", "Strong presence detected."],
  mood:               ["Mood: complex.", "Seasonal mood variations noted.", "Mood depends on the weather. Literally.", "Subject to change."],
  drama:              ["Drama: weather-dependent.", "Occasional volcanic drama.", "Drama is built in.", "The drama is part of the aesthetic."],
  speed:              ["Fast. Possibly too fast.", "Speed: confident.", "Exceeds necessary limits.", "The speed is a lifestyle."],
  reliability:        ["Reliable. Mostly.", "Dependable until it isn't.", "Reliability: good question.", "Has not broken down. Yet."],
  style:              ["Extremely stylish.", "Has a look. Commits to it.", "Style: undeniable.", "No notes on the aesthetic."],
  roadRage:           ["Road rage: elevated.", "Zero tolerance for slow drivers.", "The horn exists and they use it.", "Patience: not detected behind the wheel."],
  fuelEnergy:         ["Fuel situation: check it.", "Running on vibes and petrol.", "Fuel efficiency: questionable.", "Might need a refill soon."],
  parkingAbility:     ["Parking: a skill in progress.", "The parking situation is complicated.", "Two spaces used. One car.", "Parking confidence exceeds parking ability."],
  growthEnergy:       ["Growing slowly. That's fine.", "Steady progress detected.", "The growth is happening. Quietly.", "Patience is the strategy."],
  waterDependency:    ["Needs water. Regularly.", "Wilts dramatically without water.", "Watering schedule: non-negotiable.", "The hydration demands are real."],
  sunlightNeed:       ["Needs sunlight. Non-negotiable.", "Without sun, nothing works.", "Photosynthesis or nothing.", "Place in a sunny window. Immediately."],
  usefulness:         ["Usefulness: debated.", "May or may not serve a purpose.", "Functionality: pending.", "Useful in ways we don't understand yet."],
  durability:         ["Surprisingly durable.", "Has survived this long.", "Built differently.", "Durability: better than expected."],
  confusion:          ["Context confidence: 3%.", "Nobody knows. Including the algorithm.", "Deeply confusing. Also iconic.", "The confusion is the point."],
  mainCharacterEnergy:["Undeniable main character energy.", "The protagonist has entered.", "Extremely main character. No notes.", "Everything happens around this one."],
  mystery:            ["Cannot be explained.", "The mystery is the message.", "Deeply undefined.", "Our algorithm gave up. Respectfully."],
  personality:        ["Has personality. Unexpectedly.", "More personality than expected.", "The personality is non-negotiable.", "Impossible to ignore."],
  chaosLevel:         ["Chaos level: elevated.", "The chaos has structure. Sort of.", "Managed chaos. Mostly.", "Entropy detected."],
  unexplainability:   ["Cannot be explained by modern science.", "Defies categorization.", "The unexplainability is the main feature.", "Our algorithm requested leave after this."],
}

function getJoke(key) {
  const pool = METRIC_JOKES[key]
  if (!pool) return 'Our algorithm declines to comment.'
  return pickRandom(pool)
}

// ── Verdict generators per context ──────────────────────────
const VERDICT_POOLS = {
  human: {
    imminent:    ['💀 BREAKUP IMMINENT','🚨 EXIT SIGNS ARE LIT','📦 START PACKING YOUR FEELINGS','🪦 RELATIONSHIP STATUS: CRITICAL','💀 OUR ALGORITHM IS CONCERNED','🚪 SOMEONE IS MENTALLY ALREADY GONE'],
    stable:      ['❤️ SURPRISINGLY STABLE','💚 AGAINST ALL ODDS: THRIVING','✅ CERTIFIED NOT A DISASTER','🏆 RELATIONSHIP GOALS (APPARENTLY)','😌 HEALTHY. DISTURBING, BUT HEALTHY.'],
    dramatic:    ['😂 TOGETHER UNTIL THE NEXT ARGUMENT','🎭 CHAOTIC BUT COMMITTED','🔥 VOLATILE. PASSIONATE. EXHAUSTING.','🎢 RELATIONSHIP STATUS: ROLLERCOASTER','🌪️ CONTROLLED CHAOS. EMPHASIS ON CHAOS.'],
    complicated: ["🫠 IT'S COMPLICATED",'🤷 UNCLEAR. LIKE THEIR RELATIONSHIP.','😐 OUR ALGORITHM IS ALSO CONFUSED','🌫️ UNDEFINED AND UNHINGED',"🤔 NEITHER TOGETHER NOR NOT. IT'S A THING."],
  },
  animal:  ['🐾 BESTIES FOR LIFE','🐕 SUSPICIOUSLY LOYAL','🐈 THEY\'RE IGNORING EACH OTHER','🦴 TREAT-BASED RELATIONSHIP','🐾 CHAOTIC BUT WHOLESOME','😴 EXTREMELY WELL-RESTED','🌀 MAXIMUM CHAOS DETECTED'],
  fruit:   ['🍓 FRUITFULLY COMPATIBLE','🍌 TOO MUCH PEELING INVOLVED','🍎 A STABLE FRUIT-IONSHIP','🍉 JUICY BUT COMPLICATED','🍍 EXTREMELY TROPICAL','🍊 UNEXPECTEDLY SWEET','🫐 SMALL BUT INTENSE'],
  food:    ['🍕 PERFECTLY SEASONED','🌶️ TOO SPICY TO HANDLE','🍔 A MESSY SITUATION','🍜 SURPRISINGLY WELL BALANCED','🍰 SWEET BUT UNSTABLE','🥗 NEEDS MORE SEASONING','🫕 CHAOTICALLY DELICIOUS'],
  pet:     ['🐾 BEST FRIENDS','🦴 TREAT DEPENDENT','😼 TOO MUCH ATTITUDE','🐕 WHOLESOME CHAOS','😴 EXCELLENT NAP ENERGY','✨ SUSPICIOUSLY CUTE','🐾 CERTIFIED CHAOS AGENT'],
  nature:  ['🌿 PEACEFULLY CHAOTIC','🌳 DEEPLY ROOTED','🌊 EMOTIONALLY TIDAL','🌋 EXTREMELY VOLATILE','☀️ SURPRISINGLY STABLE','🌈 BEAUTIFULLY COMPLICATED','🍃 QUIETLY THRIVING'],
  vehicle: ['🚗 ROAD-TRIP READY','⛽ RUNNING ON FUMES','🏎️ DANGEROUSLY FAST','🚌 RELIABLE BUT SLOW','🔧 NEEDS MAINTENANCE','🛻 BUILT FOR CHAOS','🚦 STUCK AT A CROSSROADS'],
  plant:   ['🌱 QUIETLY THRIVING','🌵 SURPRISINGLY RESILIENT','🪴 NEEDS WATERING URGENTLY','🌸 BEAUTIFULLY COMPLICATED','🍃 GROWING SLOWLY BUT SURELY','🌾 SEASONAL COMPLICATIONS'],
  object:  ['✨ MAIN CHARACTER ENERGY','📦 EXTREMELY CONFIDENT','🔮 MYSTERIOUSLY FUNCTIONAL','❓ ABSOLUTELY NO IDEA','🌟 ICONIC WITHOUT EXPLANATION','🎭 HAS SEEN THINGS','⚡ UNEXPECTEDLY ELECTRIC'],
  unknown: ['❓ ABSOLUTELY NO IDEA','🫠 CONTEXT NOT FOUND','😂 THE ALGORITHM GAVE UP','✨ SOMEHOW IMPRESSIVE','🌫️ MAGNIFICENTLY UNDEFINED','🔮 BEYOND CATEGORIZATION'],
}

function getVerdict(context, scores) {
  if (context === 'human') {
    const bp = scores.breakupProbability ?? 50
    const rs = scores.relationshipStrength ?? 50
    const dp = scores.dramaPotential ?? 50
    let pool
    if (bp >= 75) pool = VERDICT_POOLS.human.imminent
    else if (rs >= 70 && bp <= 35) pool = VERDICT_POOLS.human.stable
    else if (dp >= 75 && rs >= 40) pool = VERDICT_POOLS.human.dramatic
    else pool = VERDICT_POOLS.human.complicated
    return pickRandom(pool)
  }
  const pool = VERDICT_POOLS[context] ?? VERDICT_POOLS.unknown
  return pickRandom(pool)
}

function getVerdictCategory(context, scores) {
  if (context !== 'human') return 'generic'
  const bp = scores.breakupProbability ?? 50
  const rs = scores.relationshipStrength ?? 50
  const dp = scores.dramaPotential ?? 50
  if (bp >= 75) return 'imminent'
  if (rs >= 70 && bp <= 35) return 'stable'
  if (dp >= 75 && rs >= 40) return 'dramatic'
  return 'complicated'
}

// ── CV / Profile generators ──────────────────────────────────
const CV_NAME_PREFIXES = {
  human:   ['The Emotionally Unavailable', 'The Chronically Online', 'The Dramatically Stable', 'The Questionably Functional', 'The Surprisingly Resilient'],
  animal:  ['The Extremely Fluffy', 'The Chaotically Loyal', 'The Snack-Motivated', 'The Suspiciously Innocent', 'The Professionally Napping'],
  fruit:   ['The Extremely Juicy', 'The Dangerously Sweet', 'The Chronically Ripening', 'The Suspiciously Fresh', 'The Tropically Complicated'],
  food:    ['The Suspiciously Spicy', 'The Unexpectedly Comforting', 'The Chronically Messy', 'The Well-Seasoned', 'The Dangerously Flavorful'],
  pet:     ['The Excessively Cute', 'The Professionally Chaotic', 'The Treat-Dependent', 'The Suspiciously Innocent', 'The Maximum Attention-Seeking'],
  nature:  ['The Eternally Peaceful', 'The Occasionally Volcanic', 'The Suspiciously Calm', 'The Beautifully Chaotic', 'The Seasonally Unstable'],
  vehicle: ['The Aggressively Confident', 'The Chronically Unreliable', 'The Surprisingly Fast', 'The Suspiciously Stylish', 'The Road-Trip Ready'],
  plant:   ['The Silently Thriving', 'The Dramatically Wilting', 'The Chronically Underwatered', 'The Suspiciously Hardy', 'The Beautifully Complicated'],
  object:  ['The Inexplicably Iconic', 'The Mysteriously Functional', 'The Confidently Confused', 'The Main Character', 'The Existentially Premium'],
  unknown: ['The Magnificently Undefined', 'The Impressively Mysterious', 'The Algorithm-Breaking', 'The Categorically Uncategorizable', 'The Profoundly Unknown'],
}

const CV_NAME_SUFFIXES = {
  human:   ['Situation', 'Energy', 'Era', 'Complication', 'Dynamic', 'Chapter'],
  animal:  ['Companion', 'Chaos Agent', 'Nap Expert', 'Treat Enthusiast', 'Good Boy/Girl'],
  fruit:   ['Fruit-ionship', 'Situation', 'Smoothie Candidate', 'Snack Situation', 'Bowl Resident'],
  food:    ['Meal', 'Situation', 'Comfort Zone', 'Flavor Profile', 'Main Course'],
  pet:     ['Companion', 'Chaos Unit', 'Cuddle Expert', 'Snack Seeker', 'Lap Occupant'],
  nature:  ['Landscape', 'Ecosystem', 'Situation', 'Phenomenon', 'Energy'],
  vehicle: ['Ride', 'Situation', 'Journey', 'Road Companion', 'Transport Complication'],
  plant:   ['Specimen', 'Growth Project', 'Situation', 'Green Companion', 'Photosynthesis Unit'],
  object:  ['Entity', 'Situation', 'Object of Interest', 'Presence', 'Thing'],
  unknown: ['Entity', 'Phenomenon', 'Situation', 'Mystery', 'Subject'],
}

export function generateProfile(context) {
  const content = getContent(context)
  const prefixes = CV_NAME_PREFIXES[context] ?? CV_NAME_PREFIXES.unknown
  const suffixes = CV_NAME_SUFFIXES[context] ?? CV_NAME_SUFFIXES.unknown
  return {
    name: `${pickRandom(prefixes)} ${pickRandom(suffixes)}`,
    type: pickRandom(content.cvTypes),
    status: pickRandom(content.cvStatuses),
    strengths: [...content.cvStrengths].sort(() => Math.random() - 0.5).slice(0, 3),
    weaknesses: [...content.cvWeaknesses].sort(() => Math.random() - 0.5).slice(0, 2),
    certification: 'Certified by the International Institute of Absolutely Nothing',
  }
}

// ── Main generator ───────────────────────────────────────────
export function getContextResult(context) {
  const schema = SCORE_SCHEMAS[context] ?? SCORE_SCHEMAS.unknown
  const content = getContent(context)

  // Generate raw scores
  const rawScores = {}
  schema.forEach(({ key }) => { rawScores[key] = rand(15, 96) })

  // Build metrics array
  const metrics = schema.map(({ key, label, emoji, invert }) => {
    const score = rawScores[key]
    const severityScore = invert ? (100 - score) : score
    return {
      key,
      label,
      emoji,
      score,
      severity: getSeverity(severityScore),
      joke: getJoke(key),
    }
  })

  // Overall score — weighted average of "positive" direction
  const overallRaw = schema.reduce((sum, { key, invert }) => {
    return sum + (invert ? (100 - rawScores[key]) : rawScores[key])
  }, 0) / schema.length
  const overallScore = Math.min(100, Math.max(0, Math.round(overallRaw)))

  // Main metric (first metric is the primary one per context)
  const mainMetric = metrics[0]

  const verdict = getVerdict(context, rawScores)
  const verdictCategory = getVerdictCategory(context, rawScores)

  // Weather
  const weather = pickRandom(content.weatherOptions)

  // Profile / CV
  const profile = generateProfile(context)

  // Advice
  const advice = pickRandom(content.advice)

  // Flags
  const shuffledRed   = [...content.redFlags].sort(() => Math.random() - 0.5).slice(0, 4)
  const shuffledGreen = [...content.greenFlags].sort(() => Math.random() - 0.5).slice(0, 4)

  // Funny reason (first item in advice pool)
  const funnyReason = pickRandom(content.advice)

  return {
    context,
    verdict,
    verdictCategory,
    overallScore,
    mainMetricLabel: content.mainMetricLabel,
    mainMetricValue: mainMetric?.score ?? 50,
    metrics,
    funnyReason,
    redFlags: shuffledRed,
    greenFlags: shuffledGreen,
    advice,
    weather,
    profile,
    // Human-specific fields (populated only for human context)
    breakupProbability: rawScores.breakupProbability ?? null,
    relationshipStrength: rawScores.relationshipStrength ?? null,
    whoMoreLikelyQuestions: context === 'human' ? content.whoMoreLikelyQuestions : [],
    isHuman: context === 'human',
  }
}
