import Watch from './src/Watch'
import VideoList from './src/VideoList'

import { createStackNavigator } from 'react-navigation';

const App = createStackNavigator({
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
