import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col justify-between">
      <nav className="flex flex-row justify-between">
        <div>
          <Link to="/">Safarilive</Link>
        </div>
        <ul className="flex justify-between">
          <li>
            <Link to="login">Login</Link>
          </li>
          <li>
            <Link to="register">register</Link>
          </li>
          <li>
            <Link to="info">info</Link>
          </li>
          <li>
            <Link to="birds">Birds</Link>
          </li>
        </ul>
      </nav>
      <section className="min-h-screen">{children}</section>
      <footer>footer</footer>
    </section>
  );
}
