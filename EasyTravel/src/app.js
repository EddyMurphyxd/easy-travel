import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import { createStore, applyMiddlewar } from 'redux';
import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import Movies from './Movies';
import Confirmation from './Confirmation';
import { apiMiddleware, reducer } from './redux';
import getStore from "./store";

const AppNavigator = StackNavigator({
    Movies       : { screen : Movies },
    Confirmation : { screen: Confirmation }
});

const navReducer = (state, action) => {
    const newState = AppNavigator.router.getStateForAction(action, state);
    return newState || state;
};

// Create Redux store
const store = getStore(navReducer);


// Fetch movie data
store.dispatch({type: 'GET_MOVIE_DATA'});

@connect(state => ({
  nav: state.nav
}))
class AppWithNavigationState extends Component {
    render() {
        return (
            <AppNavigator
                navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav
                })}
            />
        );
    }
}

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
