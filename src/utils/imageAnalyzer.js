/**
 * imageAnalyzer.js
 *
 * REAL AI — Two-tier browser-side detection:
 *  Tier 1: COCO-SSD  — accurate people / animal / vehicle / common object detection
 *  Tier 2: MobileNet — ImageNet classifier (1000 classes) for fruits, food, plants, etc.
 *
 * Images never leave the browser. Nothing is transmitted.
 */

// ── Confidence thresholds ─────────────────────────────────────
export const COCO_THRESHOLD      = 0.30   // lowered — some objects score 0.30–0.40
export const MOBILENET_THRESHOLD = 0.15   // MobileNet top-1 is usually higher; this catches edge cases
export const CONFIDENCE_THRESHOLD = COCO_THRESHOLD  // legacy alias

// ── COCO-SSD label → app context ─────────────────────────────
const COCO_TO_CONTEXT = {
  person:   'human',
  // Animals
  bird: 'animal', cat: 'animal', dog: 'animal', horse: 'animal',
  sheep: 'animal', cow: 'animal', elephant: 'animal', bear: 'animal',
  zebra: 'animal', giraffe: 'animal',
  // Fruit (COCO only knows these 3)
  banana: 'fruit', apple: 'fruit', orange: 'fruit',
  // Food
  sandwich: 'food', pizza: 'food', donut: 'food', cake: 'food',
  'hot dog': 'food', broccoli: 'food', carrot: 'food',
  // Vehicles
  bicycle: 'vehicle', car: 'vehicle', motorcycle: 'vehicle',
  airplane: 'vehicle', bus: 'vehicle', train: 'vehicle', truck: 'vehicle', boat: 'vehicle',
  // Plant
  'potted plant': 'plant',
  // Objects
  chair: 'object', couch: 'object', bed: 'object', 'dining table': 'object',
  toilet: 'object', tv: 'object', laptop: 'object', mouse: 'object',
  remote: 'object', keyboard: 'object', 'cell phone': 'object',
  microwave: 'object', oven: 'object', toaster: 'object', sink: 'object',
  refrigerator: 'object', book: 'object', clock: 'object', vase: 'object',
  scissors: 'object', 'teddy bear': 'object', 'hair drier': 'object',
  toothbrush: 'object', bottle: 'object', cup: 'object', fork: 'object',
  knife: 'object', spoon: 'object', bowl: 'object', umbrella: 'object',
  handbag: 'object', tie: 'object', suitcase: 'object', frisbee: 'object',
  skis: 'object', snowboard: 'object', 'sports ball': 'object', kite: 'object',
  'baseball bat': 'object', 'baseball glove': 'object', skateboard: 'object',
  surfboard: 'object', 'tennis racket': 'object', 'wine glass': 'object',
  'traffic light': 'object', 'fire hydrant': 'object', 'stop sign': 'object',
  'parking meter': 'object', bench: 'object', backpack: 'object',
}

