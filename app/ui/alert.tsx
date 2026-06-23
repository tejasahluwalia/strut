import { css } from "remix/ui";

type AlertProps = JSX.IntrinsicElements["div"] & {
  variant?: "default" | "destructive";
};

export function Alert() {
  return ({ variant = "default", ...props }: AlertProps) => {
    let variants: any = {
      default: {
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        border: "1px solid hsl(var(--border))",
      },
      destructive: {
        border: "1px solid hsl(var(--destructive) / 0.5)",
        color: "hsl(var(--destructive))",
      },
    };

    let baseStyles: any = {
      position: "relative",
      width: "100%",
      borderRadius: "var(--radius)",
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
        {...props}
      />
    );
  };
}

export function AlertTitle() {
  return (props: JSX.IntrinsicElements["h5"]) => (
    <h5
      mix={css({
        margin: 0,
        fontWeight: 500,
        lineHeight: 1,
        letterSpacing: "-0.025em",
      })}
      {...props}
    />
  );
}

export function AlertDescription() {
  return (props: JSX.IntrinsicElements["div"]) => (
    <div
      mix={css({
        margin: 0,
        opacity: 0.9,
      })}
      {...props}
    />
  );
}
