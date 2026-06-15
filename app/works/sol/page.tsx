import type { Metadata } from 'next';
import Sol from '../../components/works-pages/sol';
import MoreWorks from '../../components/works-pages/MoreWorks';
import ScrollToTop from '../../components/ui/ScrollToTop';

export const metadata: Metadata = {
  title: "Sol — Solar Energy Platform | Varun Gupta",
};

export default function SolPage() {
  return (
    <div className="bg-white min-h-screen">
      <Sol />
      <MoreWorks current="/works/sol" />
      <ScrollToTop />
    </div>
  );
}
