"use client";

import React, { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabaseClient';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { ActionButton } from './components/ActionButton';
import { PreviewArea } from './components/PreviewArea';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EbookForm, ToneOfVoice, FontFamily } from './types';
import { TONE_OPTIONS, FONT_OPTIONS } from './constants';
import { generateEbookContent } from './services/geminiService';
import { saveEbook } from './services/supabaseService';
import { downloadPdf } from './services/pdfService';
import { ZapIcon, SaveIcon, DownloadIcon, RotateCcwIcon, LogOutIcon } from './components/Icons';
import { AuthForm } from './components/AuthForm';

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [saveMessage, setSaveMessage] = useState<string>('');
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

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
        try {
            const { content } = await generateEbookContent(formData);
            setGeneratedContent(content);
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
            if (!user) {
                throw new Error('Você precisa estar logado para salvar um e-book.');
            }
            await saveEbook(formData, generatedContent, user.id);
            setSaveMessage('E-book salvo com sucesso!');
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
        setError('');
        setSaveMessage('');
        setIsLoading(false);
    };

    const handleLogout = async () => {
        setIsLoading(true);
        setError('');
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
            setGeneratedContent('');
            setFormData(initialState);
            setSaveMessage('Desconectado com sucesso.');
        } catch (err: any) {
            setError(err.message || 'Erro ao desconectar.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <AuthForm onAuthSuccess={() => { /* O useEffect já lida com a atualização da sessão */ }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <div className="flex justify-end mb-4">
                    <ActionButton color="gray" onClick={handleLogout} disabled={isLoading}>
                        <LogOutIcon className="-ml-1 mr-2 h-5 w-5" />
                        Sair ({user?.email})
                    </ActionButton>
                </div>
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
                </main>
            </div>
        </div>
    );
};
export default App;