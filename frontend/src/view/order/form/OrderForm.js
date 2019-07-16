import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { i18n } from 'i18n';
import actions from 'modules/order/form/orderFormActions';
import selectors from 'modules/order/form/orderFormSelectors';
import model from 'modules/order/orderModel';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ViewFormItem from 'view/shared/form/items/ViewFormItem';
import Spinner from 'view/shared/Spinner';
import FormWrapper, {
  tailFormItemLayout,
} from 'view/shared/styles/FormWrapper';
import FormSchema from 'view/shared/form/formSchema';
import UserAutocompleteFormItem from 'view/iam/autocomplete/UserAutocompleteFormItem';
import SwitchFormItem from 'view/shared/form/items/SwitchFormItem';
import FilesFormItem from 'view/shared/form/items/FilesFormItem';
import CustomerAutocompleteFormItem from 'view/customer/autocomplete/CustomerAutocompleteFormItem';
import ProductAutocompleteFormItem from 'view/product/autocomplete/ProductAutocompleteFormItem';

const { fields } = model;

class OrderForm extends Component {
  schema = new FormSchema(fields.id, [
    fields.customer,
    fields.products,
    fields.employee,
    fields.delivered,
    fields.attachments,
  ]);

  componentDidMount() {
    const { dispatch, match } = this.props;

    if (this.isEditing()) {
      dispatch(actions.doFind(match.params.id));
    } else {
      dispatch(actions.doNew());
    }
  }

  isEditing = () => {
    const { match } = this.props;
    return !!match.params.id;
  };

  handleSubmit = (values) => {
    const { dispatch } = this.props;
    const { id, ...data } = this.schema.cast(values);

    if (this.isEditing()) {
      dispatch(actions.doUpdate(id, data));
    } else {
      dispatch(actions.doCreate(data));
    }
  };

  initialValues = () => {
    const record = this.props.record;

    if (this.isEditing() && record) {
      return this.schema.initialValues(record);
    }

    return this.schema.initialValues();
  };

  renderForm() {
    const { saveLoading } = this.props;

    return (
      <FormWrapper>
        <Formik
          initialValues={this.initialValues()}
          validationSchema={this.schema.schema}
          onSubmit={this.handleSubmit}
          render={(form) => {
            return (
              <Form onSubmit={form.handleSubmit}>
                {this.isEditing() && (
                  <ViewFormItem
                    name={fields.id.name}
                    label={fields.id.label}
                  />
                )}

                <CustomerAutocompleteFormItem
                  name={fields.customer.name}
                  label={fields.customer.label}
                  required={fields.customer.required}
                />
                <ProductAutocompleteFormItem
                  name={fields.products.name}
                  label={fields.products.label}
                  required={fields.products.required}
                  mode="multiple"
                />
                <UserAutocompleteFormItem
                  name={fields.employee.name}
                  label={fields.employee.label}
                  required={fields.employee.required}
                />
                <SwitchFormItem
                  name={fields.delivered.name}
                  label={fields.delivered.label}
                />
                <FilesFormItem
                  name={fields.attachments.name}
                  label={fields.attachments.label}
                  required={fields.attachments.required}
                  path={fields.attachments.path}
                  schema={{
                    size: fields.attachments.size,
                    formats: fields.attachments.formats,
                  }}
                  max={fields.attachments.max}
                />

                <Form.Item
                  className="form-buttons"
                  {...tailFormItemLayout}
                >
                  <Button
                    loading={saveLoading}
                    type="primary"
                    htmlType="submit"
                    icon="save"
                  >
                    {i18n('common.save')}
                  </Button>

                  <Button
                    disabled={saveLoading}
                    onClick={form.handleReset}
                    icon="undo"
                  >
                    {i18n('common.reset')}
                  </Button>
                </Form.Item>
              </Form>
            );
          }}
        />
      </FormWrapper>
    );
  }

  render() {
    const { findLoading, record } = this.props;

    if (findLoading) {
      return <Spinner />;
    }

    if (this.isEditing() && !record) {
      return <Spinner />;
    }

    return this.renderForm();
  }
}

function select(state) {
  return {
    findLoading: selectors.selectFindLoading(state),
    saveLoading: selectors.selectSaveLoading(state),
    record: selectors.selectRecord(state),
  };
}

export default connect(select)(OrderForm);
