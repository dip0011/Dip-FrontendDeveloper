import React, { createContext, useContext, useState } from 'react';

// Create a context
const CapsuleXContext = createContext();

// Create a provider component
export function CapsuleXProvider({ children }) {
  const [capsuleXData, setCapsuleXData] = useState([]);

  const contextValue = {
    capsuleXData,
    setCapsuleXData,
  };

  return (
    <CapsuleXContext.Provider value={contextValue}>
      {children}
    </CapsuleXContext.Provider>
  );
}

// Custom hook to use the context
export function useCapsuleXContext() {
  return useContext(CapsuleXContext);
}