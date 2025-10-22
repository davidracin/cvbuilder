export default function KreativniTemplate({ data }) {
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
