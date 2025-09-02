"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { exportCVToPDF } from "../../../lib/pdfExport";
import ExportButton from "../../../components/ExportButton";
import { useToast } from "../../../components/Toast";

export default function EditorPage() {
  const params = useParams();
  const templateSlug = params.template;
  const { addToast, ToastContainer } = useToast();
  
  // Default CV data structure
  const [cvData, setCvData] = useState({
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
          name: "Nová dovednost"
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

  // Function to export CV to PDF
  const handleExportToPDF = async (filename) => {
    try {
      const exportFilename = filename || `${cvData.personal.name.replace(/\s+/g, '_')}_CV.pdf`;
      const success = await exportCVToPDF('cv-preview', exportFilename, {
        scale: 2,
        quality: 0.95,
        backgroundColor: '#ffffff',
        width: 210, // A4 width in mm
        height: 297 // A4 height in mm
      });
      
      if (success) {
        addToast('CV bylo úspěšně exportováno do PDF!', 'success');
        console.log('CV bylo úspěšně exportováno do PDF');
      } else {
        addToast('Nepodařilo se exportovat CV. Zkuste to prosím znovu.', 'error');
      }
      
      return success;
    } catch (error) {
      console.error('Chyba při exportu:', error);
      addToast('Došlo k chybě při exportu PDF. Zkuste to prosím znovu.', 'error');
      return false;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for editing */}
      <div className="w-1/3 bg-sidebar text-sidebar-foreground overflow-y-auto p-4 border-r border-sidebar-border">
        <div className="mb-4">
          <h1 className="text-xl font-bold mb-3">Editor CV - {templateSlug}</h1>
          
          {/* Export Button */}
          <ExportButton 
            onExport={handleExportToPDF}
            filename={`${cvData.personal.name.replace(/\s+/g, '_')}_CV.pdf`}
          />
        </div>
        
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
            
            <div>
              <label className="block text-sm font-medium mb-1">Datum narození</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={cvData.personal.dateOfBirth}
                onChange={(e) => updateCvData("personal", "dateOfBirth", e.target.value)}
                placeholder="DD.MM.YYYY"
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
      </div>

      {/* Preview area */}
      <div className="w-2/3 overflow-y-auto p-6 bg-white flex flex-col items-center">
        <div 
          className="w-full max-w-3xl shadow-lg min-h-[500px] p-8 bg-white"
          style={{
            backgroundColor: '#ffffff',
            minWidth: '800px',
            minHeight: '1000px',
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}
        >
          {/* CV Content - this is what gets exported */}
          <div 
            id="cv-preview"
            style={{
              backgroundColor: '#ffffff',
              padding: '0',
              margin: '0',
              border: 'none',
              boxShadow: 'none'
            }}
          >
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

// Moderní CV Template Component
function ModerniCVTemplate({ data }) {
  return (
    <div className="font-sans">
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
            <div className="flex justify-between">
              <h3 className="font-medium text-lg">{exp.title}</h3>
              <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="text-gray-600 font-medium">{exp.company}</div>
            <p className="text-gray-700 mt-1">{exp.description}</p>
          </div>
        ))}
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Vzdělání</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium text-lg">{edu.degree}</h3>
              <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
            </div>
            <div className="text-gray-600 font-medium">{edu.school}</div>
            <p className="text-gray-700 mt-1">{edu.description}</p>
          </div>
        ))}
      </section>
      
      <div className="flex flex-wrap">
        <section className="w-1/2 pr-4 mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Dovednosti</h2>
          <ul className="list-disc pl-5">
            {data.skills.map((skill) => (
              <li key={skill.id} className="mb-1">
                <span className="text-gray-700">{skill.name}</span>
              </li>
            ))}
          </ul>
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
    <div className="font-serif">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">{data.personal.name}</h1>
        <p className="text-xl mt-1">{data.personal.title}</p>
        
        <div className="mt-3 text-sm text-gray-600">
          <div>{data.personal.email} | {data.personal.phone}</div>
          <div>{data.personal.address}</div>
          {data.personal.dateOfBirth && (
            <div>Datum narození: {data.personal.dateOfBirth}</div>
          )}
        </div>
      </header>
      
      <hr className="my-4 border-gray-300" />
      
      <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-3">Vzdělání</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4">
            <div className="font-bold">{edu.degree}, {edu.school}</div>
            <div className="text-gray-600 italic">{edu.startDate} - {edu.endDate}</div>
            <p className="mt-1">{edu.description}</p>
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
      
      <hr className="my-4 border-gray-300" />
      
      <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-3">Pracovní zkušenosti</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="font-bold">{exp.title}, {exp.company}</div>
            <div className="text-gray-600 italic">{exp.startDate} - {exp.endDate}</div>
            <p className="mt-1">{exp.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

// Kreativní CV Template Component
function KreativniTemplate({ data }) {
  return (
    <div className="font-sans bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
      <header className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
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
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-5 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between flex-wrap">
                <h3 className="font-bold text-lg text-gray-800">{exp.title}</h3>
                <span className="text-purple-500 font-medium">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="text-purple-600 font-medium">{exp.company}</div>
              <p className="text-gray-600 mt-2">{exp.description}</p>
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
          {data.education.map((edu) => (
            <div key={edu.id} className="p-5 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between flex-wrap">
                <h3 className="font-bold text-lg text-gray-800">{edu.degree}</h3>
                <span className="text-purple-500 font-medium">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="text-purple-600 font-medium">{edu.school}</div>
              <p className="text-gray-600 mt-2">{edu.description}</p>
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
            <ul className="list-disc pl-5">
              {data.skills.map((skill) => (
                <li key={skill.id} className="mb-2">
                  <span className="font-medium">{skill.name}</span>
                </li>
              ))}
            </ul>
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
    <div className="font-sans">
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
            <ul className="list-disc pl-3">
              {data.skills.map((skill) => (
                <li key={skill.id} className="mb-2">
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
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
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-gray-800">{exp.title}</h3>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="text-gray-600 font-medium mb-2">{exp.company}</div>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vzdělání</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-gray-800">{edu.degree}</h3>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-gray-600 font-medium mb-2">{edu.school}</div>
                <p className="text-gray-600">{edu.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}