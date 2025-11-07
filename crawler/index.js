import getSeats from './crawler.js';
import pool from './db.js';

let prevData = null;

const crawlAndSave = async () => {
    const curData = await getSeats();

    if (!prevData) {
        console.log(':: save the initially crawled data');
        await Promise.all(
            curData.map(async (seat) => {
                await pool.query(
                    `
                    INSERT INTO seat (name, "isOccupied")
                    VALUES ($1, $2)
                    ON CONFLICT (name)
                    DO UPDATE SET "isOccupied" = EXCLUDED."isOccupied";
                    `,
                    [seat.name, seat.isOccupied]
                );
            })
        );
        prevData = curData;
        return;
    }

    for (let i = 0; i < curData.length; i++) {
        const prev = prevData[i].isOccupied;
        const cur = curData[i].isOccupied;

        if (prev !== cur) {
            console.log(`:: update DB seat ${curData[i].name} status changed`);
            await pool.query(
                `
                UPDATE seat
                SET "isOccupied" = $1
                WHERE name = $2;
                `,
                [cur, curData[i].name]
            );
        }
    }

    prevData = curData;
};

setInterval(crawlAndSave, 10000);
