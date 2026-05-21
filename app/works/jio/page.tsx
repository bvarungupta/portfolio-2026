import type { Metadata } from 'next';
import JioGlasses from '../../components/works-pages/jioGlasses';
import MoreWorks from '../../components/works-pages/MoreWorks';
import ScrollToTop from '../../components/ui/ScrollToTop';

export const metadata: Metadata = {
  title: "Jio Tesseract — Product Design | Varun Gupta",
};

export default function JioGlassesPage() {
  return (
    <div className="bg-white min-h-screen">
      <JioGlasses />
      <MoreWorks current="/works/jio" />
      <ScrollToTop />
    </div>
  );
}
