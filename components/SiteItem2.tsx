import * as React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from 'react-native';
import cuid from 'cuid';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../constants/Layout';

const SiteItem2 = ({ navigation, siteItem }) => {
  const user = {
				id: 'ckfer7sjm0000y3ptfo3w6vmm',
				avatarUrl:
					'https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/66188154_1188080104705443_2371676809092661248_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=UTKmMB9BZ6EAX9MIkUf&oh=a08d7cfbcfd5f2a03ac06c85a595b1c7&oe=5FB026DA',
				username: 'Gmarket',
			}

  const post = {
    itemName:(siteItem != null && siteItem.itemName != null ? siteItem.itemName.trim() : ''), 
    location: 'G마켓 - 쇼핑을 바꾸는 쇼핑',
    medias: [
				{
					id: cuid(),
					url:
						'http://gdimg.gmarket.co.kr/' +
						(siteItem != null ? siteItem.itemId : '') +
						'/still/400?ver=curation_shopping',
				},
    ]
  }

	const handlePostClick = async () => {
		//console.log(siteItem);
		
		navigation.navigate('VIP', {
			siteItem: siteItem
    });

	};

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
        <View><Text>{post.itemName}</Text></View>
				<View style={styles.caption}>
          <View>
              <Text style={{ fontWeight: 'bold' }}>
                {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(siteItem.sellingPrice)}
              </Text>
          </View>
				</View>
			</View>
		</View>
	);
};

export default SiteItem2;

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
