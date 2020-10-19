import React from 'react';
import { ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from '../components/Loader';

export default ({ navigation, route }) => {
	let loading = false;

	return (
		<ScrollView>
			{loading ? (
				<Loader />
			) : (
				<WebView source={{ uri: 'https://reactnative.dev/' }} />
			)}
		</ScrollView>
	);
};
