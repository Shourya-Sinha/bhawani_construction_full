import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../styles/colors';
import ProjectStatus from '../../components/ProjectStatus';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getandsetCompanyinfo } from '../../redux/slices/Company/companyAllOtherSlice';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompanyLogout } from '../../redux/slices/Company/companyAuthSlice';

const CompanyDashboard = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector(state => state.companyAuth);
  const [refreshing, setRefreshing] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      if (isLoggedIn) {
        await dispatch(getandsetCompanyinfo());
      }
    } catch (error) {
      console.log('Error fetching profile info:', error);
      // Alert.alert('Something went wrong while fetching company info');
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isLoggedIn]);
  useEffect(() => {
    const checkTokenExpiry = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token'); // or AsyncStorage for React Native
        if (token) {
          const decoded: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            dispatch(CompanyLogout());
            navigation.navigate('CompanyLogin');
          }
        }
      } catch (err) {
        console.log('Token decode error:', err);
        dispatch(CompanyLogout());
        navigation.navigate('CompanyLogin');
      }
    };

    checkTokenExpiry();
  }, [dispatch, navigation]);
  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('CompanyLogin');
    }
  }, [isLoggedIn]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <GlassCard style={styles.headerCard}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome back, {user?.companyName || null}!
          </Text>
        </GlassCard>

        <GlassCard style={styles.statsCard}>
          <View style={styles.statRow}>
            <StatItem value="5" label="Active Projects" />
            <StatItem value="24" label="Workers" />
          </View>
          <View style={styles.statRow}>
            <StatItem value="3" label="Completed" />
            <StatItem value="₹1.2M" label="Revenue" />
          </View>
        </GlassCard>

        <GlassCard style={styles.projectCard}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>

          <ProjectItem name="Office Building" status="running" progress={65} />

          <ProjectItem name="Shopping Mall" status="completed" progress={100} />

          <ProjectItem name="Residential Tower" status="stuck" progress={30} />
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

export default CompanyDashboard;
