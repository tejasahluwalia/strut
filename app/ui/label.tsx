import { css } from "remix/ui";

export function Label() {
  return (props: JSX.IntrinsicElements["label"]) => (
    <label
      mix={css({
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1,
        color: "hsl(var(--foreground))",
        cursor: props.htmlFor ? "pointer" : "default",
      })}
      {...props}
    />
  );
}
