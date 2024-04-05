"use server"

import { getUserById } from "@/queries/user"

export const getUserByIdAction = async(id:string)=>{
    return getUserById(id)
}