// ── MobileNet / ImageNet keyword → app context ────────────────
const MOBILENET_KEYWORD_MAP = [
  // Fruits first — specific before generic
  { keywords: ['granny smith','red delicious','golden delicious'], ctx: 'fruit' },
  { keywords: ['banana','plantain'], ctx: 'fruit' },
  { keywords: ['orange','clementine','mandarine','lemon','lime','tangerine'], ctx: 'fruit' },
  { keywords: ['strawberry','raspberry','blueberry','blackberry','cranberry','gooseberry'], ctx: 'fruit' },
  { keywords: ['grape','currant'], ctx: 'fruit' },
  { keywords: ['watermelon','mango','pineapple','pomegranate','fig','jackfruit',
               'custard apple','papaya','guava','lychee','durian'], ctx: 'fruit' },
  { keywords: ['pear','quince','nectarine','plum','peach','cherry','apricot'], ctx: 'fruit' },
  { keywords: ['apple'], ctx: 'fruit' },   // kept separate — ImageNet uses "Granny Smith, apple"
  { keywords: ['fruit','berry','melon','citrus'], ctx: 'fruit' },

  // Food
  { keywords: ['pizza','burger','hamburger','cheeseburger'], ctx: 'food' },
  { keywords: ['hot dog','hotdog','corn dog'], ctx: 'food' },
  { keywords: ['sandwich','sub','wrap','panini'], ctx: 'food' },
  { keywords: ['sushi','taco','burrito','nachos','pretzel','bagel','croissant'], ctx: 'food' },
  { keywords: ['cake','cupcake','muffin','donut','doughnut','waffle','pancake','tart','pie'], ctx: 'food' },
  { keywords: ['ice cream','gelato','sundae','popsicle'], ctx: 'food' },
  { keywords: ['pasta','noodle','spaghetti','ramen','noodles'], ctx: 'food' },
  { keywords: ['broccoli','carrot','corn','cauliflower','mushroom',
               'zucchini','cucumber','cabbage','artichoke'], ctx: 'food' },
  { keywords: ['bread','loaf','baguette','toast'], ctx: 'food' },
  { keywords: ['soup','stew','curry','chili'], ctx: 'food' },
  { keywords: ['chocolate','candy','cookie','biscuit'], ctx: 'food' },
  { keywords: ['coffee','espresso','latte','tea','juice','smoothie','cocktail'], ctx: 'food' },
  { keywords: ['food','meal','dish','cuisine','snack'], ctx: 'food' },

  // Animals
  { keywords: ['labrador','retriever','poodle','terrier','bulldog','beagle',
               'husky','dalmatian','dachshund','chihuahua','german shepherd',
               'rottweiler','collie','malamute','samoyed'], ctx: 'animal' },
  { keywords: ['dog','puppy','hound','spitz','mastiff','spaniel'], ctx: 'animal' },
  { keywords: ['tabby','persian','siamese','tiger cat','egyptian cat'], ctx: 'animal' },
  { keywords: ['cat','kitten','lynx','cougar','jaguar'], ctx: 'animal' },
  { keywords: ['parrot','robin','sparrow','eagle','owl','peacock',
               'flamingo','toucan','macaw','penguin','crane','heron'], ctx: 'animal' },
  { keywords: ['bird','fowl'], ctx: 'animal' },
  { keywords: ['fish','shark','whale','dolphin','seal','sea lion',
               'jellyfish','starfish','crab','lobster','eel'], ctx: 'animal' },
  { keywords: ['snake','lizard','gecko','iguana','crocodile','alligator','turtle'], ctx: 'animal' },
  { keywords: ['rabbit','hamster','squirrel','chipmunk','guinea pig'], ctx: 'animal' },
  { keywords: ['bear','panda','koala','fox','wolf','deer','lion','tiger',
               'cheetah','leopard','elephant','giraffe','gorilla','monkey',
               'orangutan','chimp','zebra','hippo','rhino','camel','llama'], ctx: 'animal' },
  { keywords: ['animal','wildlife','mammal','reptile','amphibian'], ctx: 'animal' },
  { keywords: ['butterfly','bee','dragonfly','grasshopper','ladybug'], ctx: 'animal' },

  // Vehicles
  { keywords: ['sports car','race car','convertible','limousine','jeep',
               'suv','pickup truck','minivan'], ctx: 'vehicle' },
  { keywords: ['car','automobile','sedan','coupe','cab'], ctx: 'vehicle' },
  { keywords: ['truck','lorry','trailer','tow truck','garbage truck'], ctx: 'vehicle' },
  { keywords: ['motorcycle','moped','scooter','motorbike'], ctx: 'vehicle' },
  { keywords: ['bicycle','bike','tricycle'], ctx: 'vehicle' },
  { keywords: ['bus','trolleybus','minibus','school bus'], ctx: 'vehicle' },
  { keywords: ['airplane','aircraft','jet','airliner','helicopter','biplane','drone'], ctx: 'vehicle' },
  { keywords: ['boat','ship','yacht','canoe','kayak','submarine','ferry','sailboat'], ctx: 'vehicle' },
  { keywords: ['train','locomotive','tram','subway','cable car','monorail'], ctx: 'vehicle' },
  { keywords: ['vehicle','transport','ambulance','fire truck','police van'], ctx: 'vehicle' },

  // Plants / nature (before generic "nature" entries)
  { keywords: ['rose','daisy','sunflower','tulip','orchid','lily',
               'blossom','petal','chrysanthemum','hibiscus','carnation'], ctx: 'plant' },
  { keywords: ['flower','bouquet'], ctx: 'plant' },
  { keywords: ['oak','pine','palm','bamboo','bonsai','willow','maple','fir'], ctx: 'plant' },
  { keywords: ['tree','shrub','bush','vine','fern','cactus','succulent'], ctx: 'plant' },
  { keywords: ['plant','leaf','foliage'], ctx: 'plant' },
  { keywords: ['forest','jungle','garden'], ctx: 'nature' },
  { keywords: ['mountain','valley','waterfall','river','lake','ocean',
               'beach','desert','cliff','canyon'], ctx: 'nature' },
  { keywords: ['sky','cloud','sunset','sunrise','snow','ice','glacier'], ctx: 'nature' },
  { keywords: ['nature','landscape','scenery'], ctx: 'nature' },
]

