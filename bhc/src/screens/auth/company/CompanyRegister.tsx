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
import { RegisterCompanySlice } from '../../../redux/slices/Company/companyAuthSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

const CompanyRegister = ({ navigation }: any) => {
  const { isLoggedIn } = useAppSelector(state => state.companyAuth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('CompanyDashboard');
    }
  }, [isLoggedIn]);

  const handleRegister = async () => {
    // Registration logic
    if (!name || !email || !userName || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill all the fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password do not match');
      return;
    }
    const formValues = {
      email,
      password,
      companyName: name,
      userName,
    };
    try {
      setLoading(true);
      const result = await dispatch(RegisterCompanySlice(formValues));
      if (result.success) {
        navigation.navigate('CompanyVerifyEmail', { email });
      } else {
        Alert.alert('Registration Failed', result.message || 'Try again later');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during registration');
    } finally {
      setLoading(false); // 🧹 Clean and guaranteed stop loader
    }
  };

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Company Registration</Text>

        <TextInput
          style={styles.input}
          placeholder="Company Name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="User Name"
          placeholderTextColor={colors.textSecondary}
          value={userName}
          onChangeText={setuserName}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <GradientButton
          title="Register"
          onPress={handleRegister}
          style={styles.button}
          loading={loading}
          disabled={
            loading ||
            !email ||
            !password ||
            !name ||
            !userName ||
            !confirmPassword
          }
        />

        <TouchableOpacity onPress={() => navigation.navigate('CompanyLogin')}>
          <Text style={styles.link}>Already have an account? Login</Text>
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

export default CompanyRegister;
