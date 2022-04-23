import { Form, Pagination, Table } from 'antd';
import ListingSkeletonTable from './ListingSkeletonTable';

export function ListingTable({
  columns,
  pageSize,
  pageNum,
  totalElements,
  onPageChange,
  tableLoading,
  dataTable
}) {
  return (
    <>
      <Form.Item name="pageNum">
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={pageNum}
          current={pageNum}
          total={totalElements}
          onChange={onPageChange}
        />
      </Form.Item>
      {tableLoading ? (
        <ListingSkeletonTable columns={columns} />
      ) : (
        <Table
          columns={columns}
          dataSource={dataTable}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          sticky={{ offsetHeader: 48 }}
          pagination={false}
        />
      )}
      <Form.Item name="pageNum">
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={pageNum}
          current={pageNum}
          total={totalElements}
          onChange={onPageChange}
        />
      </Form.Item>
    </>
  );
}
