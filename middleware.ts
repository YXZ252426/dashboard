import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // 从请求中获取 JWT Token
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // 如果没有 Token 且请求的路径不是 /login，重定向到登录页
  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 继续正常处理请求
  return NextResponse.next();
}

// 配置中间件只对特定路径生效
export const config = {
  matcher: ['/((?!login).*)'], // 匹配所有路径，排除 /login
};
