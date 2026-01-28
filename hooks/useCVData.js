import { useState, useCallback } from "react";
import { DEFAULT_CV_DATA, NEW_ITEM_TEMPLATES, TEMPLATE_DESIGN_DEFAULTS } from "../lib/constants";

/**
 * useCVData Hook
 * 
 * Central state management for all CV data. Handles CRUD operations for:
 * - Personal info (name, email, phone, etc.)
 * - Array sections (experience, education, skills, languages)
 * - Custom sections (user-created sections with nested items)
 * - Design settings (colors, fonts, spacing)
 * 
 * All updates use spread syntax (...) to create new objects for React state.
 */
export function useCVData() {
  // STATE VARIABLES
  const [cvData, setCvData] = useState(DEFAULT_CV_DATA);  // All CV content
  const [cvId, setCVId] = useState(null);                 // Firestore doc ID (null = unsaved)
  const [cvName, setCVName] = useState('');               // Display name

  // GENERIC FIELD UPDATES
  /**
   * Update any field in CV data
   * @param {string} section - Section name ('personal', 'experience', etc.)
   * @param {string} field - Field to update
   * @param {any} value - New value
   * @param {number|null} id - Item ID for array sections, null for others
   */
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

  // ARRAY SECTION OPERATIONS
  // For: experience, education, skills, languages

  // Add new item to an array section
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

  // Remove item from array section by ID
  const removeItem = (section, id) => {
    setCvData((prevData) => {
      return {
        ...prevData,
        [section]: prevData[section].filter(item => item.id !== id)
      };
    });
  };

  // Reorder items in array section (drag & drop)
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
  
  // CUSTOM SECTIONS
  // User-created sections with nested items array

  // Create a new custom section
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

  // Update custom section properties (title, type)
  const updateCustomSection = (sectionId, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  // Delete an entire custom section
  const removeCustomSection = (sectionId) => {
    setCvData((prevData) => ({
      ...prevData,
      customSections: prevData.customSections.filter(s => s.id !== sectionId)
    }));
  };

  // Add item inside a custom section
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

  // Update field on item inside custom section
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

  // Remove item from inside a custom section
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

  // Reorder items within a custom section (drag & drop)
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

  // DESIGN SETTINGS
  // Colors, fonts, spacing customization

  // Update a single design setting
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

  // Reset all design settings to template defaults
  const resetDesignSettings = (templateName) => {
    const defaults = TEMPLATE_DESIGN_DEFAULTS[templateName];
    if (defaults) {
      setCvData((prevData) => ({
        ...prevData,
        designSettings: JSON.parse(JSON.stringify(defaults))
      }));
    }
  };

  // Get merged design settings (user overrides + template defaults)
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

  // PERSISTENCE
  // Load complete CV from database
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

  // RETURN HOOK
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
