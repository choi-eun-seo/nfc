import { HeroUIProvider, ToastProvider } from "@heroui/react";

export const HeroProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider spinnerVariant="simple">
      {children}
      <ToastProvider
        placement="bottom-center"
        toastProps={{
          radius: "md",
          variant: "solid",
          timeout: 1000,
        }}
      />
    </HeroUIProvider>
  );
};
