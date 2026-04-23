import type { Metadata } from 'next';
import SkillRadius from '../../components/works-pages/skillRadius';
import MoreWorks from '../../components/works-pages/MoreWorks';
import ScrollToTop from '../../components/ui/ScrollToTop';

export const metadata: Metadata = {
  title: "SkillRadius — EdTech Product Design | Varun Gupta",
};

export default function SkillRadiusPage() {
  return (
    <div className="bg-white min-h-screen">
      <SkillRadius />
      <MoreWorks current="/works/skillRadius" />
      <ScrollToTop />
    </div>
  );
}
