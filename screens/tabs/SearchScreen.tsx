import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	Keyboard,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { gql } from 'graphql-request';
import { useScrollToTop } from "@react-navigation/native";

import ClientContext from '../../context/ClientContext';
import { Text, TextInput, View } from '../../components/Themed';
import Layout from '../../constants/Layout';
import SiteItem2 from '../../components/SiteItem2';
import SearchResultItems from '../../components/SearchResultItems';

const SEARCH_CURATION_ITEMS_BY_SITE_ITEM_ID = gql`
	query searchCurationItemsBySiteItemId(
		$keywordId: String!
		$siteItemId: String!
		$endCursor: Int!
		$pageSize: Int!
	) {
		searchCurationItemsBySiteItemId(
			keywordId: $keywordId
			siteItemId: $siteItemId
			endCursor: $endCursor
			pageSize: $pageSize
		) {
			edges {
				cursor
				node {
					id
					keywordId
					keyword
					siteItemId
					site
					itemId
					itemName
					sellingPrice
					discountPrice1
					discountPrice2
					curationScore
					imageScore
				}
			}
			pageInfo {
				endCursor
				pageSize
				hasNextPage
			}
		}
	}
`;

const SEARCH_CURATION_ITEMS_BY_HASH_TAGS = gql`
	query searchCurationItemsByHashTags(
		$hashTags: String!
		$endCursor: Int!
		$pageSize: Int!
	) {
		searchCurationItemsByHashTags(
			hashTags: $hashTags
			endCursor: $endCursor
			pageSize: $pageSize
		) {
			edges {
				node {
					id
					keywordId
					keyword
					siteItemId
					site
					itemId
					itemName
					isActiveSiteItem
					sellingPrice
					discountPrice1
					discountPrice2
					curationScore
					imageScore
				}
			}
		}
	}
`;

