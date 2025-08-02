import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import GlassCard from '../../../components/GlassCard';
import { colors } from '../../../styles/colors';
import GradientButton from '../../../components/GradientButton';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { LoginCompanySlice } from '../../../redux/slices/Company/companyAuthSlice';
import ShowLogoPage from '../../main/ShowLogoPage';

const CompanyLogin = ({ navigation }: any) => {
  const { isLoggedIn } = useAppSelector(state => state.companyAuth);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('CompanyDashboard');
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    // Login logic
    let loginIdentifier = email.trim();
    if (
      !loginIdentifier.includes('@') &&
      !loginIdentifier.endsWith('.BHCFamily')
    ) {
      loginIdentifier = `${loginIdentifier}.BHCFamily`;
    }
    console.log('Sending login as:', loginIdentifier);
    if (!loginIdentifier || !password) {
      Alert.alert('Validation Error', 'Email/Username and Password required');
      return;
    }
    try {
      setLoading(true);
      const formValues = {
        email: loginIdentifier,
        password,
      };
      const result = await dispatch(LoginCompanySlice(formValues));

      if (result?.success) {
        navigation.navigate('CompanyDashboard');
      } else {
        Alert.alert(result?.message || 'Login Error');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(error?.message || 'Login Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    {/* Centered Animated Logo */}
       <ShowLogoPage />
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Company Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <GradientButton
          title="Login"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading || !email || !password}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('CompanyRegister')}
        >
          <Text style={styles.link}>Don't have an account? Register</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

export default CompanyLogin;
