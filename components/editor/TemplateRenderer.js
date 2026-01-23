"use client";
import dynamic from "next/dynamic";

// Dynamic imports for templates - only load the one needed
const ModerniCVTemplate = dynamic(() => import("../templates/ModerniCVTemplate"), { ssr: false });
const KlasickeTemplate = dynamic(() => import("../templates/KlasickeTemplate"), { ssr: false });
const KreativniTemplate = dynamic(() => import("../templates/KreativniTemplate"), { ssr: false });
const ProfesionalniTemplate = dynamic(() => import("../templates/ProfesionalniTemplate"), { ssr: false });

const TEMPLATES = {
  moderni: ModerniCVTemplate,
  klasicke: KlasickeTemplate,
  kreativni: KreativniTemplate,
  profesionalni: ProfesionalniTemplate,
};

export default function TemplateRenderer({ templateSlug, data, designSettings }) {
  const TemplateComponent = TEMPLATES[templateSlug];

  if (!TemplateComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">Šablona nebyla nalezena</p>
      </div>
    );
  }

  return <TemplateComponent data={data} designSettings={designSettings} />;
}
