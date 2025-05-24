import OfferDetailPage from '@/app/components/dashboard/[id]/OfferDetailPage';

type OfferDetailDashboardPageProps = {
  params: Promise<{
    id: string; //testerrorPromise
  }>;
}

const OfferDetailDashboardPage: React.FC<OfferDetailDashboardPageProps> = async ({ params }) => {
  
    const pageParams = await params;
    if (!pageParams.id) {
      return <div>ID de l'offre manquant</div>;
    }
  
    return <OfferDetailPage params={pageParams} />;
  };
  
export default OfferDetailDashboardPage;
