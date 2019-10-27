import React, { Component } from 'react';
import { BrowserRouter, Link, Switch } from 'react-router-dom';
import style from '../style/index';
import * as db from '../logic/db';
import { stripLeadingSlash } from 'history/PathUtils';

const data: db.Data = require('../data/data.json');

type Props = {
}

type State = {
	data: db.Data;
}

class App extends Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			data,
		}
	}

	renderPlayer = (player: db.Player) => {
		const date: Date = new Date(player.dateOfBirth);

		return (
			<tr>
				<td></td>
				<td></td>
				<td align="right">{`${player.shirtNumber || ''}`}</td>
				<td>{`${player.name}`}</td>
				<td>{`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`}</td>
				<td style={{opacity: 0.5}}>{ player.position }</td>
			</tr>
		)
	}

	renderPlayerWithSameBirthday = (players: db.Player[]) => {
		return (
			<React.Fragment>
				{ players.map(this.renderPlayer) }
				<tr style={{ height: 20 }}></tr>
			</React.Fragment>
		)
	}

	renderMatch = (match: db.Match) => {
		const baseStyle = {
			padding: 8,
			fontSize: style.fontSize1,
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
			<React.Fragment>
				<tr><td style={scoreStyle}>{ match.score.fullTime.homeTeam }</td><td style={teamStyle}>{ match.homeTeam.name }</td></tr>
				<tr><td style={scoreStyle}>{ match.score.fullTime.awayTeam }</td><td style={teamStyle}>{ match.awayTeam.name }</td></tr>
				{ match.playersWithTheSameBirthday.map(this.renderPlayerWithSameBirthday) }
				<tr style={{ height: 36 }}></tr>
			</React.Fragment>
		)
	}

	renderData = (data: db.Data) => {
		return (
			<div
				style={{
					fontFamily: 'Radikal',
					background: style.background,
				}}
			>
				<div style={{
					display: 'flex',
					fontSize: 40,
					marginBottom: 40,
					color: style.highlightFg,
					background: style.highlightBg,
					padding: '20px',
				}}>
					<div style={{ }} >{ data.competition.name }</div>
					<div style={{ width: 20 }} ></div>
					<div style={{ opacity: 0.5 }} >{ `(${data.competition.area.name}, Matchday ${data.competition.currentSeason.currentMatchday})` }</div>
				</div>
				<div style={{
					padding: '20px',
				}}>
					<table>
						<tbody>
							{ this.state.data.matches.map(this.renderMatch) }
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	public render() {
		return (
			<BrowserRouter>
			{
				this.renderData(this.state.data)
			}
			</BrowserRouter>
		);
	}
}

export default App;
