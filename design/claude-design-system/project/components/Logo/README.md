# Logo

The brand logo in four arrangements: `lockup` (mark + wordmark), `stacked`, `mark` and `wordmark`.

Without props it renders the brand set on Root. The generated marks (monogram, ring, spark, stack, orbit) follow the system: the monogram's corners track `roundness`, and `markTone` decides whether the mark follows the text color (`current`, knocks the letter out so it works on any background) or the brand `primary`.

**Props:** `variant`, `size` sm|md|lg|xl, `wordmark`, `caption` ('' hides it), `mark`, `initials`, `tone`, `src` (full logo image, replaces the lockup), `markSrc` (mark-only image), `href`.

**Custom logos:** upload the client's SVG/PNG and pass it as `logoSrc` (full logo) and `markSrc` (mark) on Root; rails, docks and favicons use the mark.

**Clear space:** keep at least the mark's height clear on every side. **Minimum size:** mark 20px, lockup 96px wide. Use `stacked` only on splash screens, covers and footers, never inside a nav bar.
