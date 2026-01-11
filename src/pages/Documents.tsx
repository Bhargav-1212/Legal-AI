import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { extractTextFromFile } from '../services/document';
import { analyzeDocument } from '../services/ai';
import { type Doc, getDocuments, saveDocuments } from '../services/storage';

const Documents = () => {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    const newDoc: Doc = {
      id: Date.now(),
      name: file.name,
      type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      uploaded: 'Just now',
      status: 'processing',
      risk: null
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    saveDocuments(updatedDocs);

    try {
      // const text = await extractTextFromFile(file); // Removed client-side extraction
      const analysis = await analyzeDocument(file);

      setDocuments(prev => {
        const next = prev.map(d => d.id === newDoc.id ? {
          ...d,
          status: 'completed',
          risk: analysis?.risk_level === 'High' ? 'high' : analysis?.risk_level === 'Medium' ? 'medium' : 'low',
          analysis: analysis
        } : d);
        saveDocuments(next);
        return next;
      });
    } catch (error: any) {
      console.error(error);
      setDocuments(prev => {
        const next = prev.map(d => d.id === newDoc.id ? { ...d, status: 'error', errorMessage: error.message } : d);
        saveDocuments(next);
        return next;
      });
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFile(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-dark">Document Intelligence (Indian Law)</h1>
          <p className="text-gray-500 mt-1">Upload to analyze (PDF, DOCX). Analysis strictly follows Indian Legal statutes.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50 hover:bg-white'
          }`}
      >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-dark">Drag & Drop documents here</h3>
        <p className="text-gray-500 mt-2">or click Upload New</p>
      </div>

      <div className="bg-white rounded-xl border border-light-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-light-border bg-gray-50/50">
          <h3 className="font-bold text-dark">Processed Documents</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {documents.length === 0 && <p className="p-8 text-center text-gray-400">No documents processed yet.</p>}

          <AnimatePresence>
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => doc.status === 'completed' && setSelectedDoc(doc)}
              >
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-dark">{doc.name}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.uploaded}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mr-4">
                  {doc.status === 'processing' && (
                    <span className="flex items-center text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1 animate-spin" /> Analyzing (Indian Protocol)
                    </span>
                  )}
                  {doc.status === 'completed' && doc.risk === 'high' && (
                    <span className="flex items-center text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full">
                      <AlertTriangle className="w-3 h-3 mr-1" /> High Risk
                    </span>
                  )}
                  {doc.status === 'completed' && doc.risk === 'medium' && (
                    <span className="flex items-center text-orange-600 text-xs bg-orange-50 px-2 py-1 rounded-full">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Medium Risk
                    </span>
                  )}
                  {doc.status === 'completed' && doc.risk === 'low' && (
                    <span className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 mr-1" /> Low Risk
                    </span>
                  )}
                  {doc.status === 'error' && (
                    <span className="text-red-500 text-xs" title={doc.errorMessage || "Analysis failed"}>Error: {doc.errorMessage}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedDoc && selectedDoc.analysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-light-border flex justify-between items-start bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-dark flex items-center">
                  <Sparkles className="w-5 h-5 text-primary mr-2" />
                  Legal Analysis
                </h2>
                <p className="text-sm text-gray-500 mt-1">{selectedDoc.name} • {selectedDoc.analysis.document_type}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  {selectedDoc.analysis.summary}
                </p>
              </section>

              <div className="grid grid-cols-2 gap-6">
                <section>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Risk Level</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedDoc.analysis.risk_level === 'High' ? 'bg-red-100 text-red-700' :
                    selectedDoc.analysis.risk_level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {selectedDoc.analysis.risk_level}
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Confidence Score</h3>
                  <div className="text-dark font-medium">{selectedDoc.analysis.confidence_score}%</div>
                </section>
              </div>

              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Parties Involved</h3>
                <ul className="space-y-2">
                  {selectedDoc.analysis.parties?.map((p: any, i: number) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                      <span className="font-semibold mr-2">{p.name}:</span>
                      <span className="text-gray-500">{p.role}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Key Legal Issues (Indian Law)</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                  {selectedDoc.analysis.legal_issues?.map((issue: string, i: number) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Observations</h3>
                <div className="space-y-2">
                  {selectedDoc.analysis.observations?.map((obs: string, i: number) => (
                    <p key={i} className="text-sm text-gray-600 italic">"{obs}"</p>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-4 bg-gray-50 border-t border-light-border text-xs text-center text-gray-400">
              Disclaimer: AI-generated analysis based on Indian generally known legal principles. Not legal advice.
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Documents;
