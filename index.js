import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class Item extends Component {
  render() {
      const item = this.props.store;
    return (
      <div className="">
        <h1><a href={item.url}>{item.title}</a></h1>
        <h2>{item.score} - {item.by.id}</h2>
      </div>
    );
  }
}

class TopItems extends Component {

    _onChange(ev) {
      const storyType = ev.target.value;
      this.setState({storyType});
      this.props.relay.setVariables({
         storyType
      });
    };

  render() {
    console.log(this);
    const items = this.props.store.stories.map(
      (store, idx) => <Item store={store} key={idx} />
    );
    const variables = this.props.relay.variables;

    const currentStoryType = (this.state && this.state.storyType) || variables.storyType;

    return (
      <div className="">
        <select onChange={this._onChange.bind(this)} value={currentStoryType}>
          <option value="top">Top</option>
          <option value="new">New</option>
          <option value="ask">Ask</option>
          <option value="show">Show</option>
        </select>
        {items}
      </div>
    );
  }
}

TopItems = Relay.createContainer(TopItems, {
  initialVariables: {
   storyType: "top"
  },
  fragments: {
    store: () => Relay.QL`
      fragment on HackerNewsAPI {
        stories(storyType: $storyType) {${Item.getFragment('store')}},
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
