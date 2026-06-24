import { css, type Handle } from "remix/ui";
import { theme } from "remix/ui/theme";

export function Label(handle: Handle<JSX.IntrinsicElements["label"]>) {
  return () => (
    <label
      mix={css({
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1,
        color: theme.colors.text.primary,
        cursor: handle.props.htmlFor ? "pointer" : "default",
      })}
      {...handle.props}
    />
  );
}
