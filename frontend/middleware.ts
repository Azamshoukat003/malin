import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedUser = ['/dashboard', '/upload'];
const protectedAdmin = ['/admin/dashboard', '/admin/generate', '/admin/qr-codes'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userSession = req.cookies.get('malinkiddy_session')?.value;
  const userRefresh = req.cookies.get('malinkiddy_refresh')?.value;
  const adminSession = req.cookies.get('malinkiddy_admin_session')?.value;

  if (protectedUser.some((p) => pathname.startsWith(p)) && !userSession && !userRefresh) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (protectedAdmin.some((p) => pathname.startsWith(p)) && !adminSession) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*', '/admin/:path*']
};
