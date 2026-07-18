import { defineConfig } from 'vite';
import { defaultViteConfig } from 'markedit-vite';
import pkg from './package.json';

// `defaultViteConfig` externalizes `markedit-api` and the CodeMirror / Lezer
// modules (they are resolved to MarkEdit's own live instances at runtime),
// builds a single CommonJS file into `dist/`, and copies it to the MarkEdit
// scripts folder so the extension is installed on every build.
//
// We additionally inject the package version as `__EXTENSION_VERSION__` so the
// self-updater can compare the running build against the latest GitHub release.
export default defineConfig({
  ...defaultViteConfig(),
  define: {
    __EXTENSION_VERSION__: JSON.stringify(pkg.version),
  },
});
