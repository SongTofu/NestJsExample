import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

@Injectable()
// 주입을 해서 다른 곳에서도 사용할 수 있게 하기 위해서
export class JwtStrategy extends PassportStrategy(Strategy) {
    // PassportStrategy 안에 있는 기능을 이용하기 위해 이를 상속해 JwtStrategy class를 만든다.
    // passport-jwt Strategy를 사용하기 위해 넣어준다. = 이름은 Strategy이지만 import 되는 곳은 passport-jwt이다.
    constructor (
        @InjectRepository(UserRepository) //UserRepository를 주입시켜주는 이유 = 나중에 토큰이 유효한지 확인 후 payload안에 username으로 유저 객체를 데이터베이스에서 가져옴을 구현하기 위해 
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: 'Secret1234',
            // auth.module이랑 똑같이 넣어준다. 토큰을 유효한지 체크할 때 쓰는 것.
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
            // 토큰이 어디에서 가져오는지 알아낼때 Header에서 BearerToken타입으로 넘어오는걸 가져와서 유효성을 체크하겠다는 뜻.
        });
    }
    // 토큰이 유효한지 확인한 후 페이로드 안에 있는 유저 이름으로 유저 정보가 데이터베이스에 있는지 확인.
    async validate(payload) {
        const {username} = payload;
        const user: User = await this.userRepository.findOne({username});

        if (!user) { //없다면 오류
            throw new UnauthorizedException();
        }
        return user; //있다면 유저 정보 리턴 -> 리퀘스트 객체 안에서 사용가능 (몇가지 더 필요 6.2 참고)
    } 
}