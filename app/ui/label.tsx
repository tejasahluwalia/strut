import { css, type Handle } from "remix/ui";
import { theme } from "remix/ui/theme";

export function Label(handle: Handle<JSX.IntrinsicElements["label"]>) {
	return () => (
		// biome-ignore lint/a11y/noLabelWithoutControl: Label wrapper component passes htmlFor via props
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
