import { defineConfig } from 'vite';
import { defaultViteConfig } from 'markedit-vite';

// `defaultViteConfig` externalizes `markedit-api` and the CodeMirror / Lezer
// modules (they are resolved to MarkEdit's own live instances at runtime),
// builds a single CommonJS file into `dist/`, and copies it to the MarkEdit
// scripts folder so the extension is installed on every build.
export default defineConfig(defaultViteConfig());
