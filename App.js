import Watch from './src/Watch'
import VideoList from './src/VideoList'

import { StackNavigator } from 'react-navigation';

const App = StackNavigator({
	VideoList: {
		screen: VideoList,
		navigationOptions: {
			title: 'Video List'
		}
	},
	Watch: {
		screen: Watch,
		navigationOptions: {
			title: 'Watch'
		}
	}
});


export default App;
