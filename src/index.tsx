import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { App } from './App';
import { Emulator } from './emulator/emulator';

const emulator = new Emulator();

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App emulator={emulator} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
