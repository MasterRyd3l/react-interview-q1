/**
 * `TableComponent` is a functional component that renders a table displaying data.
 * It expects `tableData` as a prop, which should be an array of objects with `name` and `country` properties.
 *
 * Props:
 * - `tableData` (Array of Objects): Each object should have `name` and `country` properties.
 *    - `name` (String): The name to be displayed in the table's first column.
 *    - `country` (String): The country to be displayed in the table's second column.
 *
 * Example usage:
 * ```
 * const tableData = [
 *   { name: 'San Diego', country: 'USA' },
 *   { name: 'Monreal', country: 'Canada' },
 * ];
 *
 * <TableComponent tableData={tableData} />
 * ```
 *
 * This component renders a `div` with a class `row my-4`, containing a single `col` `div`.
 * Inside this `div`, a `table` with class `table` is rendered, which includes a `thead` section for column titles,
 * and a `tbody` section where data rows are dynamically generated based on `tableData`.
 */

import "./TableComponent.css"; // Import the CSS styles

function TableComponent({ tableData }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={`${item.name}-${item.country}`}>
              <td>{item.name}</td>
              <td>{item.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;
