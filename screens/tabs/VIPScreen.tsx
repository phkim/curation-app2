import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { WebView } from "react-native-webview";
import Layout from '../../constants/Layout';

export default function VIPScreen({ route }) {
	const [url, setUrl] = useState("https://cart.gmarket.co.kr/ko-m/cart");

	const LoadingIndicatorView = () => {
		return (<ActivityIndicator color='#009b88' size='large' />)
	}

	useEffect(() => {
		const initVIP = async () => {
			if(route != null &&
				route.params != null &&
				route.params.siteItem != null){
					setUrl('http://mitem.gmarket.co.kr/Item?goodscode='+route.params.siteItem.itemId);
			}
		}

		initVIP();
	}, [route]);

	console.log(Layout.window.height);

	return (
		<View style={styles.background}>
			<SafeAreaView style={styles.container}>
				<WebView 
					source={{ uri: url }}
					style={styles.webview}
					originWhitelist={['*']}
					renderLoading={LoadingIndicatorView}
					startInLoadingState={true}
				/>
		 	</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	background: {
		width: Layout.window.width,
		height: Layout.window.height,
	},
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: Layout.window.width,
		height: Layout.window.height > 890 ? (Layout.window.height-80) : (Layout.window.height-50),
	},
	contentBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: Layout.window.width,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: Layout.window.width - 100,
	},
	webview: {
		height: Layout.window.height > 890 ? (Layout.window.height-80) : (Layout.window.height-50),
		width: Layout.window.width
	}
});
