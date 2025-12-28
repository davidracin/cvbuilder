'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Circle } from '@react-pdf/renderer';
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

// Icon component using SVG circles
const IconBadge = ({ color }) => (
  <View style={{ width: 20, height: 20, marginRight: 8, borderRadius: 10, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="12" height="12" viewBox="0 0 12 12">
      <Circle cx="6" cy="6" r="2" fill="white" />
    </Svg>
  </View>
);

// Section icon badge (larger)
const SectionIconBadge = ({ color }) => (
  <View style={{ width: 24, height: 24, marginRight: 8, borderRadius: 12, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width="14" height="14" viewBox="0 0 14 14">
      <Circle cx="7" cy="7" r="3" fill="white" />
    </Svg>
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
      marginBottom: 20,
      paddingBottom: 15,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: 'flex-end',
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
      padding: 15,
      borderRadius: 8,
      marginBottom: spacing.section,
    },
    section: {
      marginBottom: spacing.section,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: headingFont,
      color: colors.primary,
    },
    itemCard: {
      backgroundColor: '#ffffff',
      padding: 12,
      borderRadius: 6,
      marginBottom: 8,
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
            <View style={styles.contactRow}>
              <IconBadge color={colors.accent} />
              <Text style={styles.contactText}>{data.personal.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <IconBadge color={colors.accent} />
              <Text style={styles.contactText}>{data.personal.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <IconBadge color={colors.accent} />
              <Text style={styles.contactText}>{data.personal.address}</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        {data.personal.about && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>O mně</Text>
            <Text style={[styles.itemDescription, { marginTop: 8 }]}>{data.personal.about}</Text>
          </View>
        )}

        {/* Work Experience */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionIconBadge color={colors.accent} />
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
            <SectionIconBadge color={colors.accent} />
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
              <SectionIconBadge color={colors.accent} />
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
              <SectionIconBadge color={colors.accent} />
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
      </Page>
    </Document>
  );
}
