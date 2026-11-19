import type { Brand, Comparison, Store, Topic } from "./types";
import { DISCLOSURE } from "./types";

const note = "Confirm this program accepts a Nigerian publisher before applying.";

function brand(
  id: string,
  name: string,
  topicSlug: string,
  network: string,
): Brand {
  return {
    id,
    name,
    topicSlug,
    network,
    signupUrl: "",
    affiliateUrl: "",
    subIdParam: "",
    countryNote: note,
    paused: false,
  };
}

const brands: Brand[] = [
  brand("namecheap", "Namecheap", "domains", "Direct"),
  brand("godaddy", "GoDaddy", "domains", "Impact"),
  brand("whogohost", "WhoGoHost", "domains", "Direct"),
  brand("hostinger", "Hostinger", "hosting", "Direct"),
  brand("bluehost", "Bluehost", "hosting", "Impact"),
  brand("siteground", "SiteGround", "hosting", "Impact"),
  brand("cloudways", "Cloudways", "hosting", "Impact"),
  brand("wix", "Wix", "site-builders", "Impact"),
  brand("shopify", "Shopify", "site-builders", "Impact"),
  brand("systeme", "Systeme.io", "site-builders", "Direct"),
  brand("zoho", "Zoho Mail", "business-email", "Direct"),
  brand("google-workspace", "Google Workspace", "business-email", "Direct"),
  brand("stripe", "Stripe", "getting-paid", ""),
  brand("paypal", "PayPal", "getting-paid", ""),
  brand("paystack", "Paystack", "getting-paid", ""),
  brand("flutterwave", "Flutterwave", "getting-paid", ""),
  brand("udemy", "Udemy", "courses", "Impact"),
  brand("coursera", "Coursera", "courses", "Impact"),
  brand("selar", "Selar", "courses", "Direct"),
];

type Draft = {
  topicSlug: string;
  pageType: Comparison["pageType"];
  audience: Comparison["audience"];
  title: string;
  slug: string;
  favorite: string;
  alternative: string;
  searchQuery: string;
};

