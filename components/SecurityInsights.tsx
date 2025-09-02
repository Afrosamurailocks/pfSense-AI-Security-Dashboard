
import React, { useState, useCallback } from 'react';
import { analyzeSecurityData } from '../services/geminiService';
import { PfSenseData } from '../types';
import { GenerateContentResponse } from '@google/genai';

interface SecurityInsightsProps {
  data: PfSenseData;
}

const SecurityInsights: React.FC<SecurityInsightsProps> = ({ data }) => {
  const [analysisResult, setAnalysisResult] = useState<GenerateContentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalysis = useCallback(async () => {
    setLoading(true);
    setError('');
    setAnalysisResult(null);
    try {
      const result = await analyzeSecurityData(data);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get security insights: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [data]);
  
  const formatInsights = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={index} className="text-lg font-bold text-accent-blue mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
      }
       if (line.trim().startsWith('*')) {
        const indentLevel = line.search(/\S|$/);
        const style = { marginLeft: `${Math.max(0, indentLevel - 1) * 20}px` };
        return <li key={index} className="list-disc" style={style}>{line.substring(line.indexOf('*') + 1).trim()}</li>;
      }
      return <p key={index} className="my-1">{line}</p>;
    });
  };

  const groundingChunks = analysisResult?.candidates?.[0]?.groundingMetadata?.groundingChunks;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-bold text-white">AI Security Analyst</h2>
            <p className="text-gray-400">Analyze logs and rules with real-time threat intelligence.</p>
        </div>
        <button
          onClick={handleAnalysis}
          disabled={loading}
          className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze with Threat Intelligence'
          )}
        </button>
      </div>

      {error && <div className="mt-4 bg-red-900/50 border border-accent-red text-accent-red px-4 py-3 rounded-lg">{error}</div>}
      
      {analysisResult && (
        <div className="mt-6 p-4 bg-gray-900 rounded-md prose prose-invert prose-sm max-w-none">
          {formatInsights(analysisResult.text)}

          {groundingChunks && groundingChunks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-md font-bold text-gray-300 mb-2">Sources (from Google Search)</h4>
              <ul className="list-disc pl-5 space-y-1">
                {groundingChunks.map((chunk: any, index: number) => (
                  <li key={index}>
                    <a 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:underline break-all"
                      title={chunk.web.uri}
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityInsights;
