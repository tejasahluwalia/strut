import { type Handle } from "remix/ui";
import { css, type RemixNode } from "remix/ui";
import { theme } from "remix/ui/theme";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  children?: RemixNode;
};

export function Button(handle: Handle<ButtonProps>) {
  return () => {
    let { variant = "primary", size = "md", ...props } = handle.props;
    let baseStyles: any = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      borderRadius: theme.radius.sm,
      fontSize: "0.875rem",
      fontWeight: 500,
      transition: "colors 0.15s ease-in-out",
      cursor: "pointer",
      border: "1px solid transparent",
      ":disabled": {
        opacity: 0.5,
        pointerEvents: "none",
      },
    };

    let variants: any = {
      primary: {
        backgroundColor: theme.colors.action.primary.background,
        color: theme.colors.action.primary.foreground,
        ":hover": {
          backgroundColor: theme.colors.action.primary.backgroundHover,
        },
      },
      secondary: {
        backgroundColor: theme.colors.action.secondary.background,
        color: theme.colors.action.secondary.foreground,
        ":hover": {
          backgroundColor: theme.colors.action.secondary.backgroundHover,
        },
      },
      destructive: {
        backgroundColor: theme.colors.action.danger.background,
        color: theme.colors.action.danger.foreground,
        ":hover": {
          backgroundColor: theme.colors.action.danger.backgroundHover,
        },
      },
      outline: {
        border: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.surface.lvl0,
        ":hover": {
          backgroundColor: theme.surface.lvl1,
          color: theme.colors.text.primary,
        },
      },
      ghost: {
        backgroundColor: "transparent",
        ":hover": {
          backgroundColor: theme.surface.lvl1,
          color: theme.colors.text.primary,
        },
      },
    };

    let sizes: any = {
      sm: { height: "2rem", padding: "0 0.75rem", fontSize: "0.75rem" },
      md: { height: "2.5rem", padding: "0 1rem" },
      lg: { height: "2.75rem", padding: "0 2rem" },
      icon: { height: "2.5rem", width: "2.5rem" },
    };

    return (
      <button
        mix={css({ ...baseStyles, ...variants[variant], ...sizes[size] })}
        {...handle.props}
      />
    );
  };
}