// ── Singleton model instances ─────────────────────────────────
let cocoModel      = null
let mobilenetModel = null
let cocoPromise    = null
let mnetPromise    = null

export async function loadModel() {
  if (cocoModel) return cocoModel
  if (cocoPromise) return cocoPromise
  cocoPromise = (async () => {
    await import('@tensorflow/tfjs')
    const cocoSsd = await import('@tensorflow-models/coco-ssd')
    cocoModel = await cocoSsd.load({ base: 'mobilenet_v2' })
    console.log('[love404 AI] COCO-SSD loaded ✓')
    return cocoModel
  })()
  return cocoPromise
}

// Exported so ImageDetectionScreen can pre-warm both models
export async function loadMobileNet() {
  if (mobilenetModel) return mobilenetModel
  if (mnetPromise) return mnetPromise
  mnetPromise = (async () => {
    await import('@tensorflow/tfjs')
    const mnet = await import('@tensorflow-models/mobilenet')
    mobilenetModel = await mnet.load({ version: 2, alpha: 1.0 })
    console.log('[love404 AI] MobileNet loaded ✓')
    return mobilenetModel
  })()
  return mnetPromise
}

export function isModelLoaded() { return cocoModel !== null }

// ── MobileNet label → context ─────────────────────────────────
function mobilenetLabelToContext(label) {
  const lower = label.toLowerCase()
  for (const entry of MOBILENET_KEYWORD_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.ctx
    }
  }
  return 'object'
}

