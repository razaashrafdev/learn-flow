import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-black",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-black",
          success: "group-[.toast]:text-black",
          error: "group-[.toast]:text-black",
          info: "group-[.toast]:text-black",
          warning: "group-[.toast]:text-black",
          icon: "group-[.toast]:text-black",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
