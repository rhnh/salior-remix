import { createCookieSessionStorage } from "@remix-run/node";
import type { Session } from "@remix-run/node";

import { SESSION_NAME, SESSION_SECRET } from "./config.server";
import { User } from "@prisma/client";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: SESSION_NAME,
      secure: true,
      secrets: [SESSION_SECRET],
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });
export type LoggedUserLoader = {
  isAuthorized: boolean;
  username?: string;
  user?: User;
};

export const createUserSession = async (userId: string): Promise<Session> => {
  const session = await getSession();
  session.set("userId", userId);
  return session;
};
function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function getLocalAuthenticatedUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}
export { getSession, commitSession, destroySession };
