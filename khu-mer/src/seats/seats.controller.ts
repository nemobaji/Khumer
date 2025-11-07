import { Body, Controller, Delete, Post } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
    constructor(private seatsService: SeatsService) {}

    /*
     * 좌석 예약
     * POST /seats/1/users/1
     */
    @Post()
    async reserveSeat(
        @Body('seatId') seatId: number,
        @Body('userId') userId: number
    ) {
        return this.seatsService.reserveSeat(userId, seatId);
    }

    /*
     * 예약 취소
     * DELETE /seats/1/users/1
     */
    @Delete()
    async cancelSeat(
        @Body('seatId') seatId: number,
        @Body('userId') userId: number
    ) {
        return this.seatsService.cancelSeat(userId, seatId);
    }
}
