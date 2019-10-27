import React, { Component } from 'react';
import { BrowserRouter, Link, Switch } from 'react-router-dom';
import style from '../style/index';
import * as db from '../logic/db';
import * as R from 'ramda';
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
			<tr
				style={{
					fontSize: style.fontSize3,
				}}
			>
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
			fontSize: style.fontSize2,
		};

		const teamStyle = {
			...baseStyle,
		}
		const scoreStyle = {
			...baseStyle,
			color: style.highlightFg,
			backgroundColor: style.highlightBg,
		};

		const renderTeamSummary = (score: number, team: db.GetTeamResult) => {
			return (
				<tr style={{ backgroundColor: '#EEE' }}>
					<td style={scoreStyle}>{ score }</td>
					<td align="center"><img style={{ height: 48, padding: 12 }} src={team.crestUrl}></img></td>
					<td colSpan={23} style={teamStyle}>
						<div>{ team.name }</div>
						<div style={{ opacity: 0.5, fontSize: style.fontSize3 }}><i>{ `${team.squad.length} players` }</i></div>
					</td>
				</tr>
			)
		}

		return (
			<React.Fragment>
				{ renderTeamSummary(match.score.fullTime.homeTeam, match.homeTeam) }
				{ renderTeamSummary(match.score.fullTime.awayTeam, match.awayTeam) }
				<tr style={{ height: 12 }}></tr>
				{
					R.pipe(
						R.sortBy((x: db.Player[]) => x.length) as (x: db.Player[][]) => db.Player[][],
						R.reverse as (x: db.Player[][]) => db.Player[][],
						R.map(this.renderPlayerWithSameBirthday)
					)(match.playersWithTheSameBirthday)
				}
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
					fontSize: style.fontSize1,
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