const drafts: Draft[] = [
  { topicSlug: "domains", pageType: "best-of", audience: "small-business", title: "Best domain registrars for a new business", slug: "best-domain-registrars", favorite: "namecheap", alternative: "godaddy", searchQuery: "best domain registrar for a new business" },
  { topicSlug: "domains", pageType: "versus", audience: "worldwide", title: "Namecheap vs GoDaddy", slug: "namecheap-vs-godaddy", favorite: "namecheap", alternative: "godaddy", searchQuery: "namecheap vs godaddy" },
  { topicSlug: "domains", pageType: "use-case", audience: "small-business", title: "How to connect a domain to your site", slug: "connect-a-domain", favorite: "namecheap", alternative: "godaddy", searchQuery: "how to connect a domain to a website" },
  { topicSlug: "domains", pageType: "versus", audience: "nigerian-business", title: ".com vs .ng for a Nigerian business", slug: "com-vs-ng", favorite: "namecheap", alternative: "whogohost", searchQuery: ".com vs .ng domain" },
  { topicSlug: "hosting", pageType: "best-of", audience: "small-business", title: "Best web hosting for a small business", slug: "best-web-hosting", favorite: "hostinger", alternative: "bluehost", searchQuery: "best web hosting for small business" },
  { topicSlug: "hosting", pageType: "best-of", audience: "small-business", title: "Best WordPress hosting", slug: "best-wordpress-hosting", favorite: "siteground", alternative: "cloudways", searchQuery: "best wordpress hosting" },
  { topicSlug: "hosting", pageType: "versus", audience: "worldwide", title: "Hostinger vs Bluehost", slug: "hostinger-vs-bluehost", favorite: "hostinger", alternative: "bluehost", searchQuery: "hostinger vs bluehost" },
  { topicSlug: "hosting", pageType: "best-of", audience: "nigerian-business", title: "Best hosting for a Nigerian business", slug: "best-hosting-nigeria", favorite: "whogohost", alternative: "hostinger", searchQuery: "best web hosting in nigeria" },
  { topicSlug: "site-builders", pageType: "use-case", audience: "small-business", title: "Turn your ideas into a page", slug: "turn-ideas-into-a-page", favorite: "wix", alternative: "shopify", searchQuery: "turn an idea into a website" },
  { topicSlug: "site-builders", pageType: "best-of", audience: "small-business", title: "Best website builders for small business", slug: "best-website-builders", favorite: "wix", alternative: "shopify", searchQuery: "best website builder for small business" },
  { topicSlug: "site-builders", pageType: "best-of", audience: "nigerian-business", title: "Best ecommerce platforms for Nigerian business", slug: "best-ecommerce-nigeria", favorite: "shopify", alternative: "systeme", searchQuery: "best ecommerce platform for nigerian business" },
  { topicSlug: "site-builders", pageType: "versus", audience: "small-business", title: "Shopify vs Wix", slug: "shopify-vs-wix", favorite: "shopify", alternative: "wix", searchQuery: "shopify vs wix" },
  { topicSlug: "business-email", pageType: "best-of", audience: "small-business", title: "Best business email for a small company", slug: "best-business-email", favorite: "zoho", alternative: "google-workspace", searchQuery: "best business email for small business" },
  { topicSlug: "business-email", pageType: "versus", audience: "worldwide", title: "Google Workspace vs Zoho Mail", slug: "google-workspace-vs-zoho", favorite: "zoho", alternative: "google-workspace", searchQuery: "google workspace vs zoho mail" },
  { topicSlug: "business-email", pageType: "use-case", audience: "small-business", title: "How to set up email on your own domain", slug: "email-on-your-domain", favorite: "zoho", alternative: "google-workspace", searchQuery: "how to set up email on your domain" },
  { topicSlug: "getting-paid", pageType: "best-of", audience: "small-business", title: "Best ways for a new business to get paid", slug: "ways-to-get-paid", favorite: "stripe", alternative: "paypal", searchQuery: "how a new online business gets paid" },
  { topicSlug: "getting-paid", pageType: "versus", audience: "worldwide", title: "Stripe vs PayPal", slug: "stripe-vs-paypal", favorite: "stripe", alternative: "paypal", searchQuery: "stripe vs paypal" },
  { topicSlug: "getting-paid", pageType: "versus", audience: "nigerian-business", title: "Paystack vs Flutterwave", slug: "paystack-vs-flutterwave", favorite: "paystack", alternative: "flutterwave", searchQuery: "paystack vs flutterwave" },
  { topicSlug: "courses", pageType: "best-of", audience: "small-business", title: "Best courses for starting an online business", slug: "courses-starting-online", favorite: "udemy", alternative: "coursera", searchQuery: "best course for starting an online business" },
  { topicSlug: "courses", pageType: "best-of", audience: "small-business", title: "Best course for opening an online store", slug: "course-opening-a-store", favorite: "udemy", alternative: "selar", searchQuery: "best course for opening an online store" },
];

function comparison(draft: Draft): Comparison {
  return {
    id: draft.slug,
    pageType: draft.pageType,
    clusterSlug: "launch",
    topicSlug: draft.topicSlug,
    audience: draft.audience,
    title: draft.title,
    slug: draft.slug,
    previousSlugs: [],
    verdict: "Draft. Check the current offer and add a first-hand note before publishing.",
    favoriteBrandId: draft.favorite,
    alternativeBrandId: draft.alternative,
    whyFavorite: "",
    whenAlternative: "",
    skipFavorite: "",
    skipAlternative: "",
    criteria: [
      { label: "Best for", favorite: "", alternative: "" },
      { label: "Limit", favorite: "", alternative: "" },
    ],
    answers: [],
    seoTitle: draft.title,
    metaDescription: draft.searchQuery,
    originalDate: null,
    reviewDate: null,
    firstHandNote: "",
    status: "draft",
    searchQuery: draft.searchQuery,
  };
}

