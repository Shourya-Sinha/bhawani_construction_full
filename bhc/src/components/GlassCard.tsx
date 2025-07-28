import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { glassStyles } from '../styles/glassmorphism';
import { colors } from '../styles/colors';

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const GlassCard = ({ children, style }: GlassCardProps) => {
  return (
    <View style={[glassStyles.container, style]}>
      {/* 3D Effect Layer */}
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.05)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Main Glass Layer */}
      <LinearGradient
        colors={[colors.glass, 'rgba(25, 25, 60, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={glassStyles.inner}>{children}</View>
    </View>
  );
};

export default GlassCard;
