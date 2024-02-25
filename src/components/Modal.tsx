import * as Dialog from '@radix-ui/react-dialog';

export const Modal = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <Dialog.Content className="DialogContent">...</Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};