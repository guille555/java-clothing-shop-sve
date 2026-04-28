import { Params, useParams } from "@solidjs/router";
import { JSX } from "solid-js";

import { store } from "~/store/store";

function DetailProduct(): JSX.Element {

  let params: Params = useParams();
  let id: number = parseInt(params.id!) - 1;
  let product = store.products[id];
  let flag_state_text: string = (product.flagState) ? ("ACTIVE") : ("INACTIVE");
  let flag_visible_text: string = (product.flagVisible) ? ("VISIBLE") : ("INVISIBLE");

  return (
    <>
      <h1>DETAIL of the product</h1>
      <div class="form_detail_container">
        <form class="form_detail">
          <div class="form_field">
            <label for="id" class="label">ID:</label>
            <input type="text" name="id" id="id" class="input input_text" value={product.publicKey} readonly />
          </div>
          <div class="form_field">
            <label for="name" class="label">Name:</label>
            <input type="text" name="name" id="name" class="input input_text" value={product.name} readonly/>
          </div>
          <div class="form_field">
            <label for="flag_state" class="label">Flag state:</label>
            <input type="text" name="flag_state" id="flag_state" class="input input_text" value={flag_state_text} readonly/>
          </div>
          <div class="form_field">
            <label for="flag_visible" class="label">Flag visible:</label>
            <input type="text" name="flag_visible" id="flag_visible" class="input input_text" value={flag_visible_text} readonly/>
          </div>
          <div class="form_field">
            <label for="category" class="label">Category:</label>
            <input type="text" name="category" id="category" class="input input_text" value={product.category?.name} readonly/>
          </div>
          <div class="buttons_panel">
            <a href="/products.html" class="button" target="_self">back</a>
          </div>
        </form>
      </div>
    </>
  );
}

export default DetailProduct;
