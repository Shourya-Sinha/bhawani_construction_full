import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../styles/colors';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  colors?: (string | number)[];
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
};

const GradientButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}: GradientButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, (disabled || loading) && { opacity: 0.6 }]}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* <Text style={styles.text}>{title}</Text> */}
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.text]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GradientButton;
