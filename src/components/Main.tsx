import React, { Component } from 'react';
import { BrowserRouter, Link, Switch } from 'react-router-dom';
import style from '../style/index';
import * as db from '../logic/db';

const matches: db.Match[] = require('../data/data.json');

type Props = {
}

type State = {
	matches: db.Match[];
}

class App extends Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			matches,
		}
	}

	renderPlayer = (player: db.Player) => {
		const date: Date = new Date(player.dateOfBirth);

		return (
			<tr>
				<td>{`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`}</td>
				<td align="right">{`${player.shirtNumber || ''}`}</td>
				<td>{`${player.name}`}</td>
				<td>{ player.position }</td>
			</tr>
		)
	}

	renderPlayerWithSameBirthday = (players: db.Player[]) => {
		return (
			<React.Fragment>
				<tr style={{ height: 12 }}></tr>
				{ players.map(this.renderPlayer) }
			</React.Fragment>
		)
	}

	renderMatch = (match: db.Match) => {
		const baseStyle = {
			padding: 8,
		};

		const teamStyle = {
			...baseStyle,
		}
		const scoreStyle = {
			...baseStyle,
			color: style.highlightFg,
			backgroundColor: style.highlightBg,
		};

		return (
			<div>
				<table>
					<tbody>
						<tr><td style={scoreStyle}>{ match.score.fullTime.homeTeam }</td><td style={teamStyle}>{ match.homeTeam.name }</td></tr>
						<tr><td style={scoreStyle}>{ match.score.fullTime.awayTeam }</td><td style={teamStyle}>{ match.awayTeam.name }</td></tr>
					</tbody>
				</table>
				<div style={{
					paddingLeft: 48,
				}}>
					<div style={{padding: 5}}>
						<table>
							<tbody>
								{ match.playersWithTheSameBirthday.map(this.renderPlayerWithSameBirthday) }
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}

	public render() {
		const routerExample = (
			<div
				style={{
					padding: '20px',
					display: 'none',
				}}
			>
				<Link to='/'>Home</Link>
				<Link to='/post/'>Post</Link>
				<Switch>
				</Switch>
			</div>
		);

		return (
			<BrowserRouter>
				<div
					style={{
						fontFamily: 'Radikal',
						background: style.background,
						padding: '20px',
					}}
				>
					<div
						style={{
							fontSize: 80,
							marginBottom: 40,
						}}
					>
						Premier League
					</div>
					<div>{ this.state.matches.map(this.renderMatch) }</div>
					{routerExample}
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
