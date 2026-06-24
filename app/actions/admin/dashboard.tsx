import { type Handle } from "remix/ui";
import { css } from "remix/ui";
import { theme } from "remix/ui/theme";

import { Document } from "../../ui/document.tsx";
import { SiteHeader } from "../../ui/header.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx";

export function AdminDashboardPage() {
  return () => (
    <Document title="Admin dashboard | Strut" head={<AdminHead />}>
      <SiteHeader isAdmin />
      <main
        mix={css({
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        })}
      >
        <section
          mix={css({ display: "flex", flexDirection: "column", gap: "1rem" })}
        >
          <div
            mix={css({
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            })}
          >
            <h1
              mix={css({
                fontSize: "2.25rem",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.025em",
              })}
            >
              Dashboard
            </h1>
            <p
              mix={css({
                color: theme.colors.text.muted,
                margin: 0,
                maxWidth: "42rem",
              })}
            >
              Active workflows, review queues, unpublished records, and import
              actions will appear here.
            </p>
          </div>

          <div
            mix={css({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            })}
          >
            <DashboardTile label="Active workflows" count="3" />
            <DashboardTile label="Needs review" count="12" />
            <DashboardTile label="Unpublished" count="4" />
            <DashboardTile label="Quick actions" count="+" />
          </div>
        </section>
      </main>
    </Document>
  );
}

function AdminHead() {
  return () => (
    <>
      <meta name="robots" content="noindex,nofollow" />
    </>
  );
}

function DashboardTile(handle: Handle<{ label: string; count: string }>) {
  return () => {
    let { label, count } = handle.props;
    return (
    <Card>
      <CardHeader>
        <CardTitle
          mix={css({
            fontSize: "1rem",
            color: theme.colors.text.muted,
            fontWeight: 500,
          })}
        >
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          mix={css({
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.025em",
          })}
        >
          {count}
        </div>
      </CardContent>
    </Card>
  );
};
}
