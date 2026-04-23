import type { Metadata } from 'next';
import SmartNation from '../../components/works-pages/smartNation';
import MoreWorks from '../../components/works-pages/MoreWorks';
import ScrollToTop from '../../components/ui/ScrollToTop';

export const metadata: Metadata = {
  title: "Smart Nation — Brand & Product Design | Varun Gupta",
};

export default function SmartNationPage() {
  return (
    <div className="bg-white min-h-screen">
      <SmartNation />
      <MoreWorks current="/works/smartNation" />
      <ScrollToTop />
    </div>
  );
}