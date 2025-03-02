import ApplicationDetailPage from '@/app/components/dashboard/applications/[id]/ApplicationDetailPage';

interface ApplicationDetailDashboardPageProps {
  params: {
    id: string;
  };
}

const ApplicationDetailDashboardPage: React.FC<ApplicationDetailDashboardPageProps> = async ({ params }) => {
  
    const pageParams = await params;
    if (!pageParams.id) {
      return <div>ID de la candidature manquant</div>;
    }
  
    return <ApplicationDetailPage params={pageParams} />;
  };
  
export default ApplicationDetailDashboardPage;
