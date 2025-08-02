import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../styles/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  // Animation values
  const glowAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const cardTilt = useRef(new Animated.Value(0)).current;

  // Glow animation effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ).start();

    // Moving line animation
    Animated.loop(
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Card tilt animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardTilt, {
          toValue: 0.03,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cardTilt, {
          toValue: -0.03,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Glow Global interpolation
  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1.8],
    outputRange: [0, 0.7],
  });
// Glow Global interpolation
    const glowContactInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0.9],
  });

  // Moving line position
  const linePosition = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100],
  });

  // Tilt transformation
  const tiltTransform = {
    transform: [
      {
        rotate: cardTilt.interpolate({
          inputRange: [-0.03, 0.03],
          outputRange: ['-3deg', '3deg'],
        }),
      },
    ],
  };

  const projects = [
    {
      id: '1',
      title: 'Modern Office Complex',
      location: 'Bangalore',
      status: 'In Progress',
      image: require('../../assets/project1.jpg'),
    },
    {
      id: '2',
      title: 'Residential Tower',
      location: 'Mumbai',
      status: 'Completed',
      image: require('../../assets/project2.jpg'),
    },
    {
      id: '3',
      title: 'Shopping Mall',
      location: 'Delhi',
      status: 'Upcoming',
      image: require('../../assets/project3.jpg'),
    },
  ];

  const testimonials = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      role: 'Project Manager',
      text: 'The team delivered our project 2 weeks ahead of schedule with exceptional quality.',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Architect',
      text: 'Working with Bhawani Construction was a seamless experience from start to finish.',
    },
    {
      id: '3',
      name: 'Vikram Singh',
      role: 'Civil Engineer',
      text: 'Their attention to detail and quality control is unmatched in the industry.',
    },
  ];

  const services = [
    {
      id: '1',
      title: 'Architectural Design',
      icon: 'architecture',
    },
    {
      id: '2',
      title: 'Construction',
      icon: 'construction',
    },
    {
      id: '3',
      title: 'Renovation',
      icon: 'home-repair-service',
    },
    {
      id: '4',
      title: 'Project Management',
      icon: 'assignment',
    },
  ];

  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '250+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '500+', label: 'Skilled Workers' },
  ];

  const renderService = (service: any) => (
    <Animated.View key={service.id} style={[styles.serviceCard, tiltTransform]}>
      <View style={styles.serviceIconContainer}>
        <MaterialIcons name={service.icon} size={32} color={colors.primary} />
      </View>
      <Text style={styles.serviceTitle}>{service.title}</Text>
    </Animated.View>
  );

  const renderStat = (stat: any, index: number) => (
    <View key={index} style={styles.statCard}>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hero Section with Glow Effect */}
        <ImageBackground
          source={require('../../assets/hero-bg.jpg')}
          style={styles.heroContainer}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <Animated.View
            style={[styles.glowOverlay, { opacity: glowInterpolation }]}
          />

          <GlassCard style={styles.heroCard}>
            <Text style={styles.heroTitle}>
              Building Dreams, Creating Legacies
            </Text>
            <Text style={styles.heroSubtitle}>
              Premium construction services with 15+ years of excellence
            </Text>

            <View style={styles.ctaContainer}>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => navigation.navigate('CompanyLogin')}
              >
                <Text style={styles.ctaText}>Login as Company</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.ctaButton, styles.secondaryCta]}
                onPress={() => navigation.navigate('WorkerLogin')}
              >
                <Text style={[styles.ctaText, { color: colors.primary }]}>Join as Worker</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate('CompanyRegister')}
              >
                <Text style={[styles.ctaText, { textAlign: 'center' }]} numberOfLines={2}>
                  Register as Company
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ctaButton, styles.secondaryCta]}
                onPress={() => navigation.navigate('WorkerRegister')}
              >
                <Text style={[styles.ctaText, { color: colors.primary }]} numberOfLines={2}>
                  Join as Worker
                </Text>
              </TouchableOpacity>
            </View> */}
          </GlassCard>
        </ImageBackground>

        {/* Animated Moving Line */}
        <Animated.View
          style={[
            styles.movingLine,
            { transform: [{ translateX: linePosition }] },
          ]}
        />

        {/* Featured Projects */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Projects</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectScroll}
        >
          {projects.map(project => (
            <ImageBackground
              key={project.id}
              source={project.image}
              style={styles.projectCard}
              imageStyle={styles.projectImage}
            >
              <Animated.View
                style={[styles.glowOverlay, { opacity: glowInterpolation }]}
              />
              <View style={styles.projectOverlay} />
              <GlassCard style={styles.projectContent}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <View style={styles.projectInfo}>
                  <MaterialIcons
                    name="location-on"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.projectLocation}>{project.location}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      project.status === 'In Progress' && styles.statusProgress,
                      project.status === 'Completed' && styles.statusCompleted,
                      project.status === 'Upcoming' && styles.statusUpcoming,
                    ]}
                  >
                    <Text style={styles.statusText}>{project.status}</Text>
                  </View>
                </View>
              </GlassCard>
            </ImageBackground>
          ))}
        </ScrollView>

        {/* Services Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesScroll}
        >
          {services.map(renderService)}
        </ScrollView>

        {/* Stats Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>By The Numbers</Text>
        </View>

        <View style={styles.statsContainer}>{stats.map(renderStat)}</View>

        {/* Testimonials */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Client Testimonials</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.testimonialScroll}
        >
          {testimonials.map(testimonial => (
            <Animated.View key={testimonial.id} style={[tiltTransform]}>
              <GlassCard style={styles.testimonialCard}>
                <MaterialIcons
                  name="format-quote"
                  size={32}
                  color={colors.primary}
                  style={styles.quoteIcon}
                />
                <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </GlassCard>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Contact CTA with Glow */}
        <Animated.View
          style={[styles.glowContainer, { opacity: glowContactInterpolation }]}
        >
          <GlassCard style={styles.contactCard}>
            <Text style={styles.contactTitle}>Start Your Project With Us</Text>
            <Text style={styles.contactText}>
              Get a free consultation with our expert team
            </Text>

            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Us</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 50,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  heroContainer: {
    height: 500,
    justifyContent: 'center',
    padding: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0,
  },
  movingLine: {
    height: 2,
    width: 200,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 510,
    zIndex: 10,
  },
  heroCard: {
    padding: 25,
    marginTop: 100,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 40,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
  },

  ctaButton: {
    flex: 1,
    height: 55,
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  // ctaButton: {
  //   flex: 1,
  //   minHeight: 55,
  //   backgroundColor: colors.primary,
  //   borderRadius: 25,
  //   marginHorizontal: 5,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: colors.primary,
  //   shadowOffset: { width: 0, height: 0 },
  //   shadowOpacity: 0.7,
  //   shadowRadius: 10,
  //   elevation: 10,
  //   paddingHorizontal: 10, // ensures text has breathing room inside
  // },
  secondaryCta: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    includeFontPadding: false, // for Android vertical alignment fix
    textAlignVertical: 'center', // only works on Android
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    position: 'relative',
    zIndex: 2,
    backgroundColor: colors.background,
    paddingRight: 10,
  },
  viewAll: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  projectScroll: {
    paddingHorizontal: 20,
  },
  projectCard: {
    width: width - 80,
    height: 300,
    marginRight: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  projectImage: {
    borderRadius: 20,
  },
  projectOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  projectContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    zIndex: 2,
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectLocation: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 5,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusProgress: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  statusUpcoming: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  servicesScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  serviceCard: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(25, 25, 60, 0.5)',
    borderRadius: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    width: '48%',
    padding: 20,
    backgroundColor: 'rgba(25, 25, 60, 0.5)',
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  testimonialScroll: {
    paddingHorizontal: 20,
  },
  testimonialCard: {
    width: width - 80,
    marginRight: 20,
    padding: 25,
  },
  quoteIcon: {
    marginBottom: 15,
  },
  testimonialText: {
    fontSize: 18,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: 20,
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  testimonialRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  glowContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 30,
    overflow: 'hidden',
  },
  contactCard: {
    padding: 30,
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
  },
  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen;
