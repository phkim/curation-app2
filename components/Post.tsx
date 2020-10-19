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

const Post = ({ navigation, user, post }) => {
	const handlePostClick = async () => {
		//console.log(post);
		navigation.navigate('Search', {
			keywordId: post.keyword.id,
			keyword: post.keyword.keyword,
			siteItemId: post.siteItem.id,
		});
	};

	const handleHashTagClick = async (hashTag) => {
		navigation.navigate('Search', {
			keywordId: null,
			keyword: hashTag,
			siteItemId: null
		});
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity>
					<Image style={styles.avatar} source={{ uri: user.avatarUrl }} />
				</TouchableOpacity>
				<TouchableOpacity>
					<View style={styles.headerUserContainer}>
						<Text style={styles.bold}>{user.username}</Text>
						<Text>{post.location}</Text>
					</View>
				</TouchableOpacity>
			</View>
			<TouchableOpacity onPress={handlePostClick}>
				{post.medias.map((media) => {
					//console.log(media.id);
					return (
						<Image
							style={styles.postImage}
							key={media.id}
							source={{ uri: media.url }}
						/>
					);
				})}
			</TouchableOpacity>
			<View style={styles.infoContainer}>
				<View style={styles.iconsContainer}>
					<TouchableOpacity>
						<View style={styles.iconContainer}>
							<Ionicons
								size={24}
								name={
									Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'
								}
							/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity>
						<View style={styles.iconContainer}>
							<Ionicons
								size={24}
								name={Platform.OS === 'ios' ? 'ios-text' : 'md-text'}
							/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.caption}>
					<Text style={styles.bold}>{user.username} </Text>
					{post.hashTagsOnPosts.map((hashTagOnPost) => {
						return (
							<TouchableOpacity key={hashTagOnPost.hashTag.id} onPress={() => handleHashTagClick(hashTagOnPost.hashTag.hashTag)}>
								<View key={hashTagOnPost.hashTag.id}>
									{hashTagOnPost.hashTag.hashTag == post.keyword.keyword ? (
										<Text style={{ fontWeight: 'bold' }}>
											#{hashTagOnPost.hashTag.hashTag}{' '}
										</Text>
									) : (
										<Text>#{hashTagOnPost.hashTag.hashTag} </Text>
									)}
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		</View>
	);
};

export default Post;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		width: Layout.window.width,
	},
	header: {
		padding: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	headerUserContainer: {
		marginLeft: 10,
	},
	bold: {
		fontWeight: '500',
	},
	location: {
		fontSize: 12,
	},
	postImage: {
		width: Layout.window.width,
		height: Layout.window.width,
	},
	infoContainer: {
		padding: 10,
	},
	iconsContainer: {
		flexDirection: 'row',
		marginBottom: 5,
	},
	iconContainer: {
		marginRight: 10,
	},
	caption: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginTop: 5,
		marginLeft: 0,
	},
	commentCount: {
		opacity: 0.5,
		fontSize: 13,
	},
});
