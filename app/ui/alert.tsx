import { css, type Handle } from "remix/ui";
import { theme } from "remix/ui/theme";

type AlertProps = JSX.IntrinsicElements["div"] & {
  variant?: "default" | "destructive";
};

export function Alert(handle: Handle<AlertProps>) {
  let { variant = "default", ...props } = handle.props;
  let variants: any = {
    default: {
      backgroundColor: theme.surface.lvl0,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.default}`,
    },
    destructive: {
      border: `1px solid ${theme.colors.action.danger.background}`,
      color: theme.colors.action.danger.background,
    },
  };

  let baseStyles: any = {
    position: "relative",
    width: "100%",
    borderRadius: theme.radius.md,
    padding: "1rem",
    fontSize: "0.875rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  };

  return (
    <div
      role="alert"
      mix={css({ ...baseStyles, ...variants[variant] })}
      {...handle.props}
    />
  );
}

export function AlertTitle(handle: Handle<JSX.IntrinsicElements["h5"]>) {
  return () => (
    <h5
      mix={css({
        margin: 0,
        fontWeight: 500,
        lineHeight: 1,
        letterSpacing: "-0.025em",
      })}
      {...handle.props}
    />
  );
}

export function AlertDescription(handle: Handle<JSX.IntrinsicElements["div"]>) {
  return () => (
    <div
      mix={css({
        margin: 0,
        opacity: 0.9,
      })}
      {...handle.props}
    />
  );
}
