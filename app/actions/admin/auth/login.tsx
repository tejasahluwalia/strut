import { css, type Handle, type SerializableProps } from "remix/ui";
import { theme } from "remix/ui/theme";
import { routes } from "../../../routes.ts";
import { Button } from "../../../ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../ui/card.tsx";
import { Document } from "../../../ui/document.tsx";
import { SiteHeader } from "../../../ui/header.tsx";

interface AdminLoginPageProps extends SerializableProps {
	error?: string | null;
}

export function AdminLoginPage(handle: Handle<AdminLoginPageProps>) {
	return () => {
		const error = handle.props.error;
		let errorMessage = "";
		if (error === "access_denied") {
			errorMessage =
				"Login was cancelled. Please authorize the app to continue.";
		} else if (error === "oauth_failed") {
			errorMessage = "An error occurred during login. Please try again.";
		} else if (error) {
			errorMessage = `Login failed: ${error}`;
		}

		return (
			<Document title="Admin login | Strut" head={<AdminHead />}>
				<SiteHeader />
				<main
					mix={css({
						maxWidth: "1400px",
						margin: "0 auto",
						padding: "4rem 1.5rem",
						display: "flex",
						justifyContent: "center",
					})}
				>
					<Card mix={css({ maxWidth: "400px", width: "100%" })}>
						<CardHeader>
							<CardTitle>Admin login</CardTitle>
							<CardDescription>
								Access to the archive management workspace is restricted.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{errorMessage && (
								<div
									mix={css({
										color: theme.colors.action.danger.background,
										marginBottom: "1rem",
										fontSize: "0.875rem",
										textAlign: "center",
									})}
								>
									{errorMessage}
								</div>
							)}
							<form
								method="GET"
								action={routes.admin.auth.facebook.login.href()}
							>
								<Button type="submit" mix={css({ width: "100%" })}>
									Log in with Facebook
								</Button>
							</form>
						</CardContent>
					</Card>
				</main>
			</Document>
		);
	};
}

function AdminHead() {
	return () => (
		<>
			<meta name="robots" content="noindex,nofollow" />
		</>
	);
}
