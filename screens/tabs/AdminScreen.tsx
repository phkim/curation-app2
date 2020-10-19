import React, { useContext, useEffect, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	StyleSheet,
} from 'react-native';
import { gql } from 'graphql-request';
import cuid from 'cuid';

import ClientContext from '../../context/ClientContext';
import AdminPost from '../../components/AdminPost';
import { Text, View } from '../../components/Themed';
import Layout from '../../constants/Layout';

const GET_TREND_KEYWORD_AND_SITE_ITEM = gql`
	query getTrendKeywordAndSiteItem(
		$queryDate: String!
		$afterRanking: Int!
		$pageSize: Int!
	) {
		getTrendKeywordAndSiteItem(
			queryDate: $queryDate
			afterRanking: $afterRanking
			pageSize: $pageSize
		) {
			pageInfo {
				endCursor
				pageSize
				hasNextPage
			}
			edges {
				node {
					trendKeywordByDay {
						id
						dt
						keyword {
							id
							keyword
							isStop
						}
						ranking
						popularity
					}
					siteItem {
						id
						site
						itemId
						itemName
						sellingPrice
						isAdult
						isActive
					}
					posts {
						id
					}
				}
			}
		}
	}
`;

export default function AdminScreen({ navigation }) {
	let now = new Date();
	let queryDate = now.toUTCString();
	/*
		now.getFullYear() +
		'-' +
		('0' + (now.getMonth() + 1)).slice(-2) +
		'-' +
		('0' + now.getDate()).slice(-2) +
		' ' +
		('0' + (now.getHours() + 1)).slice(-2) +
		':' +
		('0' + now.getMinutes()).slice(-2) +
		':' +
		('0' + now.getSeconds()).slice(-2);
	*/

	queryDate = '2020-09-21 09:00:00';

	const client = useContext(ClientContext);
	const [data, setData] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		queryDate,
		endCursor: 0,
		pageSize: 20,
		hasNextPage: true,
	});
	const [loading, setLoading] = useState(false);

	const renderItem = ({ item }) => {
		let trendKeywordByDay = item.node.trendKeywordByDay;
		let siteItem = item.node.siteItem;
		let posts = item.node.posts;

		let adminPost = {
			id: trendKeywordByDay.id,
			dt: trendKeywordByDay.dt,
			keyword: trendKeywordByDay.keyword,
			siteItem: siteItem,
			posts: posts,
			ranking: trendKeywordByDay.ranking,
			popularity: trendKeywordByDay.popularity,
			user: {
				id: 'ckfer7sjm0000y3ptfo3w6vmm',
				avatarUrl:
					'https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/66188154_1188080104705443_2371676809092661248_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=UTKmMB9BZ6EAX9MIkUf&oh=a08d7cfbcfd5f2a03ac06c85a595b1c7&oe=5FB026DA',
				username: 'Gmarket',
			},
			location: 'G마켓 - 쇼핑을 바꾸는 쇼핑',
			medias: [
				{
					id: cuid(),
					url:
						'http://gdimg.gmarket.co.kr/' +
						(siteItem != null ? siteItem.itemId : '') +
						'/still/400?ver=curation_shopping',
				},
			],
		};

		//console.log(adminPost);

		return <AdminPost navigation={navigation} adminPost={adminPost} />;
	};

	const loadNextPage = async () => {
		try {
			//console.log('handleLoadMore');
			//console.log(pageInfo);

			if (pageInfo.hasNextPage == false) return;

			setLoading(true);

			let rep = await client.request(GET_TREND_KEYWORD_AND_SITE_ITEM, {
				queryDate,
				afterRanking: pageInfo.endCursor,
				pageSize: pageInfo.pageSize,
			});

			// load trendKeywordItemAndSiteItem
			let newData = [...data, ...rep.getTrendKeywordAndSiteItem.edges];
			setData(newData);
			setPageInfo(rep.getTrendKeywordAndSiteItem.pageInfo);

			setLoading(false);
		} catch (e) {
			console.log('AdminScreen.tsx loadNextPage exception: ' + e);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		try {
			pageInfo.endCursor = 0;
			pageInfo.hasNextPage = true;

			loadNextPage();
		} catch (e) {
			console.log('AdminScreen.tsx onRefresh exception: ' + e);
		}
	};

	const handleLoadMore = async () => {
		try {
			loadNextPage();
		} catch (e) {
			console.log('AdminScreen.tsx handleLoadMore exception: ' + e);
		}
	};

	useEffect(() => {
		const bootstrapAsync = async () => {
			try {
				loadNextPage();
			} catch (e) {
				console.log('AminScreeen.tsx bootstrapAsyc exception: ' + e);
			}
		};

		bootstrapAsync();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			{data != null && data.length > 0 ? (
				<>
					<FlatList
						data={data}
						keyExtractor={(item) => item.node.trendKeywordByDay.id}
						onEndReachedThreshold={0.5}
						onEndReached={handleLoadMore}
						refreshing={loading}
						refreshingControl={
							<RefreshControl refreshing={loading} onRefresh={onRefresh} />
						}
						renderItem={renderItem}
					/>
				</>
			) : (
				<>
					<Text style={styles.title}>Admin</Text>
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
	keywordBox: {
		width: Layout.window.width,
		height: Layout.window.height / 2,
	},
});
