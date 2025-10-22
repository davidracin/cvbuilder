export default function ModerniCVTemplate({ data }) {
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
