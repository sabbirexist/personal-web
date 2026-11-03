export type ThemeName = "dark" | "light";

export interface Social {
  label: string;
  url: string;
  handle?: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export interface SiteSettings {
  name: string;
  wordmark: string;
  role: string;
  tagline: string;
  taglineAccent: string;
  intro: string;
  bio: string[];
  email: string;
  phone: string;
  location: string;
  timezone: string;
  availability: string;
  available: boolean;
  reelUrl: string;
  reelPoster: string;
  portrait: string;
  portraitSquare: string;
  socials: Social[];
  stats: Stat[];
  seo: { title: string; description: string; keywords: string[] };
  footerNote: string;
  accent: "ember" | "tangerine" | "amber" | "coral";
}

export interface ProjectResult {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  client: string;
  role: string;
  tools: string[];
  summary: string;
  body: string[];
  poster: string;
  videoUrl: string;
  previewUrl: string;
  gallery: string[];
  featured: boolean;
  size: "wide" | "half" | "tall";
  results: ProjectResult[];
  order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  image: string;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  order: number;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Content {
  site: SiteSettings;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  process: ProcessStep[];
  messages: Message[];
}
