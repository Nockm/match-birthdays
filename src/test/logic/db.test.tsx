import { writeFileSync } from 'fs';
import * as db from '../../logic/db';

async function main() {
	const mainData = await db.main();
	writeFileSync('./cache/data.json', JSON.stringify(mainData, null, 2), { encoding: 'utf8' });
	// console.log(mainData);
}

main().then(() => { console.log('Completed.'); });
