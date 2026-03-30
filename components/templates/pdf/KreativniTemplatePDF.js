'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from '@react-pdf/renderer';
import { getPDFFont } from '@/lib/pdfFonts';

// Helper function for date formatting
const formatDate = (isoDate) => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    const months = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return isoDate;
  }
};

const formatDateFull = (isoDate) => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    const months = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return isoDate;
  }
};

// SVG Icon components for PDF
const MailIcon = ({ color, size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke={color} strokeWidth={3}/>
    <Path d="M22 6l-10 7L2 6" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const PhoneIcon = ({ color, size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const MapPinIcon = ({ color, size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill="none" stroke={color} strokeWidth={3}/>
    <Circle cx={12} cy={10} r={3} fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const CalendarIcon = ({ color, size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" fill="none" stroke={color} strokeWidth={3}/>
    <Path d="M16 2v4M8 2v4M3 10h18" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const BriefcaseIcon = ({ color, size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" fill="none" stroke={color} strokeWidth={3}/>
    <Path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const GraduationCapIcon = ({ color, size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M22 10l-10-5L2 10l10 5 10-5z" fill="none" stroke={color} strokeWidth={3}/>
    <Path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const WrenchIcon = ({ color, size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const LanguagesIcon = ({ color, size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1" fill="none" stroke={color} strokeWidth={3}/>
    <Path d="M22 22l-5-10-5 10M14 18h6" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

const StarIcon = ({ color, size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke={color} strokeWidth={3}/>
  </Svg>
);

// Icon badge wrapper for contact icons
const IconBadge = ({ color, children }) => (
  <View style={{ 
    width: 20, 
    height: 20, 
    marginRight: 8, 
    borderRadius: 10, 
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {children}
  </View>
);

// Section icon badge (larger)
const SectionIconBadge = ({ color, children }) => (
  <View style={{ 
    width: 24, 
    height: 24, 
    marginRight: 8, 
    borderRadius: 12, 
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {children}
  </View>
);

// Create styles based on designSettings
const createStyles = (designSettings) => {
  const { colors, fonts, spacing } = designSettings;
  const headingFont = getPDFFont(fonts.heading);
  const bodyFont = getPDFFont(fonts.body);

  return StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: bodyFont,
      backgroundColor: colors.background || '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: 'flex-start',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.primary,
      marginBottom: 4,
    },
    title: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    contactText: {
      fontSize: 10,
      color: colors.text,
    },
    card: {
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 8,
      marginBottom: spacing.section,
    },
    section: {
      marginBottom: spacing.section,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.primary,
      marginBottom: 12,
    },
    itemCard: {
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 6,
      marginBottom: 24,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    itemTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textSecondary,
      flex: 1,
    },
    itemDate: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    itemSubtitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.4,
      marginTop: 8,
    },
    columnsContainer: {
      flexDirection: 'row',
    },
    column: {
      flex: 1,
      marginRight: 10,
    },
    columnRight: {
      flex: 1,
      marginLeft: 10,
    },
    skillItem: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 6,
    },
    languageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    languageDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
      marginRight: 8,
    },
    languageName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    languageLevel: {
      fontSize: 10,
      color: colors.textSecondary,
    },
  });
};

export default function KreativniTemplatePDF({ data, designSettings }) {
  const styles = createStyles(designSettings);
  const { colors } = designSettings;

  // Render custom section
  const renderCustomSection = (section) => (
    <View key={section.id} style={styles.section}>
      <View style={styles.sectionHeader}>
        <SectionIconBadge color={colors.accent}>
          <StarIcon color="#ffffff" size={12} />
        </SectionIconBadge>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      {section.items && section.items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {(item.startDate || item.endDate === "current" || item.endDate) && (
              <Text style={styles.itemDate}>
                {item.startDate && formatDate(item.startDate)}
                {item.startDate && (item.endDate === "current" || item.endDate) && ' - '}
                {item.endDate === "current" ? 'Současnost' : item.endDate ? formatDate(item.endDate) : ''}
              </Text>
            )}
          </View>
          {item.subTitle && (
            <Text style={styles.itemSubtitle}>{item.subTitle}</Text>
          )}
          {item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{data.personal.name}</Text>
            <Text style={styles.title}>{data.personal.title}</Text>
          </View>
          <View style={styles.headerRight}>
            {data.personal.email && (
              <View style={styles.contactRow}>
                <IconBadge color={colors.accent}>
                  <MailIcon color="#ffffff" size={10} />
                </IconBadge>
                <Text style={styles.contactText}>{data.personal.email}</Text>
              </View>
            )}
            {data.personal.phone && (
              <View style={styles.contactRow}>
                <IconBadge color={colors.accent}>
                  <PhoneIcon color="#ffffff" size={10} />
                </IconBadge>
                <Text style={styles.contactText}>{data.personal.phone}</Text>
              </View>
            )}
            {data.personal.address && (
              <View style={styles.contactRow}>
                <IconBadge color={colors.accent}>
                  <MapPinIcon color="#ffffff" size={10} />
                </IconBadge>
                <Text style={styles.contactText}>{data.personal.address}</Text>
              </View>
            )}
            {data.personal.dateOfBirth && (
              <View style={styles.contactRow}>
                <IconBadge color={colors.accent}>
                  <CalendarIcon color="#ffffff" size={10} />
                </IconBadge>
                <Text style={styles.contactText}>{formatDateFull(data.personal.dateOfBirth)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* About Section */}
        {data.personal.about && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>O mně</Text>
            <Text style={styles.itemDescription}>{data.personal.about}</Text>
          </View>
        )}

        {/* Work Experience */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionIconBadge color={colors.accent}>
              <BriefcaseIcon color="#ffffff" size={12} />
            </SectionIconBadge>
            <Text style={styles.sectionTitle}>Pracovní zkušenosti</Text>
          </View>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.title}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
              {exp.description && (
                <Text style={styles.itemDescription}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionIconBadge color={colors.accent}>
              <GraduationCapIcon color="#ffffff" size={12} />
            </SectionIconBadge>
            <Text style={styles.sectionTitle}>Vzdělání</Text>
          </View>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{edu.school}</Text>
              {edu.description && (
                <Text style={styles.itemDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Skills and Languages - Two Columns */}
        <View style={styles.columnsContainer}>
          {/* Skills */}
          <View style={styles.column}>
            <View style={styles.sectionHeader}>
              <SectionIconBadge color={colors.accent}>
                <WrenchIcon color="#ffffff" size={12} />
              </SectionIconBadge>
              <Text style={styles.sectionTitle}>Dovednosti</Text>
            </View>
            <View style={styles.itemCard}>
              {data.skills.map((skill) => (
                <Text key={skill.id} style={styles.skillItem}>• {skill.name}</Text>
              ))}
            </View>
          </View>

          {/* Languages */}
          <View style={styles.columnRight}>
            <View style={styles.sectionHeader}>
              <SectionIconBadge color={colors.accent}>
                <LanguagesIcon color="#ffffff" size={12} />
              </SectionIconBadge>
              <Text style={styles.sectionTitle}>Jazyky</Text>
            </View>
            <View style={styles.itemCard}>
              {data.languages.map((language) => (
                <View key={language.id} style={styles.languageRow}>
                  <View style={styles.languageDot} />
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageLevel}>{language.level}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Custom Sections */}
        {data.customSections && data.customSections.map(renderCustomSection)}
      </Page>
    </Document>
  );
}
