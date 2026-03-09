import { User } from "../models/User";
import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers (q: string | undefined){

        let usersDB

        if (q) {
            const result = await BaseDatabase.connection(UserDatabase.TABLE_USERS).where("content", "LIKE", `%${q}%`)
            usersDB = result
        } else {
            const result = await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            usersDB = result
        }

        return usersDB
    }
    
    public getUsers = async (): Promise<UserDB[]> => {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
        return result
    }

    public findUsersbyId = async (id: string): Promise<UserDB[]>=>{
        const result: UserDB[] | undefined = await BaseDatabase.connection(UserDatabase.TABLE_USERS).where({id})
        return result
    }

    public insert = async (userDB: UserDB) =>{
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .insert(userDB)
    }

    public findByEmail = async (email: string): Promise<UserDB | undefined> =>{
        const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .select()
        .where({email})

    return result[0]
    }
}