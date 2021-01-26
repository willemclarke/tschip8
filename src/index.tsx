import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { App } from './App';
import { Emulator } from './emulator';

const emulator = new Emulator();

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App emulator={emulator} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
