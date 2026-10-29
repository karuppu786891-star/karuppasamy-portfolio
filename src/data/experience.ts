/**
 * EXPERIENCE & EDUCATION DATA — edit freely.
 * Only truthful details are included. No employer name, dates or metrics are
 * invented; add them yourself when you want them shown.
 */

export type ExperienceArea = {
  title: string;
  accent: "violet" | "cyan";
  points: string[];
  /** Optional real photo/screenshot (e.g. "/experience/store.jpg"). Leave empty to show the built-in illustration. */
  image?: string;
};

export const experience = {
  duration: "6 Months",
  heading: "E-Commerce Website Handling & Social Media Management",
  summary:
    "Six months of hands-on experience across two areas of digital work: running an e-commerce website and managing social media.",
  employer: "", // optional — leave "" to hide
  areas: [
    {
      title: "E-Commerce Website Handling",
      accent: "violet",
      points: [
        "E-commerce website management and maintenance",
        "Product listing and content updates",
        "Website content organization",
        "Supporting day-to-day website operations",
        "Improving digital storefront presentation",
      ],
    },
    {
      title: "Social Media Management",
      accent: "cyan",
      points: [
        "Social media content management",
        "Post scheduling and publishing",
        "Creative content preparation",
        "Supporting brand presence across social platforms",
        "Social media page management",
      ],
    },
  ] as ExperienceArea[],
};

export const education = {
  degree: "Bachelor of Engineering — Computer Science and Engineering",
  institution: "NSN College of Engineering and Technology, Karur",
  languages: ["Tamil", "English"],
  extra: [] as string[], // add certificates/qualifications as text lines
};

export const capabilities = [
  { id: "develop", label: "Develop", text: "Building powerful digital experiences.", accent: "#8B5CF6" },
  { id: "create", label: "Create", text: "Turning imagination into visual stories.", accent: "#EC4899" },
  { id: "market", label: "Market", text: "Connecting brands with digital audiences.", accent: "#22D3EE" },
  { id: "innovate", label: "Innovate", text: "Exploring the future through AI.", accent: "#34D399" },
];
