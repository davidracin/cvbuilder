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
      padding: 40,
      fontFamily: bodyFont,
      backgroundColor: colors.background || '#ffffff',
    },
    header: {
      marginBottom: spacing.section,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.primary,
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
    },
    contactItem: {
      fontSize: 10,
      color: colors.textSecondary,
      marginRight: 8,
    },
    contactSeparator: {
      fontSize: 10,
      color: colors.textSecondary,
      marginRight: 8,
    },
    section: {
      marginBottom: spacing.section,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: colors.accent,
      paddingBottom: 4,
      marginBottom: 12,
    },
    itemContainer: {
      marginBottom: 16,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    itemTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textSecondary,
      flex: 1,
    },
    itemDate: {
      fontSize: 10,
      color: colors.textSecondary,
    },
    itemSubtitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.4,
      marginTop: 4,
    },
    columnsContainer: {
      flexDirection: 'row',
      marginTop: 8,
    },
    column: {
      flex: 1,
      paddingRight: 10,
    },
    columnRight: {
      flex: 1,
      paddingLeft: 10,
    },
    listItem: {
      fontSize: 10,
      color: colors.text,
      marginBottom: 4,
    },
    bulletDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent,
      marginRight: 8,
      marginTop: 4,
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    listItemLevel: {
      fontSize: 9,
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });
};

export default function ModerniTemplatePDF({ data, designSettings }) {
  const styles = createStyles(designSettings);

  // Build contact items
  const contactItems = [
    data.personal.email,
    data.personal.phone,
    data.personal.address,
    data.personal.dateOfBirth ? formatDateFull(data.personal.dateOfBirth) : null,
  ].filter(Boolean);

  // Render custom section
  const renderCustomSection = (section) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items && section.items.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
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
          <Text style={styles.name}>{data.personal.name}</Text>
          <Text style={styles.title}>{data.personal.title}</Text>
          <View style={styles.contactRow}>
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                <Text style={styles.contactItem}>{item}</Text>
                {index < contactItems.length - 1 && (
                  <Text style={styles.contactSeparator}>|</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* About Section */}
        {data.personal.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O mně</Text>
            <Text style={styles.itemDescription}>{data.personal.about}</Text>
          </View>
        )}

        {/* Work Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pracovní zkušenosti</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.itemContainer}>
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
          <Text style={styles.sectionTitle}>Vzdělání</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Současnost'}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{edu.school}</Text>
              {edu.description && (
                <Text style={styles.itemDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Custom Sections */}
        {data.customSections && data.customSections.map(renderCustomSection)}

        {/* Skills and Languages - Two Columns */}
        <View style={styles.columnsContainer}>
          {/* Skills */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Dovednosti</Text>
            {data.skills.map((skill) => (
              <View key={skill.id} style={styles.listRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.listItem}>{skill.name}</Text>
              </View>
            ))}
          </View>

          {/* Languages */}
          <View style={styles.columnRight}>
            <Text style={styles.sectionTitle}>Jazyky</Text>
            {data.languages.map((language) => (
              <View key={language.id} style={styles.listRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.listItem}>{language.name}</Text>
                <Text style={styles.listItemLevel}>({language.level})</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
