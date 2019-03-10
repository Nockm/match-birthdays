export interface VideoSpec {
	code: string;
	start: number;
	end: number;
	wide: boolean;
	team: {
		home: { name: string, score: number },
		away: { name: string, score: number },
	};
	urls?: string[];
}

export const Videos: VideoSpec[] = [
	{
		code: 'wyJUrpElkUs', start: 20, end: 28,
		wide: false,
		team: {
			home: { name: 'Chelsea', score: 1 },
			away: { name: 'Barcelona', score: 1 },
		},
	},
	{
		code: 'qYSxQWF6mXE', start: 0, end: 29,
		wide: true,
		team: {
			home: { name: 'Arsenal', score: 1 },
			away: { name: 'Chelsea', score: 1 },
		},
	},
	{
		code: 'ENzc_ow2sCU', start: 0, end: 23,
		wide: false,
		team: {
			home: { name: 'Juventus', score: 2 },
			away: { name: 'Chelsea', score: 2 },
		},
		urls: [
			'https://www.rte.ie/sport/soccer/2009/0310/246265-juventus_chelsea/',
		],
	},
];
