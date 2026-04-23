import type { Metadata } from 'next';
import BlumeHealth from '../../components/works-pages/blumeHealth';
import MoreWorks from '../../components/works-pages/MoreWorks';
import ScrollToTop from '../../components/ui/ScrollToTop';

export const metadata: Metadata = {
  title: "Blume Health — SaaS Product Design | Varun Gupta",
};

export default function BlumeHealthPage() {
  return (
    <div className="bg-white min-h-screen">
      <BlumeHealth />
      <MoreWorks current="/works/blumeHealth" />
      <ScrollToTop />
    </div>
  );
}
