import React, { useContext } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View } from '../../components/Themed';
import AuthContext from '../../context/AuthContext';
import Layout from '../../constants/Layout';

export default function ProfileScreen() {
	const { signOut } = React.useContext(AuthContext);

	const onSignOut = async () => {
		try {
			console.log('ProfileScreen.tsx - onSignOut');
			await AsyncStorage.clear();
			signOut();
		} catch (e) {
			console.log('onSignOut exception e: ' + e);
		}
	};

	return (
		<View style={styles.background}>
			<SafeAreaView style={styles.container}>
				<ScrollView>
					<View style={styles.profileMenuBar}>
						<TouchableOpacity onPress={onSignOut}>
							<View style={styles.logoutButton}>
								<Text style={styles.logoutButtonText}>로그아웃</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.container}>
						<Text style={styles.title}>Profile</Text>
						<View
							style={styles.separator}
							lightColor="#eee"
							darkColor="rgba(255,255,255,0.1)"
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	background: {
		width: Layout.window.width,
		height: Layout.window.height,
	},
	profileMenuBar: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		height: 50,
	},
	logoutButton: {
		width: Layout.window.width / 7,
		height: 40,
		marginLeft: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#3897f0',
		borderWidth: 0.5,
		borderStyle: 'solid',
		borderColor: '#999',
		borderRadius: 4,
	},
	logoutButtonText: {
		color: '#ffffff',
		textAlign: 'center',
		fontWeight: '600',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: Layout.window.height - 80,
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
