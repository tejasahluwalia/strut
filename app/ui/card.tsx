import { css, type Handle } from "remix/ui";
import { theme } from "remix/ui/theme";

export function Card(handle: Handle<JSX.IntrinsicElements["div"]>) {
  return () => (
        <div
      mix={css({
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.surface.lvl0,
        color: theme.colors.text.primary,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
      })}
      {...handle.props}
    />
  );
}

export function CardHeader(handle: Handle<JSX.IntrinsicElements["div"]>) {
  return () => (
        <div
      mix={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        padding: "1.5rem",
      })}
      {...handle.props}
    />
  );
}

export function CardTitle(handle: Handle<JSX.IntrinsicElements["h3"]>) {
  return () => (
        <h3
      mix={css({
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "-0.025em",
        margin: 0,
      })}
      {...handle.props}
    />
  );
}

export function CardDescription(handle: Handle<JSX.IntrinsicElements["p"]>) {
  return () => (
        <p
      mix={css({
        fontSize: "0.875rem",
        color: theme.colors.text.muted,
        margin: 0,
      })}
      {...handle.props}
    />
  );
}

export function CardContent(handle: Handle<JSX.IntrinsicElements["div"]>) {
  return () => (
        <div
      mix={css({
        padding: "0 1.5rem 1.5rem 1.5rem",
        flex: 1,
      })}
      {...handle.props}
    />
  );
}

export function CardFooter(handle: Handle<JSX.IntrinsicElements["div"]>) {
  return () => (
        <div
      mix={css({
        display: "flex",
        alignItems: "center",
        padding: "1.5rem",
        paddingTop: 0,
      })}
      {...handle.props}
    />
  );
}