export default function SearchScreen({ navigation, route }) {
	const ref = useRef(null);
	const client: any = useContext(ClientContext);
	const [loading, setLoading] = useState(false);

	const [searchKeywords, setSearchKeywords] = useState('');
	const [pageInfo, setPageInfo] = useState({
		hashTags: searchKeywords,
		endCursor: 0,
		pageSize: 10,
		hasNextPage: true,
	})
	const [siteItemData, setSiteItemData] = useState(new Array());
	const [isEditing, setIsEditing] = useState(false);

	const loadSelectedItem = async (keywordId, siteItemId) => {
		try {
			setLoading(true);
			siteItemData.length = 0;

			let rep = await client.request(SEARCH_CURATION_ITEMS_BY_SITE_ITEM_ID, {
				keywordId: keywordId,
				siteItemId: siteItemId,
				endCursor: 0,
				pageSize: 10,
			});

			rep.searchCurationItemsBySiteItemId.edges.map(edge => {
				siteItemData.push(edge.node);
			});

			setSiteItemData(siteItemData);
			setLoading(false);
		} catch (e) {
			console.log('SearchScreen.tsx loadSelectedItem exception: ' + e);
		}
	};

	const loadNextPage = async (siteItemId) => {
		try {
			if(pageInfo.hasNextPage == false && loading == true) return;

			setLoading(true);

			//console.log(pageInfo.hashTags);

			let rep = await client.request(SEARCH_CURATION_ITEMS_BY_HASH_TAGS, {
				hashTags: pageInfo.hashTags,
				endCursor: pageInfo.endCursor,
				pageSize: pageInfo.pageSize,
			});

			pageInfo.hasNextPage = rep.searchCurationItemsByHashTags.hasNextPage;
			pageInfo.endCursor = pageInfo.endCursor + pageInfo.pageSize;

			rep.searchCurationItemsByHashTags.edges.map(edge => {
				if(edge.node.siteItemId != siteItemId){
					siteItemData.push(edge.node);
				}
			})

			setSiteItemData(siteItemData);
			setLoading(false);
		} catch (e) {}
	};

	const onChangeHashTags = (text:string) => {
		setIsEditing(true);
		setSearchKeywords(text);
	};

	const onSubmitHashTags = async () => {
		Keyboard.dismiss();
		setIsEditing(false);

		pageInfo.hashTags = searchKeywords;
		pageInfo.hasNextPage = true;
		pageInfo.endCursor = 0;
		siteItemData.length = 0;
		await loadNextPage('');
	};

	const handleLoadMore = async () => {
		try {
			console.log("handleLoadMore");

			if(pageInfo.hasNextPage == false || loading == true){
				//console.log("return");
				return;
			}

			if (
				route != null &&
				route.params.siteItemId != null
			) {
				let siteItemId = route.params.siteItemId;
				await loadNextPage(siteItemId);
			}
		} catch (e) {
			console.log("SearchScreen.tsx handleLoadMore exception: " + e);
		}
	}

	const handleRefresh = async () => {
		try {
			//console.log("handleRefresh");

			if (
				route != null &&
				route.params.keywordId != null &&
				route.params.keyword != null &&
				route.params.siteItemId != null
			) {
				let keywordId = route.params.keywordId;
				let keyword = route.params.keyword;
				let siteItemId = route.params.siteItemId;

				//console.log(keyword + "," + keywordId + "," + siteItemId);
				//console.log(searchKeywords);

				if (searchKeywords != route.params.keyword) {
					pageInfo.hashTags = keyword;
					pageInfo.hasNextPage = true;
					pageInfo.endCursor = 0;
					await loadSelectedItem(keywordId, siteItemId);
					await loadNextPage(siteItemId);
					setSearchKeywords(keyword);
				}

				//console.log(keyword);
			}
		} catch (e) {
			console.log("SearchScreen.tsx - handleRefresh exception: " + e);
		}
	}

	const renderItem = ({ item }) => {
		return (
			<SiteItem2
				key={item.id}
				siteItem={item}
				navigation={navigation}
			/>
		)
	}

	useEffect(() => {
		const initSearchKeyword = async () => {
			//console.log(route);

			if (
				route != null &&
				route.params != null && 
				route.params.keyword != null
			) {
				let keywordId = route.params.keywordId;
				let keyword = route.params.keyword;
				let siteItemId = route.params.siteItemId;

				//console.log(keyword + "," + keywordId + "," + siteItemId);
				//console.log(searchKeywords);

				if (searchKeywords != route.params.keyword) {
					pageInfo.hashTags = keyword;
					pageInfo.hasNextPage = true;
					pageInfo.endCursor = 0;
					siteItemData.length = 0;
					if(keywordId != null && siteItemId != null){
						await loadSelectedItem(keywordId, siteItemId);	
					}
					await loadNextPage(siteItemId);
					setSearchKeywords(keyword);
				}

				//console.log(keyword);
			}
		};

		initSearchKeyword();

		//console.log('컴포넌트가 화면에 나타남');
		return () => {
			//console.log('컴포넌트가 화면에서 사라잠');
		};
	}, [route]);

	useScrollToTop(ref);

	//console.log(selectedItemData);

	return (
		<View style={styles.background}>
			<SafeAreaView style={styles.container}>
				<View style={styles.searchBar}>
					<TextInput
						placeholder="상품 태그를 입력하세요."
						value={searchKeywords}
						returnKeyType="search"
						onChangeText={onChangeHashTags}
						onEndEditing={onSubmitHashTags}
						style={styles.searchInput}
					/>
					<TouchableOpacity onPress={onSubmitHashTags}>
						<View style={styles.searchButton}>
							<Text style={styles.searchButtonText}>검색</Text>
						</View>
					</TouchableOpacity>
				</View>
				{siteItemData != null && siteItemData.length > 0 ? (
					<>
						<FlatList
							data={siteItemData}
							renderItem={renderItem}
							keyExtractor={(item) => item.id}
							onEndReachedThreshold={3}
							onEndReached={handleLoadMore}
							onRefresh={handleRefresh}
							refreshing={loading}
							ref={ref}
						/>
					</>
				) : (
					<View style={styles.contentBox}>
						<Text style={styles.title}>Search</Text>
						<View
							style={styles.separator}
							lightColor="#0d0d0d"
							darkColor="#fafafa"
						/>
					</View>
				)}
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	background: {
		width: Layout.window.width,
		height: Layout.window.height,
	},
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: Layout.window.width,
		height: Layout.window.height > 890 ? (Layout.window.height-80) : (Layout.window.height-50),
	},
	searchBar: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: Layout.window.width - 2,
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
	contentBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: Layout.window.width,
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
