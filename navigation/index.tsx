import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Button, ColorSchemeName, View, Text, TextInput } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
	colorScheme,
	state,
}: {
	colorScheme: ColorSchemeName;
	state: any;
}) {
	// A root stack navigator is often used for displaying modals on top of all other content
	// Read more here: https://reactnavigation.org/docs/modal
	const Stack = createStackNavigator<RootStackParamList>();

	if (state.isLoading) {
		return <SplashScreen />;
	} else {
		//console.log('./navigation/index.tsx - state: ');
		//console.log(state);
		return (
			<NavigationContainer
				linking={LinkingConfiguration}
				theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
			>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					{state.userToken == null ? (
						<>
							<Stack.Screen
								name="SignIn"
								component={SignInScreen}
								options={{
									title: 'Sign In',
									animationTypeForReplace: state.isSignout ? 'pop' : 'push',
								}}
							/>
						</>
					) : (
						//User is sign in
						<>
							<Stack.Screen
								name="Root"
								component={BottomTabNavigator}
								initialParams={state}
							/>
							<Stack.Screen
								name="NotFound"
								component={NotFoundScreen}
								options={{ title: 'Oops!' }}
							/>
						</>
					)}
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
