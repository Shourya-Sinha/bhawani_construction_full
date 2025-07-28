import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';

type ProjectStatusProps = {
  status: string;
  style?: StyleProp<ViewStyle>;
};

const ProjectStatus = ({ status, style }: ProjectStatusProps) => {
  const statusColors: Record<string, string> = {
    running: '#4CAF50',
    completed: '#2196F3',
    closed: '#9C27B0',
    stuck: '#FF9800',
  };

  return (
    <View style={[styles.container, { backgroundColor: `${statusColors[status]}20` }, style]}>
      <View style={[styles.dot, { backgroundColor: statusColors[status] }]} />
      <Text style={[styles.text, { color: statusColors[status] }]}>{status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProjectStatus;