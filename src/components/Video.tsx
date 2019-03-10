import * as React from 'react';
import * as videos from '../data/videos';

interface Props {
		videoSpec: videos.VideoSpec;
}

class Video extends React.Component<Props> {
	public render(): React.ReactNode {
		const { start, end, code } = this.props.videoSpec;
		return (
			<div>
				<iframe
					width='560'
					height='315'
					src={`https://www.youtube.com/embed/${code}?controls=0&start=${start};end=${end};rel=0;showinfo=0`}
					frameBorder='0'
					allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
				>
				</iframe>
			</div>
		);
	}
}

export default Video;
