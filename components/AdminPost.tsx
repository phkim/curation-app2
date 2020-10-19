import React, { useContext, useState } from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from 'react-native';
import { gql } from 'graphql-request';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

import ClientContext from '../context/ClientContext';
import Layout from '../constants/Layout';

const UPDATE_KEYWORD_IS_STOP = gql`
	mutation upsertKeyword($keyword: String!, $isStop: Boolean!) {
		upsertKeyword(keyword: $keyword, isStop: $isStop) {
			id
			keyword
			isStop
		}
	}
`;

const UPDATE_TREND_KEYWORD_FOR_HIDING = gql`
	mutation upsertTrendKeywordByAdmin(
		$id: String
		$keywordId: String!
		$hideUntil: String!
	) {
		upsertTrendKeywordByAdmin(
			id: $id
			keywordId: $keywordId
			hideUntil: $hideUntil
		) {
			id
			keywordId
			keyword {
				id
				keyword
			}
			hideUntil
		}
	}
`;

const UPSERT_POST_BY_USER_SITE_ITEM = gql`
	mutation upsertPostByUserSiteItem(
		$id: String
		$userId: String!
		$siteItemId: String!
		$keywordId: String!
		$location: String
		$caption: String
		$imageScore: Float
		$curationScore: Float
		$popularityNow: Int
		$popularityDay: Int
		$popularityWeek: Int
		$popularityMonth: Int
		$popularityQuarter: Int
		$popularityYear: Int
		$nowScore: Float
		$dayScore: Float
		$weekScore: Float
		$monthScore: Float
		$quarterScore: Float
		$yearScore: Float
	) {
		upsertPostByUserSiteItem(
			id: $id
			userId: $userId
			siteItemId: $siteItemId
			keywordId: $keywordId
			location: $location
			caption: $caption
			imageScore: $imageScore
			curationScore: $curationScore
			popularityNow: $popularityNow
			popularityDay: $popularityDay
			popularityWeek: $popularityWeek
			popularityMonth: $popularityMonth
			popularityQuarter: $popularityQuarter
			popularityYear: $popularityYear
			nowScore: $nowScore
			dayScore: $dayScore
			weekScore: $weekScore
			monthScore: $monthScore
			quarterScore: $quarterScore
			yearScore: $yearScore
		) {
			id
			siteItem {
				id
				itemId
			}
			keyword {
				id
				keyword
			}
			location
			caption
			user {
				id
				username
			}
			imageScore
			curationScore
			popularityNow
			popularityDay
			popularityWeek
			popularityMonth
			popularityQuarter
			popularityYear
			nowScore
			dayScore
			weekScore
			monthScore
			quarterScore
			yearScore
		}
	}
`;

const DELETE_MEDIAS_BY_POST_ID = gql`
	mutation deleteMediasByPostId($postId: String!) {
		deleteMediasByPostId(postId: $postId)
	}
`;

const UPSERT_MEDIA = gql`
	mutation upsertMedia($id: String, $url: String!, $postId: String!) {
		upsertMedia(id: $id, url: $url, postId: $postId) {
			id
			url
			postId
			createdAt
			updatedAt
		}
	}
`;

const GET_KEYWORD_ITEMS_BY_SITE_ITEM_ID = gql`
	query getKeywordItemsBySiteItemId($siteItemId: String!) {
		getKeywordItemsBySiteItemId(siteItemId: $siteItemId) {
			id
			keyword {
				id
				keyword
			}
		}
	}
`;

const UPSERT_HASHTAG = gql`
	mutation upsertHashTag($hashTag: String!) {
		upsertHashTag(hashTag: $hashTag) {
			id
			hashTag
		}
	}
`;

const UPSERT_HASHTAG_ON_POSTS = gql`
	mutation upsertHashTagsOnPosts($hashTagId: String!, $postId: String!) {
		upsertHashTagsOnPosts(hashTagId: $hashTagId, postId: $postId) {
			hashTagId
			postId
			createdAt
			updatedAt
		}
	}
`;

const CREATE_FEED_BY_POST_ID = gql`
	mutation createFeedByPostId($userId: String!, $postId: String!) {
		createFeedByPostId(userId: $userId, postId: $postId) {
			id
		}
	}
`;

