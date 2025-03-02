import OfferDetailPage from '@/app/components/dashboard/[id]/OfferDetailPage';

interface OfferDetailDashboardPageProps {
  params: {
    id: string;
  };
}

const OfferDetailDashboardPage: React.FC<OfferDetailDashboardPageProps> = async ({ params }) => {
  
    const pageParams = await params;
    if (!pageParams.id) {
      return <div>ID de l'offre manquant</div>;
    }
  
    return <OfferDetailPage params={pageParams} />;
  };
  
export default OfferDetailDashboardPage;
