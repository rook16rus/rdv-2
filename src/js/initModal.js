import { Modal } from "./Modal";

export default () => {
    const modal = new Modal({
        isOpen: (modal) => {

        },
        isClose: (modal) => {
        },
    });

    window.rdv.modal = modal;
};
