// Registry of all AI engines. Order = display order on the dashboard.

import * as chatgpt from './chatgpt.js';
import * as claude from './claude.js';
import * as gemini from './gemini.js';
import * as perplexity from './perplexity.js';

export const ENGINES = [chatgpt, claude, gemini, perplexity];

export const ENGINE_IDS = ENGINES.map((e) => e.id);

export const ENGINE_LABELS = Object.fromEntries(ENGINES.map((e) => [e.id, e.label]));

// Only the engines whose API key is present in the environment.
export function activeEngines() {
  return ENGINES.filter((e) => e.enabled());
}
