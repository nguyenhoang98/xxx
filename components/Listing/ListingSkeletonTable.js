import { Table, Skeleton } from 'antd';

function ListingSkeletonTable({ columns, rowCount }) {
  return (
    <Table
      rowKey="key"
      pagination={false}
      dataSource={[...Array(rowCount)].map((_, index) => ({
        key: `key${index}`
      }))}
      columns={columns.map(column => {
        return {
          ...column,
          render: function renderPlaceholder() {
            return <Skeleton key={column.dataIndex} title paragraph={false} />;
          }
        };
      })}
    />
  );
}

ListingSkeletonTable.defaultProps = {
  rowCount: 10
};

export default ListingSkeletonTable;
