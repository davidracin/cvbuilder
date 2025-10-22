export default function ProfesionalniTemplate({ data }) {
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
