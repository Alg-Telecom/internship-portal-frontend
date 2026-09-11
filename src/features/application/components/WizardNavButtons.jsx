import Button from '../../../components/ui/Button';

export default function WizardNavButtons({ stepIndex, totalSteps, onPrevious, isSubmitting }) {
  const isLastStep = stepIndex === totalSteps - 1;
  return (
    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
      <Button type="button" variant="outline" onClick={onPrevious} className={stepIndex === 0 ? 'invisible' : ''}>
        Previous
      </Button>
      <Button type="submit" isLoading={isSubmitting}>
        {isLastStep ? 'Submit Application' : 'Next'}
      </Button>
    </div>
  );
}
