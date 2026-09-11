import Stepper from '../../../components/ui/Stepper';
import { STEPS } from '../schema';

/** Thin wrapper configuring the shared Stepper for this specific wizard. */
export default function ApplyWizardStepper({ currentIndex }) {
  return <Stepper steps={STEPS} currentIndex={currentIndex} />;
}