const AdminPost = ({ navigation, adminPost }) => {
	const client: any = useContext(ClientContext);
	const [isStopKeyword, setIsStopKeyword] = useState(adminPost.keyword.isStop);
	const [hideKeyword, setHideKeyword] = useState(false);
	const [hideUntil, setHideUntil] = useState('');
	const [isPosted, setIsPosted] = useState(false);

	const handlePostClick = async () => {
		navigation.navigate('Search', { hashTags: adminPost.keyword.keyword });
	};

	const handleStopKeywordClick = async () => {
		try {
			let rep = await client.request(UPDATE_KEYWORD_IS_STOP, {
				keyword: adminPost.keyword.keyword,
				isStop: !isStopKeyword,
			});

			setIsStopKeyword(!isStopKeyword);
		} catch (e) {
			console.log('AdminPost.tsx handleStopKeywordClick exception: ' + e);
		}
	};

	const handleHideKeywordWeekClick = async () => {
		try {
			let now = new Date();
			let hideUntil = '';

			if (!hideKeyword) {
				hideUntil = new Date(
					now.getTime() + 7 * 24 * 60 * 60 * 1000
				).toUTCString();
				//console.log(hideUntil);
			} else {
				hideUntil = new Date().toUTCString();
				//console.log(hideUntil);
			}

			let rep = await client.request(UPDATE_TREND_KEYWORD_FOR_HIDING, {
				keywordId: adminPost.keyword.id,
				hideUntil: hideUntil,
			});

			//console.log('response: ');
			//console.log(rep);

			setHideUntil(hideUntil);
			setHideKeyword(!hideKeyword);
		} catch (e) {
			console.log('AdminPost.tsx handleHideKeywordClick exception: ' + e);
		}
	};

	const handleHideKeywordMonthClick = async () => {
		try {
			let now = new Date();
			let hideUntil = '';

			if (!hideKeyword) {
				hideUntil = new Date(
					now.getTime() + 30 * 24 * 60 * 60 * 1000
				).toUTCString();
				//console.log(hideUntil);
			} else {
				hideUntil = new Date().toUTCString();
				//console.log(hideUntil);
			}

			let rep = await client.request(UPDATE_TREND_KEYWORD_FOR_HIDING, {
				keywordId: adminPost.keyword.id,
				hideUntil: hideUntil,
			});

			setHideUntil(hideUntil);
			setHideKeyword(!hideKeyword);
		} catch (e) {
			console.log('AdminPost.tsx handleHideKeywordClick exception: ' + e);
		}
	};

	const handleHideKeywordQuarterClick = async () => {
		try {
			let now = new Date();
			let hideUntil = '';

			if (!hideKeyword) {
				hideUntil = new Date(
					now.getTime() + 120 * 24 * 60 * 60 * 1000
				).toUTCString();
				//console.log(hideUntil);
			} else {
				hideUntil = new Date().toUTCString();
				//console.log(hideUntil);
			}

			let rep = await client.request(UPDATE_TREND_KEYWORD_FOR_HIDING, {
				keywordId: adminPost.keyword.id,
				hideUntil: hideUntil,
			});

			setHideUntil(hideUntil);
			setHideKeyword(!hideKeyword);
		} catch (e) {
			console.log('AdminPost.tsx handleHideKeywordClick exception: ' + e);
		}
	};

	const handlePostingItemClick = async () => {
		try {
			let rep = await client.request(UPSERT_POST_BY_USER_SITE_ITEM, {
				userId: adminPost.user.id,
				siteItemId: adminPost.siteItem.id,
				keywordId: adminPost.keyword.id,
				location: adminPost.location,
				caption: '',
				imageScore: 0,
				curationScore: 0,
				popularityNow: 0,
				popularityDay: 0,
				popularityWeek: 0,
				popularityMonth: 0,
				popularityQuarter: 0,
				popularityYear: 0,
				nowScore: 0,
				dayScore: 0,
				weekScore: 0,
				monthScore: 0,
				quarterScore: 0,
				yearScore: 0,
			});

			let postId = rep.upsertPostByUserSiteItem.id;

			console.log(postId);

			let deletedMediaCount = await client.request(DELETE_MEDIAS_BY_POST_ID, {
				postId: postId,
			});

			adminPost.medias.map(async (media: any) => {
				await client.request(UPSERT_MEDIA, {
					url: media.url,
					postId: postId,
				});
			});

			let keywordItemsForHashTag = (
				await client.request(GET_KEYWORD_ITEMS_BY_SITE_ITEM_ID, {
					siteItemId: adminPost.siteItem.id,
				})
			).getKeywordItemsBySiteItemId;

			keywordItemsForHashTag.map(async (keywordItem: any) => {
				let hashTag = (
					await client.request(UPSERT_HASHTAG, {
						hashTag: keywordItem.keyword.keyword,
					})
				).upsertHashTag;

				await client.request(UPSERT_HASHTAG_ON_POSTS, {
					hashTagId: hashTag.id,
					postId: postId,
				});
			});

			rep = await client.request(CREATE_FEED_BY_POST_ID, {
				userId: adminPost.user.id,
				postId: postId,
			});

			setIsPosted(true);
		} catch (e) {
			console.log('AdminPost.tsx handlePostingItemClick exception: ' + e);
		}
	};

	const handleAddPostClick = async () => {
		let post = {
			location: adminPost.location,
			medias: adminPost.medias,
			keywordId: adminPost.keyword.keywordId,
			keyword: adminPost.keyword.keyword,
		};

		navigation.navigate('Add', { post });
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity>
					<Image
						style={styles.avatar}
						source={{ uri: adminPost.user.avatarUrl }}
					/>
				</TouchableOpacity>
				<TouchableOpacity>
					<View style={styles.headerUserContainer}>
						<Text style={styles.bold}>{adminPost.user.username}</Text>
						<Text>{adminPost.location}</Text>
					</View>
				</TouchableOpacity>
			</View>
			<TouchableOpacity onPress={handlePostClick}>
				{adminPost.medias.map((media) => {
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
					<View style={styles.iconsLeftContainer}>
						<TouchableOpacity>
							<View style={styles.leftIcon}>
								<Ionicons
									size={24}
									name={
										Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'
									}
								/>
							</View>
						</TouchableOpacity>
						<TouchableOpacity>
							<View style={styles.leftIcon}>
								<Ionicons
									size={24}
									name={Platform.OS === 'ios' ? 'ios-text' : 'md-text'}
								/>
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.iconsCenterContainer}></View>

					<View style={styles.iconsRightContainer}>
						<TouchableOpacity onPress={handleStopKeywordClick}>
							<View style={styles.rightIcon}>
								<MaterialIcons size={24} name="stop-screen-share" />
								<Text>s</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleHideKeywordWeekClick}>
							<View style={styles.rightIcon}>
								<Ionicons size={24} name="md-eye-off" />
								<Text>w</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleHideKeywordMonthClick}>
							<View style={styles.rightIcon}>
								<Ionicons size={24} name="md-eye-off" />
								<Text>m</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleHideKeywordQuarterClick}>
							<View style={styles.rightIcon}>
								<Ionicons size={24} name="md-eye-off" />
								<Text>q</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={handlePostingItemClick}>
							<View style={styles.rightIcon}>
								<FontAwesome size={24} name="photo" />
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleAddPostClick}>
							<View style={styles.rightIcon}>
								<MaterialIcons size={24} name="add-a-photo" />
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.caption}>
					<Text style={styles.bold}>{adminPost.user.username} </Text>
					<View key={adminPost.keyword.keywordId}>
						<Text>
							#{adminPost.keyword.keyword}
							{isStopKeyword == true ? ' (Set Stop Keyword) ' : ''}
							{hideKeyword == true ? ' (Hide: ' + hideUntil + ') ' : ''}
							{isPosted == true ? ' (Posted) ' : ''}
							{adminPost.posts.length > 0
								? ' (Posted for another keyword) '
								: ''}
						</Text>
					</View>
				</View>
				<View>
					<Text>
						{adminPost.ranking}순위 {adminPost.popularity} 점
					</Text>
				</View>
			</View>
		</View>
	);
};

export default AdminPost;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
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
		borderColor: '#000000',
	},
	iconsContainer: {
		alignItems: 'stretch',
		alignContent: 'space-between',
		borderColor: '#111111',
		//borderWidth: 5,
		marginBottom: 5,
		flexDirection: 'row',
		width: Layout.window.width - 20,
	},
	iconsLeftContainer: {
		borderColor: '#000000',
		//borderWidth: 1,
		flexDirection: 'row',
		width: 66,
	},
	iconsCenterContainer: {
		borderColor: '#000000',
		//borderWidth: 1,
		width: Layout.window.width - 325,
	},
	iconsRightContainer: {
		alignSelf: 'flex-end',
		borderColor: '#000000',
		//borderWidth: 1
		flexDirection: 'row',
		width: 66,
	},
	leftIcon: {
		marginRight: 10,
		borderColor: '#000000',
	},
	rightIcon: {
		flexDirection: 'row',
		alignItems: 'baseline',
		marginLeft: 10,
		borderColor: '#000000',
	},
	caption: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginTop: 5,
		marginLeft: 0,
		borderColor: '#000000',
		//borderWidth: 1,
	},
});
