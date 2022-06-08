import React from 'react';
import { Provider } from "react-redux";

import Navigation from './Navigation.js'
import store from './redux/store.js'

const App = () =>  {
  return (
    <Provider store={store}>
      <Navigation/>
    </Provider>
  );
};

export default App;
