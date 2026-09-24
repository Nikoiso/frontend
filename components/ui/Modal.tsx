interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  export default function Modal({
    open,
    onClose,
    children,
  }: ModalProps) {
    if (!open) return null;
  
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[600px] rounded-2xl bg-white"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }