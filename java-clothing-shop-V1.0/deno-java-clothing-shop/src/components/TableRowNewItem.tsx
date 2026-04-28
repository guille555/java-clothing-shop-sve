import { Component, JSX } from "solid-js";

type TableRowNewItemProps = {
  text: string
  key: number
};

const TableRowNewItem: Component<TableRowNewItemProps> = (props: TableRowNewItemProps): JSX.Element => {
  return (
    <tr class="table_row_new_item" data-position={props.key}>
      <td>{props.text}</td>
    </tr>
  );
};

export default TableRowNewItem;
