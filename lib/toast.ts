import iziToast, { IziToast } from 'izitoast';
import "izitoast/dist/css/iziToast.min.css";

if (typeof window !== "undefined") {
  iziToast.settings({
    timeout: 3000,
    resetOnHover: true,
    transitionIn: 'fadeInLeft',
    transitionOut: 'fadeOutRight',
    position: 'topRight',
    progressBar: true,
  });
}

export const toast = {
  success: (message: string) => {
    if (typeof window !== "undefined") iziToast.success({ title: 'OK', message });
  },
  error: (message: string) => {
    if (typeof window !== "undefined") iziToast.error({ title: 'Помилка', message });
  },
  info: (message: string) => {
    if (typeof window !== "undefined") iziToast.info({ title: 'Інфо', message });
  },
  warning: (message: string) => {
    if (typeof window !== "undefined") iziToast.warning({ title: 'Увага', message });
  }
};

export const confirmAction = (
  message: string, 
  onConfirm: () => Promise<void> | void,
  title: string = 'Ви впевнені?'
) => {
  if (typeof window === "undefined") return; 

  iziToast.question({
    timeout: 20000,
    close: false,
    overlay: true,
    displayMode: 1, 
    id: 'question',
    zindex: 9999,
    title: title,
    message: message,
    position: 'center',
    buttons: [
      [
        '<button><b>Так</b></button>', 
        async function (instance: IziToast, toast: HTMLDivElement) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          await onConfirm();
        }, 
        true
      ], 
      [
        '<button>Скасувати</button>', 
        function (instance: IziToast, toast: HTMLDivElement) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, 
        false
      ]
    ]
  });
};