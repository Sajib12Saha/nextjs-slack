'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { SignInFlow } from "@/app/(features)/auth/_components/auth-screen"
import {useState, useEffect} from 'react';
import {TriangleAlert} from 'lucide-react';
import { useAuthActions as useAuth}  from "@convex-dev/auth/react"
import {useRouter} from 'next/navigation';


interface Props{

    setState: (state:SignInFlow) => void
}

export const SignInCard = ({setState}:Props) =>{

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');

    const [pending, setPending] = useState(false)
  

    const [error, setError] = useState("")
    const router = useRouter()
  

    const { signIn } = useAuth();



    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setPending(true)
        signIn("password", {email, password, flow:"signIn"})
        .catch(()=> {
            setError("Invalid email or password");

        })
        .finally(()=>{
                setPending(false)
                router.push("/")
                
        })
    }

    const handleProviderSignIn = (value:"github" | "google") => {

        setPending(true)
        signIn(value)
        .finally(()=>{
            setPending(false);
            router.push("/")
           
        })
    }



    return(
        <Card className="w-full h-full p-8 ">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                Log in continue
                </CardTitle>

                <CardDescription>
               Use your email or another service to continue  
            </CardDescription>
               
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="h-4 w-4"/>
                    <p>{error}</p>
                </div>
            )}
            
            <CardContent className="space-y-6 px-0 pb-0 ">
                <form onSubmit={onPasswordSignIn} className="space-y-2.5">

                <Input disabled={pending} value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="example@gmail.com" type="email" required/>

                <Input disabled={pending} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required/>

               <Button type="submit" className="w-full" size="lg" disabled={pending}>
                Continue
               </Button>

                </form>
                <Separator/>
                <div className="flex flex-col gap-y-2.5">
                    <Button disabled={pending}
                    onClick= {() => handleProviderSignIn("google")} variant={'outline'} size="lg" className="w-full relative">
                        <FcGoogle className="size-5 absolute top-2.5 left-2.5"/>
                        Continue with Google
                    </Button>

                    <Button disabled={pending}
                    onClick= {()=>handleProviderSignIn("github")} variant={'outline'} size="lg" className="w-full relative">
                        <FaGithub className="size-5 absolute top-2.5 left-2.5"/>
                        Continue with Github
                    </Button>

                </div>
             
                <p className="text-xs text-muted-foreground justify-center flex gap-x-2">
                    Don't have an account ?
                    <span className="text-sky-700 hover:underline cursor-pointer" onClick={()=> setState("signUp")}>Sign up</span>

                </p>


           
               
            </CardContent>
        </Card>
    )
}


