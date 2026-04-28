import { Component, JSX } from "solid-js";

import "./Header.css";

const Header: Component = (): JSX.Element => {
  return (
    <>
      <header class="header">
        <div class="header_banner">
          <div id="menu_container" class="menu_container">
            <i class="fa-solid fa-bars" />
          </div>
          <div class="logo_container">
            <p><a href="#">JAVA SHOP</a></p>
          </div>
          <div class="shopping_basket_container">
            <i class="fa-solid fa-basket-shopping" />
          </div>
        </div>
        <div class="header_menu">
          <div id="menu_container" class="menu_container">
            <i class="fa-solid fa-bars" />
          </div>
          <nav class="menu_bar">
            <ul class="menu">
              <li class="menu_item"><a href="#">manage</a></li>
              <li class="menu_item"><a href="#">account</a></li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
