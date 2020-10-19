import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, View } from '../components/Themed';
import SignInButton from '../components/buttons/SignInButton';
import AuthContext from '../context/AuthContext';
import Layout from '../constants/Layout';

export default function SignInScreen() {
	const [userName, setUserName] = React.useState('');
	const [password, setPassword] = React.useState('');

	const { signIn } = React.useContext(AuthContext);

	const onSubmitEditing = () => {
		console.log('SignInScreen.tsx - onEndEditing');

		onSignIn();
	};

	const onSignIn = () => {
		console.log(
			'SignInScreen.tsx - onSignIn(' + userName + ',' + password + ')'
		);

		signIn({ userName, password });
	};

	useEffect(() => {
		console.log('SignInScreen.tsx - useEffect()');
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Curation Pilot</Text>
			<View
				style={styles.separator}
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>
			<TextInput
				placeholder="Username"
				value={userName}
				autoFocus={true}
				keyboardType={'email-address'}
				returnKeyLabel={'Sign In'}
				onChangeText={setUserName}
				onSubmitEditing={onSubmitEditing}
				style={{
					width: Layout.window.width / 1.7,
					padding: 10,
					borderWidth: 0.5,
					borderStyle: 'solid',
					borderColor: '#999',
					borderRadius: 4,
				}}
			/>
			<SignInButton text="Sign In" onPress={onSignIn}></SignInButton>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
