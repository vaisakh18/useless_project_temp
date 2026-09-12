// predictionEngine.js
// 100% pseudo-random, 0% actual AI. As nature intended.

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ── Verdict pools — multiple phrasings per category ──────────
// Each run picks one randomly, so the verdict never feels the same.
const VERDICT_POOLS = {
  imminent: [
    '💀 BREAKUP IMMINENT',
    '💀 THIS IS NOT LOOKING GOOD',
    '🚨 EXIT SIGNS ARE LIT',
    '📦 START PACKING YOUR FEELINGS',
    '💀 OUR ALGORITHM IS CONCERNED',
    '🪦 RELATIONSHIP STATUS: CRITICAL',
    '🚪 SOMEONE IS MENTALLY ALREADY GONE',
  ],
  stable: [
    '❤️ SURPRISINGLY STABLE',
    '💚 AGAINST ALL ODDS: THRIVING',
    '✅ CERTIFIED NOT A DISASTER',
    '❤️ OUR ALGORITHM IS IMPRESSED',
    '🏆 RELATIONSHIP GOALS (APPARENTLY)',
    '💪 DEFYING THE STATISTICS',
    '😌 HEALTHY. DISTURBING, BUT HEALTHY.',
  ],
  dramatic: [
    '😂 TOGETHER UNTIL THE NEXT ARGUMENT',
    '🎭 CHAOTIC BUT COMMITTED',
    '🔥 VOLATILE. PASSIONATE. EXHAUSTING.',
    '😂 HELD TOGETHER BY SPITE AND LOVE',
    '🎢 RELATIONSHIP STATUS: ROLLERCOASTER',
    '😤 THEY FIGHT, THEY MAKE UP, REPEAT FOREVER',
    '🌪️ CONTROLLED CHAOS. EMPHASIS ON CHAOS.',
  ],
  complicated: [
    "🫠 IT'S COMPLICATED",
    '🤷 UNCLEAR. LIKE THEIR RELATIONSHIP.',
    '😐 OUR ALGORITHM IS ALSO CONFUSED',
    '🌫️ UNDEFINED AND UNHINGED',
    '🫣 WE HAVE QUESTIONS. SO DO THEY.',
    '📊 DATA INCONCLUSIVE. FEELINGS: MESSY.',
    "🤔 NEITHER TOGETHER NOR NOT. IT'S A THING.",
  ],
}

const FUNNY_REASONS = [
  "One of them definitely says 'I'm fine' when they are absolutely not fine.",
  "Their communication protocol is 90% unhinged TikToks and 10% passive-aggressive memes.",
  "Survives solely because neither wants to find a new apartment.",
  "They share a Netflix password. That's the only thing holding this together.",
  "One leaves read receipts on. The other calls this 'emotional warfare'.",
  "They have argued about the thermostat setting at least 47 times this year.",
  "Their love language is sending each other mildly concerning tweets at 2am.",
  "At least one party still hasn't introduced the other to their parents after 2 years.",
  "The relationship is being held together by a shared Spotify playlist and mutual denial.",
  "One of them still has their ex saved as 'Do Not Answer' in their contacts.",
  "They've had the exact same argument 6 times in different fonts.",
  "Compatible on paper. Incompatible near a dishwasher loading situation.",
  "One is a morning person. The other is a felony waiting to happen before coffee.",
  "Their idea of 'date night' is watching true crime and arguing about who the killer is.",
  "Fundamentally divided on whether a hot dog is a sandwich. This will not end well.",
  "At least one of them is still orbiting an ex on Instagram. For 'research'.",
  "They agreed on a restaurant once. In 2021. It closed.",
  "Relationship is currently held together by a running inside joke neither can explain.",
  "Someone in this photo has definitely cried in a car alone this month.",
  "The love is real. The communication is a work in progress. A very long project.",
]

const METRIC_JOKES = {
  relationshipStrength: [
    "Held together with vibes and a concerning amount of hope.",
    "Structurally sound, spiritually questionable.",
    "Like a WiFi signal — strong near the router, drops in the kitchen.",
    "Stronger than expected. Still not strong enough to survive IKEA.",
    "Certified load-bearing relationship. Do not remove.",
    "Fragile. Handle with compliments.",
  ],
  breakupProbability: [
    "Our algorithm is sweating.",
    "The exit signs are being quietly illuminated.",
    "Statistically speaking: yikes.",
    "Lower than expected. Suspiciously lower.",
    "We've seen worse. Not often, but we've seen worse.",
    "The data says run. The heart says maybe not yet.",
  ],
  dramaPotential: [
    "This relationship has Emmy-winning potential.",
    "Reality TV producers are circling.",
    "Could be weaponized. Handle with care.",
    "Somewhere between a telenovela and a Reddit post.",
    "High drama. High reward. High therapy bills.",
    "Someone in this photo has a 'we need to talk' drafted and unsent.",
  ],
  ghostingRisk: [
    "Last seen: emotionally unavailable.",
    "Delivered. Not opened. Never mentioned again.",
    "One of them has already rehearsed the 'I need space' speech.",
    "The read receipts tell a story. A sad, sad story.",
    "Disappearing act probability: elevated.",
    "If they ghost you, at least the silence will be consistent.",
  ],
  vibeCompatibility: [
    "The vibes are… present. Mostly.",
    "Technically compatible. Vibes-wise: jury's out.",
    "Strong vibe alignment detected. Source: trust me.",
    "Their playlists would actually slap together.",
    "Vibe check: passed. Barely.",
    "Same energy, different frequencies.",
  ],
  communicationScore: [
    "They talk. Sometimes about the actual problem.",
    "Communication is happening. Whether it's working is classified.",
    "One listens. The other waits to talk. Classic.",
    "Messages are being sent. Meanings are being lost.",
    "Healthy dialogue detected. 1 out of 7 days.",
    "They communicate mostly via sighs and loaded silences.",
  ],
}

