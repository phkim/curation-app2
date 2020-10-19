import React from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Layout from '../../constants/Layout';

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#3897f0',
		width: Layout.window.width / 1.7,
		height: 35,
		padding: 10,
		marginTop: 5,
		borderRadius: 4,
	},
	text: {
		color: '#ffffff',
		textAlign: 'center',
		fontWeight: '600',
	},
});

const SignInButton = ({ text, onPress, loading = false }) => (
	<TouchableOpacity disabled={loading} onPress={onPress}>
		<View style={styles.container}>
			{loading ? (
				<ActivityIndicator />
			) : (
				<Text style={styles.text}>{text}</Text>
			)}
		</View>
	</TouchableOpacity>
);

export default SignInButton;
