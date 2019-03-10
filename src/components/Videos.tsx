import * as R from 'ramda';
import * as React from 'react';
import * as videoData from '../data/videos';
import VideoComponent from './Video';

class Videos extends React.Component {
	public render(): React.ReactNode {
		function videoSpecToComponent(videoSpec: videoData.VideoSpec) {
			return (
				<div
					key={R.join('', [
						videoSpec.code,
						videoSpec.start,
						videoSpec.end,
					])}
				>
					<VideoComponent
						videoSpec={videoSpec}
						>
					</VideoComponent>
				</div>
			);
		}

		return (
			<div
				style={{
					display: 'flex',
					flexFlow: 'row',
					flexWrap: 'wrap',
				}}
			>
				{R.map(videoSpecToComponent, videoData.Videos)}
			</div>
		);
	}
}

export default Videos;
