import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getandsetCompanyinfo } from '../../redux/slices/Company/companyAllOtherSlice';
import { CompanyLogout } from '../../redux/slices/Company/companyAuthSlice';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditCompanyProfile'
>;

const CompanyProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.companyAuth);
  const companyInfo = useAppSelector(state => state.companyOther);
  const [refreshing, setRefreshing] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      await dispatch(getandsetCompanyinfo());
    } catch (error) {
      console.log('Error fetching profile info:', error);
      Alert.alert('Something went wrong while fetching company info');
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  console.log('company info in profile page', companyInfo);
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [companyData, setCompanyData] = useState({
    name: user?.companyName || 'N/A',
    tagline: 'Building the future, one project at a time',
    email: user?.email || 'N/A',
    phone: '+91 9876543210',
    address: '123 Construction Ave, Build City, IN 560001',
    website: 'www.constructpro.com',
    established: '2010',
    employees: '85',
    rating: '4.7',
    projectsCompleted: '48',
    activeProjects: '5',
    description:
      'ConstructPro Solutions is a leading construction management company with over 15 years of experience. We specialize in commercial and residential projects, delivering high-quality results on time and within budget.',
  });

  const [stats, setStats] = useState([
    { label: 'Total Projects', value: '53' },
    { label: 'Completed', value: '48' },
    { label: 'Active', value: '5' },
    { label: 'Workers', value: '85' },
    { label: 'Revenue', value: '₹8.6M' },
    { label: 'Rating', value: '4.7 ★' },
  ]);

  const [services, setServices] = useState([
    'Project Management',
    'Construction Consulting',
    'Architectural Design',
    'Renovation & Remodeling',
    'Quality Assurance',
    'Safety Compliance',
  ]);

  useEffect(() => {
    // In a real app, this would fetch company data from API
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        setCompanyData({
          ...companyData,
          rating: '4.8',
          activeProjects: '6',
        });
      }, 1000);
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditCompanyProfile');
  };
  const handleLogout=()=>{
    try {
      dispatch(CompanyLogout());
    } catch (error) {
      Alert.alert("Something Problem")
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <GlassCard style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="business" size={40} color={colors.primary} />
              </View>
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={18} color="#4CAF50" />
              </View>
            </View>

            <Text style={styles.companyName}>{companyData.name}</Text>
            <Text style={styles.tagline}>{companyData.tagline}</Text>

            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>
                {companyData.rating} (128 Reviews)
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Stats Grid */}
        <GlassCard style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Company Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Contact Information */}
        <GlassCard style={styles.card}>
        <GradientButton title="Logout" onPress={handleLogout} />
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <InfoItem icon="email" label={companyData.email} />
          <InfoItem icon="phone" label={companyData.phone} />
          <InfoItem icon="location-on" label={companyData.address} />
          <InfoItem icon="web" label={companyData.website} />
          <InfoItem icon="event" label={`Est. ${companyData.established}`} />
          <InfoItem
            icon="people"
            label={`${companyData.employees} employees`}
          />
        </GlassCard>

        {/* About Company */}
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.description}>{companyData.description}</Text>
        </GlassCard>

        {/* Services */}
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesContainer}>
            {services.map((service, index) => (
              <ServiceItem key={index} service={service} />
            ))}
          </View>
        </GlassCard>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <GradientButton
            title="Edit Profile"
            onPress={handleEditProfile}
            style={styles.button}
          />
          <GradientButton
            title="Share Profile"
            onPress={() => {}}
            style={[styles.button, styles.secondaryButton]}
            colors={['transparent', 'transparent']}
            textStyle={{ color: colors.primary }}
          />
        </View>
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

const ServiceItem = ({ service }: { service: string }) => (
  <View style={styles.serviceItem}>
    <Icon name="check-circle" size={18} color={colors.primary} />
    <Text style={styles.serviceText}>{service}</Text>
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
    marginBottom: 20,
    paddingVertical: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 10,
    padding: 5,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 5,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    padding: 25,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 15,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  servicesContainer: {
    marginTop: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  serviceText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});

export default CompanyProfile;
