import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeBloodTest } from './lab-analysis/services/geminiService';
import { Disclaimer } from './lab-analysis/components/Disclaimer';
import { Spinner } from './lab-analysis/components/Spinner';
import { UploadIcon, AlertTriangleIcon, DocumentTextIcon } from './lab-analysis/components/Icons';
import { AppNavigation } from '../components/AppNavigation';

interface LabAnalysisAppProps {
  onBack: () => void;
}

interface Base64File {
  base64String: string;
  mimeType: string;
}

const fileToFormattedBase64 = (file: File): Promise<Base64File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const parts = result.split(',');
      if (parts.length !== 2) {
        reject(new Error("Неверный формат файла Data URL"));
        return;
      }
      const mimeType = parts[0].substring(parts[0].indexOf(':') + 1, parts[0].indexOf(';'));
      const base64String = parts[1];
      resolve({ base64String, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};

const LabAnalysisApp: React.FC<LabAnalysisAppProps> = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
        setError('Пожалуйста, выберите файл изображения (JPEG, PNG, WebP) или PDF.');
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsPdf(false);
        return;
      }
      setSelectedFile(file);
      setAnalysisResult(null); 
      setError(null); 
      
      const oldPreviewUrl = previewUrl;

      if (file.type === 'application/pdf') {
        setPreviewUrl(null); // No object URL for PDF preview in this design
        setIsPdf(true);
      } else {
        setPreviewUrl(URL.createObjectURL(file));
        setIsPdf(false);
      }
      
      if (oldPreviewUrl) {
          URL.revokeObjectURL(oldPreviewUrl);
      }
    }
  };
  
  useEffect(() => {
    // Cleanup for image preview URL
    let currentPreviewUrl = previewUrl;
    return () => {
      if (currentPreviewUrl && !isPdf) { // Only revoke if it's an image object URL
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [previewUrl, isPdf]);


  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError('Пожалуйста, сначала выберите файл анализов.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const { base64String, mimeType } = await fileToFormattedBase64(selectedFile);
      const result = await analyzeBloodTest(base64String, mimeType);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error("Ошибка при расшифровке:", err);
      setError(err.message || 'Произошла неизвестная ошибка при расшифровке.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const ConditionalSection: React.FC<{isVisible: boolean; children: React.ReactNode; className?: string}> = ({ isVisible, children, className }) => (
    <div
      className={`transition-all duration-300 ease-in-out ${className || ''} ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 max-h-0 mt-0 invisible overflow-hidden'
      }`}
      style={{ transitionProperty: 'opacity, max-height, margin-top, visibility' }}
      aria-hidden={!isVisible}
    >
      {isVisible && children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <AppNavigation 
        title="Лабораторные анализы" 
        onBack={onBack}
        icon="🧪"
        gradient="from-pink-500 to-rose-500"
      />
      
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-rose-800 mb-3">
              Интерпретация результатов анализов крови
            </h1>
            <p className="text-gray-700">
              Загрузите ваш анализ для расшифровки при помощи ИИ.
            </p>
          </header>

          <div className="space-y-6">
            {/* File Upload Section */}
            <section className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-lg border-2 border-rose-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-rose-800 mb-5">
                Загрузите файл анализов
              </h2>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, application/pdf"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                aria-label="Загрузить файл анализов"
              />
              <button
                onClick={triggerFileInput}
                className={`
                  w-full p-5 sm:p-7 transition-all duration-200 ease-in-out
                  bg-white hover:bg-pink-50
                  border-2 border-dashed border-rose-300
                  hover:border-rose-400
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2
                  ${selectedFile ? 'border-solid border-rose-400 bg-pink-50' : ''}
                `}
                aria-describedby="file-types-info"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <UploadIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-3 text-rose-500" />
                  <span className="font-semibold text-gray-800">
                    {selectedFile ? selectedFile.name : 'Нажмите, чтобы выбрать файл'}
                  </span>
                  {!selectedFile && (
                    <span className="text-gray-600 mt-1.5">
                      (PNG, JPEG, WebP, PDF)
                    </span>
                  )}
                </div>
              </button>
              <p id="file-types-info" className="text-gray-600 mt-3 text-center text-sm">
                Поддерживаемые форматы: PNG, JPEG, WebP, PDF.
              </p>
            </section>

            {/* File Preview */}
            <ConditionalSection isVisible={!!selectedFile}>
              <div className="bg-pink-50 p-4 sm:p-5 rounded-xl border border-rose-200">
                <h2 className="font-semibold text-gray-800 mb-3 sr-only">
                  Предпросмотр файла
                </h2>
                {isPdf ? (
                  <div className="flex items-center text-gray-700 py-2">
                    <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-rose-500 flex-shrink-0" />
                    <span className="break-all">{selectedFile?.name} (PDF документ)</span>
                  </div>
                ) : previewUrl && (
                  <div className="flex justify-center items-center max-h-80 overflow-hidden rounded-md bg-white p-2 border border-rose-200">
                    <img src={previewUrl} alt="Предпросмотр загруженного файла" className="max-w-full max-h-[calc(20rem-1rem)] object-contain rounded-md" />
                  </div>
                )}
              </div>
            </ConditionalSection>
            
            {/* Analyze Button */}
            <ConditionalSection isVisible={!!selectedFile} className="text-center pt-0">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-8 py-3 sm:px-10 sm:py-3.5 font-semibold bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 disabled:bg-gray-400 text-white rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2.5 inline align-middle" />
                    Анализ...
                  </>
                ) : (
                  'Расшифровать анализы'
                )}
              </button>
            </ConditionalSection>

            {/* Error Display */}
            <ConditionalSection isVisible={!!error}>
              <div role="alert" className="bg-rose-50 p-4 sm:p-5 rounded-xl border border-rose-200 flex items-start">
                <AlertTriangleIcon className="w-6 h-6 mr-3 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <strong className="font-bold text-rose-800 block">Ошибка:</strong>
                  <span className="block mt-0.5 text-rose-700">{error}</span>
                </div>
              </div>
            </ConditionalSection>

            {/* Analysis Results */}
            <ConditionalSection isVisible={!!analysisResult && !isLoading}>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 sm:p-5 rounded-xl border-2 border-rose-200 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-rose-800 mb-4">
                  Результаты интерпретации
                </h2>
                <div className="prose prose-sm sm:prose-base max-w-none bg-white p-4 sm:p-5 rounded-lg overflow-x-auto text-gray-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
                </div>
              </div>
            </ConditionalSection>
            
            <Disclaimer />
          </div>
        </div>
      </main>

      <footer className="w-full text-center p-4 text-xs text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Beauty Panel. Результаты не являются диагнозом.</p>
      </footer>
    </div>
  );
};

export { LabAnalysisApp };
