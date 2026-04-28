import { action, Navigator, useAction, useNavigate } from "@solidjs/router";
import { createEffect, createResource, createSignal, For } from "solid-js";

import type { Category } from "~/model/Category";
import type { Product } from "~/model/Product";
import type { Sale } from "~/model/Sale";

import { setStore, store } from "~/store/store";

const dateConfig: object = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit" 
};

async function fetchAllSales() {
  let date = new Date();
  let route = `http://localhost:8899/api/sale/find_all?date=${date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0")}`;
  let response = await fetch(route);
  if (!response.ok) { throw new Error("fail to fetch"); }
  return response.json();
}

function Sale() {

  const navigator: Navigator = useNavigate();

  const [listSales, setListSales] = createSignal<Array<Sale>>(Array<Sale>());
  const [data] = createResource(fetchAllSales);
  
  function goDetail(event: Event, id: number) {
    event.preventDefault();
    navigator(`/sale/${id + 1}/detail.html`);
  }

  createEffect(() => {
    setListSales(data());
    if (listSales()) {
      setStore("sales", data());
    }
  });
  
  return (
    <>
      <div class="filter_panel_container">
        <form autocomplete="off">
          <div class="filter_panel_field">
            <label for="date">Date:</label>
            <input type="date" name="date" id="date" placeholder="sale date" />
          </div>
          <div class="filter_panel_buttons">
            <input type="submit" value="search" class="filter_button" />
            <input type="reset" value="clean" class="filter_button" />
            <a href="/sale/new.html" target="_self" class="filter_button">new</a>
          </div>
        </form>
      </div>
      <h1>LIST sales</h1>
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <For each={store.sales} >
            {
              (sale, index) => {
                return (
                  <>
                    <tr>
                      <td>{sale.createDate?.toString()}</td>
                      <td>
                        <div>
                          <a href={`/sale/${index() + 1}/detail.html`} target="_self" onClick={(event) => {goDetail(event, index())}}>
                            <i class="fa-solid fa-circle-info" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              }
            }
          </For>
        </tbody>
      </table>
    </>
  );
}

export default Sale;
