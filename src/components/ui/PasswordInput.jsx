import { forwardRef, useState } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import Input from './Input';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Password field with an eye button to show/hide what was typed — same
 * look and position as the one on the login page. Takes every Input prop
 * (label, error, helperText, react-hook-form's register(...), ...).
 */
const PasswordInput = forwardRef(function PasswordInput({ className, ...props }, ref) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input ref={ref} {...props} type={isVisible ? 'text' : 'password'} className={`pe-10 ${className || ''}`} />
      <button
        type="button"
        onClick={() => setIsVisible((v) => !v)}
        aria-label={isVisible ? t('login.hidePassword') : t('login.showPassword')}
        aria-controls={props.id}
        className="absolute end-3 top-9 cursor-pointer rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {isVisible ? <EyeSlash className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
});

export default PasswordInput;
