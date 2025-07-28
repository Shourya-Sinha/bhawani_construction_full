import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../styles/colors';
import { glassStyles } from '../../styles/glassmorphism';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditCompanyProfile = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    name: 'ConstructPro Solutions',
    tagline: 'Building the future, one project at a time',
    email: 'contact@constructpro.com',
    phone: '+91 9876543210',
    address: '123 Construction Ave, Build City, IN 560001',
    website: 'www.constructpro.com',
    established: '2010',
    description: 'ConstructPro Solutions is a leading construction management company with over 15 years of experience. We specialize in commercial and residential projects, delivering high-quality results on time and within budget.',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save logic would go here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>Edit Company Profile</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tagline</Text>
            <TextInput
              style={styles.input}
              value={formData.tagline}
              onChangeText={(text) => handleInputChange('tagline', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(text) => handleInputChange('website', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Established Year</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.established}
              onChangeText={(text) => handleInputChange('established', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>
          
          <View style={styles.buttonRow}>
            <GradientButton 
              title="Save Changes" 
              onPress={handleSave} 
              style={styles.button} 
            />
            <GradientButton 
              title="Cancel" 
              onPress={() => navigation.goBack()} 
              style={[styles.button, styles.secondaryButton]}
              colors={['transparent', 'transparent']}
              textStyle={{ color: colors.primary }}
            />
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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

export default EditCompanyProfile;