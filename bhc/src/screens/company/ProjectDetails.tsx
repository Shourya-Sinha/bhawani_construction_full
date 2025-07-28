import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GlassCard from '../../components/GlassCard';
import ProjectStatus from '../../components/ProjectStatus';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';

const ProjectDetails = ({ route }: any) => {
  const { project } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>{project.name}</Text>
          <ProjectStatus status={project.status} style={styles.status} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Progress:</Text>
            <Text style={styles.detailValue}>{project.progress}%</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>Downtown, City</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Budget:</Text>
            <Text style={styles.detailValue}>₹2,500,000</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>15 Jan 2025</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Completion:</Text>
            <Text style={styles.detailValue}>30 Dec 2025</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Workers Assigned</Text>
          <View style={styles.workersContainer}>
            <WorkerItem name="Rajesh Kumar" role="Site Supervisor" />
            <WorkerItem name="Priya Sharma" role="Architect" />
            <WorkerItem name="Vikram Singh" role="Civil Engineer" />
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const WorkerItem = ({ name, role }: { name: string; role: string }) => (
  <View style={styles.workerItem}>
    <View style={styles.workerAvatar} />
    <View>
      <Text style={styles.workerName}>{name}</Text>
      <Text style={styles.workerRole}>{role}</Text>
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
    padding: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  status: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 15,
  },
  workersContainer: {
    // Style for workers list
  },
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    marginRight: 15,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  workerRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ProjectDetails;