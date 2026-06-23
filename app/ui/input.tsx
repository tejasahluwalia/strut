import { css } from "remix/ui";

export function Input() {
  return (props: JSX.IntrinsicElements["input"]) => {
    return (
      <input
        mix={css({
          display: "flex",
          height: "2.5rem",
          width: "100%",
          borderRadius: "calc(var(--radius) - 2px)",
          border: "1px solid hsl(var(--input))",
          backgroundColor: "hsl(var(--background))",
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
          color: "hsl(var(--foreground))",
          transition:
            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          ":focus-visible": {
            outline: "none",
            border: "1px solid hsl(var(--ring))",
            boxShadow: "0 0 0 1px hsl(var(--ring))",
          },
          ":disabled": {
            cursor: "not-allowed",
            opacity: 0.5,
          },
          "::placeholder": {
            color: "hsl(var(--muted-foreground))",
          },
        })}
        {...props}
      />
    );
  };
}
