import { formatDate, formatDateFull } from "@/lib/utils";

export default function KlasickeTemplate({ data, designSettings }) {
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
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold" style={headingStyle}>{data.personal.name}</h1>
        <p className="text-xl mt-1" style={secondaryTextStyle}>{data.personal.title}</p>
        
        <div className="mt-3 text-sm" style={secondaryTextStyle}>
          <div>{data.personal.email} | {data.personal.phone}</div>
          <div>{data.personal.address}</div>
          {data.personal.dateOfBirth && (
            <div>Datum narození: {formatDateFull(data.personal.dateOfBirth)}</div>
          )}
        </div>
      </header>
      
      <hr className="my-4" style={{ borderColor: colors.accent }} />
      
      <section style={sectionStyle}>
        <h2 className="text-xl font-bold uppercase tracking-wider mb-3" style={headingStyle}>Vzdělání</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4">
            <div className="font-bold" style={secondaryTextStyle}>{edu.degree}, {edu.school}</div>
            <div className="italic" style={secondaryTextStyle}>
              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
            </div>
            <p className="mt-1" style={bodyTextStyle}>{edu.description}</p>
          </div>
        ))}
      </section>
      
      <hr className="my-4" style={{ borderColor: colors.accent }} />
      
      <div className="flex flex-wrap">
        <section className="w-1/2 pr-4">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-3" style={headingStyle}>Dovednosti</h2>
          <ul className="pl-5">
            {data.skills.map((skill) => (
              <li key={skill.id} className="flex items-center mb-1" style={bodyTextStyle}>
                <span className="mr-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent }}></span>
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
        
        <section className="w-1/2 pl-4">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-3" style={headingStyle}>Jazyky</h2>
          <ul className="pl-5">
            {data.languages.map((language) => (
              <li key={language.id} className="flex items-center mb-1" style={bodyTextStyle}>
                <span className="mr-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent }}></span>
                {language.name} - {language.level}
              </li>
            ))}
          </ul>
        </section>
      </div>
      
      <hr className="my-4" style={{ borderColor: colors.accent }} />
      
      <section style={sectionStyle}>
        <h2 className="text-xl font-bold uppercase tracking-wider mb-3" style={headingStyle}>Pracovní zkušenosti</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="font-bold" style={secondaryTextStyle}>{exp.title}, {exp.company}</div>
            <div className="italic" style={secondaryTextStyle}>
              {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
            </div>
            <p className="mt-1" style={bodyTextStyle}>{exp.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