const topics: Topic[] = [
  { slug: "domains", clusterSlug: "launch", title: "Domains", description: "Buying a name and connecting it to a new site." },
  { slug: "hosting", clusterSlug: "launch", title: "Hosting", description: "Where the new site lives, including WordPress and renewals." },
  { slug: "site-builders", clusterSlug: "launch", title: "Site builders and stores", description: "Tools that turn an idea into a page or a shop." },
  { slug: "business-email", clusterSlug: "launch", title: "Business email", description: "A professional address on your own domain." },
  { slug: "getting-paid", clusterSlug: "launch", title: "Getting paid", description: "How a new business accepts money." },
  { slug: "courses", clusterSlug: "launch", title: "Courses", description: "Courses for starting a site or opening a store." },
  { slug: "ai-tools", clusterSlug: "grow", title: "AI tools", description: "Writing, images, and assistants for a small business." },
  { slug: "design", clusterSlug: "grow", title: "Design", description: "Logos, social posts, and simple graphics." },
  { slug: "email-marketing", clusterSlug: "grow", title: "Email marketing", description: "Newsletters sent to a list. This is not business email." },
  { slug: "seo", clusterSlug: "grow", title: "SEO", description: "Keywords, rankings, and content optimization." },
  { slug: "saas-productivity", clusterSlug: "grow", title: "SaaS and productivity", description: "Accounting, invoicing, notes, and tasks." },
  { slug: "developer-tools", clusterSlug: "grow", title: "Developer tools", description: "Code hosting, preview hosting, and APIs." },
  { slug: "skill-courses", clusterSlug: "grow", title: "Skill courses", description: "Courses for writing, design, SEO, and marketing." },
];

export function seedData(): Store {
  return {
    settings: {
      homeIntro:
        "Clevorah compares the tools for starting an online business. Each comparison names one favorite and one alternative.",
      launchIntro:
        "Start with a domain, a host, a page, a business inbox, a way to get paid, and a course if you want one.",
      growIntro: "Tools for after the site exists.",
      disclosure: DISCLOSURE,
      aboutBody:
        "Clevorah compares tools for starting an online business. Each page names one favorite and one alternative.\n\nThe site is published from Nigeria for readers anywhere. A recommendation can pay Clevorah a commission when a reader buys through a link. That does not change the price.",
      contactIntro:
        "Send a note about a comparison, a correction, or a partnership. Messages are stored and read by the publisher. There is no live chat.",
      disclosureBody:
        "Buttons that leave Clevorah for a brand are affiliate links. The favorite uses a filled button. The alternative uses an outline button. If a program is paused, or the link is not connected, the button is left off the page.\n\nThe newsletter is optional. It is never required before you can read a recommendation.",
      privacyBody:
        "Clevorah stores the email address you submit for the newsletter, the page you submitted it from, and whether you confirmed it. A confirmation email is sent before the address counts as subscribed. Every newsletter email includes an unsubscribe link.\n\nThe contact form stores your name, email, and message.\n\nThe click log stores the comparison path, the brand, whether the button was the favorite or the alternative, and the time. It does not store your IP address.\n\nGoogle Analytics loads only after you accept the notice, and only on public pages. It does not load on the desk.\n\nThese records are kept so the publisher can run the site. They are covered by Nigeria's data protection rules. You can ask for a newsletter address to be removed by using unsubscribe or the contact form.",
      navLaunch: "Launch",
      navGrow: "Grow",
      navAbout: "About",
      navContact: "Contact",
    },
    author: {
      name: "",
      bio: "Clevorah is published from Nigeria for readers anywhere.",
      profileUrl: "/about",
    },
    clusters: [
      {
        slug: "launch",
        title: "Launch",
        description: "The tools a new business needs before it has a site.",
      },
      {
        slug: "grow",
        title: "Grow",
        description: "The tools a business needs after the site exists.",
      },
    ],
    topics,
    comparisons: drafts.map(comparison),
    brands,
    clicks: [],
    subscribers: [],
    messages: [],
    redirects: [],
  };
}
