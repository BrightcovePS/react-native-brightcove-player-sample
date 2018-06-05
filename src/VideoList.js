
import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View, ListView, ActivityIndicator, } from 'react-native';

import { CONFIG } from '../config';

export default class Application extends Component {


	constructor(props) {
		super(props);
		this.fetchMore = this._fetchMore.bind(this);
		this.fetchData = this._fetchData.bind(this);
		this.state = {
			dataSource: null,
			isLoading: true,
			isLoadingMore: false,
			_videos: null,
			_endOfList: false,
			_page: 1
		};
	}

	_fetchData(callback) {
		let offset = (this.state._page - 1) * CONFIG.limit;
		fetch(`https://edge.api.brightcove.com/playback/v1/accounts/5490902258001/playlists/5792434636001?limit=${CONFIG.limit}&offset=${offset}`,{
			headers: {
				"Accept": `application/json;pk=${CONFIG.policyKey}`
			}})
		.then(response => response.json())
		.then(callback)
		.catch(error => {
			console.error(error);
		});
	}

	_fetchMore() {
		this.fetchData(responseJson => {
			this.setState({
				isLoadingMore: false,
				_page: this.state._page + 1
			});

			if (responseJson.videos.length) {
				const videos = this.state._videos.concat(responseJson.videos);

				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(videos),
					_videos: videos
				});
			} else {
				this.setState({
					_endOfList: true
				});
			}
		});
	}

	componentDidMount() {
		// Start getting the first batch of data from then api
		this.fetchData(responseJson => {
			let ds = new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			});

			this.setState({
				dataSource: ds.cloneWithRows(responseJson.videos),
				isLoading: false,
				_videos: responseJson.videos,
				_page: this.state._page + 1
			});
		});
	}


	render() {
 		if (this.state.isLoading) {
			return (
				<View style={styles.container}>
				<ActivityIndicator size="large" />
				</View>
			);
		} else {
			return (
				<ListView
				dataSource={this.state.dataSource}
				style={styles.listView}
				renderRow={rowData => {
					let { thumbnail_sources, name, description } = rowData;
					let img = thumbnail_sources && thumbnail_sources instanceof Array && thumbnail_sources.length && thumbnail_sources[1] && thumbnail_sources[1].src; // get the https one
					return (
						<TouchableOpacity onPress={() => this.props.navigation.navigate('Watch', rowData)}>
							<View style={styles.listItem}>
								<View style={styles.imageWrapper}>
									<Image
									style={{ width: 70, height: 70 }}
									source={{
										uri: !img ? "https://via.placeholder.com/70x70.jpg" : img
									}}
									/>
								</View>
								<View style={{ flex: 1 }}>
									<Text style={styles.title}>
									{name}
									</Text>
									<Text style={styles.subtitle}>
									{description}
									</Text>
								</View>
							</View>
						</TouchableOpacity>

					);
				}}
				onEndReachedThreshold={10}
				onEndReached={() =>
					!this.state._endOfList && !this.state.isLoadingMore && this.setState({ isLoadingMore: true }, () => this.fetchMore())}

				renderFooter={() => {
					return (
					this.state.isLoadingMore &&
					<View style={{ flex: 1, padding: 10 }}>
						<ActivityIndicator size="small" />
					</View>
					);
				}}
				/>
			);
		}
	}
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	alignItems: 'center',
	justifyContent: 'center',
	paddingTop: 80,
	backgroundColor: '#ecf0f1',
  },
  listView: {
	paddingTop: 20,
	padding: 6,
  },
  listItem: {
	flex: 1,
	flexDirection: 'row',
	borderBottomWidth: 1,
	borderBottomColor: '#d6d7da',
	padding: 6,
  },
  imageWrapper: {
	padding: 5,
  },
  title: {
	fontSize: 20,
	textAlign: 'left',
	margin: 6,
  },
  subtitle: {
	fontSize: 10,
	textAlign: 'left',
	margin: 6,
  },
});



