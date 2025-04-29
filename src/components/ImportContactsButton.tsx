import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

interface ImportContactsButtonProps {
  onImport: (file: File, verificationCode: string) => Promise<void>;
}

export const ImportContactsButton: React.FC<ImportContactsButtonProps> = ({ onImport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Selecione um arquivo para importar.');
      return;
    }
    if (!verificationCode.trim()) {
      setError('Informe o código de verificação.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await onImport(selectedFile, verificationCode.trim());
      setIsModalOpen(false);
      setSelectedFile(null);
      setVerificationCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        Importar Contatos
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-secondary-800">Importar Contatos</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-secondary-600 mb-4">
                Para importar seus contatos, baixe o modelo de planilha abaixo e preencha com os dados necessários.
              </p>
              
              <a
                href="https://s3.oramatech.com.br/typebot/public/workspaces/clxfjheiu000110b8nbxbiwnb/typebots/clxg1pmi6001i6f9ib9dkxkvs/results/jr182dncfpg3hfdx8ew48gkr/contatos%20disparador.xlsx"
                download
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
              >
                <Download className="w-5 h-5" />
                Baixar Modelo de Planilha
              </a>

              <div className="mt-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Código de verificação
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  className="block w-full mb-4 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Digite o código de verificação"
                  disabled={isLoading}
                  required
                />
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Selecione o arquivo preenchido
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-secondary-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>

            {isLoading && (
              <div className="flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-primary-200 rounded-full border-t-primary-600 animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}; 