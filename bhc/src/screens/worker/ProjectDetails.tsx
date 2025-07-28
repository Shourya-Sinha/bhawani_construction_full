import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GlassCard from '../../components/GlassCard';
import ProjectStatus from '../../components/ProjectStatus';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WorkerProjectDetails = ({ route }: any) => {
  const { project } = route.params || {
    name: 'Office Building',
    status: 'running',
    progress: 65,
    location: 'Downtown, Mumbai',
    budget: '₹1,200,000',
    startDate: '15 Jan 2025',
    endDate: '30 Dec 2025',
    description: 'Construction of a 10-story office building with modern amenities and eco-friendly design.'
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>{project.name}</Text>
          <ProjectStatus status={project.status} style={styles.status} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Your Role:</Text>
            <Text style={styles.detailValue}>Carpentry Lead</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Progress:</Text>
            <Text style={styles.detailValue}>{project.progress}%</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{project.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Budget:</Text>
            <Text style={styles.detailValue}>{project.budget}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>{project.startDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>End Date:</Text>
            <Text style={styles.detailValue}>{project.endDate}</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Project Description</Text>
          <Text style={styles.description}>{project.description}</Text>
          
          <Text style={styles.sectionTitle}>Tasks Assigned</Text>
          <TaskItem title="Install wooden frames" completed />
          <TaskItem title="Build custom cabinets" completed />
          <TaskItem title="Install doors and windows" />
          <TaskItem title="Finish wood surfaces" />
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const TaskItem = ({ title, completed = false }: { title: string; completed?: boolean }) => (
  <View style={styles.taskItem}>
    <Icon 
      name={completed ? "check-circle" : "radio-button-unchecked"} 
      size={24} 
      color={completed ? colors.primary : colors.textSecondary} 
    />
    <Text style={[styles.taskText, completed && styles.completedTask]}>{title}</Text>
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
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
});

export default WorkerProjectDetails;