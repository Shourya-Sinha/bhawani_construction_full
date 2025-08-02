import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/Home';
import StatsScreen from '../screens/main/Stats';
import CompanyProfile from '../screens/main/CompanyProfile';
import TabBar from '../components/TabBar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const getTabBarIcon = (iconName: string) => {
    return ({ focused, color, size }: { 
      focused: boolean; 
      color: string; 
      size: number 
    }) => (
      <Icon 
        name={iconName} 
        size={size} 
        color={color} 
      />
    );
  };
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: getTabBarIcon('home') }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ tabBarIcon: getTabBarIcon('insights') }}
      />
      <Tab.Screen
        name="CompanyProfile"
        component={CompanyProfile}
        options={{ tabBarIcon: getTabBarIcon('business') }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
