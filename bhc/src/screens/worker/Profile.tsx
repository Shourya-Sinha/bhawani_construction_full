import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { WorkerUpdateInfo } from '../../redux/slices/Worker/workerOtherAllSlices';

const WorkerProfile = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useAppSelector(state => state.workerAuth);
  const { userInfo } = useAppSelector(state => state.workerOther);

  console.log('userinfo in worker profile poage', userInfo);
  // console.log('user info in worker dashboard', user);
  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('WorkerLogin');
    }
  }, [isLoggedIn]);

  const getInitials = (name?: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleImageUpload = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        return Alert.alert(
          'Error',
          response.errorMessage || 'Something went wrong.',
        );
      }

      const asset = response.assets?.[0];
      if (!asset) return Alert.alert('Error', 'No image selected.');

      const { uri, fileName, fileSize, type } = asset;

      if (!uri) return Alert.alert('Error', 'Image URI not found.');

      if (!['image/jpeg', 'image/jpg'].includes(type || '')) {
        return Alert.alert(
          'Invalid Format',
          'Only JPG or JPEG images are allowed.',
        );
      }

      if ((fileSize || 0) > 1024 * 1024) {
        return Alert.alert('File Too Large', 'Image must be under 1MB.');
      }

      const formData = new FormData();
      formData.append('profilePic', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: fileName || `profile_${Date.now()}.jpg`,
        type: type || 'image/jpeg',
      });
      try {
        setLoading(true);
        const result = await dispatch(WorkerUpdateInfo(formData) as any);
        Alert.alert(result?.message || 'Upload Success');
      } catch (err: any) {
        console.error(err);
        Alert.alert(err?.message || 'Upload Failed!! Try agin later');
      } finally {
        setLoading(false);
      }
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {userInfo?.profilePic?.url ? (
                <Image
                  source={{ uri: userInfo?.profilePic?.url }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>
                    {getInitials(user?.fullName)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleImageUpload}
              >
                {loading ? (
                  <ActivityIndicator size={'small'} color={'#fff'} />
                ) : (
                  <View style={styles.plusIcon}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>
              {user?.fullName || user?.googleName || 'N/A'}
            </Text>
            <Text style={styles.role}>Senior Carpenter</Text>
          </View>

          <View style={styles.infoContainer}>
            <InfoItem icon="email" label={user?.email || 'N/A'} />
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
          <CertificationItem
            title="Advanced Carpentry Certification"
            year="2022"
          />
          <CertificationItem
            title="Safety Training Certification"
            year="2021"
          />
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

const CertificationItem = ({
  title,
  year,
}: {
  title: string;
  year: string;
}) => (
  <View style={styles.certItem}>
    <Icon name="verified" size={24} color={colors.primary} />
    <View style={styles.certText}>
      <Text style={styles.certTitle}>{title}</Text>
      <Text style={styles.certYear}>Issued: {year}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  plusIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  plusText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    marginBottom: 15,
    position: 'relative',
    backgroundColor: colors.primary,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: colors.glass,
  },

  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: colors.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  addButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
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
