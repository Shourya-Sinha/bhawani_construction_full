import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CompanyDashboard from '../screens/company/CompanyDashboard';
import CompanyProjects from '../screens/company/Projects';
import CompanyProfile from '../screens/company/Profile';
import TabBar from '../components/TabBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ColorValue } from 'react-native';

const Tab = createBottomTabNavigator();

const CompanyTabNavigator = () => {
  const getTabBarIcon = (iconName: string) => {
    return ({
      focused,
      color,
      size,
    }: {
      focused: boolean;
      color: ColorValue;
      size: number;
    }) => <Icon name={iconName} size={size} color={color} />;
  };
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="CompanyHome"
        component={CompanyDashboard}
        options={{ tabBarIcon: getTabBarIcon('dashboard') }}
      />
      <Tab.Screen
        name="Projects"
        component={CompanyProjects}
        options={{ 
          tabBarIcon: getTabBarIcon('list') 
        }}
      />
      <Tab.Screen
        name="CompanyProfile"
        component={CompanyProfile}
        options={{ 
          tabBarIcon: getTabBarIcon('person') 
        }}
      />
    </Tab.Navigator>
  );
};

export default CompanyTabNavigator;
