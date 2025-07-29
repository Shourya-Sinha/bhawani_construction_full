import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import GlassCard from '../../../components/GlassCard';
import GradientButton from '../../../components/GradientButton';
import { colors } from '../../../styles/colors';
import { useAppDispatch } from '../../../redux/store';
import { VerifyEmailCompanySlice } from '../../../redux/slices/Company/companyAuthSlice';

const VerifyEmail = ({ navigation, route }: any) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { email: passedEmail } = route.params || {};
  const [email, setEmail] = useState(passedEmail || '');
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (!email || !otp) {
      Alert.alert('Please fill in both fields');
      return;
    }
    const formValues = {
      email,
      otp,
    };

    try {
      setLoading(true);
      const result = await dispatch(VerifyEmailCompanySlice(formValues));

      if (result.success) {
        navigation.navigate('CompanyDashboard');
      } else {
        Alert.alert(
          'Email Verification Failed',
          result.message || 'Try again later',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during Verification');
    } finally {
      setLoading(false); // 🧹 Clean and guaranteed stop loader
    }
  };

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Verify Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <GradientButton
          title="Verify"
          onPress={handleVerify}
          style={styles.button}
          loading={loading}
          disabled={loading || !email || !otp}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back to Register</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  button: {
    marginTop: 10,
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 15,
  },
});

export default VerifyEmail;
