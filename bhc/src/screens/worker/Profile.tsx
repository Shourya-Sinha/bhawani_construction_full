import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WorkerProfile = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar} />
            <Text style={styles.name}>Rajesh Kumar</Text>
            <Text style={styles.role}>Senior Carpenter</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <InfoItem icon="email" label="rajesh@constructpro.com" />
            <InfoItem icon="phone" label="+91 9876543210" />
            <InfoItem icon="location-on" label="Mumbai, India" />
            <InfoItem icon="work" label="5 years experience" />
          </View>
        </GlassCard>
        
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Worker Information</Text>
          <InfoRow label="Projects Completed" value="24" />
          <InfoRow label="Active Projects" value="2" />
          <InfoRow label="Rating" value="4.7 ★" />
          <InfoRow label="Skills" value="Carpentry, Woodwork, Finishing" />
        </GlassCard>
        
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <CertificationItem title="Advanced Carpentry Certification" year="2022" />
          <CertificationItem title="Safety Training Certification" year="2021" />
          <CertificationItem title="Woodwork Mastery Program" year="2020" />
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={24} color={colors.primary} />
    <Text style={styles.infoText}>{label}</Text>
  </View>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const CertificationItem = ({ title, year }: { title: string; year: string }) => (
  <View style={styles.certItem}>
    <Icon name="verified" size={24} color={colors.primary} />
    <View style={styles.certText}>
      <Text style={styles.certTitle}>{title}</Text>
      <Text style={styles.certYear}>Issued: {year}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  card: {
    marginBottom: 25,
    padding: 25,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glass,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  role: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  certText: {
    flex: 1,
    marginLeft: 10,
  },
  certTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  certYear: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 3,
  },
});

export default WorkerProfile;