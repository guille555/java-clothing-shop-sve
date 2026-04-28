import { Component, ComponentProps, JSX } from "solid-js";

import "./MainTitle.css";

type MainTitleProps = {
  text: string
};

const MainTitle: Component<MainTitleProps> = (props: MainTitleProps): JSX.Element => {
  return (
    <div class="main_title_container">
      <h1 class="main_title">{props.text}</h1>
    </div>
  );
};

export default MainTitle;
