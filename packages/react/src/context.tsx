import * as React from 'react';
import { buildTokens, resolveConfig, type BrandConfig, type Placement, type Tokens } from '@loomlyne/ui-system-core';

export interface UISContextValue {
  /** Every computed value for the current config (colors, radius, type, CSS variables). */
  tokens: Tokens;
  /** @deprecated Use `tokens`. */
  theme: Tokens;
  brand: BrandConfig;
}

const fallback: UISContextValue = (() => {
  const tokens = buildTokens();
  return { tokens, theme: tokens, brand: tokens.config.brand };
})();

export const UISContext = React.createContext<UISContextValue>(fallback);

export const useUIS = () => React.useContext(UISContext);

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/** Treat '', 'default' and undefined as "inherit from the theme". */
export function pick<T>(value: T | '' | 'default' | undefined | null, fallbackValue: T): T {
  return value === undefined || value === null || value === '' || value === 'default' ? fallbackValue : (value as T);
}

export function usePlacement(p?: Placement | 'default' | ''): Placement {
  const { brand } = useUIS();
  return pick(p, brand.placement);
}

export { resolveConfig };
