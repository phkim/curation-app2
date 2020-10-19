import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native';

export default () => (
	<View style={styles.loader}>
		<ActivityIndicator color="#0000ff" />
	</View>
);

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
