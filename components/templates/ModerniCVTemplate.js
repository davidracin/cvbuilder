import { formatDate, formatDateFull } from "@/lib/utils";

export default function ModerniCVTemplate({ data, designSettings }) {
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

  const renderCustomSection = (section) => (
    <section key={section.id} style={sectionStyle}>
      <h2 
        className="text-xl font-semibold border-b pb-1 mb-3"
        style={{ ...headingStyle, borderColor: colors.accent }}
      >
        {section.title}
      </h2>
      {section.items && section.items.map((item) => (
        <div key={item.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-medium text-lg" style={secondaryTextStyle}>
              {item.title}
            </h3>
            {(item.startDate || item.endDate) && (
              <span className="text-sm" style={secondaryTextStyle}>
                {item.startDate && formatDate(item.startDate)} 
                {item.startDate && item.endDate && ' - '}
                {item.endDate ? formatDate(item.endDate) : (item.startDate ? 'Současnost' : '')}
              </span>
            )}
          </div>
          {item.organization && (
            <div className="font-medium" style={secondaryTextStyle}>
              {item.organization}
            </div>
          )}
          {item.description && (
            <p className="mt-1" style={bodyTextStyle}>
              {item.description}
            </p>
          )}
        </div>
      ))}
    </section>
  );

  return (
    <div style={{ backgroundColor: colors.background, fontFamily: fonts.body }}>
      <header style={sectionStyle}>
        <h1 className="text-3xl font-bold" style={headingStyle}>
          {data.personal.name}
        </h1>
        <p className="text-xl" style={secondaryTextStyle}>
          {data.personal.title}
        </p>
        
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" style={secondaryTextStyle}>
          {[data.personal.email, data.personal.phone, data.personal.address, formatDateFull(data.personal.dateOfBirth)]
            .filter(field => field && field.trim())
            .reduce((acc, field, index, arr) => {
              acc.push(<span key={`field-${index}`}>{field}</span>);
              if (index < arr.length - 1) {
                acc.push(<span key={`sep-${index}`}>|</span>);
              }
              return acc;
            }, [])}
        </div>
      </header>
      
      {data.personal.about && (
        <section style={sectionStyle}>
          <h2 
            className="text-xl font-semibold border-b pb-1 mb-3"
            style={{ ...headingStyle, borderColor: colors.accent }}
          >
            O mně
          </h2>
          <p style={bodyTextStyle}>{data.personal.about}</p>
        </section>
      )}
      
      <section style={sectionStyle}>
        <h2 
          className="text-xl font-semibold border-b pb-1 mb-3"
          style={{ ...headingStyle, borderColor: colors.accent }}
        >
          Pracovní zkušenosti
        </h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium text-lg" style={secondaryTextStyle}>
                {exp.title}
              </h3>
              <span className="text-sm" style={secondaryTextStyle}>
                {exp.startDate && formatDate(exp.startDate)} 
                {exp.startDate && ' - '}
                {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
              </span>
            </div>
            <div className="font-medium" style={secondaryTextStyle}>
              {exp.company}
            </div>
            <p className="mt-1" style={bodyTextStyle}>
              {exp.description}
            </p>
          </div>
        ))}
      </section>
      
      <section style={sectionStyle}>
        <h2 
          className="text-xl font-semibold border-b pb-1 mb-3"
          style={{ ...headingStyle, borderColor: colors.accent }}
        >
          Vzdělání
        </h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium text-lg" style={secondaryTextStyle}>
                {edu.degree}
              </h3>
              <span className="text-sm" style={secondaryTextStyle}>
                {edu.startDate && formatDate(edu.startDate)} 
                {edu.startDate && ' - '}
                {edu.endDate ? formatDate(edu.endDate) : 'Současnost'}
              </span>
            </div>
            <div className="font-medium" style={secondaryTextStyle}>
              {edu.school}
            </div>
            <p className="mt-1" style={bodyTextStyle}>
              {edu.description}
            </p>
          </div>
        ))}
      </section>

      {/* Custom Sections */}
      {data.customSections && data.customSections.map(renderCustomSection)}
      
      <div className="flex flex-wrap">
        <section className="w-1/2 pr-4" style={sectionStyle}>
          <h2 
            className="text-xl font-semibold border-b pb-1 mb-3"
            style={{ ...headingStyle, borderColor: colors.accent }}
          >
            Dovednosti
          </h2>
          <ul className="pl-5">
            {data.skills.map((skill) => (
              <li key={skill.id} className="flex items-center mb-1">
                <span className="mr-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent }}></span>
                <span style={bodyTextStyle}>{skill.name}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section className="w-1/2 pl-4" style={sectionStyle}>
          <h2 
            className="text-xl font-semibold border-b pb-1 mb-3"
            style={{ ...headingStyle, borderColor: colors.accent }}
          >
            Jazyky
          </h2>
          <ul className="pl-5">
            {data.languages.map((language) => (
              <li key={language.id} className="flex items-center mb-1">
                <span className="mr-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent }}></span>
                <span style={bodyTextStyle}>{language.name}</span>
                <span className="ml-2 text-sm" style={secondaryTextStyle}>
                  ({language.level})
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
