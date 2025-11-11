import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const ShowcaseBreadcrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { slug } = useParams();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('showcase.breadcrumbs.home', 'Home'), path: '/' }
    ];

    if (path.includes('/brands')) {
      breadcrumbs.push({ label: t('showcase.breadcrumbs.brands', 'Brands'), path: '/brands' });

      if (slug) {
        const brandName = slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        breadcrumbs.push({ label: brandName, path: `/brands/${slug}` });

        if (path.includes('/setup')) {
          breadcrumbs.push({ label: t('showcase.breadcrumbs.setup', 'Setup') });
        } else if (path.includes('/create-content')) {
          breadcrumbs.push({ label: t('showcase.breadcrumbs.createContent', 'Create Content') });
        } else if (path.includes('/create-campaign')) {
          breadcrumbs.push({ label: t('showcase.breadcrumbs.createCampaign', 'Create Campaign') });
        } else if (path.includes('/chat-automation')) {
          breadcrumbs.push({ label: t('showcase.breadcrumbs.chatAutomation', 'Chat Automation') });
        } else if (path.includes('/video-generator')) {
          breadcrumbs.push({ label: t('showcase.breadcrumbs.videoGenerator', 'Video Generator') });
        } else if (path.includes('/inspiration')) {
          breadcrumbs.push({ label: t('showcase.breadcrumbs.inspiration', 'Inspiration Library') });
        } else if (path.includes('/lead-capture')) {
          breadcrumbs.push({ label: t('showcase.breadcrumbs.leadCapture', 'Lead Capture') });
        }
      }
    } else if (path.includes('/pricing')) {
      breadcrumbs.push({ label: t('showcase.breadcrumbs.pricing', 'Pricing') });
    } else if (path.includes('/onboarding')) {
      breadcrumbs.push({ label: t('showcase.breadcrumbs.onboarding', 'Onboarding') });
    } else if (path.includes('/lead-capture')) {
      breadcrumbs.push({ label: t('showcase.breadcrumbs.leadCapture', 'Lead Capture') });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm py-3 overflow-x-auto">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0;

        return (
          <div key={index} className="flex items-center space-x-2 flex-shrink-0">
            {crumb.path ? (
              <Link
                to={crumb.path}
                className="flex items-center space-x-1 text-muted-foreground hover:text-electric-cyan transition-colors duration-200 group"
              >
                {isFirst && <Home className="w-4 h-4 group-hover:text-electric-cyan transition-colors" />}
                <span className="group-hover:text-electric-cyan transition-colors">{crumb.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                {isFirst && <Home className="w-4 h-4" />}
                <span>{crumb.label}</span>
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
};
