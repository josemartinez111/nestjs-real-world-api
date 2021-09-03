/** user.service.ts */
import { JWT_SECRET_KEY } from "@/config"
import { CreateUserDTO } from "@/user/dtos/create-user.dto"
import { LoginUserDTO } from "@/user/dtos/login-user.dto"
import { UserEntity } from "@/user/entities/user.entity"
import { UserResponseType } from "@/user/types/user.response.type"
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"
import { Repository } from "typeorm"
// ⚫️⚫️☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰

@Injectable()
export class UserService {
	/// ======== <> Constructor <> ========
	constructor(
	@InjectRepository(UserEntity)
	private readonly userRepo: Repository<UserEntity>
	) {
	}
	
	/// ======== <> member-service-methods <> ========
	async serviceCreateUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
		//..........
		const { email: userEmail, username: name } = createUserDTO
		
		/* USER-VALIDATION */
		const userByEmail = await this.userRepo
		.findOne({
			email: userEmail
		})
		
		const userByUsername = await this.userRepo
		.findOne({
			username: name
		})
		
		// If either the user email or name, is already in the
		// database, then we will throw a data is not valid error
		if ( userByEmail || userByUsername ) {
			throw new HttpException(
			'[ ERROR ]..email & username are already taken...',
			HttpStatus.UNPROCESSABLE_ENTITY
			)
		}
		
		const newUser = new UserEntity()
		/** @assign: The Object.assign() method copies all enumerable own
		 *  properties from one or more source objects to a target object.
		 *  It returns the modified target object. */
		Object.assign(newUser, createUserDTO)
		
		const savedUser = await this.userRepo.save(newUser)
		.then((user) => {
			const { email, username } = user
			console.log('\n\nNew User Created:', username)
			console.log('User Email:', email)
			
			return user
		})
		
		return savedUser
	}
	
	async serviceLogin(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
		//..........
		const userToLogin = await this.userRepo
		.findOne(
		{ email: loginUserDTO.email },
		{
			select: [
				'id', 'username', 'bio',
				'image', 'password'
			]}
		)
		
		// 1. First we are checking if the user exist. If the user
		// does exist we proceed to check the passwordIf the user
		// email is invalid, then we will throw a email is invalid error
		if ( !userToLogin ) {
			throw new HttpException(
			'[ ERROR ]..invalid email.. try again...',
			HttpStatus.UNPROCESSABLE_ENTITY
			)
		}
		
		// If the email is valid, we will now make sure that
		// the password is correct. Checking if the password
		// is correct by comparing the password, with the
		// compare function from bcrypt
		const isPasswordCorrect = await compare(
		loginUserDTO.password,
		userToLogin.password,
		)
		
		// If the user password is invalid, then we
		// will throw a password is invalid error
		if ( !isPasswordCorrect ) {
			throw new HttpException(
			'[ ERROR ]..invalid password.. try again...',
			HttpStatus.UNPROCESSABLE_ENTITY
			)
		}
		
		// Deleting the password before returning the login POST REQUEST
		delete userToLogin.password
		return userToLogin
	}
	
	serviceBuildUserResponse(user: UserEntity): UserResponseType {
		//..........
		return {
			user: {
				...user,
				token: this.generateJwt(user)
			}
		}
	}
	
	/// ======== <> helper-methods <> ========
	/** @json-web-tokens:
	 * are managed on the client while a session with
	 * cookies is managed on the server. a hacker in a
	 * session managed on a server can attack the client
	 * by providing a redirect & having the client input
	 * i.e for example there email, password..etc */
	generateJwt(user: UserEntity): string {
		//..........
		return sign({
			id: user.id,
			username: user.username,
			email: user.email,
		}, JWT_SECRET_KEY,)
	}
}
// ⚫️⚫️☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰











