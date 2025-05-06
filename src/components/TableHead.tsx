const TableHead = ({ tableHeadItems }: { tableHeadItems: string[] }) => (
  <thead>
    <tr>
      {tableHeadItems.map((item: string) => (
        <th
          key={item}
          scope="col"
          className="px-6 py-3 bg-grey-75 text-start text-sm font-medium text-grey-700 capitalize"
        >
          {item}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHead;
