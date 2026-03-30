'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getPDFFont } from '@/lib/pdfFonts';

// Helper function for date formatting (simplified for PDF)
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
      backgroundColor: '#ffffff',
    },
    header: {
      textAlign: 'center',
      marginBottom: 32,
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
    contactInfo: {
      fontSize: 10,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.accent,
      marginVertical: 8,
    },
    section: {
      marginBottom: spacing.section,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
    },
    itemContainer: {
      marginBottom: 16,
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    itemDate: {
      fontSize: 10,
      fontStyle: 'italic',
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
      paddingHorizontal: 8,
    },
    listItem: {
      fontSize: 10,
      color: colors.text,
      marginBottom: 4,
      paddingLeft: 10,
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
    bullet: {
      position: 'absolute',
      left: 0,
    },
  });
};

export default function KlasickeTemplatePDF({ data, designSettings }) {
  const styles = createStyles(designSettings);

  // Render custom section
  const renderCustomSection = (section) => (
    <View key={section.id}>
      <View style={styles.divider} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.items && section.items.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>
              {item.title}{item.subTitle && `, ${item.subTitle}`}
            </Text>
            {(item.startDate || item.endDate === "current" || item.endDate) && (
              <Text style={styles.itemDate}>
                {item.startDate && formatDate(item.startDate)}
                {item.startDate && (item.endDate === "current" || item.endDate) && ' - '}
                {item.endDate === "current" ? 'Současnost' : item.endDate ? formatDate(item.endDate) : ''}
              </Text>
            )}
            {item.description && (
              <Text style={styles.itemDescription}>{item.description}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personal.name}</Text>
          <Text style={styles.title}>{data.personal.title}</Text>
          <Text style={styles.contactInfo}>
            {[data.personal.email, data.personal.phone].filter(Boolean).join(' | ')}
          </Text>
          <Text style={styles.contactInfo}>{data.personal.address}</Text>
          {data.personal.dateOfBirth && (
            <Text style={styles.contactInfo}>
              Datum narození: {formatDateFull(data.personal.dateOfBirth)}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Work Experience Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pracovní zkušenosti</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>
                {exp.title}, {exp.company}
              </Text>
              <Text style={styles.itemDate}>
                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Současnost'}
              </Text>
              {exp.description && (
                <Text style={styles.itemDescription}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vzdělání</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>
                {edu.degree}, {edu.school}
              </Text>
              <Text style={styles.itemDate}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </Text>
              {edu.description && (
                <Text style={styles.itemDescription}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Skills and Languages - Two Columns */}
        <View style={styles.columnsContainer}>
          {/* Skills Column */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Dovednosti</Text>
            {data.skills.map((skill) => (
              <View key={skill.id} style={styles.listRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.listItem}>{skill.name}</Text>
              </View>
            ))}
          </View>

          {/* Languages Column */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Jazyky</Text>
            {data.languages.map((language) => (
              <View key={language.id} style={styles.listRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.listItem}>
                  {language.name} - {language.level}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Custom Sections */}
        {data.customSections && data.customSections.map(renderCustomSection)}
      </Page>
    </Document>
  );
}
