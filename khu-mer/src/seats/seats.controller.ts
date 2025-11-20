import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
    constructor(private seatsService: SeatsService) {}

    /***************************
     * 좌석 예약
     * [POST] 
     * req.body: {seatId, userId} 
     ***************************/
    @Post()
    async reserveSeat(
        @Body('seatId') seatId: number,
        @Body('userId') userId: number,
        @Body('location') location: string
    ) {
        return this.seatsService.reserveSeat(userId, seatId, location);
    }

    /***************************
     * 예약 취소
     * [DELETE] 
     * req.body: {seatId, userId}
     ***************************/
    @Delete()
    async cancelSeat(
        @Body('seatId') seatId: number,
        @Body('userId') userId: number,
        @Body('location') location: string
    ) {
        return this.seatsService.cancelSeat(userId, seatId, location);
    }

    /***************************
     * 전체 좌석 전송
     * [GET] 
     * req.body
     ***************************/   
    @Get()
    async getAllSeat() {
        return this.seatsService.getSeatByLocation();
    }

    /***************************
     * 좌석 상태 전송
     * localhost:3000/seats/loc 
     * req.body
     ***************************/
    @Get(':locationId')
    async getSeatState(@Param('locationId') locationId: string) {
        return this.seatsService.getSeatState(locationId);
    }
}