// ── Core analyzeImage ─────────────────────────────────────────
export async function analyzeImage(imgEl) {
  // ── Tier 1: COCO-SSD ────────────────────────────────────────
  const coco = await loadModel()
  const rawPredictions = await coco.detect(imgEl)

  // DEBUG — always log raw detections so we can see what the model found
  console.log('[love404 AI] RAW COCO-SSD DETECTIONS:', rawPredictions)
  console.log('[love404 AI] ALL LABELS:', rawPredictions.map(p => `${p.class} (${(p.score * 100).toFixed(1)}%)`))

  const filtered    = rawPredictions.filter(p => p.score >= COCO_THRESHOLD)
  const people      = filtered.filter(p => p.class === 'person')
  const peopleCount = people.length

  console.log('[love404 AI] PEOPLE COUNT:', peopleCount)
  console.log('[love404 AI] FILTERED (above threshold):', filtered.map(p => `${p.class} (${(p.score * 100).toFixed(1)}%)`))

  // People found — return immediately, let validation handle count
  if (peopleCount > 0) {
    const confidence = people.reduce((sum, p) => sum + p.score, 0) / people.length
    const result = {
      peopleCount,
      context: 'human',
      confidence: Math.round(confidence * 100) / 100,
      label: `${peopleCount} ${peopleCount === 1 ? 'person' : 'people'}`,
      detections: filtered,
      allContexts: ['human'],
      rawDetections: rawPredictions,
      detectionMethod: 'coco',
    }
    console.log('[love404 AI] FINAL RESULT (people found):', result.context, result.peopleCount, result.confidence)
    return result
  }

  // Non-person COCO detections — build context map
  const contextCounts = {}
  filtered.forEach(p => {
    const ctx = COCO_TO_CONTEXT[p.class] ?? 'object'
    contextCounts[ctx] = (contextCounts[ctx] ?? 0) + 1
  })

  const nonHumanContexts = Object.keys(contextCounts).filter(c => c !== 'human')
  console.log('[love404 AI] NON-HUMAN CONTEXTS (COCO):', nonHumanContexts, contextCounts)

  if (nonHumanContexts.length > 0) {
    const PRIORITY = ['animal', 'food', 'fruit', 'vehicle', 'plant', 'object']
    for (const ctx of PRIORITY) {
      if (contextCounts[ctx]) {
        const best = filtered
          .filter(p => (COCO_TO_CONTEXT[p.class] ?? 'object') === ctx)
          .sort((a, b) => b.score - a.score)[0]
        const result = {
          peopleCount: 0,
          context: ctx,
          confidence: Math.round((best?.score ?? 0) * 100) / 100,
          label: best?.class ?? ctx,
          detections: filtered,
          allContexts: nonHumanContexts,
          rawDetections: rawPredictions,
          detectionMethod: 'coco',
        }
        console.log('[love404 AI] FINAL RESULT (COCO non-human):', result.context, result.label, result.confidence)
        return result
      }
    }
  }

  // ── Tier 2: MobileNet ────────────────────────────────────────
  // COCO found nothing above threshold — use MobileNet image classifier
  console.log('[love404 AI] COCO found nothing. Trying MobileNet fallback…')
  try {
    const mnet = await loadMobileNet()
    const mnRaw = await mnet.classify(imgEl, 5)

    console.log('[love404 AI] MOBILENET RAW:', mnRaw.map(p => `${p.className} (${(p.probability * 100).toFixed(1)}%)`))

    const mnFiltered = mnRaw.filter(p => p.probability >= MOBILENET_THRESHOLD)
    console.log('[love404 AI] MOBILENET FILTERED:', mnFiltered.map(p => `${p.className} (${(p.probability * 100).toFixed(1)}%)`))

    if (mnFiltered.length > 0) {
      // Map each MobileNet prediction to a context
      const mnContextMap = {}
      mnFiltered.forEach(p => {
        const ctx = mobilenetLabelToContext(p.className)
        if (!mnContextMap[ctx] || p.probability > mnContextMap[ctx].confidence) {
          mnContextMap[ctx] = { confidence: p.probability, label: p.className }
        }
      })

      console.log('[love404 AI] MOBILENET CONTEXT MAP:', mnContextMap)

      // Pick context with highest confidence
      let bestCtx   = 'object'
      let bestConf  = 0
      let bestLabel = mnFiltered[0].className
      for (const [ctx, data] of Object.entries(mnContextMap)) {
        if (data.confidence > bestConf) {
          bestConf  = data.confidence
          bestCtx   = ctx
          bestLabel = data.label
        }
      }

      // Clean up verbose ImageNet class names
      // e.g. "Granny Smith, apple" → "Granny Smith"
      const cleanLabel = bestLabel.split(',')[0].replace(/_/g, ' ').trim()

      const result = {
        peopleCount: 0,
        context: bestCtx,
        confidence: Math.round(bestConf * 100) / 100,
        label: cleanLabel,
        detections: [],
        allContexts: [...new Set(Object.keys(mnContextMap))],
        rawDetections: rawPredictions,
        detectionMethod: 'mobilenet',
        mobilenetPredictions: mnFiltered,
      }
      console.log('[love404 AI] FINAL RESULT (MobileNet):', result.context, result.label, result.confidence)
      return result
    }
  } catch (err) {
    console.warn('[love404 AI] MobileNet failed:', err)
  }

  // ── Total fallback — use best COCO guess regardless of threshold ──
  if (rawPredictions.length > 0) {
    const best = [...rawPredictions].sort((a, b) => b.score - a.score)[0]
    const ctx  = COCO_TO_CONTEXT[best.class] ?? 'unknown'
    const result = {
      peopleCount: 0,
      context: ctx,
      confidence: Math.round(best.score * 100) / 100,
      label: best.class,
      detections: [],
      allContexts: [ctx],
      rawDetections: rawPredictions,
      detectionMethod: 'fallback',
    }
    console.log('[love404 AI] FINAL RESULT (fallback):', result.context, result.label, result.confidence)
    return result
  }

  // Nothing at all
  const unknown = {
    peopleCount: 0, context: 'unknown', confidence: 0, label: 'Unknown',
    detections: [], allContexts: ['unknown'], rawDetections: [], detectionMethod: 'none',
  }
  console.log('[love404 AI] FINAL RESULT: unknown (no detections at all)')
  return unknown
}

