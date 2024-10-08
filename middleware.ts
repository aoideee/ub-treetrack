import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // protected routes and sub-routes

  const protectedRoutes = ["/add-plant", "/dashboard", "/settings"];

  if (
    !user &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/add-plant/:path*", "/dashboard/:path*", "/settings/:path*"],
};
