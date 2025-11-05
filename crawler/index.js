import getSeats from './crawler.js';
import pool from './db.js';

let prevData = null;

const crawlAndSave = async () => {
    const curData = await getSeats();

    if (!prevData) {
        console.log('> save the initially crawled data');
        await Promise.all(
            curData.map(async (seat) => {
                await pool.query(
                    `
                    INSERT INTO seat (name, "seatTime")
                    VALUES ($1, $2)
                    ON CONFLICT (name)
                    DO UPDATE SET "seatTime" = EXCLUDED."seatTime";
                    `,
                    [seat.name, seat.seatTime]
                );
            })
        );
        prevData = curData;
        return;
    }

    for (let i = 0; i < curData.length; i++) {
        const prev = prevData[i].seatTime;
        const cur = curData[i].seatTime;

        if (prev !== cur) {
            console.log(`> update DB: seat ${curData[i].name} status changed`);
            await pool.query(
                `
                UPDATE seat
                SET "seatTime" = $1
                WHERE name = $2;
                `,
                [cur, curData[i].name]
            );
        }
    }

    prevData = curData;
};

setInterval(crawlAndSave, 10000);
