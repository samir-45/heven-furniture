import { createContext, useContext, useState, useCallback } from "react";

const ConsultationContext = createContext(null);

export function ConsultationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState({});

  const openConsultation = useCallback((data = {}) => {
    setInitialData(data);
    setIsOpen(true);
  }, []);

  const closeConsultation = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ConsultationContext.Provider
      value={{
        isOpen,
        initialData,
        openConsultation,
        closeConsultation,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) {
    return {
      isOpen: false,
      initialData: {},
      openConsultation: () => {},
      closeConsultation: () => {},
    };
  }
  return ctx;
}
