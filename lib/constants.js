export const DEFAULT_CV_DATA = {
  personal: {
    name: "Vaše Jméno",
    title: "Profesní Titul",
    email: "email@example.com",
    phone: "+420 123 456 789",
    address: "Praha, Česká republika",
    about: "Krátké představení o vás a vašich zkušenostech.",
    dateOfBirth: "1990-01-01", // ISO format
  },
  experience: [
    {
      id: 1,
      title: "Pracovní pozice",
      company: "Společnost",
      startDate: "2020-01-01", // ISO format
      endDate: "", // Empty for current position
      description: "Popis vaší pracovní náplně a dosažených úspěchů."
    }
  ],
  education: [
    {
      id: 1,
      degree: "Dosažené vzdělání",
      school: "Název školy",
      startDate: "2015-09-01", // ISO format
      endDate: "2019-06-01", // ISO format
      description: "Popis vašeho studia a případných úspěchů."
    }
  ],
  skills: [
    { id: 1, name: "Dovednost 1" },
    { id: 2, name: "Dovednost 2" },
    { id: 3, name: "Dovednost 3" }
  ],
  languages: [
    { id: 1, name: "Čeština", level: "Rodilý mluvčí" },
    { id: 2, name: "Angličtina", level: "Pokročilý (C1)" }
  ],
  customSections: [],
  designSettings: null // Will use template defaults
};

export const NEW_ITEM_TEMPLATES = {
  experience: {
    title: "Nová pozice",
    company: "Společnost",
    startDate: "",
    endDate: "",
    description: ""
  },
  education: {
    degree: "Nové vzdělání",
    school: "Škola",
    startDate: "",
    endDate: "",
    description: ""
  },
  skills: {
    name: "Nová dovednost"
  },
  languages: {
    name: "Nový jazyk",
    level: "Začátečník"
  },
  customSection: {
    type: "custom",
    title: "Vlastní sekce",
    items: []
  },
  customSectionItem: {
    title: "Název položky",
    subTitle: "Podtitul",
    startDate: "",
    endDate: "",
    description: ""
  }
};

// Pre-defined custom section types
export const CUSTOM_SECTION_TYPES = {
  projects: {
    type: "projects",
    title: "Projekty",
    icon: "💼"
  },
  certifications: {
    type: "certifications",
    title: "Certifikace",
    icon: "📜"
  },
  awards: {
    type: "awards",
    title: "Ocenění",
    icon: "🏆"
  },
  volunteering: {
    type: "volunteering",
    title: "Dobrovolnictví",
    icon: "🤝"
  },
  hobbies: {
    type: "hobbies",
    title: "Zájmy",
    icon: "🎨"
  },
  custom: {
    type: "custom",
    title: "Vlastní sekce",
    icon: "📝"
  }
};

// Default design settings per template
export const TEMPLATE_DESIGN_DEFAULTS = {
  moderni: {
    colors: {
      primary: "#2563eb", // blue-600
      textSecondary: "#6b7280", // gray-500
      text: "#1f2937", // gray-800 
      accent: "#3b82f6", // blue-500
      background: "#ffffff"
    },
    fonts: {
      heading: "var(--font-inter), sans-serif",
      body: "var(--font-inter), sans-serif"
    },
    spacing: {
      section: 24 // px
    }
  },
  klasicke: {
    colors: {
      primary: "#000000", // black
      textSecondary: "#4b5563", // gray-600
      text: "#000000",
      accent: "#374151", // gray-700
      background: "#ffffff"
    },
    fonts: {
      heading: "var(--font-merriweather), serif",
      body: "var(--font-merriweather), serif"
    },
    spacing: {
      section: 20
    }
  },
  kreativni: {
    colors: {
      primary: "#9333ea", // purple-600
      textSecondary: "#7c3aed", // purple-600
      text: "#581c87", // purple-900
      accent: "#a855f7", // purple-500
      background: "#faf5ff" // purple-50
    },
    fonts: {
      heading: "var(--font-montserrat), sans-serif",
      body: "var(--font-open-sans), sans-serif"
    },
    spacing: {
      section: 28
    }
  },
  profesionalni: {
    colors: {
      primary: "#1f2937", // gray-800
      textSecondary: "#6b7280", // gray-500
      text: "#111827", // gray-900
      accent: "#3b82f6", // blue-500
      background: "#ffffff",
      sidebar: "#1f2937", // gray-800 - sidebar background
      sidebarText: "#ffffff" // white - sidebar text color
    },
    fonts: {
      heading: "var(--font-roboto), sans-serif",
      body: "var(--font-roboto), sans-serif"
    },
    spacing: {
      section: 24
    }
  }
};

// Using CSS variables set in layout.js via next/font/google
export const FONT_OPTIONS = [
  { value: "var(--font-inter), sans-serif", label: "Inter" },
  { value: "var(--font-roboto), sans-serif", label: "Roboto" },
  { value: "var(--font-open-sans), sans-serif", label: "Open Sans" },
  { value: "var(--font-lato), sans-serif", label: "Lato" },
  { value: "var(--font-montserrat), sans-serif", label: "Montserrat" },
  { value: "var(--font-merriweather), serif", label: "Merriweather" },
  { value: "var(--font-playfair-display), serif", label: "Playfair Display" },
  { value: "var(--font-roboto-mono), monospace", label: "Roboto Mono" },
];