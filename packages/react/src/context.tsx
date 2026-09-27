import * as React from 'react';
import { buildTheme, resolveConfig, type BrandConfig, type Placement, type Theme } from '@ui-system/core';

export interface UISContextValue {
  theme: Theme;
  brand: BrandConfig;
}

const fallback: UISContextValue = (() => {
  const theme = buildTheme();
  return { theme, brand: theme.config.brand };
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
