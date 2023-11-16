import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

type Props = {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  button?: JSX.Element;
  size?: string;
};
function ModalComponent(props: Props) {
  return (
    <Modal
      size={props?.size ?? "md"}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        <ModalBody maxH="70vh" overflow="auto" py={5}>
          {props.children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalComponent;
