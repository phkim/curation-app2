import * as React from 'react';
import { Platform } from 'react-native';
import { Ionicons, Foundation } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import TabHomeScreen from '../screens/tabs/HomeScreen';
import TabSearchScreen from '../screens/tabs/SearchScreen';
import TabVIPScreen from "../screens/tabs/VIPScreen";
import TabAddScreen from '../screens/tabs/AddScreen';
import TabNotificationsScreen from '../screens/tabs/NotificationsScreen';
import TabProfileScreen from '../screens/tabs/ProfileScreen';
import TabAdminScreen from '../screens/tabs/AdminScreen';

import {
	BottomTabParamList,
	TabHomeParamList,
	TabSearchParamList,
	TabVIPParamList,
	TabAddParamList,
	TabProfileParamList,
	TabNotificationsParamList,
} from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
	const colorScheme = useColorScheme();

	//console.log('BottomTabNavigator.tsx - state: ');

	return (
		<BottomTab.Navigator
			initialRouteName="Home"
			tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
		>
			<BottomTab.Screen
				name="Home"
				component={TabHomeNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon
							name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="Search"
				component={TabSearchScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon
							name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="VIP"
				component={TabVIPScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon
							name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="Add"
				component={TabAddScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon
							name={
								Platform.OS === 'ios'
									? 'ios-add-circle-outline'
									: 'md-add-circle-outline'
							}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="Notifications"
				component={TabNotificationsScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon
							name={
								Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'
							}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="Profile"
				component={TabProfileScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon
							name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="Admin"
				component={TabAdminScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon
							name={Platform.OS === 'ios' ? 'ios-build' : 'md-build'}
							color={color}
						/>
					),
				}}
			/>
		</BottomTab.Navigator>
	);
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
	return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const TabHomeStack = createStackNavigator<TabHomeParamList>();
const TabSearchStack = createStackNavigator<TabSearchParamList>();
const TabVIPStack = createStackNavigator<TabVIPParamList>();
const TabAddStack = createStackNavigator<TabAddParamList>();
const TabNotificationsStack = createStackNavigator<TabNotificationsParamList>();
const TabProfileStack = createStackNavigator<TabProfileParamList>();

function TabHomeNavigator() {
	return (
		<TabHomeStack.Navigator>
			<TabHomeStack.Screen
				name="TabHomeScreen"
				component={TabHomeScreen}
				options={{
					headerShown: false,
					headerTitle: 'Home',
				}}
			/>
		</TabHomeStack.Navigator>
	);
}

function TabSearchNavigator() {
	return (
		<TabSearchStack.Navigator>
			<TabSearchStack.Screen
				name="TabSearchScreen"
				component={TabSearchScreen}
				options={{ headerTitle: 'Search' }}
			/>
		</TabSearchStack.Navigator>
	);
}

function TabVIPNavigator() {
	return (
		<TabSearchStack.Navigator>
			<TabVIPStack.Screen 
				name="TabVIPScreen"
				component={TabVIPScreen}
				options={{ headerTitle: 'VIP'}}
			/>
		</TabSearchStack.Navigator>
	);
}

function TabAddNavigator() {
	return (
		<TabAddStack.Navigator>
			<TabAddStack.Screen
				name="TabAddScreen"
				component={TabAddScreen}
				options={{ headerTitle: 'Add' }}
			/>
		</TabAddStack.Navigator>
	);
}

function TabNotificationsNavigator() {
	return (
		<TabNotificationsStack.Navigator>
			<TabNotificationsStack.Screen
				name="TabNotificationsScreen"
				component={TabNotificationsScreen}
				options={{ headerTitle: 'Notifications' }}
			/>
		</TabNotificationsStack.Navigator>
	);
}

function TabProfileNavigator() {
	return (
		<TabProfileStack.Navigator>
			<TabProfileStack.Screen
				name="TabProfileScreen"
				component={TabProfileScreen}
				options={{ headerTitle: 'Profile' }}
			/>
		</TabProfileStack.Navigator>
	);
}
