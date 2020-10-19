import * as React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../constants/Layout';

const SiteItem = ({ siteItem }) => {

	let site = siteItem.site == null ? "" : siteItem.site;
	let itemId = siteItem.itemId == null ? "" : siteItem.itemId;
	let itemName = siteItem.itemName == null ? "" : siteItem.itemName;
	let sellingPrice = siteItem.sellingPrice == null ? 0 : siteItem.sellingPrice;
	let discountPrice1 = siteItem.discountPrice1 == null ? 0 : siteItem.discountPrice1;
	let discountPrice2 = siteItem.discountPrice2 == null ? 0 : siteItem.discountPrice2;

	let imageUrl =
		'http://gdimg.gmarket.co.kr/' +
		itemId +
		'/still/280?ver=' +
		new Date().toISOString();

	const handleImageClick = async () => {};

	return (
		<View style={styles.container}>
			<View>
				<Image style={styles.itemImage} source={{ uri: imageUrl }} />
			</View>
			<View style={styles.infoBox}>
				<View>
					<Text>{itemName}</Text>
				</View>
				<View>
					<Text>{sellingPrice}</Text>
				</View>
			</View>
		</View>
	);
};

export default SiteItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		marginTop: 20,
		marginBottom: 20,
		width: Layout.window.width,
		height: 150,
	},
	itemImage: {
		width: 150,
		height: 150,
	},
	infoBox: {
		width: Layout.window.width - 150,
		height: 150,
		borderColor: '#aaaaaa',
	},
});
