// @refresh reload
import { JSX } from "solid-js";
import { mount, StartClient } from "@solidjs/start/client";

const AppHTML: HTMLElement = document.getElementById("app")!;

function ClientComponent(): JSX.Element {
  return (
    <StartClient />
  );
}

mount(ClientComponent, AppHTML);
