import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'Secret1234', // 토큰을 생성할 때 씀
      signOptions: {
        expiresIn: 60 * 60, //토큰의 유효시간 3600 = 1시간
      }
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //auth모듈에서 사용할 때
  exports: [JwtStrategy, PassportModule] //auth모듈 뿐만아니라 다른 모듈에서도 사용하기 위해
})
export class AuthModule {}
