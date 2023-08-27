import React from "react";
import { CapsuleXProvider  } from './contexts/CapsuleXContext';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <>    
      <ToastContainer />
        <CapsuleXProvider >
          <Home />
        </CapsuleXProvider >
    </>
  );
}

export default App;
