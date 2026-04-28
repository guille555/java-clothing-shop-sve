import { JSX } from "solid-js";
import { A } from "@solidjs/router";

import "./Layout.css";

type LayoutProps = {
  children?: JSX.Element
};

function Layout(props: LayoutProps): JSX.Element {
  return (
    <>
      <header class="header">
        <nav class="navbar">
          <ul class="menu_list">
            <li class="menu_item"><A class="menu_link" href="/" target="_self">HOME</A></li>
            <li class="menu_item"><A class="menu_link" href="/categories.html" target="_self">CATEGORIES</A></li>
            <li class="menu_item"><A class="menu_link" href="/products.html" target="_self">PRODUCTS</A></li>
            <li class="menu_item"><A class="menu_link" href="/sales.html" target="_self">SALES</A></li>
          </ul>
        </nav>
      </header>
      <main class="main">
        {props.children}
      </main>
    </>
  );
}

export default Layout;
