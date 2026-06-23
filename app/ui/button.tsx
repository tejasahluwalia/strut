import { css, type RemixNode } from "remix/ui";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  children?: RemixNode;
};

export function Button() {
  return ({ variant = "primary", size = "md", ...props }: ButtonProps) => {
    let baseStyles: any = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      borderRadius: "calc(var(--radius) - 2px)",
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
        backgroundColor: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        ":hover": {
          backgroundColor: "hsl(var(--primary) / 0.9)",
        },
      },
      secondary: {
        backgroundColor: "hsl(var(--secondary))",
        color: "hsl(var(--secondary-foreground))",
        ":hover": {
          backgroundColor: "hsl(var(--secondary) / 0.8)",
        },
      },
      destructive: {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
        ":hover": {
          backgroundColor: "hsl(var(--destructive) / 0.9)",
        },
      },
      outline: {
        border: "1px solid hsl(var(--input))",
        backgroundColor: "hsl(var(--background))",
        ":hover": {
          backgroundColor: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        ":hover": {
          backgroundColor: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
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
        {...props}
      />
    );
  };
}
