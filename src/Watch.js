import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BrightcovePlayer } from 'react-native-brightcove-player';

import { CONFIG } from '../config';


export default class Watch extends Component {

	state = {
		playing: false,
		progress: 0
	};

  	render() {

		let { id:videoId, name } = this.props.navigation.state.params;

		return (
			<View style={styles.container}>
				<BrightcovePlayer
					accountId={CONFIG.accountId}
					videoId={videoId}
					policyKey={CONFIG.policyKey}
					style={styles.player}
					autoPlay={CONFIG.player.autoplay}
					ref={ref => (this.player = ref)}
					play={this.state.playing}
					onReady={() => console.log('ready')}
					onPlay={() => this.setState({ playing: true })}
					onPause={() => this.setState({ playing: false })}
					onEnd={() => console.log('end')}
					onProgress={({ currentTime }) =>
						this.setState({ progress: currentTime })
					}

				/>

				<View style={styles.content}>
					<Text style={styles.title}>{name}</Text>
					<Text>
						{this.state.playing ? 'Playing' : 'Paused'} (
						{Math.floor(this.state.progress * 10) / 10}s)
					</Text>
					<View style={styles.control}>
						<Button title="Play" onPress={() => this.setState({ playing: true })} />
						<Button title="Pause" onPress={() => this.setState({ playing: false })} />
						<Button title="+10s" onPress={() => this.player.seekTo(this.state.progress + 10)} />
						<Button title="-10s" onPress={() => this.player.seekTo(this.state.progress - 10)} />
					</View>
				</View>
			</View>
		);
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		flexDirection: 'column'
	},
	player: {
		flex: 1
	},
	content: {
		flex: 1,
		padding: 20
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	control: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});