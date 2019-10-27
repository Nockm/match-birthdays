import crypto from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import fetch, { Headers } from 'node-fetch';
import * as R from 'ramda';

interface ListCompetitionsResult_CompetitionsArrayItem_Area {
	id: number;
	name: string;
}

interface ListCompetitionsResult_CompetitionsArrayItem_Season {
	id: number;
	startDate: string;
	endDate: string;
	currentMatchday: number;
	winner?: any;
}

interface ListCompetitionsResult_CompetitionsArrayItem {
	id: number;
	area: ListCompetitionsResult_CompetitionsArrayItem_Area;
	name: string;
	code?: any;
	emblemUrl?: any;
	plan: string;
	currentSeason: ListCompetitionsResult_CompetitionsArrayItem_Season;
	numberOfAvailableSeasons: number;
	lastUpdated: string;
}

interface ListCompetitionsResult {
	count: number;
	filters: {};
	competitions: ListCompetitionsResult_CompetitionsArrayItem[];
}

interface GetCompetitionResult_Season {
	id: number;
	startDate: string;
	endDate: string;
	currentMatchday: number;
	winner: string | null,
}

interface GetCompetitionResult {
	id: number;
	area: ListCompetitionsResult_CompetitionsArrayItem_Area;
	name: string;
	code: string;
	emblemUrl: string | null;
	plan: string;
	currentSeason: GetCompetitionResult_Season;
	seasons: GetCompetitionResult_Season[];
}

interface ListMatchesResult_MatchesArrayItem_Team {
	id: number;
	name: string;
}

interface ListMatchesResult_MatchesArrayItem {
	id: number;
	homeTeam: ListMatchesResult_MatchesArrayItem_Team;
	awayTeam: ListMatchesResult_MatchesArrayItem_Team;
	score: {
		winner: 'AWAY_TEAM',
		duration: 'REGULAR',
		fullTime: {
			homeTeam: number,
			awayTeam: number,
		},
		halfTime: {
			homeTeam: number,
			awayTeam: number,
		},
		extraTime: {
			homeTeam: number | null,
			awayTeam: number | null,
		},
		penalties: {
			homeTeam: number | null,
			awayTeam: number | null,
		},
	};
}

interface ListMatchesResult {
	matches: ListMatchesResult_MatchesArrayItem[];
}

interface GetTeamResult_Player {
	id: number;
	name: string;
	position: string;
	dateOfBirth: string;
	countryOfBirth: string;
	nationality: string;
	shirtNumber: number;
	role: string;
}

interface GetTeamResult {
	id: number;
	name: string;
	shortName: string;
	tla: string;
	crestUrl: string;
	address: string;
	phone: null;
	website: string;
	email: string;
	founded: number;
	clubColors: string;
	venue: string;
	squad: GetTeamResult_Player[];
}

/*
	Fetch.
*/

const apikey: string = '85daf6c69c744f06ae1f5cebb93006a8';

function sleep(ms: number): Promise<any> {
	return new Promise((resolve, reject) => {
		setTimeout(() => { resolve(true); }, ms);
	});
}

async function invoke(endpoint: string): Promise<any> {
	// Cache load.
	// const cachePath: string = './cache/calls.json';
	// const cacheText: any = readFileSync(cachePath, { encoding: 'utf8' }) || '{}';
	// const cache: any = JSON.parse(cacheText);

	// Cache hit.
	const hash: string = crypto.createHash('md5').update(endpoint).digest('hex');
	// if (cache[hash]) {
	// 	return cache[hash];
	// }

	// Fresh request.
	const request = {
		method: 'GET',
		headers: new Headers({ 'X-Auth-Token': apikey }),
	};

	// Fresh response.
	const response = await fetch(`http://api.football-data.org/v2/${endpoint}`, request);
	const result = await response.json();

	// Throttle and indicate fresh API call.
	await sleep(6000);
	console.log('API Call:', endpoint);

	// Cache update.
	// cache[hash] = result;
	// writeFileSync(cachePath, JSON.stringify(cache, null, 4), { encoding: 'utf8' });

	// Return result.
	return result;
}

/*
	API
*/

async function listCompetitions(): Promise<ListCompetitionsResult> { return invoke('competitions/'); }
async function getCompetition(id: number): Promise<GetCompetitionResult> { return invoke(`competitions/${id}`); }
async function listMatches(competitionId: number, matchday: number): Promise<ListMatchesResult> { return invoke(`competitions/${competitionId}/matches?matchday=${matchday}`); }
async function getTeam(teamId: number): Promise<GetTeamResult> { return invoke(`teams/${teamId}`); }

const COMPETITIONS = {
	PREMIER_LEAGUE: 2021,
};

export interface Player extends GetTeamResult_Player {
	teamId: number;
	birthday: string;
}

export type PlayersWithTheSameBirthday = Player[][];

async function processMatch(match: ListMatchesResult_MatchesArrayItem): Promise<Match> {
	function getPlayer(team: GetTeamResult, x: GetTeamResult_Player): Player {
		const birthdayDate: Date = new Date(x.dateOfBirth);
		return {
			teamId: team.id,
			...x,
			birthday: `${birthdayDate.getMonth() + 1} ${birthdayDate.getDate()}`,
		};
	}

	const homeTeam: GetTeamResult = await getTeam(match.homeTeam.id);
	const awayTeam: GetTeamResult = await getTeam(match.awayTeam.id);

	const players: Player[] = [
		...R.map((x: GetTeamResult_Player) => getPlayer(homeTeam, x))(homeTeam.squad),
		...R.map((x: GetTeamResult_Player) => getPlayer(awayTeam, x))(awayTeam.squad),
	];

	const playersWithTheSameBirthday: any = R.pipe(
		R.groupBy((x: Player) => x.birthday),
		R.values as (x: {[birthday: string]: Player[]}) => Player[][],
		R.filter((x: Player[]) => x.length > 1) as (x: Player[][]) => Player[][],
	)(players);

	return {
		...match,
		playersWithTheSameBirthday,
	};
}

export interface Match extends ListMatchesResult_MatchesArrayItem {
	playersWithTheSameBirthday: PlayersWithTheSameBirthday;
}

async function processMatchday(competitionId: number, matchday: number): Promise<Match[]> {
	const plMatchday: ListMatchesResult = await listMatches(competitionId, matchday);

	const matches: Match[] = [];
	for await (const matchResponse of plMatchday.matches) {
		const match: Match = await processMatch(matchResponse);
		matches.push(match);
	}

	return matches;
}

export interface Data {
	competition: GetCompetitionResult;
	matchday: number;
	matches: Match[];
}

export async function main(): Promise<Data | null> {
	const competition: GetCompetitionResult | null = await getCompetition(COMPETITIONS.PREMIER_LEAGUE);
	if (!competition) {
		return null;
	}

	const matchday: number = competition.seasons[0].currentMatchday;
	if (!matchday) {
		return null;
	}

	const matches: Match[] = await processMatchday(COMPETITIONS.PREMIER_LEAGUE, matchday);
	const data: Data = {
		competition,
		matchday,
		matches,
	};

	return data;
}
