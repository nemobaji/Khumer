import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    /***************************
     * 유저 등록
     * [POST] body: {name, email} 
     ***************************/
    @Post()
    async createUser(
        @Body('name') name: string,
        @Body('email') email: string
    ) {
        return this.usersService.createUser(name, email);
    }
}
