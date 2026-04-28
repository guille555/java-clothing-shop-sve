import { children, Component, createSignal, For, JSX, ParentComponent, Show } from "solid-js";

import MainTitle from "~/components/MainTitle";
import TableRowNewItem from "~/components/TableRowNewItem";

import "./Layout.css";

/*
type NewCategory = {
  name: string
};

const FormField: ParentComponent = (props): JSX.Element => {
  let cmp = children(() => props.children);
  return (
    <div class="form_field">
      {cmp()}
    </div>
  );
};
*/

/*
const Layout: Component = (): JSX.Element => {

  let initValue: Array<NewCategory> = [];

  const [showTable, setShowTable] = createSignal(false);
  const [showSuccessMessage, setShowSuccessMessage] = createSignal(false);
  const [categories, setCategories] = createSignal(initValue);

  const handler_bulk_save = async (list: Array<NewCategory>) => {
    let response = await fetch("http://localhost:8899/api/category/save_bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(list)
    });
    return await response.json();
  };

  const handler_save = async (event: Event) => {
    event.preventDefault();
    let size: number = categories().length;
    let result;
    if (size > 0) {
      result = await handler_bulk_save(categories());
    }
    console.log(result);
    if (result && (result.length > 0)) {
      setShowSuccessMessage(true);
    }
    return result;
  };

  const handler_clear_form = (): void => {
    setShowTable(false);
    setCategories([]);
  };

  const handler_enqueue_item = (): void => {
    let form: HTMLFormElement = document.getElementById("form") as HTMLFormElement;
    let fields: FormData = new FormData(form);
    let data: NewCategory = Object.fromEntries(fields) as NewCategory;
    setCategories([ ...categories(), data ]);
    setShowTable(true);
  };

  return (
    <main class="main">
      <MainTitle text="NEW CATEGORY" />
      <div class="form_container">
        <form id="form" class="form_new_item" autocomplete="off">
          <FormField>
            <label for="name" class="label">Name: (*)</label>
            <input type="text" name="name" id="name" placeholder="category name" class="input input_text" />
          </FormField>
          <div class="form_field buttons">
            <input type="submit" value="save" class="button" onClick={handler_save} />
            <input type="button" value="enqueue" class="button" onClick={handler_enqueue_item} />
            <input type="reset" value="clear" class="button" onClick={handler_clear_form} />
            <a href="#" class="button">return</a>
          </div>
        </form>
      </div>
      <Show when={showTable()}>
        <div class="table_items_container">
          <table id="table_items" class="table_items">
            <thead>
              <tr>
                <th>NAME</th>
              </tr>
            </thead>
            <tbody>
              <For each={categories()}>
                {
                  (category, index) => {
                    return  <TableRowNewItem text={category.name} key={index()}/>
                  }
                }
              </For>
            </tbody>
          </table>
        </div>
      </Show>
      <Show when={showSuccessMessage()}>
        <div>
          <p>saved, succcess!!</p>
        </div>
      </Show>
    </main>
  );
};

export default Layout;
*/

function Layout(): JSX.Element {
  return (
    <>
      <header class="header">
        <nav class="navbar">
          <ul class="menu_list">
            <li class="menu_item"><a class="menu_link" href="/">HOME</a></li>
            <li class="menu_item"><a class="menu_link" href="/categories.html">CATEGORIES</a></li>
            <li class="menu_item"><a class="menu_link" href="#">PRODUCTS</a></li>
            <li class="menu_item"><a class="menu_link" href="#">SALES</a></li>
          </ul>
        </nav>
      </header>
      <main class="main">
        <div class="title_main_container">
          <h1 class="title_main">NEW CATEGORY</h1>
        </div>
        <div class="form_container">
          <form id="form" class="form" autocomplete="off">
            <div class="form_field">
              <label for="name" class="label">Name: (*)</label>
              <input type="text" name="name" id="name" class="input input_text" minlength="1" maxlength="32" placeholder="new name for the category" />
            </div>
            <div class="buttons_panel">
              <input class="button" type="submit" value="save" />
              <input class="button" type="button" value="queue" />
              <input class="button" type="reset" value="clear" />
              <a href="#" class="button">back</a>
            </div>
          </form>
        </div>
        <div class="table_form_elements_container">
          <table class="table_form_elements">
            <thead>
              <tr>
                <th>NAME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>NAME#01</td>
                <td>
                  <i class="fa-solid fa-circle" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default Layout;
