import {
  Children,
  cloneElement,
  createContext,
  ReactElement,
  useCallback,
  useContext,
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

  const next = useCallback((data?: Record<string, unknown>) => {
    setStepData((prevData) => ({ ...prevData, ...(data || {}) }));
    setStep((prev) => prev + 1);
  }, []);

  const prev = useCallback((data?: Record<string, unknown>) => {
    setStepData((prevData) => ({ ...prevData, ...(data || {}) }));
    setStep((prev) => prev - 1);
  }, []);

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
    <DialogStepperContext.Provider value={{ next, prev, reset, stepData }}>
      {memoizedChildren[step]}
    </DialogStepperContext.Provider>
  );
}

const DialogStepperContext = createContext<
  DialogStepperContextValue | undefined
>(undefined);

export function useDialogStepper() {
  const context = useContext(DialogStepperContext);
  if (!context) {
    throw new Error(
      'useDialogStepperContext must be used within a DialogStepperProvider'
    );
  }
  return context;
}
