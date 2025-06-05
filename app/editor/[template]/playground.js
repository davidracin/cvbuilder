"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { exportToPDF, exportToImage, exportToWord } from "../../../lib/exportUtils";

export default function EditorPage() {
  const params = useParams();
  const templateSlug = params.template;
  
  // State for export dropdown
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  
  // Default CV data structure
  const [cvData, setCvData] = useState({
    personal: {
      name: "Vaše Jméno",
      title: "Profesní Titul",
      email: "email@example.com",
      phone: "+420 123 456 789",
      address: "Praha, Česká republika",
      about: "Krátké představení o vás a vašich zkušenostech.",
    },    experience: [
      {
        id: 1,
        title: "Senior Software Developer a Team Lead",
        company: "Technology Innovation Solutions International Corporation s.r.o.",
        startDate: "01/2020",
        endDate: "Současnost",
        description: "Popis vaší pracovní náplně a dosažených úspěchů."
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "Velmi Dlouhý Název Společnosti Která Má Opravdu Dlouhý Název a.s.",
        startDate: "06/2018",
        endDate: "12/2019",
        description: "Vývoj moderních webových aplikací s použitím React a TypeScript."
      }
    ],
    education: [
      {
        id: 1,
        degree: "Magisterský titul v oboru Informatika",
        school: "Univerzita Karlova v Praze, Fakulta matematiky a fyziky, Katedra softwarového inženýrství",
        startDate: "09/2015",
        endDate: "06/2019",
        description: "Popis vašeho studia a případných úspěchů."
      },
      {
        id: 2,
        degree: "Bakalářský titul",
        school: "Czech Technical University in Prague, Faculty of Information Technology and Computer Science",
        startDate: "09/2012",
        endDate: "06/2015",
        description: "Studium základů informatiky a programování."
      }
    ],
    skills: [
      { id: 1, name: "Dovednost 1", level: 80 },
      { id: 2, name: "Dovednost 2", level: 70 },
      { id: 3, name: "Dovednost 3", level: 90 }
    ],
    languages: [
      { id: 1, name: "Čeština", level: "Rodilý mluvčí" },
      { id: 2, name: "Angličtina", level: "Pokročilý (C1)" }
    ]
  });

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
      
      let newItem = { id: newId };
      if (section === "experience") {
        newItem = {
          ...newItem,
          title: "Nová pozice",
          company: "Společnost",
          startDate: "",
          endDate: "",
          description: ""
        };
      } else if (section === "education") {
        newItem = {
          ...newItem,
          degree: "Nové vzdělání",
          school: "Škola",
          startDate: "",
          endDate: "",
          description: ""
        };
      } else if (section === "skills") {
        newItem = {
          ...newItem,
          name: "Nová dovednost",
          level: 50
        };
      } else if (section === "languages") {
        newItem = {
          ...newItem,
          name: "Nový jazyk",
          level: "Začátečník"
        };
      }
      
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

  // Function to handle export
  const handleExport = async (format) => {
    try {
      const fileName = `${cvData.personal.name.replace(/\s+/g, '_')}_CV`;
      
      switch (format) {
        case 'pdf':
          await exportToPDF('cv-template', fileName);
          break;
        case 'word':
          await exportToWord(cvData, fileName);
          break;
        case 'image':
          await exportToImage('cv-template', fileName);
          break;
        default:
          throw new Error('Neplatný formát exportu');
      }
      
      // You could add a success notification here
      console.log(`CV úspěšně exportováno jako ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Chyba při exportování CV:', error);
      // You could add an error notification here
      alert(`Chyba při exportování CV: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for editing */}
      <div className="w-1/3 bg-sidebar text-sidebar-foreground overflow-y-auto p-4 border-r border-sidebar-border">
        <h1 className="text-xl font-bold mb-4">Editor CV - {templateSlug}</h1>
        
        {/* Personal Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 border-b border-sidebar-border pb-1">Osobní údaje</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Jméno</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={cvData.personal.name}
                onChange={(e) => updateCvData("personal", "name", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Profesní titul</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={cvData.personal.title}
                onChange={(e) => updateCvData("personal", "title", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={cvData.personal.email}
                onChange={(e) => updateCvData("personal", "email", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={cvData.personal.phone}
                onChange={(e) => updateCvData("personal", "phone", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Adresa</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={cvData.personal.address}
                onChange={(e) => updateCvData("personal", "address", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">O mně</label>
              <textarea 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground min-h-[100px]"
                value={cvData.personal.about}
                onChange={(e) => updateCvData("personal", "about", e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Work Experience Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
            <h2 className="text-lg font-semibold">Pracovní zkušenosti</h2>
            <button 
              className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
              onClick={() => addItem("experience")}
            >
              Přidat
            </button>
          </div>
          
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="mb-4 p-3 border border-sidebar-border rounded">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Zkušenost #{exp.id}</h3>
                <button 
                  className="text-destructive text-sm"
                  onClick={() => removeItem("experience", exp.id)}
                >
                  Odstranit
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Pozice</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                    value={exp.title}
                    onChange={(e) => updateCvData("experience", "title", e.target.value, exp.id)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Společnost</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                    value={exp.company}
                    onChange={(e) => updateCvData("experience", "company", e.target.value, exp.id)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Od</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                      value={exp.startDate}
                      onChange={(e) => updateCvData("experience", "startDate", e.target.value, exp.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Do</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                      value={exp.endDate}
                      onChange={(e) => updateCvData("experience", "endDate", e.target.value, exp.id)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Popis</label>
                  <textarea 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground min-h-[80px]"
                    value={exp.description}
                    onChange={(e) => updateCvData("experience", "description", e.target.value, exp.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Education Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
            <h2 className="text-lg font-semibold">Vzdělání</h2>
            <button 
              className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
              onClick={() => addItem("education")}
            >
              Přidat
            </button>
          </div>
          
          {cvData.education.map((edu) => (
            <div key={edu.id} className="mb-4 p-3 border border-sidebar-border rounded">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Vzdělání #{edu.id}</h3>
                <button 
                  className="text-destructive text-sm"
                  onClick={() => removeItem("education", edu.id)}
                >
                  Odstranit
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Titul/Stupeň</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                    value={edu.degree}
                    onChange={(e) => updateCvData("education", "degree", e.target.value, edu.id)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Škola</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                    value={edu.school}
                    onChange={(e) => updateCvData("education", "school", e.target.value, edu.id)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Od</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                      value={edu.startDate}
                      onChange={(e) => updateCvData("education", "startDate", e.target.value, edu.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Do</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                      value={edu.endDate}
                      onChange={(e) => updateCvData("education", "endDate", e.target.value, edu.id)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Popis</label>
                  <textarea 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground min-h-[80px]"
                    value={edu.description}
                    onChange={(e) => updateCvData("education", "description", e.target.value, edu.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Skills Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
            <h2 className="text-lg font-semibold">Dovednosti</h2>
            <button 
              className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
              onClick={() => addItem("skills")}
            >
              Přidat
            </button>
          </div>
          
          {cvData.skills.map((skill) => (
            <div key={skill.id} className="mb-3 p-3 border border-sidebar-border rounded">
              <div className="flex justify-between mb-2">
                <div className="flex-1">
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                    value={skill.name}
                    onChange={(e) => updateCvData("skills", "name", e.target.value, skill.id)}
                    placeholder="Název dovednosti"
                  />
                </div>
                <button 
                  className="ml-2 text-destructive text-sm"
                  onClick={() => removeItem("skills", skill.id)}
                >
                  X
                </button>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  className="w-full mr-2"
                  value={skill.level}
                  onChange={(e) => updateCvData("skills", "level", parseInt(e.target.value), skill.id)}
                />
                <span className="w-8 text-center">{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Languages Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
            <h2 className="text-lg font-semibold">Jazyky</h2>
            <button 
              className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
              onClick={() => addItem("languages")}
            >
              Přidat
            </button>
          </div>
          
          {cvData.languages.map((language) => (
            <div key={language.id} className="mb-3 p-3 border border-sidebar-border rounded">
              <div className="flex justify-between gap-2 mb-2">
                <div className="flex-1">
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                    value={language.name}
                    onChange={(e) => updateCvData("languages", "name", e.target.value, language.id)}
                    placeholder="Název jazyka"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                    value={language.level}
                    onChange={(e) => updateCvData("languages", "level", e.target.value, language.id)}
                    placeholder="Úroveň"
                  />
                </div>
                <button 
                  className="text-destructive text-sm"
                  onClick={() => removeItem("languages", language.id)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>      {/* Preview area */}
      <div className="w-2/3 overflow-y-auto p-6 bg-white flex flex-col items-center">
        <div id="cv-template" className="w-full max-w-3xl shadow-lg bg-transparent">
          {/* Import the specific template based on the template slug */}
          {templateSlug === "moderni" && <ModerniCVTemplate data={cvData} />}
          {templateSlug === "klasicke" && <KlasickeTemplate data={cvData} />}
          {templateSlug === "kreativni" && <KreativniTemplate data={cvData} />}
          {templateSlug === "profesionalni" && <ProfesionalniTemplate data={cvData} />}
          
          {/* Fallback if template is not found */}
          {!["moderni", "klasicke", "kreativni", "profesionalni"].includes(templateSlug) && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500">Šablona nebyla nalezena</p>
            </div>
          )}
        </div>

        {/* Export dropdown button */}
        <div className="relative mt-6">
          <button
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportovat CV
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isExportDropdownOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsExportDropdownOpen(false)}
              ></div>
              
              {/* Dropdown content */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Vyberte formát
                  </div>
                  
                  <button
                    onClick={() => {
                      handleExport('pdf');
                      setIsExportDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">PDF</div>
                      <div className="text-sm text-gray-500">Profesionální formát pro sdílení</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleExport('word');
                      setIsExportDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Word</div>
                      <div className="text-sm text-gray-500">Editovatelný dokument (.docx)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleExport('image');
                      setIsExportDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-150 flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Obrázek</div>
                      <div className="text-sm text-gray-500">PNG formát pro rychlé sdílení</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Moderní CV Template Component
function ModerniCVTemplate({ data }) {
  return (
    <div className="font-sans p-8 bg-white min-h-[500px]">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">{data.personal.name}</h1>
        <p className="text-xl text-gray-600">{data.personal.title}</p>
        
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
          <div>{data.personal.email}</div>
          <div>|</div>
          <div>{data.personal.phone}</div>
          <div>|</div>
          <div>{data.personal.address}</div>
        </div>
      </header>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">O mně</h2>
        <p className="text-gray-700">{data.personal.about}</p>
      </section>
        <section className="mb-6">
        <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Pracovní zkušenosti</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between flex-wrap">
              <h3 className="font-medium text-lg break-words">{exp.title}</h3>
              <span className="text-gray-500 text-sm whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="text-gray-600 font-medium break-words">{exp.company}</div>
            <p className="text-gray-700 mt-1 break-words">{exp.description}</p>
          </div>
        ))}
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Vzdělání</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4">
            <div className="flex justify-between flex-wrap">
              <h3 className="font-medium text-lg break-words">{edu.degree}</h3>
              <span className="text-gray-500 text-sm whitespace-nowrap">{edu.startDate} - {edu.endDate}</span>
            </div>
            <div className="text-gray-600 font-medium break-words">{edu.school}</div>
            <p className="text-gray-700 mt-1 break-words">{edu.description}</p>
          </div>
        ))}
      </section>
      
      <div className="flex flex-wrap">
        <section className="w-1/2 pr-4 mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Dovednosti</h2>
          {data.skills.map((skill) => (
            <div key={skill.id} className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-gray-500 text-sm">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </section>
        
        <section className="w-1/2 pl-4 mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Jazyky</h2>
          <ul className="list-disc pl-5">
            {data.languages.map((language) => (
              <li key={language.id} className="mb-1">
                <span className="text-gray-700">{language.name}</span>
                <span className="text-gray-500 ml-2 text-sm">({language.level})</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

// Classic CV Template Component
function KlasickeTemplate({ data }) {
  return (
    <div className="font-serif p-8 bg-white min-h-[500px]">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">{data.personal.name}</h1>
        <p className="text-xl mt-1">{data.personal.title}</p>
        
        <div className="mt-3 text-sm text-gray-600">
          <div>{data.personal.email} | {data.personal.phone}</div>
          <div>{data.personal.address}</div>
        </div>
      </header>
      
      <hr className="my-4 border-gray-300" />
      
      <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-3">Profil</h2>
        <p className="text-gray-700">{data.personal.about}</p>
      </section>
      
      <hr className="my-4 border-gray-300" />
        <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-3">Pracovní zkušenosti</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="font-bold break-words">{exp.title}</div>
            <div className="text-gray-700 font-medium break-words">{exp.company}</div>
            <div className="text-gray-600 italic">{exp.startDate} - {exp.endDate}</div>
            <p className="mt-1 break-words">{exp.description}</p>
          </div>
        ))}
      </section>
      
      <hr className="my-4 border-gray-300" />
      
      <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-3">Vzdělání</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4">
            <div className="font-bold break-words">{edu.degree}</div>
            <div className="text-gray-700 font-medium break-words">{edu.school}</div>
            <div className="text-gray-600 italic">{edu.startDate} - {edu.endDate}</div>
            <p className="mt-1 break-words">{edu.description}</p>
          </div>
        ))}
      </section>
      
      <hr className="my-4 border-gray-300" />
      
      <div className="flex flex-wrap">
        <section className="w-1/2 pr-4">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-3">Dovednosti</h2>
          <ul className="list-disc pl-5">
            {data.skills.map((skill) => (
              <li key={skill.id}>
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
        
        <section className="w-1/2 pl-4">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-3">Jazyky</h2>
          <ul className="list-disc pl-5">
            {data.languages.map((language) => (
              <li key={language.id}>
                {language.name} - {language.level}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

// Kreativní CV Template Component
function KreativniTemplate({ data }) {
  return (
    <div className="font-sans bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg min-h-[500px]">
      <header className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-600">
            {data.personal.name}
          </h1>
          <p className="text-lg text-gray-600 mt-1">{data.personal.title}</p>
        </div>
        
        <div className="mt-3 md:mt-0 text-sm">
          <div className="flex items-center mb-1">
            <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
              ✉
            </span>
            {data.personal.email}
          </div>
          <div className="flex items-center mb-1">
            <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
              ✆
            </span>
            {data.personal.phone}
          </div>
          <div className="flex items-center">
            <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
              ⌂
            </span>
            {data.personal.address}
          </div>
        </div>
      </header>
      
      <section className="mb-8 p-5 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-purple-600 mb-3">O mně</h2>
        <p className="text-gray-700">{data.personal.about}</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold text-purple-600 flex items-center mb-4">
          <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
            ★
          </span>
          Pracovní zkušenosti
        </h2>
          <div className="space-y-6">
          {data.experience.map((exp) => (            <div key={exp.id} className="p-5 bg-white rounded-lg shadow-sm">
              <div className="mb-2">
                <h3 className="font-bold text-lg text-gray-800 break-words">{exp.title}</h3>
                <span className="text-purple-500 font-medium text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="text-purple-600 font-medium break-words mb-1">{exp.company}</div>
              <p className="text-gray-600 mt-2 break-words">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold text-purple-600 flex items-center mb-4">
          <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
            ✎
          </span>
          Vzdělání
        </h2>
          <div className="space-y-6">
          {data.education.map((edu) => (            <div key={edu.id} className="p-5 bg-white rounded-lg shadow-sm">
              <div className="mb-2">
                <h3 className="font-bold text-lg text-gray-800 break-words">{edu.degree}</h3>
                <span className="text-purple-500 font-medium text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="text-purple-600 font-medium break-words mb-1">{edu.school}</div>
              <p className="text-gray-600 mt-2 break-words">{edu.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="flex flex-wrap">
        <section className="w-full md:w-1/2 md:pr-4 mb-8">
          <h2 className="text-xl font-bold text-purple-600 flex items-center mb-4">
            <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
              ⚙
            </span>
            Dovednosti
          </h2>
          
          <div className="p-5 bg-white rounded-lg shadow-sm">
            {data.skills.map((skill) => (
              <div key={skill.id} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-purple-500">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-purple-100 rounded-full">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="w-full md:w-1/2 md:pl-4 mb-8">
          <h2 className="text-xl font-bold text-purple-600 flex items-center mb-4">
            <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
              🗣
            </span>
            Jazyky
          </h2>
          
          <div className="p-5 bg-white rounded-lg shadow-sm">
            {data.languages.map((language) => (
              <div key={language.id} className="mb-3 flex items-center">
                <span className="mr-2 w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="font-medium">{language.name}</span>
                <span className="ml-auto text-purple-500">{language.level}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Profesionální CV Template Component
function ProfesionalniTemplate({ data }) {
  return (
    <div className="font-sans bg-white min-h-[500px]">
      <div className="flex flex-wrap">
        {/* Left sidebar */}
        <div className="w-1/3 bg-gray-800 text-white p-6 min-h-[750px]">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">{data.personal.name}</h1>
            <p className="text-gray-300 mt-1">{data.personal.title}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">Kontakt</h2>
            <div className="space-y-2">
              <div>{data.personal.email}</div>
              <div>{data.personal.phone}</div>
              <div>{data.personal.address}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">Dovednosti</h2>
            {data.skills.map((skill) => (
              <div key={skill.id} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>{skill.name}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5">
                  <div 
                    className="bg-white h-1.5 rounded-full" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3">Jazyky</h2>
            {data.languages.map((language) => (
              <div key={language.id} className="mb-2">
                <span className="block">{language.name}</span>
                <span className="text-sm text-gray-400">{language.level}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right content */}
        <div className="w-2/3 p-6">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">O mně</h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.about}</p>
          </section>
            <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pracovní zkušenosti</h2>
            {data.experience.map((exp) => (              <div key={exp.id} className="mb-6">
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-gray-800 break-words">{exp.title}</h3>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="text-gray-600 font-medium mb-2 break-words">{exp.company}</div>
                <p className="text-gray-600 break-words">{exp.description}</p>
              </div>
            ))}
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vzdělání</h2>
            {data.education.map((edu) => (              <div key={edu.id} className="mb-6">
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-gray-800 break-words">{edu.degree}</h3>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-gray-600 font-medium mb-2 break-words">{edu.school}</div>
                <p className="text-gray-600 break-words">{edu.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}