# ALMAR audit (scripts/uis-rtl-audit.mjs, branch gsd/phase-19-02-rtl-defects), run on this tree

## Before (0.3.2, sha256 4b3ca979…6236)
```
packages/core/styles/ui.css
53 physical-side declarations (49 defect, 4 intentional)
  79  defect      side       .uis-count                                                             right: 1px
  80  defect      side       .uis-dot                                                               right: 6px
 103  defect      side       .uis-control > .uis-icon                                               left: 14px
 104  defect      side       .uis-control > .uis-kbd                                                right: 10px
 114  defect      side       .uis-control--icon .uis-input                                          padding-left: 42px
 115  defect      side       .uis-control--kbd .uis-input                                           padding-right: 52px
 117  intentional side       .uis-control--reveal .uis-input                                        padding-right: 48px
 118  intentional side       .uis-reveal                                                            right: 4px
 124  intentional side       .uis-control--reveal > .uis-kbd                                        right: 48px
 125  intentional side       .uis-control--reveal.uis-control--kbd .uis-input                       padding-right: 92px
 130  defect      side       .uis-select                                                            padding-right: 42px
 131  defect      side       .uis-control > .uis-select + .uis-icon                                 left: auto
 131  defect      side       .uis-control > .uis-select + .uis-icon                                 right: 14px
 164  defect      side       .uis-switch__thumb                                                     left: 3px
 166  defect      translateX .uis-switch input:checked + .uis-switch__track .uis-switch__thumb      transform: translateX(18px)
 211  defect      side       .uis-avatars .uis-avatar + .uis-avatar                                 margin-left: -8px
 216  defect      translateX @keyframes uis-slide                                                   transform: translateX(…)
 224  defect      side       .uis-menu__item .uis-kbd                                               margin-left: auto
 229  defect      side       .uis-drawer                                                            right: 0
 229  defect      side       .uis-drawer                                                            border-left: 1px solid var(--uis-line)
 230  defect      side       .uis-drawer--floating                                                  right: 12px
 231  defect      side       .uis-drawer--left                                                      right: auto
 231  defect      side       .uis-drawer--left                                                      left: 0
 231  defect      side       .uis-drawer--left                                                      border-left: 0
 231  defect      side       .uis-drawer--left                                                      border-right: 1px solid var(--uis-line)
 232  defect      shorthand  .uis-drawer__head                                                      padding: 20px 20px 16px 24px
 239  defect      shorthand  .uis-toast                                                             padding: 14px 14px 14px 16px
 260  defect      text-align .uis-table th                                                          text-align: left
 318  defect      shorthand  .uis-island                                                            padding: 6px 6px 6px 18px
 327  defect      shorthand  .uis-bar__brand                                                        padding: 0 10px 0 8px
 353  defect      row-reverse .uis-minimal[data-placement="right"]                                   flex-direction: row-reverse
 355  defect      shorthand  .uis-menubtn                                                           padding: 0 18px 0 14px
 363  defect      side       .uis-overlaymenu__links a .uis-icon                                    margin-left: auto
 363  defect      translateX .uis-overlaymenu__links a .uis-icon                                    transform: translate(-8px, 8px)
 375  defect      shorthand  .uis-overlaymenu--drawer                                               inset: 12px 12px 12px auto
 390  defect      shorthand  .uis-capsule__menu                                                     padding: 0 14px 0 10px
 396  defect      shorthand  .uis-mbar                                                              padding: 0 12px 0 16px
 420  defect      shorthand  .uis-app--inset                                                        padding: 10px 10px 10px 0
 428  defect      side       .uis-sidebar                                                           border-right: 1px solid var(--uis-line)
 429  defect      side       .uis-app--inset .uis-sidebar                                           border-right: 0
 432  defect      row-reverse .uis-sidebar__head[data-placement="right"]                             flex-direction: row-reverse
 433  defect      text-align .uis-workspace                                                         text-align: left
 447  defect      side       .uis-navitem__badge                                                    margin-left: auto
 450  defect      text-align .uis-account                                                           text-align: left
 456  defect      side       .uis-rail                                                              border-right: 1px solid var(--uis-line)
 465  defect      side       .uis-railitem > .uis-tooltip                                           left: calc(100% + 12px)
 468  defect      side       .uis-railitem > .uis-dot                                               right: 8px
 470  defect      shorthand  .uis-topbar                                                            padding: 0 20px 0 24px
 472  defect      side       .uis-topbar__end                                                       margin-left: auto
 473  defect      side       .uis-topbar__search                                                    margin-right: 6px
 476  defect      side       .uis-topbar[data-placement="center"] > :nth-child(3)                   margin-left: 0
 481  defect      shorthand  .uis-appdock__search                                                   padding: 0 10px 0 14px
 482  defect      side       .uis-appdock__search .uis-kbd                                          margin-left: auto
```

## After
```
packages/core/styles/ui.css
8 physical-side declarations (2 defect, 6 intentional)
 126  intentional side       .uis-control--reveal .uis-input                                        padding-right: 48px
 127  intentional side       .uis-control--reveal.uis-control--icon .uis-input                      padding-left: 42px
 128  intentional side       .uis-control--reveal > .uis-icon                                       left: 14px
 129  intentional side       .uis-reveal                                                            right: 4px
 135  intentional side       .uis-control--reveal > .uis-kbd                                        right: 48px
 136  intentional side       .uis-control--reveal.uis-control--kbd .uis-input                       padding-right: 92px
 371  defect      row-reverse .uis-minimal[data-placement="right"]                                   flex-direction: row-reverse
 451  defect      row-reverse .uis-sidebar__head[data-placement="right"]                             flex-direction: row-reverse
```

## UI System's own audit (packages/core/test/rtl-audit.mjs), after
```
/Users/koss/.t3/worktrees/ui-system/fix-rtl-logical-propert-6bff6c6507567979/packages/core/styles/ui.css
8 physical-side declarations: 0 without an RTL path, 8 allowed
 126  allowed  side        .uis-control--reveal .uis-input                                  padding-right: 48px
 127  allowed  side        .uis-control--reveal.uis-control--icon .uis-input                padding-left: 42px
 128  allowed  side        .uis-control--reveal > .uis-icon                                 left: 14px
 129  allowed  side        .uis-reveal                                                      right: 4px
 135  allowed  side        .uis-control--reveal > .uis-kbd                                  right: 48px
 136  allowed  side        .uis-control--reveal.uis-control--kbd .uis-input                 padding-right: 92px
 371  allowed  row-reverse .uis-minimal[data-placement="right"]                             flex-direction: row-reverse
 451  allowed  row-reverse .uis-sidebar__head[data-placement="right"]                       flex-direction: row-reverse
```