// ── Validation helpers ────────────────────────────────────────
export function validateCoupleImage(analysis) {
  const { peopleCount, context } = analysis

  console.log('[love404 AI] validateCoupleImage — peopleCount:', peopleCount, 'context:', context)

  if (peopleCount === 2) return { valid: true, errorType: 'none' }

  if (peopleCount === 0) {
    const routeContext = (context && context !== 'human') ? context : 'unknown'
    console.log('[love404 AI] Routing to non-human context:', routeContext)
    return { valid: true, errorType: 'none', routeToContext: routeContext }
  }

  if (peopleCount === 1) {
    return {
      valid: false,
      errorType: 'too_few',
      errorMessage: "We found only one person. A breakup prediction needs two participants. Please upload a photo containing both people.",
    }
  }

  return {
    valid: false,
    errorType: 'too_many',
    errorMessage: `We found ${peopleCount} people. This relationship has officially become a group project. Please upload a photo of just the two people.`,
  }
}

export function validateIndividualImage(analysis, personLabel = 'Person') {
  const { peopleCount } = analysis
  if (peopleCount === 1) return { valid: true, errorType: 'none' }
  if (peopleCount === 0) {
    return {
      valid: false,
      errorType: 'no_person',
      errorMessage: `${personLabel}'s photo doesn't appear to contain a person. Please upload a clear photo of one person.`,
    }
  }
  return {
    valid: false,
    errorType: 'too_many',
    errorMessage: `${personLabel}'s photo contains ${peopleCount} people. Please upload a photo of only ${personLabel}.`,
  }
}

/**
 * validateSubjectsForIndividualMode
 *
 * Context-aware validation for the "two separate subjects" upload mode.
 * Does NOT assume subjects are people. The AI decides what each subject is.
 *
 * Rules:
 *   - human  + human  → valid, context = 'human'  (each must have exactly 1 person)
 *   - fruit  + fruit  → valid, context = 'fruit'
 *   - animal + animal → valid, context = 'animal'
 *   - food   + food   → valid, context = 'food'
 *   - vehicle+vehicle → valid, context = 'vehicle'
 *   - object + object → valid, context = 'object'
 *   - X      + Y      → invalid, reason = 'context-mismatch'
 *   - unknown+ any    → invalid, reason = 'unknown-context'
 *   - human(2+)per img→ invalid, reason = 'too-many-people-in-subject'
 *   - human(0) in img → invalid, reason = 'no-person-in-human-subject'
 */
