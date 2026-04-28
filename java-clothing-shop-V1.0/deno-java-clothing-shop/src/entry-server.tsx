// @refresh reload
import { createHandler, DocumentComponentProps, StartServer } from "@solidjs/start/server";
import { JSX } from "solid-js";

function HTMLFile({assets, children, scripts}: DocumentComponentProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ico/favicon.ico" />
        <link rel="stylesheet" href="/assets/fontawesome/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/fontawesome/css/brands.min.css" />
        <link rel="stylesheet" href="/assets/fontawesome/css/solid.min.css" />
        <link rel="stylesheet" href="/css/normalize.min.8.0.1.css" />
        {assets}
      </head>
      <body>
        <div id="app">
          {children}
        </div>
        {scripts}
      </body>
    </html>
  );
}

function ServerComponent(): JSX.Element {
  return (
    <StartServer document={HTMLFile} />
  );
}

export default createHandler(ServerComponent);
