import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){ }

    async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authcredentialsDto);
    }

    async singIn(authcredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { username, password } =  authcredentialsDto;
        const user = await this.userRepository.findOne({username});

        if (user && (await (await bcrypt.compare(password, user.password)))) {
            // 유저 토큰 생성 ( Secret + Payload )
            const payload = { username } //payload에는 중요한 정보는 넣지 않는다. 정보를 가져가기 쉬워서
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('login Failed');
        }
    }
}
