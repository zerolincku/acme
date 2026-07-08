import { useTranslation } from 'react-i18next';
import { Construction } from 'lucide-react';

export default function ComingSoon() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Construction className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">{t('comingSoon.title')}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {t('comingSoon.description')}
      </p>
    </div>
  );
}
