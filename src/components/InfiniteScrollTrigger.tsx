import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}

export const InfiniteScrollTrigger = ({ 
  onIntersect, 
  isFetching, 
  hasNextPage 
}: InfiniteScrollTriggerProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0,
      }
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [onIntersect, hasNextPage, isFetching]);

  if (!hasNextPage) return null;

  return (
    <div ref={triggerRef} className="py-8 pb-24 flex flex-col items-center gap-4">
      {isFetching ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading more articles...</span>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={onIntersect}
          disabled={isFetching}
          className="min-w-[150px]"
        >
          Load more
        </Button>
      )}
    </div>
  );
};
