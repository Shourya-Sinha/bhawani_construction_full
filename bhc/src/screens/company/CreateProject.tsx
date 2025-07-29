import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import { colors } from '../../styles/colors';

const CreateProject = ({ navigation }: any) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const handleCreate = () => {
    // Create project logic
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>Create New Project</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            placeholderTextColor={colors.textSecondary}
            value={projectName}
            onChangeText={setProjectName}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Budget (₹)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
          
          <GradientButton 
            title="Create Project" 
            onPress={handleCreate} 
            style={styles.button} 
          />
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
    flexGrow: 1,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 10,
  },
});

export default CreateProject;