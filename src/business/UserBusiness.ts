import { UserDatabase } from "../database/UserDatabase.js"
import { GetUsersInput, GetUsersOutput, LoginInputDTO, LoginOutputDTO, SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { User } from "../models/User.js";
import { HashManager } from "../services/HashManager.js";
import { IdGenerator } from "../services/IdGenerator.js";
import { TokenManager } from "../services/TokenManager.js";
import { TokenPayload, UserDB, USER_ROLES } from "../types.js";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { name, email, password } = input

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }
        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const id = this.idGenerator.generate()
        const hashedPassword = await this.hashManager.hash(password)
        const role = USER_ROLES.NORMAL
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()

        

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            role,
            createdAt,
            updatedAt
        )

        const userDB = newUser.toDBModel()

        await this.userDatabase.insert(userDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const output: SignupOutputDTO = {
            token: this.tokenManager.createToken(payload)
        }

        return output
    }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input

        
        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

       const userDB:UserDB | undefined = await this.userDatabase.findByEmail(email)

       if(!userDB ){
        throw new NotFoundError("'email' não cadastrado")
       }


       const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at,
        userDB.updated_at
       )

        const isPasswordCorrect = await this.hashManager.compare(password, user.getPassword())

       

        if(!isPasswordCorrect){
           
            throw new BadRequestError("'password' incorreto")
        }

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)
        
        const output: LoginOutputDTO ={
            token
        }

        return output
 
    }

    public getUsers = async (input: GetUsersInput): Promise<GetUsersOutput> =>{
        const {q} = input

        if(typeof q !== "string" && q !== undefined){
            throw new BadRequestError("q deve ser uma string")
        }

        const usersDB = await this.userDatabase.findUsers(q)

        const users = usersDB.map((userDB)=>{
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.USER_ROLES,
                userDB.created_at,
               userDB.updated_at
               )
               return user.toBusinessModel()
              
        })

       const output:GetUsersOutput = users

       return output
    }
}