import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../context/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';

export default () => {
	var _menu: any;

	const { signOut } = React.useContext(AuthContext);

	const setMenuRef = (ref) => {
		_menu = ref;
	};

	const showMenu = () => {
		_menu.show();
	};

	const onSignOut = () => {
		try {
			_menu.hide();
			AsyncStorage.clear();
			signOut();
		} catch (e) {
			console.log('onSignOut exception e: ' + e);
		}
	};

	return (
		<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
			<Menu
				ref={setMenuRef}
				button={
					<TouchableOpacity onPress={showMenu}>
						<Ionicons
							name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
							onPress={showMenu}
						/>
					</TouchableOpacity>
				}
			>
				<MenuItem disabled>----</MenuItem>
				<MenuDivider />
				<MenuItem onPress={onSignOut}>Sign Out</MenuItem>
			</Menu>
		</View>
	);
};
