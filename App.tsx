import { StatusBar } from 'expo-status-bar';
import React, { useState, useReducer } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

import { GraphQLClient } from 'graphql-request';

import config from './config';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import AuthContext from './context/AuthContext';
import ClientContext from './context/ClientContext';

export default function App() {
	const [client, setClient] = useState(null);
	const [state, dispatch] = useReducer(
		(prevState: any, action: any) => {
			switch (action.type) {
				case 'RESTORE_TOKEN':
					//console.log('RESTORE_TOKEN');
					//console.log(action.userId);
					return {
						...prevState,
						isLoading: false,
						userName: action.userName,
						userToken: action.userToken,
						userId: action.userId,
					};
				case 'SIGN_IN':
					//console.log('SIGN_IN: ');
					//console.log(prevState);
					return {
						...prevState,
						isSignout: false,
						userName: action.userName,
						userToken: action.userToken,
						userId: action.userId,
					};
				case 'SIGN_OUT':
					//console.log('SIGN_OUT: ');
					/*
					console.log({
						...prevState,
						isSignout: true,
						userName: '',
						userToken: null,
						userId: '',
					});
					*/
					return {
						...prevState,
						isSignout: true,
						userName: '',
						userToken: null,
						userId: '',
					};
			}
		},
		{
			isLoading: true,
			isSignout: false,
			userName: '',
			userToken: null,
			userId: '',
		}
	);

	React.useEffect(() => {
		// Fetch the token storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			try {
				// Get userToken from app storage if it has.
				let userToken = await AsyncStorage.getItem('userToken');

				// After restoring token, we may need to validate it in production apps
				// To Do: remove username and userId from AsyncStorage
				//        these values should be retrieved from userToken validation.
				let userName = await AsyncStorage.getItem('userName');
				let userId = await AsyncStorage.getItem('userId');

				// initialize client
				const client = new GraphQLClient(config.CURATION_BACKEND_URI, {
					headers: {
						authorization: 'Bearer ' + userToken,
					},
				});

				//console.log('new Client');
				setClient(client);

				//console.log('App.tsx - bootstrapAsync.userToke: ' + userToken);

				// This will switch to the App screen or Auth screen and this loading
				// screen will be unmounted thrown away.
				dispatch({
					type: 'RESTORE_TOKEN',
					userToken: userToken,
					userName: userName,
					userId: userId,
				});
			} catch (e) {
				console.log('Restoring token failed');
			}
		};

		bootstrapAsync();
	}, []);

	const authContext = React.useMemo(
		() => ({
			signIn: async (data: any) => {
				// In a production app, we need to send some data (usually username, password) to server and get a token
				// We will also need to handle errors if sign in failed
				// After getting token, we need to persist the token using 'AsyncStorage'
				// In the example, we'll use a dummy token

				let userId = '';
				let userName = data.userName;
				let userToken = '';

				try {
					switch (userName) {
						case 'philjae@gmail.com':
							userToken = 'ckev3zgqm00010epthv1b7nyy';
							userId = 'ckev3zgqm00010epthv1b7nyy';
							break;
						case 'phkim@ebay.com':
							userToken = 'ckev3vs0300000eptey9ph2xn';
							userId = 'ckev3vs0300000eptey9ph2xn';
							break;
						default:
							userToken = 'ckev3zgqm00010epthv1b7nyy';
							userId = 'ckev3zgqm00010epthv1b7nyy';
							break;
					}

					await AsyncStorage.setItem('userName', data.userName);
					await AsyncStorage.setItem('userToken', userId);
					await AsyncStorage.setItem('userId', userId);
				} catch (e) {
					console.log('signIn exception: ' + e);
				}

				//console.log('signIn() => userId: ' + userId);

				dispatch({
					type: 'SIGN_IN',
					userName: userName,
					userToken: userToken,
					userId: userId,
				});
			},
			signOut: () => {
				//console.log('App.tsx - signOut()');
				dispatch({ type: 'SIGN_OUT' });
			},
			signUp: async (data: any) => {
				// In a production app, we need to send user data to server and get a token
				// We will also need to handle errors if sign up failed
				// After getting token, we need to persist the token using 'AsyncStorage'
				// In the example, we'll use a dummy token

				dispatch({
					type: 'SIGN_IN',
					userToken: 'replace after sign up implemented',
				});
			},
		}),
		[]
	);

	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	} else if (client == null) {
		return null;
	} else {
		return (
			<AuthContext.Provider value={authContext}>
				<ClientContext.Provider value={client}>
					<SafeAreaProvider>
						<Navigation colorScheme={colorScheme} state={state} />
						<StatusBar />
					</SafeAreaProvider>
				</ClientContext.Provider>
			</AuthContext.Provider>
		);
	}
}
