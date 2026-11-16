// Entry for the browser bundle (window.UIS). Components plus the engine,
// so a page can also compute tokens: UIS.buildTokens(config).vars().
// THEMES / themeId are the ways of designing (ledger, atelier). The old names
// (buildTheme, PRESETS, PRESET_ALIASES, presetId) stay for older boards.
export * from './index';
export {
  buildTokens, buildTheme, resolveConfig, DEFAULT_CONFIG, RADIUS_PRESETS, FONT_PRESETS, THEMES, THEME_ALIASES, themeId,
  PRESETS, PRESET_ALIASES, presetId, KINDS, contrastReport,
  toCSS, toTailwind, toDesignTokens, allPresetFontsUrl, googleFontsUrl, contrast, scaleFrom,
} from '@loomlyne/ui-system-core';
