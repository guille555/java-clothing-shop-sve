import { action, useAction } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, JSX, Show } from "solid-js";

import type { Category } from "~/model/Category";
import type { Product } from "~/model/Product";



function NewProduct(): JSX.Element {

  const saveProduct = action(async (product: Product) =>  {
    let route: string = "http://localhost:8899/api/product";
    let response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });
    if (!response.ok) { throw new Error("can not save!"); }
    return response.json();
  });

  const saveProducts = action(async (products: Array<Product>) => {
    let route: string = "http://localhost:8899/api/product/save_bulk";
    let response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(products)
    });
    if (!response.ok) { throw new Error("can not save!"); }
    return response.json();
  });

  async function fetchAllCategories() {
    let route = "http://localhost:8899/api/category/find_all";
    let response = await fetch(route);
    if (!response.ok) { throw new Error("fail to fetch"); }
    return response.json();
  }

  const actionSave = useAction(saveProduct);
  const actionSaveProducts = useAction(saveProducts);

  let [listCategories, setListCategories] = createSignal<Array<Category>>([]);
  let [listProducts, setListProducts] = createSignal<Array<Product>>([]);

  function handleSubmit(event: Event): void {
    event.preventDefault();
    let data: FormData = new FormData(event.target as HTMLFormElement);
    let categoryIndex: number = parseInt(data.get("category") as string);
    let category: Category = listCategories().at(categoryIndex)!;
    let product: Product = {
      name: data.get("name") as string,
      unitPrice: parseFloat(data.get("unit_price") as string),
      ammount: parseInt(data.get("ammount") as string),
      category
    };
    if (listProducts().length === 0) {
      actionSave(product);
    } else {
      actionSaveProducts(listProducts());
    }
  }

  function handleAddElement(): void {
    let form: HTMLFormElement = document.getElementById("form") as HTMLFormElement;
    let data: FormData = new FormData(form);
    let categoryIndex: number = parseInt(data.get("category") as string);
    let category: Category = listCategories().at(categoryIndex)!;
    let product: Product = {
      name: data.get("name") as string,
      unitPrice: parseFloat(data.get("unit_price") as string),
      ammount: parseInt(data.get("ammount") as string),
      category
    };
    let list: Array<Product> = [
      ...listProducts(),
      product
    ]
    setListProducts(list);
  }

  function handleRemoveElement(position: number): void {
    let list: Array<Product> = listProducts().filter((_, index) => index !== position);
    setListProducts(list);
  }

  function handleClear(): void {
    setListProducts([]);
  }

  const [data] = createResource(fetchAllCategories);
  createEffect(() => {
    setListCategories(data());
  });

  return (
    <>
      <div class="title_main_container">
        <h1 class="title_main">NEW PRODUCT</h1>
      </div>
      <div class="form_container">
        <form id="form" class="form form_new_item" autocomplete="off" onSubmit={handleSubmit}  onReset={handleClear}>
          <div class="form_field">
            <label for="name" class="label">Name: (*)</label>
            <input type="text" name="name" id="name" class="input input_text" minlength="1" maxlength="32" placeholder="new name for the product" required />
          </div>
          <div class="form_field">
            <label for="unitPrice" class="label">Unit price: (*)</label>
            <input type="text" name="unitPrice" id="unitPrice" class="input input_text" placeholder="new price of the product" required />
          </div>
          <div class="form_field">
            <label for="ammount" class="label">Ammount: (*)</label>
            <input type="number" name="ammount" id="ammount" class="input input_text" min="1" step="1" placeholder="new ammount to store" required />
          </div>
          <div class="form_field">
            <label for="category" class="label">Category: (*)</label>
            <select name="category" id="category" required>
              <option value="NaN" disabled selected>SELECT OPTION</option>
              <For each={listCategories()}>
                {
                  (itm, index) => <option value={index()}>{itm.name}</option>
                }
              </For>
            </select>
          </div>
          <div class="buttons_panel">
            <input class="button" type="submit" value="save" />
            <input class="button" type="button" value="queue" onClick={handleAddElement} />
            <input class="button" type="reset" value="clear" />
            <a href="/products.html" class="button" target="_self">back</a>
          </div>
        </form>
      </div>
      <Show when={listProducts().length}>
        <div class="table_form_elements_container">
          <table class="table_form_elements">
            <thead>
              <tr>
                <th>NAME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <For each={listProducts()}>
                {
                  (category, index) => {
                    return (
                      <>
                        <tr>
                          <td>{category.name}</td>
                          <td>
                            <button>
                              <i class="fa-solid fa-circle-xmark" onClick={() => {handleRemoveElement(index())}} />
                            </button>
                          </td>
                        </tr>
                      </>
                    );
                  }
                }
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </>
  );
}

export default NewProduct;
