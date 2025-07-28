import {
  Children,
  cloneElement,
  createContext,
  ReactElement,
  use,
  useCallback,
  useMemo,
  useState
} from 'react';

type DialogStepperProps = {
  children: ReactElement[];
};

export type DialogStepperContextValue = {
  next: (data?: Record<string, unknown>) => void;
  prev: (data?: Record<string, unknown>) => void;
  reset: () => void;
  stepData: Record<string, unknown>;
};

// DialogStepper has local state which is modified on next and previous
// State is available to children to read
// On submit, state can then be transformed as necessary
export function DialogStepper({ children }: DialogStepperProps) {
  const [step, setStep] = useState(0);
  const [stepData, setStepData] = useState({});

  const next = (data?: Record<string, unknown>) => {
    const updatedData = { ...stepData, ...data };
    setStepData(updatedData);
    setStep((prev) => prev + 1);
  };

  const prev = (data?: Record<string, unknown>) => {
    const updatedData = { ...stepData, ...data };
    setStepData(updatedData);
    setStep((prev) => prev - 1);
  };

  const reset = useCallback(() => {
    setStep(0);
    setStepData({});
  }, [setStep, setStepData]);

  const memoizedChildren = useMemo(() => {
    return Children.map(children, (child, index) => {
      return cloneElement(child, { key: index });
    });
  }, [children]);

  return (
    <>
      <DialogStepperContext value={{ next, prev, reset, stepData }}>
        {memoizedChildren[step]}
      </DialogStepperContext>
    </>
  );
}

const DialogStepperContext = createContext({} as DialogStepperContextValue);

export function useDialogStepper() {
  const context = use(DialogStepperContext);
  if (!context) {
    throw new Error(
      'useDialogStepperContext must be used within a DialogStepperProvider'
    );
  }
  return context;
}
