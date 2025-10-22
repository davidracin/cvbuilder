export const DEFAULT_CV_DATA = {
  personal: {
    name: "Vaše Jméno",
    title: "Profesní Titul",
    email: "email@example.com",
    phone: "+420 123 456 789",
    address: "Praha, Česká republika",
    about: "Krátké představení o vás a vašich zkušenostech.",
    dateOfBirth: "01.01.1990",
  },
  experience: [
    {
      id: 1,
      title: "Pracovní pozice",
      company: "Společnost",
      startDate: "01/2020",
      endDate: "Současnost",
      description: "Popis vaší pracovní náplně a dosažených úspěchů."
    }
  ],
  education: [
    {
      id: 1,
      degree: "Dosažené vzdělání",
      school: "Název školy",
      startDate: "09/2015",
      endDate: "06/2019",
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
  ]
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
  }
};
