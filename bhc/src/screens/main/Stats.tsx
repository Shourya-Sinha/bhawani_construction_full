import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';

const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>Company Statistics</Text>
          
          <View style={styles.statContainer}>
            <StatItem value="24" label="Total Projects" />
            <StatItem value="18" label="Completed" />
            <StatItem value="5" label="In Progress" />
            <StatItem value="1" label="On Hold" />
          </View>
          
          <View style={styles.statContainer}>
            <StatItem value="86" label="Total Workers" />
            <StatItem value="₹8.6M" label="Total Revenue" />
            <StatItem value="4.8" label="Avg. Rating" />
          </View>
        </GlassCard>
        
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          {/* Charts would go here */}
          <View style={styles.chartPlaceholder} />
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    marginTop: 10,
  },
});

export default StatsScreen;