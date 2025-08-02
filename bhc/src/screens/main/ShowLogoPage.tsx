import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import logo from '../../assets/logo_2.png';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/core';
import handIcon from '../../assets/press.png';

type HomeNavProp = StackNavigationProp<RootStackParamList>;

const ShowLogoPage = () => {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const handAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<HomeNavProp>();

  useEffect(() => {
    Animated.spring(logoAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(handAnim, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(handAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const goToHome = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };
  return (
    <View style={styles.logoContainer}>
      <Pressable onPress={goToHome} >
        <Animated.Image
          source={logo}
          style={[
            styles.logo,
            { transform: [{ scale: logoAnim }] }, // 👈 animation here
          ]}
          resizeMode="contain"
        />
        <Animated.Image
          source={handIcon}
          style={[styles.handIcon, { transform: [{ scale: handAnim }] }]}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  gradientStrip: {
    flex: 1,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  handIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 20,
    right: -10,
    opacity: 0.8,
  },
});

export default ShowLogoPage;
