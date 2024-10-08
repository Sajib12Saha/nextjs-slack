

import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
import { useRouter } from "next/navigation";

import { NextRequest, NextResponse } from "next/server";

 

const isPublicPage = createRouteMatcher("/auth")


export default convexAuthNextjsMiddleware((request:NextRequest)=> {


  if(!isPublicPage(request) && !isAuthenticatedNextjs()){

 
 return  nextjsMiddlewareRedirect(request, "/auth");

 
}

  if(isPublicPage(request) && isAuthenticatedNextjs()){

     return nextjsMiddlewareRedirect(request, "/")
        
  }
  

})
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};