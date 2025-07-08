import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Add proper crypto polyfill
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = { env: {} };
}