import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // 获取用户的身份验证令牌
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // 添加日志记录，检查 token
  console.log('Token:', token); // 打印获取的 token

  // 如果用户未登录且请求的路径不是 /login，则重定向到 /login
  if (!token && request.nextUrl.pathname !== '/login') {
    console.log('User not authenticated, redirecting to /login'); // 日志记录重定向
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 如果用户已登录或请求的是 /login 页面，则允许请求继续
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|api|_next/static|_next/image|favicon.ico).*)'], // 应用中间件到所有非 /login 路径
}; 