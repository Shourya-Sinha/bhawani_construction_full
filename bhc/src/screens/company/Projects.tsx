import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ViewStyle,
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import ProjectStatus from '../../components/ProjectStatus';
import { colors } from '../../styles/colors';
import GradientButton from '../../components/GradientButton';
import { Animated, Easing } from 'react-native';

const projects = [
  { id: '1', name: 'Office Building', status: 'running', progress: 65 },
  { id: '2', name: 'Shopping Mall', status: 'completed', progress: 100 },
  { id: '3', name: 'Residential Tower', status: 'stuck', progress: 30 },
  { id: '4', name: 'Hospital', status: 'running', progress: 45 },
];

interface ProjectFormData {
  projectName: string;
  budget: string;
  deadline: string;
  bidClosingDate: string;
  estimatedDuration: string;
  category: string;
  requirements: string[];
  carpetArea: string;
  location: string;
  priorityLevel: string;
  locationCoords: string;
  projectFile?: File | null;
}

const PublishProjectForm = ({
  onSubmit,
}: {
  onSubmit: (data: ProjectFormData) => void;
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    budget: '',
    deadline: '',
    bidClosingDate: '',
    estimatedDuration: '',
    category: '',
    requirements: [''],
    carpetArea: '',
    location: '',
    priorityLevel: '',
    locationCoords: '',
    projectFile: null,
  });

  const handleChange = (key: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.formContainer}>
      <TextInput
      placeholderTextColor="#fff" 
        placeholder="Project Name"
        onChangeText={v => handleChange('projectName', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Budget"
        onChangeText={v => handleChange('budget', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Deadline"
        onChangeText={v => handleChange('deadline', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Bid Closing Date"
        onChangeText={v => handleChange('bidClosingDate', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Estimated Duration"
        onChangeText={v => handleChange('estimatedDuration', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Category"
        onChangeText={v => handleChange('category', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Requirements (comma separated)"
        onChangeText={v => handleChange('requirements', v.split(','))}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Carpet Area"
        onChangeText={v => handleChange('carpetArea', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Location"
        onChangeText={v => handleChange('location', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Priority Level"
        onChangeText={v => handleChange('priorityLevel', v)}
        style={styles.input}
      />
      <TextInput
      placeholderTextColor="#fff"
        placeholder="Location Coords"
        onChangeText={v => handleChange('locationCoords', v)}
        style={styles.input}
      />
      {/* For file uploads you can add file picker logic later */}
      <GradientButton
        title="Create Project"
        onPress={() => onSubmit(formData)}
      />
    </ScrollView>
  );
};

const CompanyProjects = ({ navigation }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [formSlideAnim] = useState(new Animated.Value(0));

  const renderProject = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProjectDetails', { project: item })}
    >
      <GlassCard style={styles.projectCard}>
        <Text style={styles.projectName}>{item.name}</Text>
        <ProjectStatus status={item.status} />
        <Text style={styles.progressText}>Progress: {item.progress}%</Text>
      </GlassCard>
    </TouchableOpacity>
  );

  const toggleForm = () => {
    const toValue = showForm ? 0 : 1;
    setShowForm(!showForm);
    Animated.timing(formSlideAnim, {
      toValue,
      duration: 400,
      useNativeDriver: false,
      easing: Easing.out(Easing.exp),
    }).start();
  };
  const slideDownStyle: Animated.WithAnimatedObject<ViewStyle> = {
    height: formSlideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 460],
    }),
    overflow: 'hidden' as 'hidden', // 👈 fix the typing issue here
  };

  const handleNewProject = () => {
    toggleForm();
  };

  const submitProject = (data: ProjectFormData) => {
    console.log('Submitted project:', data);
    // TODO: Send API call here with form data
  };

  return (
    <View style={styles.container}>
      {/* Button Section */}
      <GlassCard style={styles.buttonCard}>
        <GradientButton
          title="Publish New Project"
          onPress={handleNewProject}
        />
      </GlassCard>
      {/* Sliding Form */}
      <Animated.View style={[slideDownStyle]}>
        {showForm && (
          <GlassCard style={styles.formCard}>
            <PublishProjectForm onSubmit={submitProject} />
          </GlassCard>
        )}
      </Animated.View>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 50,
  },
  formContainer: {
    padding: 10,
    marginBottom:20
  },
  formCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom:10
  },
  listContent: {
    paddingBottom: 30,
  },
  projectCard: {
    marginBottom: 15,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    color: '#fff',
    fontSize:10
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
  },
  buttonCard: {
    marginBottom: 15,
    padding: 10,
  },
});

export default CompanyProjects;
