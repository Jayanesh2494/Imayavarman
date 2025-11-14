import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { Card } from './ui/Card';

export function AboutContent() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text variant="headlineMedium" style={styles.centerTitle}>
          Imayavarman Training Centre
        </Text>
        <Text variant="bodyLarge" style={styles.centerSubtitle}>
          Excellence in Traditional Silambam
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          About Us
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Imayavarman Training Centre is a premier institution dedicated to preserving and promoting the ancient martial art of Silambam. Founded with the vision of keeping traditional Tamil martial arts alive, we provide comprehensive training to students of all ages and skill levels.
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Our centre combines traditional teaching methods with modern training techniques, ensuring students receive well-rounded martial arts education while respecting the rich heritage of Silambam.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Master Manikandan
        </Text>
        <Text variant="titleMedium" style={styles.masterSubtitle}>
          Chief Instructor and Founder
        </Text>
        <Divider style={styles.divider} />
        <Text variant="bodyMedium" style={styles.paragraph}>
          Master Manikandan is a distinguished Silambam expert with over 15 years of experience in teaching and promoting this ancient martial art. His dedication to preserving traditional techniques while incorporating modern training methodologies has made him one of the most respected instructors in Tamil Nadu.
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          <Text style={styles.bold}>Achievements:</Text>
        </Text>
        <View style={styles.bulletList}>
          <Text variant="bodyMedium" style={styles.bullet}>
            • State Level Silambam Champion (2010, 2012, 2015)
          </Text>
          <Text variant="bodyMedium" style={styles.bullet}>
            • Certified Master Trainer from Tamil Nadu Silambam Association
          </Text>
          <Text variant="bodyMedium" style={styles.bullet}>
            • Trained over 500+ students across various age groups
          </Text>
          <Text variant="bodyMedium" style={styles.bullet}>
            • Regular participant in national and international demonstrations
          </Text>
          <Text variant="bodyMedium" style={styles.bullet}>
            • Awarded Best Silambam Instructor by Sports Authority of India
          </Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Our Training Programs
        </Text>
        <View style={styles.programList}>
          <View style={styles.programItem}>
            <Text variant="titleMedium" style={styles.programTitle}>
              Beginner Classes
            </Text>
            <Text variant="bodyMedium" style={styles.programDescription}>
              Foundation training for ages 8+
            </Text>
          </View>
          
          <View style={styles.programItem}>
            <Text variant="titleMedium" style={styles.programTitle}>
              Advanced Training
            </Text>
            <Text variant="bodyMedium" style={styles.programDescription}>
              Specialized techniques and competition preparation
            </Text>
          </View>
          
          <View style={styles.programItem}>
            <Text variant="titleMedium" style={styles.programTitle}>
              Women's Self-Defense
            </Text>
            <Text variant="bodyMedium" style={styles.programDescription}>
              Empowerment through martial arts
            </Text>
          </View>
          
          <View style={styles.programItem}>
            <Text variant="titleMedium" style={styles.programTitle}>
              Kids Program
            </Text>
            <Text variant="bodyMedium" style={styles.programDescription}>
              Age-appropriate training for children 5-12 years
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Contact Information
        </Text>
        <Text variant="bodyMedium" style={styles.contactItem}>
          📍 Chennai, Tamil Nadu, India
        </Text>
        <Text variant="bodyMedium" style={styles.contactItem}>
          📞 +91-7871096601
        </Text>
        <Text variant="bodyMedium" style={styles.contactItem}>
          📧 imayavarman.silambam@gmail.com
        </Text>
        <Text variant="bodyMedium" style={styles.contactItem}>
          🕒 Training Hours: Mon-Sat, 6:00 AM - 8:00 PM
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  centerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  centerSubtitle: {
    textAlign: 'center',
    marginTop: 4,
    color: '#666',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF6B35',
  },
  masterSubtitle: {
    color: '#004E89',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  bulletList: {
    marginLeft: 8,
  },
  bullet: {
    marginBottom: 6,
    lineHeight: 20,
  },
  programList: {
    marginTop: 8,
  },
  programItem: {
    marginBottom: 16,
  },
  programTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  programDescription: {
    color: '#666',
  },
  contactItem: {
    marginBottom: 8,
    lineHeight: 24,
  },
});
