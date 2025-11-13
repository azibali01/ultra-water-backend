import { Body, Controller, Post, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const safeBody = { ...body, password: body.password ? '***REDACTED***' : undefined };
        this.logger.log(`Login attempt: ${body.email ?? '<no-email>'}`);
        this.logger.debug(`Login payload (masked): ${JSON.stringify(safeBody)}`);

        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            this.logger.warn(`Login failed for: ${body.email ?? '<no-email>'}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.log(`Login successful for: ${body.email}`);
        return this.authService.login(user);
    }

    // Dev-only endpoint to echo parsed request body for debugging
    @Post('echo')
    echo(@Body() body: Record<string, unknown>) {
        if (process.env.NODE_ENV === 'production') {
            throw new UnauthorizedException('Not allowed');
        }
        const safeBody = { ...body } as any;
        if (safeBody.password) safeBody.password = '***REDACTED***';
        this.logger.debug(`Echo endpoint called (masked): ${JSON.stringify(safeBody)}`);
        return { received: safeBody };
    }
}
