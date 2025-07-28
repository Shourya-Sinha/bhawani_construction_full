import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '../styles/colors';

// Auth Screens
import CompanyLogin from '../screens/auth/company/CompanyLogin';
import CompanyRegister from '../screens/auth/company/CompanyRegister';
import ForgotPassword from '../screens/auth/company/ForgotPassword';
import ResetPassword from '../screens/auth/company/ResetPassword';
import WorkerLogin from '../screens/auth/worker/WorkerLogin';
import WorkerRegister from '../screens/auth/worker/WorkerRegister';
import WorkerForgotPassword from '../screens/auth/worker/WorkerForgotPassword';
import WorkerResetPassword from '../screens/auth/worker/WorkerResetPassword';

// Main Tabs
import MainTabNavigator from './MainTabNavigator';
import CompanyTabNavigator from './CompanyTabNavigator';
import WorkerTabNavigator from './WorkerTabNavigator';
import EditCompanyProfile from '../screens/company/EditCompanyProfile';
import { SafeAreaView, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const DummyScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24 }}>It works! or </Text>
  </View>
);

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.background },
          }}
          initialRouteName="MainTabs"
        >
          {/* Main Tabs */}
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />

          {/* Company Auth */}
          <Stack.Screen name="CompanyLogin" component={CompanyLogin} />
          <Stack.Screen name="CompanyRegister" component={CompanyRegister} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />

          {/* Worker Auth */}
          <Stack.Screen name="WorkerLogin" component={WorkerLogin} />
          <Stack.Screen name="WorkerRegister" component={WorkerRegister} />
          <Stack.Screen
            name="WorkerForgotPassword"
            component={WorkerForgotPassword}
          />
          <Stack.Screen
            name="WorkerResetPassword"
            component={WorkerResetPassword}
          />

          {/* Company Dashboard */}
          <Stack.Screen
            name="CompanyDashboard"
            component={CompanyTabNavigator}
          />
          <Stack.Screen
            name="EditCompanyProfile"
            component={EditCompanyProfile}
          />

          {/* Worker Dashboard */}
          <Stack.Screen name="WorkerDashboard" component={WorkerTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
