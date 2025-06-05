import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const isValid = token && verifyToken(token);
    const protectedPaths = ['/dashboard'];
    if (protectedPaths.includes(request.nextUrl.pathname) && !isValid) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
  
  export const config = {
    matcher: ['/dashboard']
  };
