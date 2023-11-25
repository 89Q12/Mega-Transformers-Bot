import { ToastId, useToast, UseToastOptions } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

export const useConditionalToast = (
  condition: boolean,
  options: Omit<UseToastOptions, 'id' | 'duration' | 'isClosable'>,
) => {
  const toast = useToast();
  const toastId = useRef<ToastId | undefined>();

  useEffect(() => {
    if (condition && !toastId.current) {
      toastId.current = toast({
        ...options,
        isClosable: false,
        duration: null,
      });
    }
    if (!condition && !!toastId.current) {
      toast.close(toastId.current);
      toastId.current = undefined;
    }
  }, [condition, toast, toastId]);
};