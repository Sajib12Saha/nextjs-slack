'use client'

import {  useState } from "react"
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export type SignInFlow = "signIn" | "signUp";

export const AuthScreen = () => {

  const [state, setState] = useState<SignInFlow>("signIn")



    return(
        <div className="h-screen flex items-center justify-center bg-[#5C3B5B]">
           <div className="md:h-auto md:w-[420px]">
            {state === "signIn" ? <SignInCard setState={setState}/> : <SignUpCard setState={setState}/>}

           </div>
        </div>
    )
}