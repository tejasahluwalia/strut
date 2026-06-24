import { createTheme } from "remix/ui/theme";

export const Theme = createTheme({
	space: {
		none: "0px",
		px: "1px",
		xs: "2px",
		sm: "4px",
		md: "8px",
		lg: "12px",
		xl: "16px",
		xxl: "24px",
	},
	radius: {
		none: "0px",
		sm: "4px",
		md: "8px",
		lg: "12px",
		xl: "16px",
		full: "9999px",
	},
	fontSize: {
		xxxs: "10px",
		xxs: "11px",
		xs: "12px",
		sm: "14px",
		md: "16px",
		lg: "18px",
		xl: "20px",
		xxl: "28px",
	},
	lineHeight: {
		tight: "1.2",
		normal: "1.5",
		relaxed: "1.7",
	},
	fontWeight: {
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	},
	shadow: {
		xs: "0 1px 2px rgb(0 0 0 / 0.05)",
		sm: "0 1px 3px rgb(0 0 0 / 0.10)",
		md: "0 4px 10px rgb(0 0 0 / 0.12)",
		lg: "0 10px 30px rgb(0 0 0 / 0.16)",
		xl: "0 20px 50px rgb(0 0 0 / 0.20)",
	},
	fontFamily: {
		sans: "Inter, sans-serif",
		mono: "monospace",
	},
	letterSpacing: {
		normal: "normal",
		tight: "-0.025em",
		meta: "0.05em",
		wide: "0.1em",
	},
	control: {
		height: {
			sm: "24px",
			md: "32px",
			lg: "40px",
		},
	},
	surface: {
		lvl0: "#ffffff",
		lvl1: "#f8fafc",
		lvl2: "#f1f5f9",
		lvl3: "#e5edf7",
		lvl4: "#dbe6f4",
	},
	colors: {
		text: {
			primary: "#111827",
			secondary: "#374151",
			muted: "#6b7280",
			link: "#2563eb",
		},
		border: {
			subtle: "#e5e7eb",
			default: "#d1d5db",
			strong: "#9ca3af",
		},
		focus: {
			ring: "#3b82f6",
		},
		overlay: {
			scrim: "rgb(0 0 0 / 0.45)",
		},
		action: {
			primary: {
				background: "#2563eb",
				backgroundHover: "#1d4ed8",
				backgroundActive: "#1e40af",
				foreground: "#ffffff",
				border: "#2563eb",
			},
			secondary: {
				background: "#ffffff",
				backgroundHover: "#f8fafc",
				backgroundActive: "#f1f5f9",
				foreground: "#111827",
				border: "#d1d5db",
			},
			danger: {
				background: "#dc2626",
				backgroundHover: "#b91c1c",
				backgroundActive: "#991b1b",
				foreground: "#ffffff",
				border: "#dc2626",
			},
		},
	},
});
