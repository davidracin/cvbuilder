export default function KlasickeTemplate({ data }) {
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
