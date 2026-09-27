// Entry for the browser bundle (window.UIS). Components plus the engine,
// so a page can also compute themes: UIS.buildTheme(config).vars().
export * from './index';
export {
  buildTheme, resolveConfig, DEFAULT_CONFIG, RADIUS_PRESETS, FONT_PRESETS,
  toCSS, toTailwind, toDesignTokens, allPresetFontsUrl, googleFontsUrl, contrast, scaleFrom,
} from '@ui-system/core';
