"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const router = useRouter();

  const templates = [
    { id: 1, name: "Moderní CV", slug: "moderni" },
    { id: 2, name: "Klasické CV", slug: "klasicke" },
    { id: 3, name: "Kreativní CV", slug: "kreativni" },
    { id: 4, name: "Profesionální CV", slug: "profesionalni" },
  ];

  const handleTemplateSelect = (template) => {
    router.push(`/editor/${template.slug}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
          CV Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-center">
          Vyberte si šablonu pro vaše CV
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Template preview - blank page with border */}
              <div className="absolute inset-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  {template.name}
                </span>
              </div>
              
              {/* Overlay on hover */}
              {hoveredTemplate === template.id && (
                <div className="absolute inset-0 bg-blue-500/50 flex items-center justify-center transition-all duration-300 ease-in-out">
                  <button 
                    className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-2 rounded-full shadow transition-all duration-200 transform hover:scale-105"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Použít
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>CV Builder &copy; {new Date().getFullYear()}</p>
      </footer>

      {/* Added simple buttons to get to login and signup pages and test them */}    
      <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
        >
          Přihlásit se
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md"
        >
          Registrovat se
        </button>

    </div>
  );
}
