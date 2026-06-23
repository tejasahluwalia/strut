import { css, type RemixNode } from "remix/ui";
import { routes } from "../routes.ts";

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader() {
  return ({ isAdmin = false }: SiteHeaderProps) => (
    <header
      mix={css({
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid hsl(var(--border))",
        backgroundColor: "hsl(var(--background) / 0.95)",
        backdropFilter: "blur(8px)",
      })}
    >
      <div
        mix={css({
          display: "flex",
          height: "3.5rem",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
        })}
      >
        <div mix={css({ display: "flex", alignItems: "center", gap: "1rem" })}>
          <a
            href={routes.home.href()}
            mix={css({
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "hsl(var(--foreground))",
              textDecoration: "none",
              letterSpacing: "-0.025em",
            })}
          >
            Strut
          </a>
          {isAdmin && (
            <span
              mix={css({
                fontSize: "0.875rem",
                color: "hsl(var(--muted-foreground))",
                marginLeft: "0.5rem",
              })}
            >
              Admin
            </span>
          )}
        </div>

        <nav
          mix={css({ display: "flex", alignItems: "center", gap: "1.5rem" })}
        >
          {!isAdmin && (
            <a
              href={routes.admin.auth.login.href()}
              mix={css({
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "hsl(var(--muted-foreground))",
                textDecoration: "none",
                transition: "color 0.15s ease",
                ":hover": { color: "hsl(var(--foreground))" },
              })}
            >
              Admin
            </a>
          )}
          {isAdmin && (
            <a
              href={routes.home.href()}
              mix={css({
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "hsl(var(--muted-foreground))",
                textDecoration: "none",
                transition: "color 0.15s ease",
                ":hover": { color: "hsl(var(--foreground))" },
              })}
            >
              Public site
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
