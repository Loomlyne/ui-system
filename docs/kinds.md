# Kinds

A kind is what you build. It is picked separately from the preset (how it looks): any kind works in any preset, and a kind sets no values. It names the pages to draw first and the questions that narrow scope before design.

```json
{ "preset": "ledger", "kind": "app" }
```

`ui-system init --preset ledger --kind app` writes that and prints the pages and questions. The list lives in `packages/core/src/kinds.ts` (`KINDS`).

| kind | for | pages | ask first |
| --- | --- | --- | --- |
| `shop` | A store with products, a bag and checkout, plus the admin that runs it. | Home, Listing, Product, Bag, Checkout, Account, Admin orders | How many products and categories? Which payment and delivery options? Do customers sign in, or check out as guests? Which languages and currencies? |
| `app` | A signed-in tool for work: dashboards, records, forms and settings. | Sign in, Overview, List, Detail, Form, Settings | Does it take or track money? Who signs in? Mostly phone or desk? Which records does it hold? |
| `website` | A public site that explains and converts. | Landing, Features or services, About, Pricing, Contact | What is the one action a visitor should take? Static pages, or content that changes? Which proof exists? Which languages? |
| `booking` | Pick a time, place or service, confirm and pay; often on a phone. | Search, Results, Detail, Book, Confirmation, My bookings | What is booked? Payment now, deposit, or later? Is there a map? Phone first? |
| `portfolio` | Work, people and contact for a person or studio. | Home, Work, Case study, About, Contact | Whose work? How many projects, any videos? A private admin behind it? How do people get in touch? |

Order of work: preset questions (corners, headings, what leads the page) pick the preset; kind questions pick the page set; then the brand goes on top. On the canvas this is the **Start here** board.
