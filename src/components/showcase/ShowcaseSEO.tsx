import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface ShowcaseSEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
}

export const ShowcaseSEO = ({
  title,
  description,
  image = '/og-image.jpg',
  path = '',
  type = 'website'
}: ShowcaseSEOProps) => {
  const { t } = useTranslation();

  const defaultTitle = t('showcase.seo.defaultTitle', 'Brainy by Unica - AI-Powered Marketing Platform');
  const defaultDescription = t('showcase.seo.defaultDescription', 'See how an agency works when AI runs it. Brainy automates content, ads, and conversations from one place. No stress. No processes. No limits.');
  
  const fullTitle = title ? `${title} | Brainy by Unica` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = `https://brainy.unica.la${path}`;
  const imageUrl = image.startsWith('http') ? image : `https://brainy.unica.la${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Brainy by Unica" />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@BrainybyUnica" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Brainy by Unica" />
      <meta name="keywords" content={t('showcase.seo.keywords', 'AI marketing, marketing automation, social media management, ad optimization, content creation, chat automation, digital marketing platform')} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Brainy by Unica",
          "description": metaDescription,
          "url": canonicalUrl,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "500",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "127"
          }
        })}
      </script>
    </Helmet>
  );
};
