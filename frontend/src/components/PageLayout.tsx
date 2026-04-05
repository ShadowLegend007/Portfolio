import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  number: string;
  subtitle: string;
  title: string;
}

const PageLayout = ({ children, number, subtitle, title }: PageLayoutProps) => {
  return (
    <main className="min-h-screen pt-28 md:pt-36 pb-20 px-6">
      <div className="max-w-5xl mx-auto page-enter">
        <div className="mb-12 md:mb-16">
          <span className="section-number">{number}</span>
          <p className="text-sm tracking-widest uppercase text-muted-foreground font-body mt-2">
            {subtitle}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-1">
            {title}
          </h1>
          <div className="w-16 h-0.5 bg-vermillion mt-6" />
        </div>
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
