import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Layout from '../constants/Layout';
import SiteItem from '../components/SiteItem';

const SearchResultItems = ({ loading, keywordItems }) => {
	const renderItem = ({item}) => {
		return <SiteItem key={item.siteItem.id} siteItem={item.siteItem} />
	}
	if (loading) {
		return (
			<View style={styles.contentBox}>
				<Text style={styles.title}>Loading...</Text>
				<View style={styles.separator} />
			</View>
		);
	} else if (keywordItems == null) {
		return (
			<View style={styles.contentBox}>
				<Text style={styles.title}>Search</Text>
				<View style={styles.separator} />
			</View>
		);
	} else if (keywordItems.length == 0) {
		return (
			<View style={styles.contentBox}>
				<Text style={styles.title}>No Result.</Text>
				<View style={styles.separator} />
			</View>
		);
	} else {
		return (
			<View style={styles.contentBox}>
				<FlatList 
					data={keywordItems}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
				/>
			</View>
		);
	}
};

export default SearchResultItems;

const styles = StyleSheet.create({
	background: {
		width: Layout.window.width,
		height: Layout.window.height,
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: Layout.window.width,
		height: 50,
	},
	searchInput: {
		width: Layout.window.width / 1.4,
		height: 40,
		padding: 10,
		backgroundColor: '#FAFAFA',
		borderWidth: 0.5,
		borderStyle: 'solid',
		borderColor: '#999',
		borderRadius: 4,
	},
	searchButton: {
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
	searchButtonText: {
		color: '#ffffff',
		textAlign: 'center',
		fontWeight: '600',
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: Layout.window.height,
	},
	contentBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: Layout.window.width,
		height: Layout.window.height - 50,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
		backgroundColor: '#eee',
	},
});
