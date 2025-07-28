import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import GlassCard from '../../../components/GlassCard';
import { colors } from '../../../styles/colors';
import { glassStyles } from '../../../styles/glassmorphism';
import GradientButton from '../../../components/GradientButton';

const CompanyRegister = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Registration logic
    navigation.navigate('CompanyDashboard');
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