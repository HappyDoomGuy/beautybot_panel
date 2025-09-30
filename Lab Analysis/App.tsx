

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeBloodTest } from './services/geminiService';
import { Disclaimer } from './components/Disclaimer';
import { Spinner } from './components/Spinner';
import { UploadIcon, AlertTriangleIcon, DocumentTextIcon } from './components/Icons';
import { BannerCarousel } from './components/BannerCarousel'; // Added import
import { appConfig } from './config'; // Added import

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

const App: React.FC = () => {
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center text-base">
      <header className="w-full max-w-3xl mb-8 sm:mb-10 text-center">
        {/* Large font size (1.25rem) */}
        <h1 className="font-bold text-inherit cursor-default" style={{ fontSize: 'var(--font-size-large)' }}> 
          Интерпретация результатов анализов крови
        </h1>
        {/* Standard font size (1rem) */}
        <p className="mt-3 text-inherit opacity-90" style={{ fontSize: 'var(--font-size-standard)' }}>
          Загрузите ваш анализ, и ИИ проанализирует его.
        </p>
      </header>

      <main className="w-full max-w-3xl neo neo-outset-deep p-6 sm:p-8 space-y-3">
        <section aria-labelledby="upload-title">
          {/* Large font size (1.25rem) */}
          <h2 id="upload-title" className="font-semibold text-inherit mb-5" style={{ fontSize: 'var(--font-size-large)' }}>Загрузите файл анализов</h2>
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
            className={`w-full p-5 sm:p-7 transition-all duration-200 ease-in-out group neo neo-button
              ${selectedFile ? 'active neo-inset-strong' : 'neo-outset'}
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] focus-visible:ring-[#7e97b8]`}
            aria-describedby="file-types-info"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <UploadIcon className={`
                w-10 h-10 sm:w-12 sm:h-12 mb-3 text-inherit transition-colors duration-200
              `} />
              {/* Standard font size (1rem) */}
              <span className="font-semibold leading-tight break-words px-2" style={{ fontSize: 'var(--font-size-standard)' }}>
                {selectedFile ? selectedFile.name : 'Нажмите, чтобы выбрать файл'}
              </span>
              {!selectedFile && <span className="text-inherit opacity-70 mt-1.5" style={{ fontSize: 'var(--font-size-standard)' }}>(PNG, JPEG, WebP, PDF)</span>}
            </div>
          </button>
          {/* Standard font size (1rem) */}
          <p id="file-types-info" className="text-inherit opacity-70 mt-3 text-center" style={{ fontSize: 'var(--font-size-standard)' }}>Поддерживаемые форматы: PNG, JPEG, WebP, PDF.</p>
        </section>

        <ConditionalSection isVisible={!!selectedFile}>
          <div className="neo neo-inset p-4 sm:p-5 rounded-xl"> {/* Consistent padding */}
            {/* Large font size for sr-only h2 to match convention, or standard if subordinate */}
            <h2 id="preview-title" className="font-semibold text-inherit mb-3 sr-only" style={{ fontSize: 'var(--font-size-large)' }}>Предпросмотр файла</h2>
            {isPdf ? (
              <div className="flex items-center text-inherit py-2">
                <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-inherit opacity-80 flex-shrink-0" />
                {/* Standard font size (1rem) */}
                <span className="break-all" style={{ fontSize: 'var(--font-size-standard)' }}>{selectedFile?.name} (PDF документ)</span>
              </div>
            ) : previewUrl && (
              <div className="flex justify-center items-center max-h-80 overflow-hidden rounded-md neo neo-inset-strong p-2">
                <img src={previewUrl} alt="Предпросмотр загруженного файла" className="max-w-full max-h-[calc(20rem-1rem)] object-contain rounded-md" /> {/* max-h adjusted for padding */}
              </div>
            )}
          </div>
        </ConditionalSection>
        
        <ConditionalSection isVisible={!!selectedFile} className="text-center pt-0">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-8 py-3 sm:px-10 sm:py-3.5 font-semibold neo neo-button neo-outset transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] focus-visible:ring-[#7e97b8]"
              style={{ fontSize: 'var(--font-size-standard)' }} // Standard font size
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-2.5 inline align-middle text-inherit" /> {/* Size aligned with text */}
                  Анализ...
                </>
              ) : (
                'Расшифровать анализы'
              )}
            </button>
        </ConditionalSection>

        <ConditionalSection isVisible={!!error}>
          <div role="alert" className="neo neo-inset p-4 sm:p-5 rounded-xl flex items-start"> {/* Consistent padding */}
            <AlertTriangleIcon className="w-6 h-6 mr-3 text-inherit opacity-80 flex-shrink-0 mt-1" />
            <div>
                {/* Standard font size (1rem) */}
                <strong className="font-bold text-inherit block" style={{ fontSize: 'var(--font-size-standard)' }}>Ошибка:</strong>
                <span className="block mt-0.5" style={{ fontSize: 'var(--font-size-standard)' }}>{error}</span>
            </div>
          </div>
        </ConditionalSection>

        <ConditionalSection isVisible={!!analysisResult && !isLoading}>
          <div className="neo neo-outset p-4 sm:p-5 rounded-xl"> {/* Consistent padding */}
            {/* Large font size (1.25rem) */}
            <h2 id="analysis-title" className="font-semibold text-inherit mb-4" style={{ fontSize: 'var(--font-size-large)' }}>Результаты интерпретации</h2>
            <div
                className="prose max-w-none neo neo-inset p-4 sm:p-5 rounded-lg overflow-x-auto"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
            </div>
          </div>
        </ConditionalSection>
        
        <Disclaimer />

        {/* Banner Carousel Section */}
        {appConfig.enableBanners && appConfig.bannerItems.length > 0 && (
          <section aria-labelledby="banner-carousel-title"> {/* mt-8 removed */}
            <h2 id="banner-carousel-title" className="sr-only">Рекламные баннеры</h2>
            <BannerCarousel 
              banners={appConfig.bannerItems} 
              autoplayInterval={appConfig.defaultAutoplayInterval} 
            />
          </section>
        )}
      </main>

      <footer className="w-full max-w-3xl mt-12 mb-6 text-center text-inherit opacity-75" style={{ fontSize: 'var(--font-size-standard)' }}> {/* Standard font size */}
        <p>&copy; {new Date().getFullYear()} PharmConsilium. Результаты не являются диагнозом.</p>
      </footer>
    </div>
  );
};

export default App;