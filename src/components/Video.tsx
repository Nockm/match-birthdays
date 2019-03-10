import * as React from 'react';
import * as videos from '../data/videos';
import style from '../style/index';

interface Props {
	videoSpec: videos.VideoSpec;
}

class Video extends React.Component<Props> {
	public render(): React.ReactNode {
		const { start, end, code, team, wide } = this.props.videoSpec;
		const scale = 0.7;
		const width = (wide ? 640 : 530) * scale;
		const height = (wide ? 360 : 360) * scale;
		return (
			<div
				style={{
					padding: '8px',
					filter: 'drop-shadow(0px 0px 4px black)',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexFlow: 'column',
						borderRadius: '2px',
						background: style.videoBg,
						border: `8px solid ${style.videoBg}`,
					}}
				>
					<div>
						<iframe
							width={width}
							height={height}
							src={`https://www.youtube.com/embed/${code}?start=${start}&end=${end}&rel=0&controls=1&showinfo=1&modestbranding=0`}
							frameBorder='0'
							allowFullScreen
						>
						</iframe>
					</div>
					<div>
						<div
							style={{
								display: 'flex',
								flexFlow: 'column',
								padding: '8px',
							}}
						>
							<div style={{ display: 'flex' }}><div style={{fontWeight: 'bold', paddingRight: '4px'}}>{team.home.score}</div><div>{team.home.name}</div></div>
							<div style={{ display: 'flex' }}><div style={{fontWeight: 'bold', paddingRight: '4px'}}>{team.away.score}</div><div>{team.away.name}</div></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Video;
