import { Route, Router } from "@solidjs/router";
import { JSX } from "solid-js";

import "./app.css";
import "./layout/Layout.css";

import Layout from "./layout/Layout";

import Home from "./page/Home";
import Category from "./page/Category";
import NewCategory from "./page/NewCategory";
import DetailCategory from "./page/DetailCategory";
import EditCategory from "./page/EditCategory";
import Product from "./page/Product";
import NewProduct from "./page/NewProduct";
import DetailProduct from "./page/DetailProduct";
import EditProduct from "./page/EditProduct";
import Sale from "./page/Sales";
import NotFound from "./page/NotFound";
import NewSale from "./page/NewSale";
import DetailSale from "./page/DetailSale";


function App(): JSX.Element {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/categories.html" component={Category} />
      <Route path="/category/new_category.html" component={NewCategory} />
      <Route path="/category/:id/detail.html" component={DetailCategory} />
      <Route path="/category/:id/edit.html" component={EditCategory} />
      <Route path="/products.html" component={Product} />
      <Route path="/product/new_product.html" component={NewProduct} />
      <Route path="/product/:id/detail.html" component={DetailProduct} />
      <Route path="/product/:id/edit.html" component={EditProduct} />
      <Route path="/sales.html" component={Sale} />
      <Route path="/sale/new.html" component={NewSale} />
      <Route path="/sale/:id/detail.html" component={DetailSale} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;
