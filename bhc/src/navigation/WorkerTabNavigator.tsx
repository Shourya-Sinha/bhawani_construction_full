import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkerDashboard from '../screens/worker/Dashboard';
import AvailableProjects from '../screens/worker/AvailableProjects';
import WorkerProfile from '../screens/worker/Profile';
import TabBar from '../components/TabBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ColorValue } from 'react-native';

const Tab = createBottomTabNavigator();

const WorkerTabNavigator = () => {
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
        name="WorkerHome"
        component={WorkerDashboard}
        options={{ tabBarIcon: getTabBarIcon('dashboard') }}
      />
      <Tab.Screen
        name="AvailableProjects"
        component={AvailableProjects}
        options={{ tabBarIcon: getTabBarIcon('work') }}
      />
      <Tab.Screen
        name="WorkerProfile"
        component={WorkerProfile}
        options={{ tabBarIcon: getTabBarIcon('person') }}
      />
    </Tab.Navigator>
  );
};

export default WorkerTabNavigator;
