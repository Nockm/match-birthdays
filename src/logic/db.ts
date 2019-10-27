import crypto from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import fetch, { Headers } from 'node-fetch';

interface Area {
	id: number;
	name: string;
}

interface Season {
	id: number;
	startDate: string;
	endDate: string;
	currentMatchday: number;
	winner?: any;
}

interface ListCompetitionsCompetition {
	id: number;
	area: Area;
	name: string;
	code?: any;
	emblemUrl?: any;
	plan: string;
	currentSeason: Season;
	numberOfAvailableSeasons: 1;
	lastUpdated: string;
}

interface ListCompetitionsResult {
	count: number;
	filters: {};
	competitions: ListCompetitionsCompetition[];
}

interface GetCompetitionResultSeason {
	id: number;
	startDate: string;
	endDate: string;
	currentMatchday: number;
	winner: string;
}

interface GetCompetitionResult {
	seasons: GetCompetitionResultSeason[];
}

function sleep(ms: number): Promise<any> {
	return new Promise((resolve, reject) => {
		setTimeout(() => { resolve(true); }, ms);
	});
}

async function invoke(endpoint: string): Promise<any> {
	const cachePath: string = './cache/calls.json';
	const cacheText: any = readFileSync(cachePath, { encoding: 'utf8' }) || '{}';
	const cache: any = JSON.parse(cacheText);

	const hash: string = crypto.createHash('md5').update(endpoint).digest('hex');

	if (cache[hash]) {
		return cache[hash];
	}

	const request = {
		method: 'GET',
		headers: new Headers({
			'X-Auth-Token': '85daf6c69c744f06ae1f5cebb93006a8',
		}),
	};

	const response = await fetch(`http://api.football-data.org/v2/${endpoint}`, request);
	const obj = await response.json();
	await sleep(1000);
	console.log('invoked:', endpoint);

	cache[hash] = obj;
	writeFileSync(cachePath, JSON.stringify(cache, null, 4), { encoding: 'utf8' });
	return obj;
}

async function listCompetitions(): Promise<ListCompetitionsResult> {
	return invoke('competitions/');
}

async function getCompetition(id: string): Promise<GetCompetitionResult> {
	return invoke(`competitions/${id}`);
}

interface ListMatchesResultMatchesArrayItemTeam {
	id: number;
	name: string;
}

interface ListMatchesResultMatchesArrayItem {
	id: string;
	homeTeam: ListMatchesResultMatchesArrayItemTeam;
	awayTeam: ListMatchesResultMatchesArrayItemTeam;
}

interface ListMatchesResult {
	matches: ListMatchesResultMatchesArrayItem[];
}

async function listMatches(competitionId: string, matchday: number): Promise<ListMatchesResult> {
	return invoke(`competitions/${competitionId}/matches?matchday=${matchday}`);
}

async function searchCompetitionName(name: string): Promise<ListCompetitionsCompetition | null> {
	const listCompetitionsResult: ListCompetitionsResult = await listCompetitions();
	const matchingCompetitions: ListCompetitionsCompetition[] = listCompetitionsResult.competitions.filter((x: ListCompetitionsCompetition) => x.name === name);
	return matchingCompetitions.length > 0 ? matchingCompetitions[0] : null;
}

async function getMatch(matchId: string): Promise<any> {
	return invoke(`matches/${264438}`);
}

const COMPETITIONS = {
	PREMIER_LEAGUE: '2021',
};

interface GetTeamResult {
	id: string;
}

function getTeam(teamId: number): Promise<GetTeamResult> {
	return invoke(`teams/${teamId}`);
}

async function getCurrentMatchday(competitionId: string): Promise<number | null> {
	const premierLeague: GetCompetitionResult | null = await getCompetition('2021');
	if (!premierLeague) {
		return null;
	}

	return premierLeague.seasons[0].currentMatchday;
}

async function processMatchday(competitionId: string, matchday: number) {
	const plMatchday: ListMatchesResult = await listMatches(competitionId, matchday);
	const singleMatch: ListMatchesResultMatchesArrayItem = plMatchday.matches[0];

	const homeTeam: GetTeamResult = await getTeam(singleMatch.homeTeam.id);
	const awayTeam: GetTeamResult = await getTeam(singleMatch.awayTeam.id);

	return {
		homeTeam,
		awayTeam,
	};
}

export async function main() {
	return processMatchday(COMPETITIONS.PREMIER_LEAGUE, 10);
}
