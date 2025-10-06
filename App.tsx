
import React from 'react';
import { useState } from 'react';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { ActionButton } from './components/ActionButton';
import { PreviewArea } from './components/PreviewArea';
import { LoadingSpinner } from './components/LoadingSpinner';
// FIX: Import Source type and SourcesList component to display web references.
import { EbookForm, ToneOfVoice, FontFamily, Source } from './types';
import { TONE_OPTIONS, FONT_OPTIONS } from './constants';
import { generateEbookContent } from './services/geminiService';
import { saveEbook } from './services/supabaseService';
import { downloadPdf } from './services/pdfService';
import { ZapIcon, SaveIcon, DownloadIcon, RotateCcwIcon } from './components/Icons';
import { SourcesList } from './components/SourcesList';

const initialState: EbookForm = {
    subject: '',
    audience: '',
    tone: ToneOfVoice.AMIGAVEL,
    authorName: '',
    authorSpecialty: '',
    dedication: '',
    font: FontFamily.INTER,
    chapters: 5,
    pages: 30,
};

const App: React.FC = () => {
    const [formData, setFormData] = useState<EbookForm>(initialState);
    const [generatedContent, setGeneratedContent] = useState<string>('');
    // FIX: Add state to store sources from Google Search grounding.
    const [sources, setSources] = useState<Source[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [saveMessage, setSaveMessage] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        const isNumericField = type === 'number';
        const parsedValue = isNumericField ? (value === '' ? '' : parseInt(value, 10)) : value;

        setFormData(prev => ({
            ...prev,
            [name]: isNumericField && isNaN(parsedValue as number) ? prev[name as keyof EbookForm] : parsedValue,
        }));
    };

    const handleGenerate = async () => {
        setError('');
        setSaveMessage('');
        setIsLoading(true);
        setGeneratedContent('');
        // FIX: Reset sources before generating new content.
        setSources([]);
        try {
            // FIX: Destructure content and sources from the service response.
            const { content, sources } = await generateEbookContent(formData);
            setGeneratedContent(content);
            setSources(sources);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setError('');
        setSaveMessage('Salvando...');
        try {
            await saveEbook(formData, generatedContent);
            setSaveMessage('E-book salvo com sucesso! (Simulado)');
        // FIX: Corrected syntax for catch block by adding curly braces.
        } catch (err: any) {
            setError(err.message || 'Falha ao salvar o e-book.');
            setSaveMessage('');
        }
    };

    const handleDownload = () => {
        setError('');
        setSaveMessage('');
        downloadPdf(generatedContent, formData.font, formData.subject);
    };

    const handleReset = () => {
        setFormData(initialState);
        setGeneratedContent('');
        // FIX: Reset sources on form reset.
        setSources([]);
        setError('');
        setSaveMessage('');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card title="1. Detalhes do Conteúdo">
                            <InputField 
                                label="Assunto Principal do E-book" 
                                id="subject" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="Ex: Guia sobre jardinagem para iniciantes"
                                required
                            />
                            <InputField 
                                label="Público-alvo" 
                                id="audience" 
                                name="audience"
                                value={formData.audience}
                                onChange={handleInputChange}
                                placeholder="Ex: Pessoas sem experiência em jardinagem"
                                required
                            />
                            <SelectField
                                label="Tom de Voz"
                                id="tone"
                                name="tone"
                                value={formData.tone}
                                onChange={handleInputChange}
                                options={TONE_OPTIONS}
                            />
                        </Card>

                        <Card title="2. Autoria e Estilo">
                            <InputField 
                                label="Nome do Autor" 
                                id="authorName"
                                name="authorName" 
                                value={formData.authorName}
                                onChange={handleInputChange}
                                required
                            />
                            <InputField 
                                label="Especialidade do Autor" 
                                id="authorSpecialty"
                                name="authorSpecialty"
                                value={formData.authorSpecialty}
                                onChange={handleInputChange}
                                placeholder="Ex: Botânico, Chef de Cozinha"
                                required
                            />
                            <InputField 
                                label="Dedicatória (Opcional)" 
                                id="dedication" 
                                name="dedication"
                                value={formData.dedication}
                                onChange={handleInputChange}
                                placeholder="Para minha família, com amor."
                            />
                            <SelectField
                                label="Fonte do E-book"
                                id="font"
                                name="font"
                                value={formData.font}
                                onChange={handleInputChange}
                                options={FONT_OPTIONS}
                            />
                        </Card>

                        <Card title="3. Estrutura do E-book">
                            <InputField 
                                label="Quantidade de Capítulos" 
                                id="chapters"
                                name="chapters"
                                type="number" 
                                value={formData.chapters}
                                onChange={handleInputChange}
                            />
                             <InputField 
                                label="Número Total de Páginas (aprox.)" 
                                id="pages"
                                name="pages"
                                type="number" 
                                value={formData.pages}
                                onChange={handleInputChange}
                            />
                        </Card>
                    </div>

                    <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex flex-wrap gap-4 items-center">
                            <ActionButton color="blue" onClick={handleGenerate} disabled={isLoading || !formData.subject || !formData.audience || !formData.authorName || !formData.authorSpecialty}>
                                <ZapIcon className="-ml-1 mr-2 h-5 w-5" />
                                {isLoading ? 'Gerando...' : 'Gerar E-book'}
                            </ActionButton>
                            <ActionButton color="green" onClick={handleSave} disabled={!generatedContent || isLoading}>
                                <SaveIcon className="-ml-1 mr-2 h-5 w-5" />
                                Salvar
                            </ActionButton>
                            <ActionButton color="purple" onClick={handleDownload} disabled={!generatedContent || isLoading}>
                                <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                                Baixar em PDF
                            </ActionButton>
                            <ActionButton color="gray" onClick={handleReset} disabled={isLoading}>
                                <RotateCcwIcon className="-ml-1 mr-2 h-5 w-5" />
                                Retornar
                            </ActionButton>
                            {isLoading && <LoadingSpinner />}
                        </div>
                        {error && <p className="text-red-400 mt-4">{error}</p>}
                        {saveMessage && <p className="text-green-400 mt-4">{saveMessage}</p>}
                    </div>
                    
                    <PreviewArea content={generatedContent} font={formData.font} />
                    {/* FIX: Render the SourcesList component to display web references. */}
                    <SourcesList sources={sources} />
                </main>
            </div>
        </div>
    );
};
export default App;