import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import GlassCard from '../../components/GlassCard';
import ProjectStatus from '../../components/ProjectStatus';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';

const projects = [
  { id: '1', name: 'Office Building', status: 'running', progress: 65 },
  { id: '2', name: 'Shopping Mall', status: 'completed', progress: 100 },
  { id: '3', name: 'Residential Tower', status: 'stuck', progress: 30 },
  { id: '4', name: 'Hospital', status: 'running', progress: 45 },
];

const CompanyProjects = ({ navigation }: any) => {
  const renderProject = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProjectDetails', { project: item })}>
      <GlassCard style={styles.projectCard}>
        <Text style={styles.projectName}>{item.name}</Text>
        <ProjectStatus status={item.status} />
        <Text style={styles.progressText}>Progress: {item.progress}%</Text>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  listContent: {
    paddingBottom: 30,
  },
  projectCard: {
    marginBottom: 15,
    padding: 20,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
  },
});

export default CompanyProjects;