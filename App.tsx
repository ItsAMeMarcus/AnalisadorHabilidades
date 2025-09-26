
import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeSkills } from './services/geminiService';
import Modal from './components/Modal';
import TextArea from './components/TextArea';
import Button from './components/Button';
import { BriefcaseIcon, CheckCircleIcon, SparklesIcon, XCircleIcon } from './components/Icons';

export default function App(): React.ReactElement {
  const [jobDescription, setJobDescription] = useState('');
  const [userSkills, setUserSkills] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCommonSkillsModalOpen, setCommonSkillsModalOpen] = useState(false);
  const [isSkillsToDevelopModalOpen, setSkillsToDevelopModalOpen] = useState(false);

  const handleAnalysis = useCallback(async () => {
    if (!jobDescription || !userSkills) {
      setError('Por favor, preencha a descrição da vaga e suas habilidades.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSkills(jobDescription, userSkills);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao analisar as habilidades. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, userSkills]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Analisador de Habilidades
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Descubra seu alinhamento com a vaga dos seus sonhos usando IA.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextArea
              id="job-description"
              label="Descrição da Vaga"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Cole a descrição da vaga aqui..."
              disabled={isLoading}
            />
            <TextArea
              id="user-skills"
              label="Suas Habilidades"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
              placeholder="Liste suas habilidades, separadas por vírgula ou em linhas..."
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={handleAnalysis} isLoading={isLoading} disabled={isLoading || !jobDescription || !userSkills}>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Analisar Gap
            </Button>
          </div>

          {error && (
            <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg flex items-center justify-center">
              <XCircleIcon className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-300 mb-2 sm:mb-0">Resultados da Análise:</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => setCommonSkillsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-green-600/20 text-green-300 border border-green-500 rounded-lg hover:bg-green-600/40 transition-colors duration-200"
                    >
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Habilidades em Comum
                    </button>
                    <button
                        onClick={() => setSkillsToDevelopModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-yellow-600/20 text-yellow-300 border border-yellow-500 rounded-lg hover:bg-yellow-600/40 transition-colors duration-200"
                    >
                        <BriefcaseIcon className="w-5 h-5 mr-2" />
                        Habilidades a Desenvolver
                    </button>
                </div>
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={isCommonSkillsModalOpen}
        onClose={() => setCommonSkillsModalOpen(false)}
        title="Habilidades em Comum"
        Icon={CheckCircleIcon}
        iconColor="text-green-400"
      >
        <ul className="space-y-2">
          {analysisResult?.commonSkills.map((skill, index) => (
            <li key={index} className="bg-gray-700/50 p-3 rounded-md text-gray-300">{skill}</li>
          ))}
          {analysisResult?.commonSkills.length === 0 && (
            <li className="text-gray-400">Nenhuma habilidade em comum encontrada.</li>
          )}
        </ul>
      </Modal>

      <Modal
        isOpen={isSkillsToDevelopModalOpen}
        onClose={() => setSkillsToDevelopModalOpen(false)}
        title="Habilidades a Desenvolver"
        Icon={BriefcaseIcon}
        iconColor="text-yellow-400"
      >
        <ul className="space-y-2">
          {analysisResult?.skillsToDevelop.map((skill, index) => (
            <li key={index} className="bg-gray-700/50 p-3 rounded-md text-gray-300">{skill}</li>
          ))}
           {analysisResult?.skillsToDevelop.length === 0 && (
            <li className="text-gray-400">Parabéns! Nenhuma habilidade a desenvolver foi identificada.</li>
          )}
        </ul>
      </Modal>
    </div>
  );
}
