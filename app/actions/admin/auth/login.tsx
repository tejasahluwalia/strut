import { css, type Handle } from "remix/ui";

import { Document } from "../../../ui/document.tsx";
import { SiteHeader } from "../../../ui/header.tsx";
import { Alert, AlertDescription, AlertTitle } from "../../../ui/alert.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../ui/card.tsx";

interface AdminLoginPageProps {
  appId?: string;
  configId?: string;
}

export function AdminLoginPage(handle: Handle<AdminLoginPageProps>) {
  return () => {
    let { appId, configId } = handle.props;
    let canRenderFacebookButton = Boolean(appId && configId);

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
              {canRenderFacebookButton
                ? (
                  <FacebookLoginButton
                    appId={appId as string}
                    configId={configId as string}
                  />
                )
                : (
                  <Alert variant="default">
                    <AlertTitle>Configuration required</AlertTitle>
                    <AlertDescription>
                      Facebook login is waiting for Meta app configuration.
                      Please set up the appropriate environment variables.
                    </AlertDescription>
                  </Alert>
                )}
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

function FacebookLoginButton() {
  return ({ appId, configId }: { appId: string; configId: string }) => (
    <>
      <div id="fb-root" />
      <div
        className="fb-login-button"
        data-config_id={configId}
        data-size="large"
        data-button-type="login_with"
        data-layout="default"
        data-auto-logout-link="false"
        data-use-continue-as="false"
      />
      <script>
        {`
window.fbAsyncInit = function() {
  FB.init({
    appId: ${JSON.stringify(appId)},
    cookie: true,
    xfbml: true,
    version: 'v20.0'
  });
};
        `.trim()}
      </script>
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js"
      />
    </>
  );
}
