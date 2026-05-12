
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { batchAnalyzeArticles, getArticlesNeedingAnalysis } from '@/utils/enhancedArticleAnalysis';
import { Loader2, Search, CheckCircle, AlertCircle, Tag } from 'lucide-react';

export function ArticleAnalysisPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const { toast } = useToast();

  const handleAnalyzeArticles = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResults(null);

    try {
      // Get articles that need analysis
      toast({
        title: "Starting Analysis",
        description: "Fetching articles that need keyword analysis..."
      });

      const articles = await getArticlesNeedingAnalysis(100);
      
      if (articles.length === 0) {
        toast({
          title: "No Articles Found",
          description: "All articles have already been analyzed for keywords."
        });
        setIsAnalyzing(false);
        return;
      }

      toast({
        title: "Analysis Started",
        description: `Analyzing ${articles.length} articles for keywords and language...`
      });

      // Start batch analysis
      const results = await batchAnalyzeArticles(articles, 10);
      
      setAnalysisResults(results);
      setProgress(100);

      if (results.successful > 0) {
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${results.successful} articles. ${results.failed} failed.`
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "No articles were successfully analyzed. Check the errors below.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error during batch analysis:', error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during the analysis process.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Article Analysis Center
        </CardTitle>
        <CardDescription>
          Analyze articles to extract keywords and detect language using predefined keyword matching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleAnalyzeArticles}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Articles...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Start Keyword Analysis
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {analysisResults && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold">Analysis Results</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Successful: <strong>{analysisResults.successful}</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    Failed: <strong>{analysisResults.failed}</strong>
                  </span>
                </div>
              </div>

              {analysisResults.errors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-red-600">Errors:</h5>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {analysisResults.errors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-xs text-red-600">
                        {error}
                      </p>
                    ))}
                    {analysisResults.errors.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        ...and {analysisResults.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
