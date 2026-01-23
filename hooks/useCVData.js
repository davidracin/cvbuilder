import { useState, useCallback } from "react";
import { DEFAULT_CV_DATA, NEW_ITEM_TEMPLATES, TEMPLATE_DESIGN_DEFAULTS } from "../lib/constants";

export function useCVData() {
  const [cvData, setCvData] = useState(DEFAULT_CV_DATA);
  const [cvId, setCVId] = useState(null);
  const [cvName, setCVName] = useState('');

  // Function to update CV data
  const updateCvData = (section, field, value, id = null) => {
    setCvData((prevData) => {
      if (id !== null && Array.isArray(prevData[section])) {
        // Update array item by id
        return {
          ...prevData,
          [section]: prevData[section].map(item => 
            item.id === id ? { ...item, [field]: value } : item
          )
        };
      } else if (section === "personal") {
        // Update nested personal data
        return {
          ...prevData,
          personal: {
            ...prevData.personal,
            [field]: value
          }
        };
      } else {
        // Update top level data
        return {
          ...prevData,
          [section]: value
        };
      }
    });
  };

  // Function to add new item to array sections
  const addItem = (section) => {
    setCvData((prevData) => {
      const newId = Math.max(0, ...prevData[section].map(item => item.id)) + 1;
      const newItem = {
        id: newId,
        ...NEW_ITEM_TEMPLATES[section]
      };
      
      return {
        ...prevData,
        [section]: [...prevData[section], newItem]
      };
    });
  };

  // Function to remove item from array sections
  const removeItem = (section, id) => {
    setCvData((prevData) => {
      return {
        ...prevData,
        [section]: prevData[section].filter(item => item.id !== id)
      };
    });
  };

  // Function to reorder items in array sections
  const reorderItems = (section, startIndex, endIndex) => {
    setCvData((prevData) => {
      const items = Array.from(prevData[section]);
      const [removed] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, removed);
      
      return {
        ...prevData,
        [section]: items
      };
    });
  };
  
  // Function to add custom section
  const addCustomSection = (sectionType, title) => {
    setCvData((prevData) => {
      const newId = Math.max(0, ...prevData.customSections.map(s => s.id)) + 1;
      const newSection = {
        id: newId,
        type: sectionType,
        title: title,
        items: []
      };
      
      return {
        ...prevData,
        customSections: [...prevData.customSections, newSection]
      };
    });
  };

  // Function to update custom section
  const updateCustomSection = (sectionId, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  // Function to remove custom section
  const removeCustomSection = (sectionId) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.filter(s => s.id !== sectionId)
    }));
  };

  // Function to add item to custom section
  const addCustomSectionItem = (sectionId) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.map(section => {
        if (section.id === sectionId) {
          const newId = Math.max(0, ...section.items.map(i => i.id)) + 1;
          const newItem = {
            id: newId,
            ...NEW_ITEM_TEMPLATES.customSectionItem
          };
          return {
            ...section,
            items: [...section.items, newItem]
          };
        }
        return section;
      })
    }));
  };

  // Function to update custom section item
  const updateCustomSectionItem = (sectionId, itemId, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item =>
              item.id === itemId ? { ...item, [field]: value } : item
            )
          };
        }
        return section;
      })
    }));
  };

  // Function to remove custom section item
  const removeCustomSectionItem = (sectionId, itemId) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter(item => item.id !== itemId)
          };
        }
        return section;
      })
    }));
  };

  // Function to reorder custom section items
  const reorderCustomSectionItems = (sectionId, startIndex, endIndex) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.map(section => {
        if (section.id === sectionId) {
          const items = Array.from(section.items);
          const [removed] = items.splice(startIndex, 1);
          items.splice(endIndex, 0, removed);
          return { ...section, items };
        }
        return section;
      })
    }));
  };

  // Function to update design settings
  const updateDesignSettings = (category, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      designSettings: {
        ...prevData.designSettings,
        [category]: {
          ...prevData.designSettings?.[category],
          [field]: value
        }
      }
    }));
  };

  // Function to reset design settings to template defaults
  const resetDesignSettings = (templateName) => {
    const defaults = TEMPLATE_DESIGN_DEFAULTS[templateName];
    if (defaults) {
      setCvData((prevData) => ({
        ...prevData,
        designSettings: JSON.parse(JSON.stringify(defaults))
      }));
    }
  };

  // Function to get merged design settings (user overrides + template defaults)
  const getDesignSettings = useCallback((templateName) => {
    const defaults = TEMPLATE_DESIGN_DEFAULTS[templateName] || TEMPLATE_DESIGN_DEFAULTS.moderni;
    if (!cvData.designSettings) {
      return defaults;
    }
    
    // Deep merge user settings with defaults
    return {
      colors: { ...defaults.colors, ...cvData.designSettings.colors },
      fonts: { ...defaults.fonts, ...cvData.designSettings.fonts },
      spacing: { ...defaults.spacing, ...cvData.designSettings.spacing }
    };
  }, [cvData.designSettings]);

  // Function to load a complete CV from database
  const loadCV = useCallback((newCvData, id, name) => {
    // Ensure designSettings exists (for backwards compatibility with older CVs)
    const dataWithDesignSettings = {
      ...newCvData,
      designSettings: newCvData.designSettings || {}
    };
    setCvData(dataWithDesignSettings);
    setCVId(id);
    setCVName(name);
  }, []);

  return {
    cvData,
    cvId,
    cvName,
    setCVName,
    updateCvData,
    addItem,
    removeItem,
    reorderItems,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    reorderCustomSectionItems,
    updateDesignSettings,
    resetDesignSettings,
    getDesignSettings,
    loadCV
  };
}
