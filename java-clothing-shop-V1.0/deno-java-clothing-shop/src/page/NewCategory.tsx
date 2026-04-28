import { action, useAction } from "@solidjs/router";
import { createSignal, For, JSX, Show } from "solid-js";

import type { Category } from "~/model/Category";

function NewCategory(): JSX.Element {

  const saveCategory = action(async (category: Category) =>  {
    let route: string = "http://localhost:8899/api/category";
    let response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(category)
    });
    if (!response.ok) { throw new Error("can not save!"); }
    return response.json();
  });

  const saveCategories = action(async (categories: Array<Category>) => {
    let route: string = "http://localhost:8899/api/category/save_bulk";
    let response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categories)
    });
    if (!response.ok) { throw new Error("can not save!"); }
    return response.json();
  });

  const actionSave = useAction(saveCategory);
  const actionSaveCategories = useAction(saveCategories);

  let [listCategories, setListCategories] = createSignal<Array<Category>>([]);

  function handleSubmit(event: Event): void {
    event.preventDefault();
    let result;
    let data: FormData = new FormData(event.target as HTMLFormElement);
    let category: Category = {
      name: data.get("name") as string
    };
    if (listCategories().length === 0) {
      result = actionSave(category);
    } else {
      result = actionSaveCategories(listCategories());
    }
  }

  function handleAddElement(): void {
    let form: HTMLFormElement = document.getElementById("form") as HTMLFormElement;
    let data: FormData = new FormData(form);
    let category: Category = {
      name: data.get("name") as string
    };
    let list: Array<Category> = [
      ...listCategories(),
      category
    ]
    setListCategories(list);
  }

  function handleRemoveElement(position: number): void {
    let list: Array<Category> = listCategories().filter((_, index) => index !== position);
    setListCategories(list);
  }

  function handleClear(): void {
    setListCategories([]);
  }

  return (
    <>
      <div class="title_main_container">
        <h1 class="title_main">NEW CATEGORY</h1>
      </div>
      <div class="form_container">
        <form id="form" class="form form_new_item" autocomplete="off" onSubmit={handleSubmit}  onReset={handleClear}>
          <div class="form_field">
            <label for="name" class="label">Name: (*)</label>
            <input type="text" name="name" id="name" class="input input_text" minlength="1" maxlength="32" placeholder="new name for the category" required />
          </div>
          <div class="buttons_panel">
            <input class="button" type="submit" value="save" />
            <input class="button" type="button" value="queue" onClick={handleAddElement} />
            <input class="button" type="reset" value="clear" />
            <a href="/categories.html" class="button" target="_self">back</a>
          </div>
        </form>
      </div>
      <Show when={listCategories().length}>
        <div class="table_form_elements_container">
          <table class="table_form_elements">
            <thead>
              <tr>
                <th>NAME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <For each={listCategories()}>
                {
                  (category, index) => {
                    return (
                      <>
                        <tr>
                          <td>{category.name}</td>
                          <td>
                            <button onClick={() => {handleRemoveElement(index())}}>
                              <i class="fa-solid fa-circle-xmark" />
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

export default NewCategory;
