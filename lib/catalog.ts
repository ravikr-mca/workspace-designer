export type Category =
  | "desks"
  | "chairs"
  | "monitors"
  | "tech"
  | "lighting"
  | "comfort";

export interface Product {
  id: string;
  name: string;
  category: Category;
  pricePerWeek: number;
  blurb: string;
}

export const CATEGORIES: { key: Category; label: string; pick: "one" | "many" }[] = [
  { key: "desks", label: "Desks", pick: "one" },
  { key: "chairs", label: "Chairs", pick: "one" },
  { key: "monitors", label: "Monitors", pick: "many" },
  { key: "tech", label: "Tech", pick: "many" },
  { key: "lighting", label: "Lighting", pick: "many" },
  { key: "comfort", label: "Comfort", pick: "many" },
];

export const PRODUCTS: Product[] = [
  // Desks — pick one
  {
    id: "desk-standing",
    name: "Mechanical Standing Desk",
    category: "desks",
    pricePerWeek: 4,
    blurb: "Crank it up, crank it down. Your back says thanks.",
  },
  {
    id: "desk-electric",
    name: "Electric Adjustable Desk",
    category: "desks",
    pricePerWeek: 7,
    blurb: "One-touch sit-stand with memory presets.",
  },
  {
    id: "desk-teak",
    name: "Classic Teak Desk",
    category: "desks",
    pricePerWeek: 5,
    blurb: "Warm teak, deep drawers, zero wobble.",
  },
  // Chairs — pick one
  {
    id: "chair-ergo",
    name: "Ergonomic Office Chair",
    category: "chairs",
    pricePerWeek: 6,
    blurb: "Full lumbar support for marathon deep-work days.",
  },
  {
    id: "chair-mesh",
    name: "Mesh Task Chair",
    category: "chairs",
    pricePerWeek: 4,
    blurb: "Breathable mesh, built for the tropics.",
  },
  {
    id: "chair-stool",
    name: "Balance Stool",
    category: "chairs",
    pricePerWeek: 2,
    blurb: "Active sitting that keeps your core awake.",
  },
  // Monitors
  {
    id: "mon-24",
    name: '24" Full HD Monitor',
    category: "monitors",
    pricePerWeek: 6,
    blurb: "Crisp everyday screen for docs and calls.",
  },
  {
    id: "mon-27",
    name: '27" 4K Monitor',
    category: "monitors",
    pricePerWeek: 9,
    blurb: "Pixel-perfect 4K for design and code.",
  },
  {
    id: "mon-studio",
    name: '27" Studio Display',
    category: "monitors",
    pricePerWeek: 14,
    blurb: "The dream screen. Retina everything.",
  },
  // Tech
  {
    id: "macbook",
    name: "MacBook Pro",
    category: "tech",
    pricePerWeek: 16,
    blurb: "Apple silicon, ready for anything you build.",
  },
  {
    id: "keyboard",
    name: "Mechanical Keyboard + Mouse",
    category: "tech",
    pricePerWeek: 3,
    blurb: "Thock. Enough said.",
  },
  {
    id: "headphones",
    name: "Noise-Cancelling Headphones",
    category: "tech",
    pricePerWeek: 5,
    blurb: "Silence the scooters, keep the focus.",
  },
  // Lighting
  {
    id: "desklamp",
    name: "Architect Desk Lamp",
    category: "lighting",
    pricePerWeek: 2,
    blurb: "Warm, adjustable light for late sessions.",
  },
  {
    id: "floorlamp",
    name: "Arc Floor Lamp",
    category: "lighting",
    pricePerWeek: 3,
    blurb: "A soft golden glow over the whole corner.",
  },
  // Comfort
  {
    id: "monstera",
    name: "Monstera Plant",
    category: "comfort",
    pricePerWeek: 2,
    blurb: "Big leafy energy. Thrives on neglect.",
  },
  {
    id: "deskplant",
    name: "Desk Succulent",
    category: "comfort",
    pricePerWeek: 1,
    blurb: "A tiny green coworker for your desk.",
  },
  {
    id: "rug",
    name: "Woven Jute Rug",
    category: "comfort",
    pricePerWeek: 3,
    blurb: "Ties the whole room together. Barefoot approved.",
  },
  {
    id: "mug",
    name: "Ceramic Mug Set",
    category: "comfort",
    pricePerWeek: 1,
    blurb: "For the Dubai kopi that fuels the code.",
  },
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  itemIds: string[];
}

export const BUNDLES: Bundle[] = [
  {
    id: "minimal-coder",
    name: "Minimal Coder",
    tagline: "Laptop, desk, done. Ship from day one.",
    itemIds: ["desk-standing", "chair-mesh", "macbook", "deskplant", "mug"],
  },
  {
    id: "creator-studio",
    name: "Creator Studio",
    tagline: "A screen worth filming and a chair worth staying in.",
    itemIds: [
      "desk-teak",
      "chair-ergo",
      "mon-studio",
      "macbook",
      "keyboard",
      "desklamp",
      "monstera",
      "rug",
    ],
  },
  {
    id: "full-battlestation",
    name: "Full Battlestation",
    tagline: "Every slot filled. Zero excuses.",
    itemIds: [
      "desk-electric",
      "chair-ergo",
      "mon-27",
      "mon-24",
      "macbook",
      "keyboard",
      "headphones",
      "desklamp",
      "floorlamp",
      "monstera",
      "rug",
      "mug",
    ],
  },
];
