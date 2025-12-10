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
    organization: "Organizace",
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
      accent: "#3b82f6", // blue-500
      background: "#ffffff",
      text: "#1f2937", // gray-800
      textSecondary: "#6b7280" // gray-500
    },
    fonts: {
      heading: "system-ui",
      body: "system-ui"
    },
    spacing: {
      section: 24 // px
    }
  },
  klasicke: {
    colors: {
      primary: "#1f2937", // gray-800
      accent: "#374151", // gray-700
      background: "#ffffff",
      text: "#000000",
      textSecondary: "#4b5563" // gray-600
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Georgia, serif"
    },
    spacing: {
      section: 20
    }
  },
  kreativni: {
    colors: {
      primary: "#9333ea", // purple-600
      accent: "#a855f7", // purple-500
      background: "#faf5ff", // purple-50
      text: "#581c87", // purple-900
      textSecondary: "#7c3aed" // purple-600
    },
    fonts: {
      heading: "system-ui",
      body: "system-ui"
    },
    spacing: {
      section: 28
    }
  },
  profesionalni: {
    colors: {
      primary: "#1f2937", // gray-800
      accent: "#3b82f6", // blue-500
      background: "#ffffff",
      text: "#111827", // gray-900
      textSecondary: "#6b7280" // gray-500
    },
    fonts: {
      heading: "system-ui",
      body: "system-ui"
    },
    spacing: {
      section: 24
    }
  }
};

// Available font options for typography customization
export const FONT_OPTIONS = [
  { value: "system-ui", label: "System (Sans-serif)" },
  { value: "Georgia, serif", label: "Georgia (Serif)" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "'Helvetica Neue', sans-serif", label: "Helvetica" },
  { value: "'Courier New', monospace", label: "Courier (Monospace)" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Lato', sans-serif", label: "Lato" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" }
];
