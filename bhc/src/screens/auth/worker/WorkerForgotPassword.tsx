import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import GlassCard from '../../../components/GlassCard';
import GradientButton from '../../../components/GradientButton';
import { colors } from '../../../styles/colors';
import { glassStyles } from '../../../styles/glassmorphism';

const WorkerForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    // Reset logic
    navigation.navigate('WorkerResetPassword');
  };

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        
        <GradientButton 
          title="Send Reset Link" 
          onPress={handleReset} 
          style={styles.button} 
        />
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back to Login</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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

export default WorkerForgotPassword;