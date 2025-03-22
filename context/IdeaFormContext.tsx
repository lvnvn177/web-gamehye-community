'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type IdeaFormContextType = {
  isFormVisible: boolean;
  toggleIdeaForm: () => void;
};

const IdeaFormContext = createContext<IdeaFormContextType | undefined>(undefined);

export function IdeaFormProvider({ children }: { children: ReactNode }) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleIdeaForm = () => {
    setIsFormVisible(prev => !prev);
  };

  return (
    <IdeaFormContext.Provider value={{ isFormVisible, toggleIdeaForm }}>
      {children}
    </IdeaFormContext.Provider>
  );
}

export function useIdeaForm() {
  const context = useContext(IdeaFormContext);
  if (context === undefined) {
    throw new Error('useIdeaForm must be used within an IdeaFormProvider');
  }
  return context;
} 