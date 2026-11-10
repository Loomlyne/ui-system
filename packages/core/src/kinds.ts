import type { KindId } from './config';

/**
 * What you build, picked separately from the preset. A kind sets no values: it names the page
 * set to draw and the questions that narrow scope before design. Any kind works in any preset.
 */
export interface Kind {
  id: KindId;
  label: string;
  note: string;
  /** Pages to design first, in order. */
  pages: string[];
  /** Questions to answer before designing. */
  questions: string[];
}

export const KINDS: Record<KindId, Kind> = {
  shop: {
    id: 'shop',
    label: 'Shop',
    note: 'A store with products, a bag and checkout, plus the admin that runs it.',
    pages: ['Home', 'Listing', 'Product', 'Bag', 'Checkout', 'Account', 'Admin orders'],
    questions: ['How many products and categories?', 'Which payment and delivery options?', 'Do customers sign in, or check out as guests?', 'Which languages and currencies?'],
  },
  app: {
    id: 'app',
    label: 'App',
    note: 'A signed-in tool for work: dashboards, records, forms and settings.',
    pages: ['Sign in', 'Overview', 'List', 'Detail', 'Form', 'Settings'],
    questions: ['Does it take or track money?', 'Who signs in (staff, customers, both)?', 'Mostly phone or desk?', 'Which records does it hold (invoices, clients, orders)?'],
  },
  website: {
    id: 'website',
    label: 'Website',
    note: 'A public site that explains and converts: landing, about, contact.',
    pages: ['Landing', 'Features or services', 'About', 'Pricing', 'Contact'],
    questions: ['What is the one action a visitor should take?', 'Static pages, or content that changes (blog, CMS)?', 'Which proof exists (clients, numbers, quotes)?', 'Which languages?'],
  },
  booking: {
    id: 'booking',
    label: 'Booking',
    note: 'Pick a time, place or service, confirm and pay; often on a phone.',
    pages: ['Search', 'Results', 'Detail', 'Book', 'Confirmation', 'My bookings'],
    questions: ['What is booked (ride, stay, slot)?', 'Is payment taken now, as a deposit, or later?', 'Is there a map?', 'Phone first?'],
  },
  portfolio: {
    id: 'portfolio',
    label: 'Portfolio',
    note: 'Work, people and contact for a person or studio.',
    pages: ['Home', 'Work', 'Case study', 'About', 'Contact'],
    questions: ['Whose work (person, studio, talent)?', 'How many projects, and are there videos?', 'Is there a private admin behind it?', 'How do people get in touch?'],
  },
};
