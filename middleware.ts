import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDataFromToken } from "./app/helpers/getDataFromToken";
import { findUserFromDatabase } from "./app/helpers/findUserFromDatabase";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  console.log("Middleware Executed");
  let isUserVerified = false;
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup";

  const userID = await getDataFromToken(request);
  if (userID) {
    isUserVerified = true;
  } else {
    isUserVerified = false;
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isPublicPath && isUserVerified) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  if (!isPublicPath && !isUserVerified) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //   return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/workspace/:path*", "/login", "/signup"],
};
