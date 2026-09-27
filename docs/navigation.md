# Navigation

All navs share one data shape so switching variants never means rewriting content:

```ts
type NavLink = { label: string; href?: string; icon?: IconName; active?: boolean; badge?: string | number };
type NavAction = { icon: IconName; label: string; href?: string; count?: number; dot?: boolean };
type NavCta = { label: string; href?: string; icon?: IconName; variant?: ButtonVariant };
type NavSection = { label?: string; items: NavLink[] };
```

## Frontend (websites)

```tsx
<SiteNav links={links} actions={actions} cta={cta} />   // variant from config.nav.front
<SiteNav variant="dock" … />                            // or pick one
```

| Component | Props beyond the shared ones | Notes |
| --- | --- | --- |
| `NavIsland` | `width`, `fixed` | Floating top bar with max width 1040. |
| `NavBar` | `transparent`, `sticky`, `secondary` | Full width. `transparent` = light text over a hero. |
| `NavStacked` | `utility {text, links}`, `search` | Utility strip, logo row, centered link row. |
| `NavDock` | `menu`, `open`, `panel`, `panelTitle`, `fixed`, `logoPlacement: 'dock' \| 'none'` | Bottom floating bar; explore panel opens upward; logo stays at the top. |
| `NavMinimal` | `open`, `menuLabel`, `aside` (or children) | Full-screen menu in the display face. |
| `NavMobile` | `variant: 'sheet' \| 'tabbar' \| 'floating'`, `open`, `transparent` | Phones. Tab bars take 3–5 links with icons. |

`tone="image"` makes header text light for photography (the floating shells stay readable).

Overlay navs (Island, Dock, Minimal, transparent Bar) position themselves inside the nearest positioned parent. On real pages pass `fixed` (Island, Dock) or wrap the hero in `position: relative`.

## Backend (apps)

```tsx
<AppShell variant="sidebar" sections={sections} user={user} workspace={workspace} search actions={actions}>
  <PageHeader title="Invoices" crumbs={['Workspace', 'Billing']} actions={<Button icon="plus">New invoice</Button>} />
  …page
</AppShell>
```

| Variant | Parts | Best for |
| --- | --- | --- |
| `sidebar` | `AppSidebar`: logo, workspace switcher, search, grouped links with icons and counts, user | Dashboards |
| `rail` | `AppRail`: mark, icon links with hover tooltips and unread dots, footer items, avatar | Tools that need width |
| `inset` | Sidebar on a tinted frame, content in a floating panel | Premium, calmer apps |
| `topbar` | `AppTopbar`: logo, section tabs, ⌘K search, icons, avatar | 3–6 sections |
| `dock` | Slim header + `AppDock` floating at the bottom | Canvas-style editors |

Give `AppShell` a sized parent (`height: 100vh` on real pages).

## Rules
- Mark the current page with `active: true`.
- 4–6 top-level links; more go into the dock panel, the stacked link row or the sidebar.
- One primary CTA per nav.
- Icon-only buttons always carry a `label`.
