import { createEffect, createResource, createSignal, For, JSX } from "solid-js";
import { action, Navigator, useAction, useNavigate } from "@solidjs/router";

import { store, setStore } from "~/store/store";
import type { Category } from "~/model/Category";

async function fetchAllCategories() {
  let route = "http://localhost:8899/api/category/find_all";
  let response = await fetch(route);
  if (!response.ok) { throw new Error("fail to fetch"); }
  return response.json();
}

async function shiftCategory(category: Category) {
  let route: string = "http://localhost:8899/api/category";
  let response = await fetch(route, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(category)
  });
  console.log(response)
}

async function deleteCategory(category: Category) {
  let route: string = `http://localhost:8899/api/category?id=${category.publicKey}`;
  let response = await fetch(route, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(category)
  });
  console.log(response)
}

function Category(): JSX.Element {

  const navigator: Navigator = useNavigate();

  const actionShift = action(async (event: Event, index: number) => {
    event.preventDefault();
    let category: Category = { ...store.categories[index] };
    category.flagVisible = !category.flagVisible;
    setStore("categories", index, category);
    await shiftCategory(category);
  });

  const actionDelete = action(async (event: Event, index: number) => {
    event.preventDefault();
    let category: Category = { ...store.categories[index] };
    await deleteCategory(category);
    setStore("categories", store.categories.filter(item => item.publicKey !== category.publicKey));
  });

  const handleShift = useAction(actionShift);

  const handleDelete = useAction(actionDelete);

  function goDetail(event: Event, id: number) {
    event.preventDefault();
    navigator(`/category/${id + 1}/detail.html`);
  }

  function goEdition(event: Event, id: number) {
    event.preventDefault();
    navigator(`/category/${id + 1}/edit.html`);
  }

  const [listCategories, setListCategories] = createSignal([]);

  const [data] = createResource(fetchAllCategories);
  setListCategories(data());

  createEffect(() => {
    if (listCategories()) {
      setStore("categories", listCategories());
    }
  });

  return (
    <>
      <div class="filter_panel_container">
        <form autocomplete="off">
          <div class="filter_panel_field">
            <label for="name">Name:</label>
            <input type="text" name="name" id="name" placeholder="category name" />
          </div>
          <div class="filter_panel_buttons">
            <input type="submit" value="search" class="filter_button" />
            <input type="reset" value="clean" class="filter_button" />
            <a href="/category/new_category.html" target="_self" class="filter_button">new</a>
          </div>
        </form>
      </div>
      <h1>LIST categories</h1>
      <table>
        <thead>
          <tr>
            <th>NAME</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <For each={store.categories} >
            {(category, index) => {
              return (
                <>
                  <tr>
                    <td>{category.name}</td>
                    <td>
                      <div>
                        <a href={`/category/${index() + 1}/detail.html`} target="_self" onClick={(event) => {goDetail(event, index())}}>
                          <i class="fa-solid fa-circle-info" />
                        </a>
                        <a href={`/category/${index() + 1}/edit.html`} target="_self" onClick={(event) => {goEdition(event, index())}}>
                          <i class="fa-solid fa-file-pen" />
                        </a>
                        <a href="#" target="_self">
                          {
                            (category.flagState) ? (
                              <i class="fa-solid fa-circle-check" />
                            ) : (
                              <i class="fa-solid fa-circle-xmark" />
                            )
                          }
                        </a>
                        <a href="#" target="_self" onClick={(event) => {handleShift(event, index())}}>
                          {
                            (category.flagVisible) ? (
                              <i class="fa-solid fa-eye" />
                            ) : (
                              <i class="fa-solid fa-eye-slash" />
                            )
                          }
                        </a>
                        <a href="#" target="_self" onClick={(event) => {handleDelete(event, index())}}>
                          <i class="fa-solid fa-trash-can" />
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

export default Category;
