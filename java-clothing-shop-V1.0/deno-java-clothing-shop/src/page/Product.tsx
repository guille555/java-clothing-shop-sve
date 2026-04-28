import { action, Navigator, useAction, useNavigate } from "@solidjs/router";
import { createEffect, createResource, createSignal, For } from "solid-js";
import type { Category } from "~/model/Category";
import type { Product } from "~/model/Product";
import { setStore, store } from "~/store/store";

async function fetchAllCategories() {
  let route = "http://localhost:8899/api/category/find_all";
  let response = await fetch(route);
  if (!response.ok) { throw new Error("fail to fetch"); }
  return response.json();
}

async function fetchAllProducts() {
  let route = "http://localhost:8899/api/product/find_all";
  let response = await fetch(route);
  if (!response.ok) { throw new Error("fail to fetch"); }
  return response.json();
}

async function shiftProduct(product: Product) {
  let route: string = "http://localhost:8899/api/product";
  let response = await fetch(route, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
}

async function deleteProduct(product: Product) {
  let route: string = `http://localhost:8899/api/product?id=${product.publicKey}`;
  let response = await fetch(route, {
    method: "DELETE"
  });
}

function Product() {
  const navigator: Navigator = useNavigate();
  
    function goDetail(event: Event, id: number) {
      event.preventDefault();
      navigator(`/product/${id + 1}/detail.html`);
    }
  
    function goEdition(event: Event, id: number) {
      event.preventDefault();
      navigator(`/product/${id + 1}/edit.html`);
    }

    const actionShift = action(async (event: Event, index: number) => {
      event.preventDefault();
      let product: Product = { ...store.products[index] };
      product.flagVisible = !product.flagVisible;
      setStore("products", index, product);
      await shiftProduct(product);
    });
  
    const actionDelete = action(async (event: Event, index: number) => {
      event.preventDefault();
      let product: Product = { ...store.products[index] };
      await deleteProduct(product);
      setStore("products", store.products.filter(item => item.publicKey !== product.publicKey));
    });

    const handleShift = useAction(actionShift);
    const handleDelete = useAction(actionDelete);
  
    const [listCategories, setListCategories] = createSignal<Category[]>([]);
    const [listProducts, setListProducts] = createSignal([]);
    const [data] = createResource(fetchAllCategories);
    const [products] = createResource(fetchAllProducts);
    setListProducts(products());

    createEffect(() => {
      setListCategories(data());
      if (listProducts()) {
        setStore("products", listProducts());
      }
    });
  
    return (
      <>
        <div class="filter_panel_container">
          <form autocomplete="off">
            <div class="filter_panel_field">
              <label for="name">Type:</label>
              <select name="category" id="category">
                <option value="0" disabled selected>SELECT OPTION</option>
                <For each={listCategories()}>
                  {
                    (cat, index) => <option value={index() + 1}>{cat.name}</option>
                  }
                </For>
              </select>
            </div>
            <div class="filter_panel_field">
              <label for="name">Name:</label>
              <input type="text" name="name" id="name" placeholder="product name" />
            </div>
            <div class="filter_panel_buttons">
              <input type="submit" value="search" class="filter_button" />
              <input type="reset" value="clean" class="filter_button" />
              <a href="/product/new_product.html" target="_self" class="filter_button">new</a>
            </div>
          </form>
        </div>
        <h1>LIST products</h1>
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <For each={store.products} >
              {(product, index) => {
                return (
                  <>
                    <tr>
                      <td>{product.name}</td>
                      <td>
                        <div>
                          <a href={`/product/${index() + 1}/detail.html`} target="_self" onClick={(event) => {goDetail(event, index())}}>
                            <i class="fa-solid fa-circle-info" />
                          </a>
                          <a href={`/product/${index() + 1}/edit.html`} target="_self" onClick={(event) => {goEdition(event, index())}}>
                            <i class="fa-solid fa-file-pen" />
                          </a>
                          <a href="#" target="_self">
                            {
                              (product.flagState) ? (
                                <i class="fa-solid fa-circle-check" />
                              ) : (
                                <i class="fa-solid fa-circle-xmark" />
                              )
                            }
                          </a>
                          <a href="#" target="_self" onClick={(event) => {handleShift(event, index())}}>
                            {
                              (product.flagVisible) ? (
                                <i class="fa-solid fa-eye" />
                              ) : (
                                <i class="fa-solid fa-eye-slash" />
                              )
                            }
                          </a>
                          <a href="#" target="_self">
                            <i class="fa-solid fa-trash-can" onClick={(event) => {handleDelete(event, index())}} />
                          </a>
                          <a href="#" target="_self">
                            <i class="fa-solid fa-file" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              }}
            </For>
          </tbody>
        </table>
      </>
    );
}

export default Product;
