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
  },
  cooking: {
    back: '‹ Recipes',
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
  subscription: {
    title: 'Lezzet Pro',
    subtitle: 'A pro by your side in the kitchen. First week free.',
    restore: 'Restore purchases',
    subscribed: 'Your subscription is active. Enjoy!',
    loading: 'Loading…',
    purchase: 'Start',
    terms: 'Subscription renews via your store account; cancel anytime.',
  },
};
