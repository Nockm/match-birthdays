import * as R from 'ramda';
import * as React from 'react';
import * as videoData from '../data/videos';
import VideoComponent from './Video';

class Videos extends React.Component {
	public render(): React.ReactNode {
		function videoSpecToComponent(videoSpec: videoData.VideoSpec) {
			return (
				<VideoComponent videoSpec={videoSpec}></VideoComponent>
			);
		}

		return (
			R.map(videoSpecToComponent, videoData.Videos)
		);
	}
}

export default Videos;
