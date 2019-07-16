import React, { Component } from 'react';
import ContentWrapper from 'view/layout/styles/ContentWrapper';
import PageTitle from 'view/shared/styles/PageTitle';
import Breadcrumb from 'view/shared/Breadcrumb';
import CustomerForm from 'view/customer/form/CustomerForm';
import { i18n } from 'i18n';

class CustomerFormPage extends Component {
  isEditing = () => {
    const { match } = this.props;
    return !!match.params.id;
  };

  title = () => {
    return this.isEditing()
      ? i18n('entities.customer.edit.title')
      : i18n('entities.customer.new.title');
  };

  render() {
    return (
      <React.Fragment>
        <Breadcrumb
          items={[
            [i18n('home.menu'), '/'],
            [i18n('entities.customer.menu'), '/customer'],
            [this.title()],
          ]}
        />

        <ContentWrapper>
          <PageTitle>{this.title()}</PageTitle>

          <CustomerForm match={this.props.match} />
        </ContentWrapper>
      </React.Fragment>
    );
  }
}

export default CustomerFormPage;
