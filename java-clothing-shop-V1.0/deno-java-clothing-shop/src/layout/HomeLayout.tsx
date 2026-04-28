import { A } from "@solidjs/router";
import { JSX } from "solid-js";

type HomeLayoutProps = {
  title: string
};

function HomeLayout(props: HomeLayoutProps): JSX.Element {
  return (
    <>
      <h1>{props.title}</h1>
      <table>
        <thead>
          <tr>
            <th>Go to...</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><A href="/categories.html" target="_self">CATEGORIES</A></td>
          </tr>
          <tr>
            <td><A href="/products.html" target="_self">PRODUCTS</A></td>
          </tr>
          <tr>
            <td><A href="/sales.html" target="_self">SALES</A></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default HomeLayout;
