import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email);
        if (!user) return null;

        const stored = (user as any).password;
        let match = false;
        try {
            if (typeof stored === 'string' && stored.startsWith('$2')) {
                match = await bcrypt.compare(password, stored);
            } else {
                match = password === stored;
            }
        } catch (e) {
            match = password === stored;
        }

        if (!match) return null;

        // remove password from returned user
        const { password: _p, ...result } = (user as any).toObject ? (user as any).toObject() : user;
        return result;
    }

    async login(user: any) {
        const payload = { sub: user._id, email: user.email, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: payload,
        };
    }
}
