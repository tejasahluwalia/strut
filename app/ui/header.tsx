import { css, type Handle, type SerializableProps } from "remix/ui";
import { theme } from "remix/ui/theme";
import { routes } from "../routes.ts";

interface SiteHeaderProps extends SerializableProps {
	isAdmin?: boolean;
}

export function SiteHeader(handle: Handle<SiteHeaderProps>) {
	return () => (
		<header
			mix={css({
				position: "sticky",
				top: 0,
				zIndex: 50,
				width: "100%",
				borderBottom: `1px solid ${theme.colors.border.default}`,
				backgroundColor: `color-mix(in srgb, ${theme.surface.lvl0} 95%, transparent)`,
				backdropFilter: "blur(8px)",
			})}
		>
			<div
				mix={css({
					display: "flex",
					height: "3.5rem",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 1.5rem",
					maxWidth: "1400px",
					margin: "0 auto",
				})}
			>
				<div mix={css({ display: "flex", alignItems: "center", gap: "1rem" })}>
					<a
						href={routes.home.href()}
						mix={css({
							fontWeight: 700,
							fontSize: "1.25rem",
							color: theme.colors.text.primary,
							textDecoration: "none",
							letterSpacing: "-0.025em",
						})}
					>
						Strut
					</a>
				</div>
				{handle.props.isAdmin && (
					<form method="POST" action={routes.admin.auth.logout.href()}>
						<button
							type="submit"
							mix={css({
								background: "transparent",
								border: "none",
								fontSize: "0.875rem",
								color: theme.colors.text.muted,
								cursor: "pointer",
								"&:hover": {
									color: theme.colors.text.primary,
								},
							})}
						>
							Sign out
						</button>
					</form>
				)}
			</div>
		</header>
	);
}
