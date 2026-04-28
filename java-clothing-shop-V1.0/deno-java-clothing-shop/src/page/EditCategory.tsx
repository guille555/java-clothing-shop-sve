import { action, Params, useAction, useParams } from "@solidjs/router";
import { JSX } from "solid-js";

import type { Category } from "~/model/Category";

import { store } from "~/store/store";

function EditCategory(): JSX.Element {

  const updateCategory = action(async (category: Category) => {
    let route: string = "http://localhost:8899/api/category";
    let response = await fetch(route, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(category)
    });
    if (!response.ok) { throw new Error("cant update"); }
    console.log(response);
  });

  const actionUpdateCategory = useAction(updateCategory);

  let params: Params = useParams();
  let id: number = parseInt(params.id!) - 1;
  let category = { ...store.categories[id] };

  function handleSubmit(event: Event) {
    event.preventDefault();
    let form: HTMLFormElement = event.target as HTMLFormElement;
    let data: FormData = new FormData(form);
    let information = Object.fromEntries(data);
    let package_data = { ...category, ...information };
    // console.log(package_data);
    actionUpdateCategory(package_data);
  };

  return (
    <>
      <h1>EDIT of the category</h1>
      <div class="form_detail_container">
        <form class="form_detail" autocomplete="off" onSubmit={handleSubmit}>
          <div class="form_field">
            <label for="name" class="label">Name: (*)</label>
            <input type="text" name="name" id="name" class="input input_text" value={category.name} minlength="1" maxlength="32" required />
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
          <div class="buttons_panel">
            <input class="button" type="submit" value="save" />
            <a href="/categories.html" class="button" target="_self">back</a>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditCategory;
