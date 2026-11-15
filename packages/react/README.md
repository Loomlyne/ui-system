# @loomlyne/ui-system-react

React components for [UI System](https://github.com/Loomlyne/ui-system): `Root` (theme provider), `Logo`, primitives, frontend navs and backend app shells, all themed by one `ui.config.json`.

```sh
npm i @loomlyne/ui-system-react @loomlyne/ui-system-core
```

```tsx
import '@loomlyne/ui-system-react/ui.css';
import { Root, Button } from '@loomlyne/ui-system-react';
import config from './ui.config.json';

export default function App() {
  return <Root config={config}><Button>Save</Button></Root>;
}
```

`@loomlyne/ui-system-react/bundle` is a browser build exposing `window.UIS` (React from `window.React`). Needs React 18 or later. ESM only. Playground: https://loomlyne.github.io/ui-system/ · MIT
