import { toast, ToasterProps, } from "sonner";

// Define the allowed toast types
type ToastType = "success" | "error" | "info" | "warning";

// Update the function signature with types for parameters
const ToastFn = (
  type: ToastType = "info",
  title: string = "",
  description: string = ""
): void => {
  const toastProps: ToasterProps = {
    duration: 1500,
    richColors: true,
    closeButton: true,
    position: "top-right",
  };

  switch (type) {
    case "success":
      toast.success(title, { ...toastProps, description });
      break;
    case "error":
      toast.error(title, { ...toastProps, description });
      break;
    case "info":
      toast.info(title, { ...toastProps, description });
      break;
    case "warning":
      toast.warning(title, { ...toastProps, description });
      break;
    default:
      toast.info(title, { ...toastProps, description });
      break;
  }
};

export default ToastFn;
