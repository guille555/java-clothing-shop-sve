import { action, useAction } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, JSX, Show } from "solid-js";

import type { Product } from "~/model/Product";
import type { SaleItem } from "~/model/SaleItem";

async function saveSale(products: Array<SaleItem>) {
  let route: string = "http://localhost:8899/api/sale";
  let response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(products)
  });
  if (!response.ok) { throw new Error("can not save!"); }
  return response.json();
};

async function fetchAllProducts() {
  let route = "http://localhost:8899/api/product/find_all";
  let response = await fetch(route);
  if (!response.ok) { throw new Error("fail to fetch"); }
  return response.json();
}

function NewSale(): JSX.Element {

  const save = action(saveSale);
  const actionSave = useAction(save);

  let [listProducts, setListProducts] = createSignal<Array<Product>>([]);
  let [listSaleItems, setListSaleItems] = createSignal<Array<SaleItem>>([]);

  function handleSubmit(event: Event): void {
    event.preventDefault();
    /*
    let data: FormData = new FormData(event.target as HTMLFormElement);
    let product: Product = {
      name: data.get("name") as string,
      unitPrice: parseFloat(data.get("unit_price") as string),
      ammount: parseInt(data.get("ammount") as string)
    };
    if (listProducts().length === 0) {
      actionSave(product);
    } else {
      actionSaveProducts(listProducts());
    }
    */
   actionSave(listSaleItems());
  }

  function handleAddElement(): void {
    let form: HTMLFormElement = document.getElementById("form") as HTMLFormElement;
    let data: FormData = new FormData(form);
    let productIndex = parseInt(data.get("product") as string);
    let product: Product = listProducts().at(productIndex)!;
    let item: SaleItem = {
      unitPrice: 1,
      ammount: parseInt(data.get("ammount") as string),
      product
    };
    let list: Array<SaleItem> = [
      ...listSaleItems(),
      item
    ]
    setListSaleItems(list);
  }

  function handleRemoveElement(position: number): void {
    let list: Array<SaleItem> = listSaleItems().filter((_, index) => index !== position);
    setListSaleItems(list);
  }

  function handleClear(): void {
    setListSaleItems(Array<SaleItem>());
  }

  const [data] = createResource(fetchAllProducts);
  createEffect(() => {
    setListProducts(data());
  });

  return (
    <>
      <div class="title_main_container">
        <h1 class="title_main">NEW SALE</h1>
      </div>
      <div class="form_container">
        <form id="form" class="form form_new_item" autocomplete="off" onSubmit={handleSubmit} onReset={handleClear} >
          <div class="form_field">
            <label for="ammount" class="label">Ammount: (*)</label>
            <input type="number" name="ammount" id="ammount" class="input input_text" min="1" step="1" placeholder="new ammount to store" required />
          </div>
          <div class="form_field">
            <label for="product" class="label">Product: (*)</label>
            <select name="product" id="product" required>
              <option value="NaN" disabled selected>SELECT OPTION</option>
              <For each={listProducts()}>
                {
                  (itm, index) => <option value={index()}>{itm.name}</option>
                }
              </For>
            </select>
          </div>
          <div class="buttons_panel">
            <input class="button" type="submit" value="sale" />
            <input class="button" type="button" value="add" onClick={handleAddElement}/>
            <input class="button" type="reset" value="clear" />
            <a href="/sales.html" class="button" target="_self">back</a>
          </div>
        </form>
      </div>
      <Show when={listSaleItems().length}>
        <div class="table_form_elements_container">
          <table class="table_form_elements">
            <thead>
              <tr>
                <th>NAME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <For each={listSaleItems()}>
                {
                  (item, index) => {
                    return (
                      <>
                        <tr>
                          <td>{item.product?.name}</td>
                          <td>{item.ammount}</td>
                          <td>{item.product?.unitPrice}</td>
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

export default NewSale;