const getSeverity = (score) => {
  if (score <= 30) return 'Low'
  if (score <= 60) return 'Moderate'
  if (score <= 80) return 'High'
  return 'Critical'
}

export function generatePrediction() {
  // ── Raw metric scores ──────────────────────────────────────
  const vibeCompatibility  = rand(20, 95)
  const communicationScore = rand(15, 90)
  const dramaPotential     = rand(25, 98)
  const ghostingRisk       = rand(10, 92)

  // Relationship strength: boosted by vibe + comms, reduced by drama + ghosting
  const rawStrength =
    vibeCompatibility  * 0.4 +
    communicationScore * 0.4 -
    dramaPotential     * 0.1 -
    ghostingRisk       * 0.1 +
    rand(-8, 8)
  const relationshipStrength = Math.min(100, Math.max(0, Math.round(rawStrength)))

  // Breakup probability: boosted by drama + ghosting, reduced by strength + vibe
  const rawBreakup =
    dramaPotential     * 0.3  +
    ghostingRisk       * 0.35 -
    relationshipStrength * 0.25 -
    vibeCompatibility  * 0.15 +
    rand(-10, 10) + 20
  const breakupProbability = Math.min(100, Math.max(0, Math.round(rawBreakup)))

  // ── Overall Relationship Score (0–100, higher = healthier) ─
  // Weighted composite: strength + vibe + comms help; drama + ghosting + breakup hurt
  const rawOverall =
    relationshipStrength * 0.30 +
    vibeCompatibility    * 0.20 +
    communicationScore   * 0.20 -
    breakupProbability   * 0.15 -
    dramaPotential       * 0.10 -
    ghostingRisk         * 0.05 +
    50  // offset so mid-range scores land around 50
  const overallScore = Math.min(100, Math.max(0, Math.round(rawOverall)))

  // ── Verdict — pick a random phrasing from the right pool ──
  let verdictPool
  if (breakupProbability >= 75) {
    verdictPool = VERDICT_POOLS.imminent
  } else if (relationshipStrength >= 70 && breakupProbability <= 35) {
    verdictPool = VERDICT_POOLS.stable
  } else if (dramaPotential >= 75 && relationshipStrength >= 40) {
    verdictPool = VERDICT_POOLS.dramatic
  } else {
    verdictPool = VERDICT_POOLS.complicated
  }
  const verdict = pickRandom(verdictPool)

  // ── Verdict category (used for styling) ───────────────────
  const verdictCategory =
    breakupProbability >= 75                              ? 'imminent'   :
    relationshipStrength >= 70 && breakupProbability <= 35 ? 'stable'    :
    dramaPotential >= 75 && relationshipStrength >= 40    ? 'dramatic'   :
    'complicated'

  const metrics = [
    {
      key: 'relationshipStrength',
      label: 'Relationship Strength',
      emoji: '❤️',
      score: relationshipStrength,
      severity: getSeverity(100 - relationshipStrength),
      joke: pickRandom(METRIC_JOKES.relationshipStrength),
    },
    {
      key: 'breakupProbability',
      label: 'Breakup Probability',
      emoji: '💔',
      score: breakupProbability,
      severity: getSeverity(breakupProbability),
      joke: pickRandom(METRIC_JOKES.breakupProbability),
    },
    {
      key: 'dramaPotential',
      label: 'Drama Potential',
      emoji: '🎭',
      score: dramaPotential,
      severity: getSeverity(dramaPotential),
      joke: pickRandom(METRIC_JOKES.dramaPotential),
    },
    {
      key: 'ghostingRisk',
      label: 'Ghosting Risk',
      emoji: '👻',
      score: ghostingRisk,
      severity: getSeverity(ghostingRisk),
      joke: pickRandom(METRIC_JOKES.ghostingRisk),
    },
    {
      key: 'vibeCompatibility',
      label: 'Vibe Compatibility',
      emoji: '✨',
      score: vibeCompatibility,
      severity: getSeverity(100 - vibeCompatibility),
      joke: pickRandom(METRIC_JOKES.vibeCompatibility),
    },
    {
      key: 'communicationScore',
      label: 'Communication Score',
      emoji: '💬',
      score: communicationScore,
      severity: getSeverity(100 - communicationScore),
      joke: pickRandom(METRIC_JOKES.communicationScore),
    },
  ]

  return {
    verdict,
    verdictCategory,
    overallScore,
    metrics,
    funnyReason: pickRandom(FUNNY_REASONS),
    breakupProbability,
    relationshipStrength,
  }
}
