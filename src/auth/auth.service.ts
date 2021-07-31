import { JwtUserPayload, UserWithoutPassword } from '@/interfaces/user';
import { UserService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOne(username);
    if (user?.password === password) {
      return { _id: user._id, username: user.username };
    }
    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload: JwtUserPayload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
