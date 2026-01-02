import { formatDate, formatDateFull } from "@/lib/utils";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Wrench, Languages, Star, Calendar } from "lucide-react";

export default function KreativniTemplate({ data, designSettings }) {
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
      <h2 className="text-xl font-bold flex items-center mb-4" style={headingStyle}>
        <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
          <Star size={16} />
        </span>
        {section.title}
      </h2>
      <div className="space-y-6">
        {section.items && section.items.map((item) => (
          <div key={item.id} className="p-5 rounded-lg shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex justify-between flex-wrap">
              <h3 className="font-bold text-lg" style={secondaryTextStyle}>{item.title}</h3>
              {(item.startDate || item.endDate) && (
                <span className="font-medium" style={secondaryTextStyle}>
                  {item.startDate && formatDate(item.startDate)}
                  {item.startDate && item.endDate && ' - '}
                  {item.endDate ? formatDate(item.endDate) : (item.startDate ? 'Současnost' : '')}
                </span>
              )}
            </div>
            {item.subTitle && (
              <div className="font-medium" style={secondaryTextStyle}>{item.subTitle}</div>
            )}
            {item.description && (
              <p className="mt-2" style={bodyTextStyle}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div style={{ fontFamily: fonts.body, backgroundColor: colors.background }} className="p-6 rounded-lg">
      <header className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={headingStyle}>
            {data.personal.name}
          </h1>
          <p className="text-lg mt-1" style={secondaryTextStyle}>{data.personal.title}</p>
        </div>
        
        <div className="mt-3 md:mt-0 text-sm flex flex-col items-start">
          {data.personal.email && (
            <div className="flex items-center mb-1">
              <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
                <Mail size={12} />
              </span>
              <span style={bodyTextStyle}>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center mb-1">
              <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
                <Phone size={12} />
              </span>
              <span style={bodyTextStyle}>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.address && (
            <div className="flex items-center mb-1">
              <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
                <MapPin size={12} />
              </span>
              <span style={bodyTextStyle}>{data.personal.address}</span>
            </div>
          )}
          {data.personal.dateOfBirth && (
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
                <Calendar size={12} />
              </span>
              <span style={bodyTextStyle}>{formatDateFull(data.personal.dateOfBirth)}</span>
            </div>
          )}
        </div>
      </header>
      
      <section className="p-5 rounded-lg shadow-sm" style={{ ...sectionStyle, backgroundColor: '#ffffff' }}>
        <h2 className="text-xl font-bold mb-3" style={headingStyle}>O mně</h2>
        <p style={bodyTextStyle}>{data.personal.about}</p>
      </section>
      
      <section style={sectionStyle}>
        <h2 className="text-xl font-bold flex items-center mb-4" style={headingStyle}>
          <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
            <Briefcase size={16} />
          </span>
          Pracovní zkušenosti
        </h2>
        
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-5 rounded-lg shadow-sm" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex justify-between flex-wrap">
                <h3 className="font-bold text-lg" style={secondaryTextStyle}>{exp.title}</h3>
                <span className="font-medium" style={secondaryTextStyle}>
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
                </span>
              </div>
              <div className="font-medium" style={secondaryTextStyle}>{exp.company}</div>
              <p className="mt-2" style={bodyTextStyle}>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section style={sectionStyle}>
        <h2 className="text-xl font-bold flex items-center mb-4" style={headingStyle}>
          <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
            <GraduationCap size={16} />
          </span>
          Vzdělání
        </h2>
        
        <div className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-5 rounded-lg shadow-sm" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex justify-between flex-wrap">
                <h3 className="font-bold text-lg" style={secondaryTextStyle}>{edu.degree}</h3>
                <span className="font-medium" style={secondaryTextStyle}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <div className="font-medium" style={secondaryTextStyle}>{edu.school}</div>
              <p className="mt-2" style={bodyTextStyle}>{edu.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="flex flex-wrap">
        <section className="w-full md:w-1/2 md:pr-4" style={sectionStyle}>
          <h2 className="text-xl font-bold flex items-center mb-4" style={headingStyle}>
            <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
              <Wrench size={16} />
            </span>
            Dovednosti
          </h2>
          
          <div className="p-5 rounded-lg shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <ul className="list-disc pl-5">
              {data.skills.map((skill) => (
                <div key={skill.id} className="mb-2 flex items-center">
                  <span className="mr-2 w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                  <span className="font-medium" style={bodyTextStyle}>{skill.name}</span>
                </div>
              ))}
            </ul>
          </div>
        </section>
        
        <section className="w-full md:w-1/2 md:pl-4" style={sectionStyle}>
          <h2 className="text-xl font-bold flex items-center mb-4" style={headingStyle}>
            <span className="w-8 h-8 mr-2 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
              <Languages size={16} />
            </span>
            Jazyky
          </h2>
          
          <div className="p-5 rounded-lg shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            {data.languages.map((language) => (
              <div key={language.id} className="mb-3 flex items-center">
                <span className="mr-2 w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                <span className="font-medium" style={bodyTextStyle}>{language.name}</span>
                <span className="ml-auto" style={secondaryTextStyle}>{language.level}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Custom Sections */}
      {data.customSections && data.customSections.map(renderCustomSection)}
    </div>
  );
}
