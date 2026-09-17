import { useMemo } from 'react';
import Stepper from '../../../components/ui/Stepper';
import { makeSteps } from '../schema';
import { useLanguage } from '../../../context/LanguageContext';

/** Thin wrapper configuring the shared Stepper for this specific wizard. */
export default function ApplyWizardStepper({ currentIndex }) {
  const { t } = useLanguage();
  const steps = useMemo(() => makeSteps(t), [t]);
  return <Stepper steps={steps} currentIndex={currentIndex} />;
}
