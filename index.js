import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class Item extends Component {
  render() {
      const item = this.props.store;
      console.log(this.props);
    return (
      <div className="">
        <h1><a href={item.url}>{item.title}</a></h1>
        <h2>{item.score} - {item.by.id}</h2>
      </div>
    );
  }
}

class TopItems extends Component {
  render() {
    console.log(this);
    const items = this.props.store.topStories.map(
      (store, idx) => <Item store={store} key={idx} />
    )
    return (
      <div className="">
        {items}
      </div>
    );
  }
}

TopItems = Relay.createContainer(TopItems, {
  fragments: {
    store: () => Relay.QL`
      fragment on HackerNewsAPI {
        topStories {${Item.getFragment('store')}},
      }
    `,
  },
});

Item = Relay.createContainer(Item, {
  fragments: {
    store: () => Relay.QL`
    fragment on HackerNewsItem {
      title,
      score,
      url
      by {
        id
      }
    }
    `,
  },
});

class HackerNewsRoute extends Relay.Route {
  static routeName = 'HackerNewsRoute';
  static queries = {
    store: (Component =>{
      return Relay.QL`
        query root {
         hn {${Component.getFragment('store')}},
        }
      `
    })
  };
}

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('https://www.GraphQLHub.com/graphql')
);

  var rootComponent = <Relay.RootContainer
    Component={TopItems}
    route={new HackerNewsRoute()} />

ReactDOM.render(rootComponent, document.getElementById('root'));
