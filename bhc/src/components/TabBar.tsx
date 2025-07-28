import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import GlassCard from './GlassCard';
import LinearGradient from 'react-native-linear-gradient';

const TabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.container}>
      <GlassCard style={styles.tabBar}>
        <LinearGradient
          colors={[colors.glass, 'rgba(25, 25, 60, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.tabBarInner}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              navigation.navigate(route.name);
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
              >
                {options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? colors.primary : colors.textSecondary,
                  size: 26
                })}
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    right: 5,
  },
  tabBar: {
    borderRadius: 30,
    paddingVertical: 15,
    overflow: 'hidden',
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBar;