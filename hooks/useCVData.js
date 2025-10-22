import { useState } from "react";
import { DEFAULT_CV_DATA, NEW_ITEM_TEMPLATES } from "../lib/constants";

export function useCVData() {
  const [cvData, setCvData] = useState(DEFAULT_CV_DATA);

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

  return {
    cvData,
    updateCvData,
    addItem,
    removeItem
  };
}