export function validateSubjectsForIndividualMode(resA, resB, labelA = 'Subject A', labelB = 'Subject B') {
  const ctxA = resA.context
  const ctxB = resB.context

  console.log('[love404 AI] validateSubjects —', labelA, ':', ctxA, '|', labelB, ':', ctxB)

  // Unknown context on either side
  if (ctxA === 'unknown' || ctxB === 'unknown') {
    const unknownLabel = ctxA === 'unknown' ? labelA : labelB
    return {
      valid: false,
      reason: 'unknown-context',
      errorType: 'unknown_context',
      errorMessage: `We couldn't identify what's in ${unknownLabel}'s photo. Try a clearer or closer image.`,
    }
  }

  // Context mismatch
  if (ctxA !== ctxB) {
    const CONTEXT_NAMES = {
      human: '👤 Human', animal: '🐾 Animal', fruit: '🍎 Fruit', food: '🍕 Food',
      pet: '🐶 Pet', nature: '🌿 Nature', vehicle: '🚗 Vehicle', plant: '🪴 Plant',
      object: '📦 Object',
    }
    return {
      valid: false,
      reason: 'context-mismatch',
      errorType: 'context_mismatch',
      contextA: ctxA,
      contextB: ctxB,
      labelA: CONTEXT_NAMES[ctxA] ?? ctxA,
      labelB: CONTEXT_NAMES[ctxB] ?? ctxB,
      errorMessage: `We found two different things: ${CONTEXT_NAMES[ctxA] ?? ctxA} and ${CONTEXT_NAMES[ctxB] ?? ctxB}. Please upload two subjects from the same category.`,
    }
  }

  // Same context — now apply context-specific sub-validation
  const ctx = ctxA

  // For humans: each image must have exactly 1 person
  if (ctx === 'human') {
    if (resA.peopleCount === 0) {
      return {
        valid: false,
        reason: 'no-person-in-human-subject',
        errorType: 'no_person',
        errorMessage: `${labelA} was detected as Human context but no person was found. Please upload a clear photo of one person.`,
      }
    }
    if (resA.peopleCount > 1) {
      return {
        valid: false,
        reason: 'too-many-people-in-subject',
        errorType: 'too_many_people',
        errorMessage: `${labelA} contains ${resA.peopleCount} people. Please upload a photo of only one person.`,
      }
    }
    if (resB.peopleCount === 0) {
      return {
        valid: false,
        reason: 'no-person-in-human-subject',
        errorType: 'no_person',
        errorMessage: `${labelB} was detected as Human context but no person was found. Please upload a clear photo of one person.`,
      }
    }
    if (resB.peopleCount > 1) {
      return {
        valid: false,
        reason: 'too-many-people-in-subject',
        errorType: 'too_many_people',
        errorMessage: `${labelB} contains ${resB.peopleCount} people. Please upload a photo of only one person.`,
      }
    }
  }

  // All other contexts just need matching — no further restrictions
  return { valid: true, context: ctx }
}

/** Emoji and display label for a context */
export function getContextEmoji(context) {
  const map = {
    human: '👥', animal: '🐾', fruit: '🍎', food: '🍕',
    pet: '🐶', nature: '🌿', vehicle: '🚗', plant: '🪴',
    object: '📦', unknown: '❓',
  }
  return map[context] ?? '🔮'
}

export function getContextDisplayLabel(context) {
  const map = {
    human: 'Human', animal: 'Animal', fruit: 'Fruit', food: 'Food',
    pet: 'Pet', nature: 'Nature', vehicle: 'Vehicle', plant: 'Plant',
    object: 'Object', unknown: 'Unknown',
  }
  return map[context] ?? context
}

/** Subject label based on detected context */
export function getSubjectLabel(context, index) {
  const prefixes = {
    human: 'Person', animal: 'Animal', fruit: 'Fruit', food: 'Food',
    pet: 'Pet', nature: 'Scene', vehicle: 'Vehicle', plant: 'Plant',
    object: 'Object', unknown: 'Subject',
  }
  const prefix = prefixes[context] ?? 'Subject'
  return `${prefix} ${index === 0 ? 'A' : 'B'}`
}
