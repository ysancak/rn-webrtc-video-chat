import React from 'react';
import MainNavigation from '@/navigation/MainNavigation';
import {Provider} from 'react-redux';
import {store} from '@/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <MainNavigation />
    </Provider>
  );
}

export default App;
