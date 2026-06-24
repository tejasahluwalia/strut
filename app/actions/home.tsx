import { css } from "remix/ui";

import { routes } from "../routes.ts";
import { Document } from "../ui/document.tsx";
import { SiteHeader } from "../ui/header.tsx";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Label } from "../ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";

export function PublicHomePage() {
  return () => (
    <Document title="Strut" head={<PublicHomeHead />}>
      <SiteHeader />
      <main
        mix={css({
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
        })}
      >
        <section
          mix={css({
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            maxWidth: "42rem",
          })}
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
                fontSize: "3rem",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                margin: 0,
                lineHeight: 1.1,
              })}
            >
              Indian Fashion Archive
            </h1>
          </div>
          <search>
            <form
              action={routes.home.href()}
              method="get"
              mix={css({
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "32rem",
              })}
            >
              <div
                mix={css({
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                })}
              >
                <Label htmlFor="site-search">Search the archive</Label>
                <div mix={css({ display: "flex", gap: "0.5rem" })}>
                  <Input
                    id="site-search"
                    name="q"
                    type="search"
                    placeholder="Search events, collections, designers"
                  />
                  <Button type="submit">Search</Button>
                </div>
              </div>
            </form>
          </search>
        </section>

        <section
          aria-label="Recently added"
          mix={css({ display: "flex", flexDirection: "column", gap: "1rem" })}
        >
          <h2
            mix={css({
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "-0.025em",
            })}
          >
            Recently added
          </h2>
          <div
            mix={css({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            })}
          >
            <Placeholder title="Event" />
            <Placeholder title="Collection" />
            <Placeholder title="Look" />
          </div>
        </section>
      </main>
    </Document>
  );
}

function PublicHomeHead() {
  return () => (
    <>
      <meta
        name="description"
        content="Strut is a public archive for Indian fashion shows, collections, looks, and media."
      />
    </>
  );
}

function Placeholder() {
  return ({ title }: { title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          mix={css({
            height: "100px",
            backgroundColor: "hsl(var(--muted))",
            borderRadius: "var(--radius)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "hsl(var(--muted-foreground))",
            fontSize: "0.875rem",
          })}
        >
          Preview
        </div>
      </CardContent>
    </Card>
  );
}
