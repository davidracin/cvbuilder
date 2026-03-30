import { formatDate, formatDateFull } from "@/lib/utils";

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

  const renderCustomSection = (section) => (
    <section key={section.id} style={sectionStyle}>
      <h2 className="text-2xl font-bold mb-4" style={headingStyle}>{section.title}</h2>
      {section.items && section.items.map((item) => (
        <div key={item.id} className="mb-6">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg" style={secondaryTextStyle}>{item.title}</h3>
            {(item.startDate || item.endDate === "current" || item.endDate) && (
              <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: colors.background, color: colors.textSecondary }}>
                {item.startDate && formatDate(item.startDate)}
                {item.startDate && (item.endDate === "current" || item.endDate) && ' - '}
                {item.endDate === "current" ? 'Současnost' : item.endDate ? formatDate(item.endDate) : ''}
              </span>
            )}
          </div>
          {item.subTitle && (
            <div className="font-medium mb-2" style={secondaryTextStyle}>{item.subTitle}</div>
          )}
          {item.description && (
            <p style={bodyTextStyle}>{item.description}</p>
          )}
        </div>
      ))}
    </section>
  );

  return (
    <div style={{ fontFamily: fonts.body, margin: '-40px', width: 'calc(100% + 80px)' }}>
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-1/3 py-6 px-4" style={{ backgroundColor: colors.sidebar || colors.primary, color: colors.sidebarText || '#ffffff', minHeight: '1123px' }}>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold" style={{ fontFamily: fonts.heading }}>{data.personal.name}</h1>
            <p className="mt-1" style={{ color: colors.sidebarText ? `${colors.sidebarText}cc` : 'rgba(255, 255, 255, 0.8)' }}>{data.personal.title}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold pb-2 mb-3" style={{ borderBottom: `1px solid ${colors.accent}`, fontFamily: fonts.heading }}>Kontakt</h2>
            <div className="space-y-2">
              <div>{data.personal.email}</div>
              <div>{data.personal.phone}</div>
              <div>{data.personal.address}</div>
              {data.personal.dateOfBirth && (
                <div>{formatDateFull(data.personal.dateOfBirth)}</div>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold pb-2 mb-3" style={{ borderBottom: `1px solid ${colors.accent}`, fontFamily: fonts.heading }}>Dovednosti</h2>
            <ul className="pl-1">
              {data.skills.map((skill) => (
                <li key={skill.id} className="mb-2 flex items-center">
                  <span className="mr-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent }}></span>
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
                <span className="text-sm" style={{ color: colors.sidebarText ? `${colors.sidebarText}b3` : 'rgba(255, 255, 255, 0.7)' }}>{language.level}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right content */}
        <div className="w-2/3 p-6">
          <section style={sectionStyle}>
            <h2 className="text-2xl font-bold pb-2 mb-4" style={{ ...headingStyle, borderBottom: `2px solid ${colors.accent}` }}>O mně</h2>
            <p className="leading-relaxed" style={bodyTextStyle}>{data.personal.about}</p>
          </section>
          
          <section style={sectionStyle}>
            <h2 className="text-2xl font-bold pb-2 mb-4" style={{ ...headingStyle, borderBottom: `2px solid ${colors.accent}` }}>Pracovní zkušenosti</h2>
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg" style={secondaryTextStyle}>{exp.title}</h3>
                  <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: colors.background, color: colors.textSecondary }}>
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
                  </span>
                </div>
                <div className="font-medium mb-2" style={secondaryTextStyle}>{exp.company}</div>
                <p style={bodyTextStyle}>{exp.description}</p>
                {index < data.experience.length - 1 && (
                  <hr className="mt-4" style={{ borderColor: colors.accent }} />
                )}
              </div>
            ))}
          </section>
          
          <section style={sectionStyle}>
            <h2 className="text-2xl font-bold pb-2 mb-4" style={{ ...headingStyle, borderBottom: `2px solid ${colors.accent}` }}>Vzdělání</h2>
            {data.education.map((edu, index) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg" style={secondaryTextStyle}>{edu.degree}</h3>
                  <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: colors.background, color: colors.textSecondary }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="font-medium mb-2" style={secondaryTextStyle}>{edu.school}</div>
                <p style={bodyTextStyle}>{edu.description}</p>
                {index < data.education.length - 1 && (
                  <hr className="mt-4" style={{ borderColor: colors.accent }} />
                )}
              </div>
            ))}
          </section>

          {/* Custom Sections */}
          {data.customSections && data.customSections.map(renderCustomSection)}
        </div>
      </div>
    </div>
  );
}
