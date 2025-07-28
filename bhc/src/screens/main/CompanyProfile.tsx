import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CompanyProfile = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar} />
            <Text style={styles.name}>ConstructPro Solutions</Text>
            <Text style={styles.tagline}>Building the future, one project at a time</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <InfoItem icon="location-on" label="123 Construction Ave, Build City" />
            <InfoItem icon="phone" label="+91 9876543210" />
            <InfoItem icon="email" label="contact@constructpro.com" />
            <InfoItem icon="web" label="www.constructpro.com" />
          </View>
        </GlassCard>
        
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.aboutText}>
            ConstructPro Solutions is a leading construction management company with over 15 years of experience. 
            We specialize in commercial and residential projects, delivering high-quality results on time and within budget.
          </Text>
        </GlassCard>
        
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <ServiceItem title="Project Management" />
          <ServiceItem title="Construction Consulting" />
          <ServiceItem title="Architectural Design" />
          <ServiceItem title="Renovation & Remodeling" />
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={20} color={colors.primary} />
    <Text style={styles.infoText}>{label}</Text>
  </View>
);

const ServiceItem = ({ title }: { title: string }) => (
  <View style={styles.serviceItem}>
    <View style={styles.bullet} />
    <Text style={styles.serviceText}>{title}</Text>
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
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  infoContainer: {
    marginTop: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  aboutText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  serviceText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default CompanyProfile;