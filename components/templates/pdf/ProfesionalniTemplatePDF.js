'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
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

// Create styles based on designSettings
const createStyles = (designSettings) => {
  const { colors, fonts, spacing } = designSettings;
  const headingFont = getPDFFont(fonts.heading);
  const bodyFont = getPDFFont(fonts.body);

  return StyleSheet.create({
    page: {
      flexDirection: 'row',
      fontFamily: bodyFont,
      backgroundColor: '#ffffff',
      padding: 0,
    },
    // Left sidebar styles
    sidebar: {
      width: '33%',
      backgroundColor: colors.sidebar || colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 25,
      minHeight: '100%',
    },
    sidebarName: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.sidebarText || '#ffffff',
      textAlign: 'center',
      marginBottom: 4,
    },
    sidebarTitle: {
      fontSize: 11,
      color: colors.sidebarText ? `${colors.sidebarText}cc` : 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: 20,
    },
    sidebarSection: {
      marginBottom: 32,
    },
    sidebarSectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.sidebarText || '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: colors.accent,
      paddingBottom: 8,
      marginBottom: 12,
    },
    sidebarText: {
      fontSize: 10,
      color: colors.sidebarText || '#ffffff',
      marginBottom: 4,
      lineHeight: 1.4,
    },
    sidebarListItem: {
      fontSize: 10,
      color: colors.sidebarText || '#ffffff',
      marginBottom: 6,
    },
    sidebarBulletDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent,
      marginRight: 8,
      marginTop: 4,
    },
    sidebarListRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    languageItem: {
      marginBottom: 8,
    },
    languageName: {
      fontSize: 10,
      color: colors.sidebarText || '#ffffff',
      fontWeight: 'bold',
    },
    languageLevel: {
      fontSize: 9,
      color: colors.sidebarText ? `${colors.sidebarText}b3` : 'rgba(255, 255, 255, 0.7)',
    },
    // Right content styles
    content: {
      width: '67%',
      padding: 25,
      paddingTop: 30,
    },
    section: {
      marginBottom: spacing.section,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.primary,
      borderBottomWidth: 2,
      borderBottomColor: colors.accent,
      paddingBottom: 8,
      marginBottom: 16,
    },
    paragraph: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.5,
    },
    itemContainer: {
      marginBottom: 16,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    itemTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textSecondary,
      flex: 1,
    },
    itemDateBadge: {
      backgroundColor: colors.background || '#f5f5f5',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 3,
    },
    itemDate: {
      fontSize: 9,
      color: colors.textSecondary,
    },
    itemSubtitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    itemDescription: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.4,
    },
    // Separator line
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: colors.accent,
      marginTop: 8,
      marginBottom: 12,
    },
  });
};

export default function ProfesionalniTemplatePDF({ data, designSettings }) {
  const styles = createStyles(designSettings);

  // Render custom section
  const renderCustomSection = (section) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items && section.items.map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {(item.startDate || item.endDate === "current" || item.endDate) && (
              <View style={styles.itemDateBadge}>
                <Text style={styles.itemDate}>
                  {item.startDate && formatDate(item.startDate)}
                  {item.startDate && (item.endDate === "current" || item.endDate) && ' - '}
                  {item.endDate === "current" ? 'Současnost' : item.endDate ? formatDate(item.endDate) : ''}
                </Text>
              </View>
            )}
          </View>
          {item.subTitle && (
            <Text style={styles.itemSubtitle}>{item.subTitle}</Text>
          )}
          {item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}
          {index < section.items.length - 1 && (
            <View style={styles.separator} />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {/* Name and Title */}
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sidebarName}>{data.personal.name}</Text>
            <Text style={styles.sidebarTitle}>{data.personal.title}</Text>
          </View>

          {/* Contact Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Kontakt</Text>
            <Text style={styles.sidebarText}>{data.personal.email}</Text>
            <Text style={styles.sidebarText}>{data.personal.phone}</Text>
            <Text style={styles.sidebarText}>{data.personal.address}</Text>
            {data.personal.dateOfBirth && (
              <Text style={styles.sidebarText}>{formatDateFull(data.personal.dateOfBirth)}</Text>
            )}
          </View>

          {/* Skills Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Dovednosti</Text>
            {data.skills.map((skill) => (
              <View key={skill.id} style={styles.sidebarListRow}>
                <View style={styles.sidebarBulletDot} />
                <Text style={styles.sidebarListItem}>{skill.name}</Text>
              </View>
            ))}
          </View>

          {/* Languages Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Jazyky</Text>
            {data.languages.map((language) => (
              <View key={language.id} style={styles.languageItem}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageLevel}>{language.level}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right Content */}
        <View style={styles.content}>
          {/* About Section */}
          {data.personal.about && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>O mně</Text>
              <Text style={styles.paragraph}>{data.personal.about}</Text>
            </View>
          )}

          {/* Work Experience */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pracovní zkušenosti</Text>
            {data.experience.map((exp, index) => (
              <View key={exp.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <View style={styles.itemDateBadge}>
                    <Text style={styles.itemDate}>
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
                {index < data.experience.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>

          {/* Education */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vzdělání</Text>
            {data.education.map((edu, index) => (
              <View key={edu.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <View style={styles.itemDateBadge}>
                    <Text style={styles.itemDate}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemSubtitle}>{edu.school}</Text>
                {edu.description && (
                  <Text style={styles.itemDescription}>{edu.description}</Text>
                )}
                {index < data.education.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>

          {/* Custom Sections */}
          {data.customSections && data.customSections.map(renderCustomSection)}
        </View>
      </Page>
    </Document>
  );
}
