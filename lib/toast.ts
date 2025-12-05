import "izitoast/dist/css/iziToast.min.css";
import type { IziToast } from "izitoast";

const loadIziToast = async (): Promise<IziToast | null> => {
  if (typeof window === "undefined") return null;
  
  
  const iziToastModule = await import("izitoast");
  const iziToast = iziToastModule.default;
  
  iziToast.settings({
    timeout: 3000,
    resetOnHover: true,
    transitionIn: 'fadeInLeft',
    transitionOut: 'fadeOutRight',
    position: 'topRight',
    progressBar: true,
  });
  
  return iziToast;
};

export const toast = {
  success: async (message: string) => {
    const izi = await loadIziToast();
    if (izi) izi.success({ title: 'OK', message });
  },
  error: async (message: string) => {
    const izi = await loadIziToast();
    if (izi) izi.error({ title: 'Помилка', message });
  },
  info: async (message: string) => {
    const izi = await loadIziToast();
    if (izi) izi.info({ title: 'Інфо', message });
  },
  warning: async (message: string) => {
    const izi = await loadIziToast();
    if (izi) izi.warning({ title: 'Увага', message });
  }
};

export const confirmAction = async (
  message: string, 
  onConfirm: () => Promise<void> | void,
  title: string = 'Ви впевнені?'
) => {
  const izi = await loadIziToast();
  if (!izi) return;

  izi.question({
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