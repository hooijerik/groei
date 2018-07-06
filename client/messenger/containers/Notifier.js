import React from 'react';
import { connect } from 'react-redux';
import { gql, graphql } from 'react-apollo';
import { Notifier as DumbNotifier } from '../components';
import { changeRoute, toggle, changeConversation, toggleNotifer } from '../actions/messenger';
import { readMessages } from '../actions/messages';

import { connection } from '../connection';
import NotificationSubscriber from './NotificationSubscriber';
import graphqlTypes from './graphql';

class Notifier extends NotificationSubscriber {
  render() {
    if (this.props.data.loading) {
      return null;
    }

    const lastUnreadMessage = this.props.data.lastUnreadMessage;

    if (!lastUnreadMessage || !lastUnreadMessage._id) {
      return null;
    }

    const extendedProps = {
      ...this.props,
      lastUnreadMessage,
    };

    return <DumbNotifier {...extendedProps} />;
  }
}

const mapStateToProps = state => ({
  isMessengerVisible: state.isVisible,
});

const mapDisptachToProps = dispatch => ({
  readMessage({ conversationId }) {
    // show messenger
    dispatch(toggle());

    // set current conversation
    dispatch(changeConversation(conversationId));

    // change route
    dispatch(changeRoute('conversationDetail'));

    // mark as read
    dispatch(readMessages(conversationId));

    toggleNotifer();

    toggle();
  },
});

const NotifierWithData = graphql(
  gql`
    query lastUnreadMessage(${connection.queryVariables}) {
      lastUnreadMessage(${connection.queryParams}) {
        ${graphqlTypes.messageFields}
      }
    }
  `,

  {
    options: () => ({
      fetchPolicy: 'network-only',
      variables: connection.data,
    }),
  },
)(Notifier);

export default connect(mapStateToProps, mapDisptachToProps)(NotifierWithData);
