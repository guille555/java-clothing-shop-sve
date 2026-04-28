import { action, Params, useAction, useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, JSX } from "solid-js";

import type { Category } from "~/model/Category";
import type { Product } from "~/model/Product";

import { store } from "~/store/store";

function EditProduct(): JSX.Element {

  const updateProduct = action(async (product: Product) => {
    let route: string = "http://localhost:8899/api/product";
    let response = await fetch(route, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });
    if (!response.ok) { throw new Error("cant update"); }
  });

  const actionUpdateProduct = useAction(updateProduct);

  let params: Params = useParams();
  let id: number = parseInt(params.id!) - 1;
  let product = { ...store.products[id] };

  function handleSubmit(event: Event) {
    event.preventDefault();
    let form: HTMLFormElement = event.target as HTMLFormElement;
    let data: FormData = new FormData(form);
    let categoryIndex: number = parseInt(data.get("category") as string);
    let cate: Category = listCategories().at(categoryIndex)!;
    let information = Object.fromEntries(data);
    let package_data = { ...product, ...information, category: cate };
    actionUpdateProduct(package_data);
  };

  async function fetchAllCategories() {
    let route = "http://localhost:8899/api/category/find_all";
    let response = await fetch(route);
    if (!response.ok) { throw new Error("fail to fetch"); }
    return response.json();
  }

  let [listCategories, setListCategories] = createSignal<Array<Category>>([]);
  const [data] = createResource(fetchAllCategories);
  createEffect(() => {
    setListCategories(data());
  });

  return (
    <>
      <h1>EDIT of the product</h1>
      <div class="form_detail_container">
        <form class="form_detail" autocomplete="off" onSubmit={handleSubmit}>
          <div class="form_field">
            <label for="name" class="label">Name: (*)</label>
            <input type="text" name="name" id="name" class="input input_text" minlength="1" maxlength="32" placeholder="new name for the product" value={product.name} required />
          </div>
          <div class="form_field">
            <label for="unitPrice" class="label">Unit price: (*)</label>
            <input type="text" name="unitPrice" id="unitPrice" class="input input_text" placeholder="new price of the product" value={product.unitPrice} required />
          </div>
          <div class="form_field">
            <label for="ammount" class="label">Ammount: (*)</label>
            <input type="number" name="ammount" id="ammount" class="input input_text" min="1" step="1" value={product.ammount} placeholder="new ammount to store" required />
          </div>
          <div class="form_field">
            <label for="flagState" class="label">Flag state:</label>
            <select name="flagState" id="flagState">
              <option value="true">ACTIVE</option>
              <option value="false">INACTIVE</option>
            </select>
          </div>
          <div class="form_field">
            <label for="flagVisible" class="label">Flag visible:</label>
            <select name="flagVisible" id="flagVisible">
              <option value="true">VISIBLE</option>
              <option value="false">INVISIBLE</option>
            </select>
          </div>
          <div class="form_field">
            <label for="category" class="label">Category: (*)</label>
            <select name="category" id="category" required>
              <For each={listCategories()}>
                {
                  (itm, index) => <option value={index()}>{itm.name}</option>
                }
              </For>
            </select>
          </div>
          <div class="buttons_panel">
            <input class="button" type="submit" value="save" />
            <a href="/products.html" class="button" target="_self">back</a>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProduct;
