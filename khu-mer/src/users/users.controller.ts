import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    /***************************
     * 유저 등록
     * [POST] 
     * req.body: {name, email} 
     ***************************/
    @Post('create')
    async createUser(
        @Body('name') name: string,
        @Body('email') email: string
    ) {
        return this.usersService.createUser(name, email);
    }

    /***************************
     * 유저 로그인
     * [POST] 
     * req.body: {name, email, id} 
     ***************************/
    @Post('login')
    async loginUser(
        @Body('name') name: string,
        @Body('email') email: string
    ) {
        return this.usersService.loginUser(name, email);
    }
    /***************************
     * 예약 정보 확인
     * [GET] 
     * req.body: {id}
     * res: 
     * seat.name, 
     * seat.location, 
     * seat.isOccupied, 
     * seat.expiredTime
     ***************************/
    @Get()
    async getReservation(@Query('userId') userId: number) {
        return this.usersService.getReservation(userId);
    }
}
