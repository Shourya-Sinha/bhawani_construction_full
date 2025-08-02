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
import GradientButton from '../../../components/GradientButton';
import { colors } from '../../../styles/colors';
import ShowLogoPage from '../../main/ShowLogoPage';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { RegisterWorkerSlice } from '../../../redux/slices/Worker/workerAuthSlice';

const WorkerRegister = ({ navigation }: any) => {
  const { isLoggedIn } = useAppSelector(state => state.workerAuth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('WorkerDashboard');
    }
  }, [isLoggedIn]);

  const handleRegister = async () => {
    // Registration logic
    if (!name || !email || !password || !confirmPassword || !userName) {
      Alert.alert('Please fill all the fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password do not match');
      return;
    }
    const formValues = {
      email,
      password,
      userName,
      fullName: name,
    };
    try {
      setLoading(true);
      const result = await dispatch(RegisterWorkerSlice(formValues));
      if (result.success) {
        navigation.navigate('WorkerVerifyEmail', { email });
      } else {
        Alert.alert(result?.message || 'Registration Failed');
      }
    } catch (error: any) {
      Alert.alert(error?.message || 'Registraiton Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Centered Animated Logo */}
      <ShowLogoPage />
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Worker Registration</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="UserName (unique)"
          placeholderTextColor={colors.textSecondary}
          value={userName}
          onChangeText={setUserName}
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
            loading || !email || !password || !userName || !confirmPassword
          }
        />

        <TouchableOpacity onPress={() => navigation.navigate('WorkerLogin')}>
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

export default WorkerRegister;
