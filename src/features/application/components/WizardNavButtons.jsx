import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

export default function WizardNavButtons({ stepIndex, totalSteps, onPrevious, isSubmitting }) {
  const { t } = useLanguage();
  const isLastStep = stepIndex === totalSteps - 1;
  return (
    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
      <Button type="button" variant="outline" onClick={onPrevious} className={stepIndex === 0 ? 'invisible' : ''}>
        {t('apply.nav.previous')}
      </Button>
      <Button type="submit" isLoading={isSubmitting}>
        {isLastStep ? t('apply.nav.submit') : t('apply.nav.next')}
      </Button>
    </div>
  );
}
