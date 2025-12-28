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
    },
    // Left sidebar styles
    sidebar: {
      width: '33%',
      backgroundColor: colors.primary,
      padding: 20,
      paddingTop: 30,
      minHeight: '100%',
    },
    sidebarName: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: 4,
    },
    sidebarTitle: {
      fontSize: 11,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: 20,
    },
    sidebarSection: {
      marginBottom: 20,
    },
    sidebarSectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: colors.accent,
      paddingBottom: 6,
      marginBottom: 10,
    },
    sidebarText: {
      fontSize: 10,
      color: '#ffffff',
      marginBottom: 4,
      lineHeight: 1.4,
    },
    sidebarListItem: {
      fontSize: 10,
      color: '#ffffff',
      marginBottom: 6,
    },
    languageItem: {
      marginBottom: 8,
    },
    languageName: {
      fontSize: 10,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    languageLevel: {
      fontSize: 9,
      color: 'rgba(255, 255, 255, 0.7)',
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
      marginBottom: 12,
    },
    paragraph: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.5,
    },
    itemContainer: {
      marginBottom: 14,
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
      marginBottom: 4,
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
          </View>

          {/* Skills Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Dovednosti</Text>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={styles.sidebarListItem}>• {skill.name}</Text>
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
        </View>
      </Page>
    </Document>
  );
}
