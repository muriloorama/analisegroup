import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Image, 
  Mic, 
  Video, 
  X, 
  AlertCircle, 
  FileText,
  Tag,
  ChevronDown,
  Check,
  KeyRound
} from 'lucide-react';
import { MessageMediaType, Label } from '../types/message';
import { LabelService } from '../services/labelService';

interface MessageFormProps {
  onSendMessage: (
    content: string, 
    mediaType: MessageMediaType, 
    mediaFile: File | null, 
    caption: string | null,
    labelId: string | null,
    labelName: string | null,
    labelColor: string | null,
    verificationCode: string
  ) => Promise<void>;
  isLoading: boolean;
  isStorageAvailable: boolean;
}

export const MessageForm: React.FC<MessageFormProps> = ({ 
  onSendMessage, 
  isLoading,
  isStorageAvailable 
}) => {
  const [content, setContent] = useState<string>('');
  const [mediaType, setMediaType] = useState<MessageMediaType>('text');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isLoadingLabels, setIsLoadingLabels] = useState<boolean>(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const labelService = new LabelService();
  
  // Fetch labels on component mount
  useEffect(() => {
    const fetchLabels = async () => {
      setIsLoadingLabels(true);
      setLabelError(null);
      
      try {
        const { data, error } = await labelService.fetchLabels();
        
        if (error) {
          console.error('Error fetching labels:', error);
          setLabelError('Não foi possível carregar as etiquetas. Por favor, tente novamente.');
        } else if (data && Array.isArray(data)) {
          console.log('Labels loaded:', data);
          setLabels(data);
        } else {
          console.error('Invalid data format received:', data);
          setLabelError('Formato de dados inválido recebido do servidor.');
        }
      } catch (fetchErr) {
        console.error('Exception while fetching labels:', fetchErr);
        setLabelError('Erro ao tentar carregar as etiquetas.');
      } finally {
        setIsLoadingLabels(false);
      }
    };
    
    fetchLabels();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  const handleMediaTypeChange = (type: MessageMediaType) => {
    // Reset state when changing media type
    setMediaType(type);
    setMediaFile(null);
    setMediaPreview(null);
    setCaption('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      
      // Create preview for images
      if (mediaType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For other media types, show file name as preview
        setMediaPreview(`Selected ${mediaType}: ${file.name}`);
      }
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === '' && !mediaFile) return;
    
    setError(null);
    
    try {
      // Send message with verification code
      await onSendMessage(
        content,
        mediaType,
        mediaFile,
        caption || null,
        selectedLabel?.id || null,
        selectedLabel?.title || null,
        selectedLabel?.color || null,
        verificationCode
      );
      
      // Reset form on success
      resetForm();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Falha ao enviar mensagem. Tente novamente.');
    }
  };
  
  const resetForm = () => {
    setContent('');
    setMediaFile(null);
    setMediaPreview(null);
    setCaption('');
    setSelectedLabel(null);
    setVerificationCode('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLabelSelect = (label: Label) => {
    setSelectedLabel(label);
    setIsDropdownOpen(false);
  };

  const handleRetryFetchLabels = async () => {
    setLabelError(null);
    
    // Retry fetching labels
    const fetchLabels = async () => {
      setIsLoadingLabels(true);
      
      try {
        const { data, error } = await labelService.fetchLabels();
        
        if (error) {
          console.error('Error retrying label fetch:', error);
          setLabelError('Não foi possível carregar as etiquetas. Por favor, tente novamente.');
        } else if (data && Array.isArray(data)) {
          setLabels(data);
          setLabelError(null);
        } else {
          console.error('Invalid data format received on retry:', data);
          setLabelError('Formato de dados inválido recebido do servidor.');
        }
      } catch (fetchErr) {
        console.error('Exception while retrying label fetch:', fetchErr);
        setLabelError('Erro ao tentar carregar as etiquetas.');
      } finally {
        setIsLoadingLabels(false);
      }
    };
    
    await fetchLabels();
  };

  const getMediaTypeLabel = (type: MessageMediaType): string => {
    switch (type) {
      case 'text': return 'Texto';
      case 'image': return 'Imagem';
      case 'audio': return 'Áudio';
      case 'video': return 'Vídeo';
      case 'document': return 'Documento';
      default: return 'Mídia';
    }
  };

  const getMediaIcon = (type: MessageMediaType) => {
    switch (type) {
      case 'text': return null;
      case 'image': return <Image className="h-5 w-5" />;
      case 'audio': return <Mic className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return null;
    }
  };

  const getAcceptFileTypes = (type: MessageMediaType): string => {
    switch (type) {
      case 'image': return 'image/*';
      case 'audio': return 'audio/*';
      case 'video': return 'video/*';
      case 'document': return '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx';
      default: return '';
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="mb-3 flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Media Type Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">Tipo de mensagem</label>
          <div className="flex flex-wrap gap-2">
            {(['text', 'image', 'audio', 'video', 'document'] as MessageMediaType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleMediaTypeChange(type)}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mediaType === type
                    ? 'bg-primary-600 text-white shadow-md transform scale-105'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {getMediaIcon(type) && <span className="mr-1.5">{getMediaIcon(type)}</span>}
                {getMediaTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Label Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Etiqueta <span className="text-xs font-normal text-secondary-500">(Escolha uma)</span>
          </label>
          
          {labelError && (
            <div className="mb-3 flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm">{labelError}</p>
                <button 
                  type="button" 
                  onClick={handleRetryFetchLabels}
                  className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}
          
          {isLoadingLabels ? (
            <div className="py-2 px-4 bg-secondary-50 rounded-lg text-secondary-500 mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin"></div>
                <span className="text-sm">Carregando etiquetas...</span>
              </div>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Dropdown button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  {selectedLabel ? (
                    <>
                      <span 
                        className="h-4 w-4 rounded-full mr-3 flex-shrink-0" 
                        style={{ backgroundColor: selectedLabel.color || '#CBD5E1' }}
                      ></span>
                      <span className="font-medium text-secondary-800">{selectedLabel.title}</span>
                    </>
                  ) : (
                    <span className="text-secondary-500">Selecione uma etiqueta</span>
                  )}
                </div>
                <ChevronDown className={`h-5 w-5 text-secondary-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-secondary-200 max-h-60 overflow-auto">
                  {labels.length > 0 ? (
                    <ul className="py-1">
                      {labels.map((label) => (
                        <li key={label.id}>
                          <button
                            type="button"
                            onClick={() => handleLabelSelect(label)}
                            className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <span 
                                className="h-4 w-4 rounded-full mr-3 flex-shrink-0" 
                                style={{ backgroundColor: label.color || '#CBD5E1' }}
                              ></span>
                              <span className="font-medium">{label.title}</span>
                            </div>
                            {selectedLabel?.id === label.id && (
                              <Check className="h-4 w-4 text-primary-600" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-3 px-4 text-secondary-500">
                      <p className="text-sm">Nenhuma etiqueta disponível no momento.</p>
                    </div>
                  )}
                  
                  {/* Option to clear selection */}
                  {selectedLabel && (
                    <div className="border-t border-secondary-100 py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLabel(null);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Remover seleção
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Media Upload (for non-text types) */}
        {mediaType !== 'text' && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Upload de {getMediaTypeLabel(mediaType).toLowerCase()}
            </label>
            
            {mediaPreview ? (
              <div className="mb-4">
                <div className="relative">
                  {mediaType === 'image' ? (
                    <div className="h-48 bg-secondary-100 rounded-lg overflow-hidden">
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="bg-secondary-100 rounded-lg p-4 flex items-center">
                      {getMediaIcon(mediaType)}
                      <span className="ml-2 text-secondary-700">{mediaPreview}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="absolute top-2 right-2 bg-white text-secondary-600 rounded-full p-1 shadow hover:bg-secondary-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer ${!isStorageAvailable ? 'bg-secondary-100 border-secondary-300' : 'border-primary-300 bg-primary-50 hover:bg-primary-100'} transition-colors p-4`}>
                  <div className="flex flex-col items-center justify-center text-center">
                    {getMediaIcon(mediaType)}
                    <p className="mt-2 text-sm text-secondary-600">
                      {!isStorageAvailable 
                        ? 'Upload indisponível no momento'
                        : `Clique para selecionar um${mediaType === 'image' ? 'a' : ''} ${getMediaTypeLabel(mediaType).toLowerCase()}`
                      }
                    </p>
                    <p className="text-xs text-secondary-500">
                      {!isStorageAvailable 
                        ? 'Por favor, configure o armazenamento'
                        : `PNG, JPG, GIF ${mediaType === 'image' ? 'etc' : 'etc'}`
                      }
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden"
                    accept={getAcceptFileTypes(mediaType)}
                    onChange={handleFileChange}
                    disabled={!isStorageAvailable}
                    ref={fileInputRef}
                  />
                </label>
              </div>
            )}

            {/* Caption for Image */}
            {mediaType === 'image' && mediaFile && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Legenda da imagem (opcional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Adicione uma legenda para esta imagem"
                />
              </div>
            )}
            
            {!isStorageAvailable && (
              <div className="mb-4 flex items-start space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">
                  O upload de mídia não está disponível no momento. Apenas o envio de mensagens de texto será possível.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Message Text */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {mediaType === 'text' ? 'Mensagem' : 'Texto adicional (opcional)'}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Digite sua mensagem aqui..."
            required={mediaType === 'text'}
          ></textarea>
        </div>

        {/* Verification Code */}
        <div>
          <label className="flex items-center text-sm font-medium text-secondary-700 mb-2">
            <KeyRound className="h-4 w-4 mr-1.5 text-primary-500" />
            Código de verificação
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Digite o código de verificação"
          />
        </div>

        {/* Submit Button - Updated with a more contrasting color */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || (mediaType !== 'text' && !mediaFile && !isStorageAvailable)}
            className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-medium shadow-soft ${
              isLoading || (mediaType !== 'text' && !mediaFile && !isStorageAvailable)
                ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 transition-colors'
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-1.5 h-4 w-4" />
                Enviar Mensagem
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};