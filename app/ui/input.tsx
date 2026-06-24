import { css, type Handle } from "remix/ui";
import { theme } from "remix/ui/theme";

export function Input(handle: Handle<JSX.IntrinsicElements["input"]>) {
    return () => (
      <input
        mix={css({
          display: "flex",
          height: "2.5rem",
          width: "100%",
          borderRadius: theme.radius.sm,
          border: `1px solid ${theme.colors.border.default}`,
          backgroundColor: theme.surface.lvl0,
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
          color: theme.colors.text.primary,
          transition:
            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          ":focus-visible": {
            outline: "none",
            border: `1px solid ${theme.colors.focus.ring}`,
            boxShadow: `0 0 0 1px ${theme.colors.focus.ring}`,
          },
          ":disabled": {
            cursor: "not-allowed",
            opacity: 0.5,
          },
          "::placeholder": {
            color: theme.colors.text.muted,
          },
        })}
        {...handle.props}
      />
    );
}
