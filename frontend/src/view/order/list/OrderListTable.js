import { Table, Popconfirm } from 'antd';
import { i18n } from 'i18n';
import actions from 'modules/order/list/orderListActions';
import destroyActions from 'modules/order/destroy/orderDestroyActions';
import selectors from 'modules/order/list/orderListSelectors';
import destroySelectors from 'modules/order/destroy/orderDestroySelectors';
import model from 'modules/order/orderModel';
import orderSelectors from 'modules/order/orderSelectors';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TableWrapper from 'view/shared/styles/TableWrapper';
import ButtonLink from 'view/shared/styles/ButtonLink';
import UserListItem from 'view/iam/list/users/UserListItem';
import FilesListView from 'view/shared/list/FileListView';
import CustomerListItem from 'view/customer/list/CustomerListItem';
import ProductListItem from 'view/product/list/ProductListItem';

const { fields } = model;

class OrderListTable extends Component {
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;

    dispatch(
      actions.doChangePaginationAndSort(pagination, sorter),
    );
  };

  doDestroy = (id) => {
    const { dispatch } = this.props;
    dispatch(destroyActions.doDestroy(id));
  };

  columns = [
    fields.id.forTable(),
    fields.customer.forTable({
      render: (value) => <CustomerListItem value={value} />,
    }),
    fields.products.forTable({
      render: (value) => <ProductListItem value={value} />,
    }),
    fields.employee.forTable({
      render: (value) => <UserListItem value={value} />,
    }),
    fields.attachments.forTable({
      render: (value) => <FilesListView value={value} />,
    }),
    fields.createdAt.forTable(),
    {
      title: '',
      dataIndex: '',
      width: '160px',
      render: (_, record) => (
        <div className="table-actions">
          <Link to={`/order/${record.id}`}>
            {i18n('common.view')}
          </Link>
          {this.props.hasPermissionToEdit && (
            <Link to={`/order/${record.id}/edit`}>
              {i18n('common.edit')}
            </Link>
          )}
          {this.props.hasPermissionToDestroy && (
            <Popconfirm
              title={i18n('common.areYouSure')}
              onConfirm={() => this.doDestroy(record.id)}
              okText={i18n('common.yes')}
              cancelText={i18n('common.no')}
            >
              <ButtonLink>
                {i18n('common.destroy')}
              </ButtonLink>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  rowSelection = () => {
    return {
      selectedRowKeys: this.props.selectedKeys,
      onChange: (selectedRowKeys) => {
        const { dispatch } = this.props;
        dispatch(actions.doChangeSelected(selectedRowKeys));
      },
    };
  };

  render() {
    const { pagination, rows, loading } = this.props;

    return (
      <TableWrapper>
        <Table
          rowKey="id"
          loading={loading}
          columns={this.columns}
          dataSource={rows}
          pagination={pagination}
          onChange={this.handleTableChange}
          rowSelection={this.rowSelection()}
          scroll={{ x: true }}
        />
      </TableWrapper>
    );
  }
}

function select(state) {
  return {
    loading:
      selectors.selectLoading(state) ||
      destroySelectors.selectLoading(state),
    rows: selectors.selectRows(state),
    pagination: selectors.selectPagination(state),
    filter: selectors.selectFilter(state),
    selectedKeys: selectors.selectSelectedKeys(state),
    hasPermissionToEdit: orderSelectors.selectPermissionToEdit(
      state,
    ),
    hasPermissionToDestroy: orderSelectors.selectPermissionToDestroy(
      state,
    ),
  };
}

export default connect(select)(OrderListTable);
