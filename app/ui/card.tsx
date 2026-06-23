import { css } from "remix/ui";

export function Card() {
  return (props: JSX.IntrinsicElements["div"]) => (
    <div
      mix={css({
        borderRadius: "var(--radius)",
        border: "1px solid hsl(var(--border))",
        backgroundColor: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
      })}
      {...props}
    />
  );
}

export function CardHeader() {
  return (props: JSX.IntrinsicElements["div"]) => (
    <div
      mix={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        padding: "1.5rem",
      })}
      {...props}
    />
  );
}

export function CardTitle() {
  return (props: JSX.IntrinsicElements["h3"]) => (
    <h3
      mix={css({
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "-0.025em",
        margin: 0,
      })}
      {...props}
    />
  );
}

export function CardDescription() {
  return (props: JSX.IntrinsicElements["p"]) => (
    <p
      mix={css({
        fontSize: "0.875rem",
        color: "hsl(var(--muted-foreground))",
        margin: 0,
      })}
      {...props}
    />
  );
}

export function CardContent() {
  return (props: JSX.IntrinsicElements["div"]) => (
    <div
      mix={css({
        padding: "0 1.5rem 1.5rem 1.5rem",
        flex: 1,
      })}
      {...props}
    />
  );
}

export function CardFooter() {
  return (props: JSX.IntrinsicElements["div"]) => (
    <div
      mix={css({
        display: "flex",
        alignItems: "center",
        padding: "1.5rem",
        paddingTop: 0,
      })}
      {...props}
    />
  );
}
