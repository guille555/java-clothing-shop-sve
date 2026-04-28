import { createStore } from "solid-js/store";

import type { Category } from "~/model/Category";
import type { Product } from "~/model/Product";
import type { Sale } from "~/model/Sale";

type GlobalStore = {
  categories: Array<Category>,
  products: Array<Product>,
  sales: Array<Sale>
};

export const [store, setStore] = createStore<GlobalStore>({
  categories: Array<Category>(),
  products: Array<Product>(),
  sales: Array<Sale>()
});
