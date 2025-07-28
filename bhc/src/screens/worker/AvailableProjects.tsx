import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import GlassCard from '../../components/GlassCard';
import ProjectStatus from '../../components/ProjectStatus';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';
import GradientButton from '../../components/GradientButton';

const projects = [
  { id: '1', name: 'Office Building', location: 'Downtown', duration: '6 months', budget: '₹1,200,000' },
  { id: '2', name: 'Residential Tower', location: 'West Side', duration: '8 months', budget: '₹1,800,000' },
  { id: '3', name: 'Hospital', location: 'North District', duration: '12 months', budget: '₹2,500,000' },
];

const AvailableProjects = ({ navigation }: any) => {
  const renderProject = ({ item }: any) => (
    <GlassCard style={styles.projectCard}>
      <Text style={styles.projectName}>{item.name}</Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Location:</Text>
        <Text style={styles.detailValue}>{item.location}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Duration:</Text>
        <Text style={styles.detailValue}>{item.duration}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Budget:</Text>
        <Text style={styles.detailValue}>{item.budget}</Text>
      </View>
      
      <GradientButton 
        title="Apply for Project" 
        onPress={() => {}} 
        style={styles.button} 
      />
    </GlassCard>
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
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  button: {
    marginTop: 15,
  },
});

export default AvailableProjects;