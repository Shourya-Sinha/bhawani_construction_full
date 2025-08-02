import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../styles/colors';
import ProjectStatus from '../../components/ProjectStatus';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import GradientButton from '../../components/GradientButton';
import { WorkerLogout } from '../../redux/slices/Worker/workerAuthSlice';
import { useFocusEffect } from '@react-navigation/core';

const WorkerDashboard = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user,isLoggedIn } = useAppSelector(state => state.workerAuth);
  // console.log('user info in worker dashboard', user);
useFocusEffect(
  useCallback(() => {
    if (!isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'WorkerLogin' }],
      });
    }
  }, [isLoggedIn])
);

  const handleLogout = async () => {
    try {
      await dispatch(WorkerLogout());
      console.log('Worker logurt success');
    } catch (error) {
      console.error('Worker logout failed', error);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.headerCard}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome back, {user?.fullName || user?.googleName || 'N/A'}!
          </Text>
        </GlassCard>

        <GlassCard style={styles.statsCard}>
          <View style={styles.statRow}>
            <StatItem value="2" label="Active Projects" />
            <StatItem value="15" label="Total Projects" />
          </View>
          <View style={styles.statRow}>
            <StatItem value="92%" label="Completion Rate" />
            <StatItem value="4.8" label="Rating" />
          </View>
          <View>
            <GradientButton title="Logout" onPress={handleLogout} />
          </View>
        </GlassCard>

        <GlassCard style={styles.projectCard}>
          <Text style={styles.sectionTitle}>Current Projects</Text>

          <ProjectItem name="Office Building" status="running" progress={65} />

          <ProjectItem name="Hospital" status="running" progress={45} />
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

const ProjectItem = ({
  name,
  status,
  progress,
}: {
  name: string;
  status: string;
  progress: number;
}) => (
  <View style={styles.projectItem}>
    <Text style={styles.projectName}>{name}</Text>
    <View style={styles.projectStatus}>
      <ProjectStatus status={status} />
      <Text style={styles.progressText}>{progress}% complete</Text>
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
  headerCard: {
    marginBottom: 25,
    paddingVertical: 30,
  },
  statsCard: {
    marginBottom: 25,
    padding: 20,
  },
  projectCard: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  projectItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  projectStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: colors.textSecondary,
  },
});

export default WorkerDashboard;
