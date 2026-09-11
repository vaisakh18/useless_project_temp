// predictionEngine.js
// 100% pseudo-random, 0% actual AI. As nature intended.

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

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
]

const METRIC_JOKES = {
  relationshipStrength: [
    "Held together with vibes and a concerning amount of hope.",
    "Structurally sound, spiritually questionable.",
    "Like a WiFi signal — strong near the router, drops in the kitchen.",
    "Stronger than expected. Still not strong enough to survive IKEA.",
  ],
  breakupProbability: [
    "Our algorithm is sweating.",
    "The exit signs are being quietly illuminated.",
    "Statistically speaking: yikes.",
    "Lower than expected. Suspiciously lower.",
  ],
  dramaPotential: [
    "This relationship has Emmy-winning potential.",
    "Reality TV producers are circling.",
    "Could be weaponized. Handle with care.",
    "Somewhere between a telenovela and a Reddit post.",
  ],
  ghostingRisk: [
    "Last seen: emotionally unavailable.",
    "Delivered. Not opened. Never mentioned again.",
    "One of them has already rehearsed the 'I need space' speech.",
    "The read receipts tell a story. A sad, sad story.",
  ],
  vibeCompatibility: [
    "The vibes are… present. Mostly.",
    "Technically compatible. Vibes-wise: jury's out.",
    "Strong vibe alignment detected. Source: trust me.",
    "Their playlists would actually slap together.",
  ],
  communicationScore: [
    "They talk. Sometimes about the actual problem.",
    "Communication is happening. Whether it's working is classified.",
    "One listens. The other waits to talk. Classic.",
    "Messages are being sent. Meanings are being lost.",
  ],
}

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const getSeverity = (score) => {
  if (score <= 30) return 'Low'
  if (score <= 60) return 'Moderate'
  if (score <= 80) return 'High'
  return 'Critical'
}

export function generatePrediction() {
  // Generate base scores with pseudo-correlation
  const vibeCompatibility = rand(20, 95)
  const communicationScore = rand(15, 90)
  const dramaPotential = rand(25, 98)
  const ghostingRisk = rand(10, 92)

  // Relationship strength boosted by vibe + communication, reduced by drama
  const rawStrength =
    vibeCompatibility * 0.4 +
    communicationScore * 0.4 -
    dramaPotential * 0.1 -
    ghostingRisk * 0.1 +
    rand(-8, 8)
  const relationshipStrength = Math.min(100, Math.max(0, Math.round(rawStrength)))

  // Breakup probability boosted by drama + ghosting, reduced by strength + vibe
  const rawBreakup =
    dramaPotential * 0.3 +
    ghostingRisk * 0.35 -
    relationshipStrength * 0.25 -
    vibeCompatibility * 0.15 +
    rand(-10, 10) +
    20
  const breakupProbability = Math.min(100, Math.max(0, Math.round(rawBreakup)))

  // Determine primary verdict
  let verdict
  if (breakupProbability >= 75) {
    verdict = '💀 BREAKUP IMMINENT'
  } else if (relationshipStrength >= 70 && breakupProbability <= 35) {
    verdict = '❤️ SURPRISINGLY STABLE'
  } else if (dramaPotential >= 75 && relationshipStrength >= 40) {
    verdict = '😂 TOGETHER UNTIL THE NEXT ARGUMENT'
  } else {
    verdict = '🫠 IT\'S COMPLICATED'
  }

  const metrics = [
    {
      key: 'relationshipStrength',
      label: 'Relationship Strength',
      emoji: '❤️',
      score: relationshipStrength,
      severity: getSeverity(100 - relationshipStrength), // inverse — low strength is bad
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
      severity: getSeverity(100 - vibeCompatibility), // inverse — low vibe is bad
      joke: pickRandom(METRIC_JOKES.vibeCompatibility),
    },
    {
      key: 'communicationScore',
      label: 'Communication Score',
      emoji: '💬',
      score: communicationScore,
      severity: getSeverity(100 - communicationScore), // inverse — low comms is bad
      joke: pickRandom(METRIC_JOKES.communicationScore),
    },
  ]

  return {
    verdict,
    metrics,
    funnyReason: pickRandom(FUNNY_REASONS),
    breakupProbability,
    relationshipStrength,
  }
}
