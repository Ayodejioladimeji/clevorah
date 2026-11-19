export type PageType = "best-of" | "versus" | "use-case";

export type Audience =
  | "small-business"
  | "freelancers"
  | "nigerian-business"
  | "worldwide";

export type Status = "draft" | "published";

export type Criterion = {
  label: string;
  favorite: string;
  alternative: string;
};

export type Answer = {
  question: string;
  answer: string;
};

export type Brand = {
  id: string;
  name: string;
  topicSlug: string;
  network: string;
  signupUrl: string;
  affiliateUrl: string;
  subIdParam: string;
  countryNote: string;
  paused: boolean;
};

export type Comparison = {
  id: string;
  pageType: PageType;
  clusterSlug: string;
  topicSlug: string;
  audience: Audience;
  title: string;
  slug: string;
  previousSlugs: string[];
  verdict: string;
  favoriteBrandId: string;
  alternativeBrandId: string;
  whyFavorite: string;
  whenAlternative: string;
  skipFavorite: string;
  skipAlternative: string;
  criteria: Criterion[];
  answers: Answer[];
  seoTitle: string;
  metaDescription: string;
  originalDate: string | null;
  reviewDate: string | null;
  firstHandNote: string;
  status: Status;
  searchQuery: string;
};

export type Topic = {
  slug: string;
  clusterSlug: string;
  title: string;
  description: string;
};

export type Cluster = {
  slug: string;
  title: string;
  description: string;
};

export type Author = {
  name: string;
  bio: string;
  profileUrl: string;
};

export type SiteSettings = {
  homeIntro: string;
  launchIntro: string;
  growIntro: string;
  disclosure: string;
  aboutBody: string;
  contactIntro: string;
  disclosureBody: string;
  privacyBody: string;
  navLaunch: string;
  navGrow: string;
  navAbout: string;
  navContact: string;
};

export type Click = {
  id: string;
  pageSlug: string;
  brandId: string;
  role: "favorite" | "alternative";
  at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  sourcePage: string;
  status: "pending" | "confirmed" | "unsubscribed";
  token: string;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type SlugRedirect = {
  from: string;
  to: string;
};

export type Store = {
  settings: SiteSettings;
  author: Author;
  clusters: Cluster[];
  topics: Topic[];
  comparisons: Comparison[];
  brands: Brand[];
  clicks: Click[];
  subscribers: Subscriber[];
  messages: ContactMessage[];
  redirects: SlugRedirect[];
};

export const DISCLOSURE =
  "Clevorah may earn a commission if you buy through a link on this page.";

export const AUDIENCE_LABEL: Record<Audience, string> = {
  "small-business": "Small business",
  freelancers: "Freelancers",
  "nigerian-business": "Nigerian business",
  worldwide: "Readers anywhere",
};

export const PAGE_TYPE_LABEL: Record<PageType, string> = {
  "best-of": "Best of",
  versus: "Versus",
  "use-case": "Use case",
};
