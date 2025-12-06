import { createContext, useContext, ReactNode } from 'react';

interface MessagingContextType {
  openChatWith: (userId: string, userName: string, userRole: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within MessagingProvider');
  }
  return context;
};

interface MessagingProviderProps {
  children: ReactNode;
  openChatWith: (userId: string, userName: string, userRole: string) => void;
}

export function MessagingProvider({ children, openChatWith }: MessagingProviderProps) {
  return (
    <MessagingContext.Provider value={{ openChatWith }}>
      {children}
    </MessagingContext.Provider>
  );
}
