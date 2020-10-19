import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { gql } from 'graphql-request';

import { useScrollToTop } from '@react-navigation/native';

import ClientContext from '../../context/ClientContext';
import { Text, View } from '../../components/Themed';
import Post from '../../components/Post';
import Layout from '../../constants/Layout';

const GET_FEEDS_BY_USER_ID = gql`
	query getFeedsByUserId(
		$userId: String!
		$lastFeedDateTime: String!
		$pageSize: Int!
	) {
		getFeedsByUserId(
			userId: $userId
			lastFeedDateTime: $lastFeedDateTime
			pageSize: $pageSize
		) {
			edges {
				cursor
				node {
					userId
					postId
					createdAt
					user {
						avatarUrl
						username
					}
					post {
						id
						keyword {
							id
							keyword
						}
						siteItem {
							id
						}
						location
						medias {
							id
							url
						}
						hashTagsOnPosts {
							hashTag {
								id
								hashTag
							}
						}
					}
				}
			}
			pageInfo {
				pageSize
				endCursor
				hasNextPage
			}
		}
	}
`;

export default function HomeScreen({ navigation }) {
	let now = new Date();
	let runningDate = now.toUTCString();

	const ref = useRef(null);
	const client: any = useContext(ClientContext);
	const [userId, setUserId] = useState('ckfer7sjm0000y3ptfo3w6vmm');
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(new Array());
	const [pageInfo, setPageInfo] = useState({
		endCursor: runningDate,
		pageSize: 10,
		hasNextPage: true,
	});

	//console.log(runningDate);

	const loadNextPage = async () => {
		try {
			if (pageInfo.hasNextPage == false && loading == true) return;
			setLoading(true);

			//console.log(pageInfo);

			let rep = await client.request(GET_FEEDS_BY_USER_ID, {
				userId: userId,
				lastFeedDateTime: pageInfo.endCursor,
				pageSize: pageInfo.pageSize,
			});

			//console.log(rep.getFeedsByUserId);

			let newData: any = [...data, ...rep.getFeedsByUserId.edges];
			setData(newData);
			setPageInfo(rep.getFeedsByUserId.pageInfo);

			//console.log(data);

			setLoading(false);
		} catch (e) {
			console.log('HomeScreen.tsx loadNextPage exception: ' + e);
		} finally {
			setLoading(false);
		}
	};

	const handleLoadMore = () => {
		//console.log('handleLoadMore');
		try {
			loadNextPage();
		} catch (e) {
			console.log('HomeScreen.tsx handleLoadMore exception: ' + e);
		}
	};

	const handleRefresh = async () => {
		try {
			setLoading(true);
			console.log('handleRefresh');

			let rep = await client.request(GET_FEEDS_BY_USER_ID, {
				userId: userId,
				lastFeedDateTime: new Date().toISOString(),
				pageSize: pageInfo.pageSize,
			});

			//console.log(rep.getFeedsByUserId);

			let newData: any = rep.getFeedsByUserId.edges;

			setData(newData);
			setPageInfo(rep.getFeedsByUserId.pageInfo);
			setLoading(false);
		} catch (e) {
			console.log('HomeScreen.tsx - handleRefresh exception: ' + e);
		}
	};

	const renderItem = ({ item }) => {
		//console.log(item);
		return (
			<Post
				key={item.node.post.id}
				user={item.node.user}
				post={item.node.post}
				navigation={navigation}
			/>
		);
	};

	useEffect(() => {
		const bootstrapAsync = async () => {
			try {
				loadNextPage();
			} catch (e) {
				console.log('HomeScreen.tsx - bootstrapAsync(): ' + e);
			} finally {
			}
		};

		bootstrapAsync();
	}, []);

	useScrollToTop(ref);

	return (
		<SafeAreaView style={styles.container}>
			{data != null && data.length > 0 ? (
				<>
					<FlatList
						data={data}
						renderItem={renderItem}
						keyExtractor={(item) => item.node.post.id}
						onEndReachedThreshold={0.5}
						onEndReached={handleLoadMore}
						onRefresh={handleRefresh}
						refreshing={loading}
						ref={ref}
					/>
				</>
			) : (
				<>
					<Text style={styles.title}>Home</Text>
					<View
						style={styles.separator}
						lightColor="#eee"
						darkColor="rgba(255,255,255,0.1)"
					/>
				</>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: Layout.window.width,
		height: Layout.window.height,
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
});
