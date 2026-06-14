/**
 * English user-facing strings. Must match the TR key set exactly (TranslationTree
 * enforces this at compile time). Tone: short, warm, friendly.
 */
import type { TranslationTree } from './tr';

export const en: TranslationTree = {
  app: {
    name: 'Lezzet',
  },
  picker: {
    title: 'What should I cook?',
    subtitle: 'What are you in the mood for today?',
    random: '🎲 Surprise me',
    minutes: 'min',
    servings: 'servings',
    search: 'Search recipes…',
    all: 'All',
    favorites: '★ Favorites',
    shopping: '🛒 Shopping list',
    pantry: '🧺 What can I make?',
    recent: 'Recently cooked',
    times: '×',
    noResults: 'No results.',
    categories: {
      kahvalti: 'Breakfast',
      corba: 'Soup',
      'ana-yemek': 'Main',
      salata: 'Salad',
      pilav: 'Pilaf',
    },
  },
  cooking: {
    back: '‹ Recipes',
    ingredients: 'Ingredients',
    addToShopping: '🛒 Add to shopping list',
    added: 'Added to list ✓',
    notes: 'Your notes',
    notesPlaceholder: 'Add a note to this recipe… (e.g. less salt)',
    ready: 'Ready steps',
    active: 'Now',
    done: 'Done',
    start: 'Start',
    complete: 'Done, next',
    skip: 'Skip',
    retry: 'Try again',
    listen: 'Hold to talk',
    listening: 'Listening…',
    check: 'Check the pot',
    capture: 'Capture',
    close: 'Close',
    permissionNeeded: 'Permission required.',
    progress: 'Progress',
    finished: 'Your meal is ready — enjoy!',
    nothingReady: 'No ready step right now.',
    remaining: 'left',
  },
  safety: {
    cannotSkip: 'This step cannot be skipped for safety reasons.',
    title: 'Safety note',
  },
  intent: {
    unknown: "Sorry, I didn't catch that — say it again?",
  },
  voice: {
    secondsLeft: 'seconds left',
    noTimer: 'Nothing on a timer right now.',
    checkPrompt: 'Point the phone at the pot — taking a photo now.',
    recoveryDefault: "Don't worry, we've got this. Lower the heat and tell me what's up.",
  },
  notify: {
    timerDone: "Time's up!",
  },
  subscription: {
    title: 'Lezzet Pro',
    subtitle: 'A pro by your side in the kitchen. First week free.',
    restore: 'Restore purchases',
    subscribed: 'Your subscription is active. Enjoy!',
    loading: 'Loading…',
    purchase: 'Start',
    terms: 'Subscription renews via your store account; cancel anytime.',
  },
  shopping: {
    title: 'Shopping List',
    empty: 'List is empty. You can add a recipe’s ingredients.',
    clearChecked: 'Clear bought',
    clearAll: 'Clear list',
  },
  pantry: {
    title: 'What Can I Make?',
    subtitle: 'Tick what you have and I’ll tell you what you can cook.',
    pickIngredients: 'Ingredients',
    canMake: 'You can make',
    none: 'Pick a few ingredients first.',
    ofTotal: 'ingredients',
  },
};
