import { formatDate } from "@/lib/utils";

export default function ProfesionalniTemplate({ data, designSettings }) {
  const { colors, fonts, spacing } = designSettings;
  
  const sectionStyle = {
    marginBottom: `${spacing.section}px`
  };

  const headingStyle = {
    fontFamily: fonts.heading,
    color: colors.primary
  };

  const bodyTextStyle = {
    fontFamily: fonts.body,
    color: colors.text
  };

  const secondaryTextStyle = {
    fontFamily: fonts.body,
    color: colors.textSecondary
  };

  return (
    <div style={{ fontFamily: fonts.body }}>
      <div className="flex flex-wrap">
        {/* Left sidebar */}
        <div className="w-1/3 p-6 min-h-[750px]" style={{ backgroundColor: colors.primary, color: '#ffffff' }}>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold" style={{ fontFamily: fonts.heading }}>{data.personal.name}</h1>
            <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{data.personal.title}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold pb-2 mb-3" style={{ borderBottom: `1px solid ${colors.accent}`, fontFamily: fonts.heading }}>Kontakt</h2>
            <div className="space-y-2">
              <div>{data.personal.email}</div>
              <div>{data.personal.phone}</div>
              <div>{data.personal.address}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold pb-2 mb-3" style={{ borderBottom: `1px solid ${colors.accent}`, fontFamily: fonts.heading }}>Dovednosti</h2>
            <ul className="list-disc pl-3">
              {data.skills.map((skill) => (
                <li key={skill.id} className="mb-2">
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold pb-2 mb-3" style={{ borderBottom: `1px solid ${colors.accent}`, fontFamily: fonts.heading }}>Jazyky</h2>
            {data.languages.map((language) => (
              <div key={language.id} className="mb-2">
                <span className="block">{language.name}</span>
                <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{language.level}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right content */}
        <div className="w-2/3 p-6">
          <section style={sectionStyle}>
            <h2 className="text-2xl font-bold mb-4" style={headingStyle}>O mně</h2>
            <p className="leading-relaxed" style={bodyTextStyle}>{data.personal.about}</p>
          </section>
          
          <section style={sectionStyle}>
            <h2 className="text-2xl font-bold mb-4" style={headingStyle}>Pracovní zkušenosti</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg" style={secondaryTextStyle}>{exp.title}</h3>
                  <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: colors.background, color: colors.textSecondary }}>
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
                  </span>
                </div>
                <div className="font-medium mb-2" style={secondaryTextStyle}>{exp.company}</div>
                <p style={bodyTextStyle}>{exp.description}</p>
              </div>
            ))}
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4" style={headingStyle}>Vzdělání</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg" style={secondaryTextStyle}>{edu.degree}</h3>
                  <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: colors.background, color: colors.textSecondary }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="font-medium mb-2" style={secondaryTextStyle}>{edu.school}</div>
                <p style={bodyTextStyle}>{edu.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
