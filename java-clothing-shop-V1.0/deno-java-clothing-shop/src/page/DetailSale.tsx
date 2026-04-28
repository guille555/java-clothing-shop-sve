import { Params, useParams } from "@solidjs/router";
import { For, JSX } from "solid-js";

import { store } from "~/store/store";

function DetailSale(): JSX.Element {

  let params: Params = useParams();
  let id: number = parseInt(params.id!) - 1;
  let sale = store.sales[id];

  return (
    <>
      <h1>DETAIL of the sale</h1>
      <div class="form_detail_container">
        <form class="form_detail">
          <div class="form_field">
            <label for="id" class="label">ID:</label>
            <input type="text" name="id" id="id" class="input input_text" value={sale.publicKey} readonly />
          </div>
          <div class="form_field">
            <label for="id" class="label">Date:</label>
            <input type="text" name="id" id="id" class="input input_text" value={sale.createDate?.toString()} readonly />
          </div>
          <For each={sale.listSaleDetails} fallback={<p>list empty</p>}>
            {
              (item) => {
                return (
                  <>
                    <div class="form_field">
                      <label for="id" class="label">Product:</label>
                      <input type="text" name="id" id="id" class="input input_text" value={item.product?.name} readonly />
                      <input type="text" name="id" id="id" class="input input_text" value={item.unitPrice! * item.ammount!} readonly />
                    </div>
                  </>
                );
              }
            }
          </For>
          <div class="buttons_panel">
            <a href="/sales.html" class="button" target="_self">back</a>
          </div>
        </form>
      </div>
    </>
  );
}

export default DetailSale;
