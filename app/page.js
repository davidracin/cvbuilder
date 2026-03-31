"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const router = useRouter();

  const templates = [
    { id: 1, name: "Moderní CV", slug: "moderni", preview: "/templates/moderni.webp" },
    { id: 2, name: "Klasické CV", slug: "klasicke", preview: "/templates/klasicke.webp" },
    { id: 3, name: "Kreativní CV", slug: "kreativni", preview: "/templates/kreativni.webp" },
    { id: 4, name: "Profesionální CV", slug: "profesionalni", preview: "/templates/profesionalni.webp" },
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
              className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Template preview image */}
              <Image
                src={template.preview}
                alt={template.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={template.id <= 2}
              />
              
              {/* Template name overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <span className="text-white text-sm font-medium">
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
    </div>
  );
}
