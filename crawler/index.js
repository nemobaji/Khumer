import { BASE_URL } from './config/api.js';
import getSeats from './crawler.js';
import pool from './db.js';

let prevData = null;
const location = process.argv[2];
const URL = BASE_URL;

const crawlAndSave = async () => {
    const curData = await getSeats(URL, location);

    if (!prevData) {
        console.log(':: save the initially crawled data');
        await Promise.all(
            curData.map(async (seat) => {
                await pool.query(
                    `
                    INSERT INTO seat (name, "isOccupied", "expiredTime", location)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (name, location)
                    DO UPDATE
                    SET "isOccupied" = EXCLUDED."isOccupied","expiredTime" = EXCLUDED."expiredTime";
                    `,
                    [seat.name, seat.isOccupied, seat.expiredTime, seat.location]
                );
            })
        );
        prevData = curData;
        return;
    }

    for (let i = 0; i < curData.length; i++) {
        const prev = prevData[i].isOccupied
        const cur = curData[i].isOccupied;

        if (prev !== cur) {
            console.log(`:: update DB seat (${curData[i].name}, ${curData[i].location}) status changed`);
            await pool.query(
                `
                UPDATE seat
                SET "isOccupied" = $1
                WHERE name = $2 AND location = $3;
                `,
                [cur, curData[i].name, curData[i].location]
            );
        }
    }

    prevData = curData;
};

setInterval(crawlAndSave, 10000);

