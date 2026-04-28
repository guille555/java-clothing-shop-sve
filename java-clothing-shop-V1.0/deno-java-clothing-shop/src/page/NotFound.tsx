import { JSX } from "solid-js";

function NotFound(): JSX.Element {
  return (
    <>
      <h1>404 Page not Found</h1>
      <a href="/" target="_self">Go to index</a>
    </>
  );
};

export default NotFound;
