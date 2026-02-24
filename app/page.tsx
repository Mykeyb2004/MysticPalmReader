'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请上传有效的图片文件。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      setError(null);
      analyzePalm(base64);
    };
    reader.onerror = () => {
      setError('读取图片文件失败。');
    };
    reader.readAsDataURL(file);
  };

  const analyzePalm = async (base64Image: string) => {
    setIsLoading(true);
    setReading(null);
    setError(null);

    try {
      // Extract base64 data without the data URL prefix
      const base64Data = base64Image.split(',')[1];
      const mimeType = base64Image.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: `你是一位充满智慧、神秘且专业的手相大师。请分析提供的掌纹图片。
              根据主要的掌纹（感情线、智慧线、生命线和事业线，如果可见的话），提供详细、鼓励且充满神秘色彩的算命解读。
              
              请使用Markdown格式，为每条线和总体总结添加清晰的标题。
              用神秘、充满智慧的语气说话，适当使用诗意的语言。
              
              如果图片明显不是手掌，请礼貌而神秘地要求用户上传一张清晰的手掌照片。
              
              请务必使用中文（简体）回答。`,
            },
          ],
        },
      });

      setReading(response.text || '灵界保持沉默。请重试。');
    } catch (err) {
      console.error('Error analyzing palm:', err);
      setError('神秘连接中断。请重试。');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setReading(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Mystical Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/10 blur-[150px]" />
      </div>

      <div className="z-10 w-full max-w-3xl flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 mb-4">
            AI 灵境手相
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto font-light tracking-wide">
            探索掌纹中隐藏的命运密码。
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!image && !isLoading && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div 
                className="relative group cursor-pointer w-full rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-500 p-12 flex flex-col items-center justify-center text-center overflow-hidden backdrop-blur-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 mb-6 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Camera className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-serif text-zinc-200 mb-2">洞悉你的命运</h3>
                  <p className="text-zinc-400 max-w-sm">
                    拍一张清晰的手掌照片，或上传已有图片以开始解读。
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 text-sm text-purple-400 font-medium tracking-wider uppercase">
                    <Upload className="w-4 h-4" />
                    <span>选择图片</span>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                <div className="absolute inset-4 rounded-full border-b-2 border-fuchsia-400 animate-spin" style={{ animationDuration: '1.5s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-serif text-zinc-200 mb-2 animate-pulse">正在沟通灵界...</h3>
              <p className="text-zinc-500">正在解读你的命运轨迹</p>
            </motion.div>
          )}

          {reading && image && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col gap-8"
            >
              <div className="w-full flex justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                  <img 
                    src={image} 
                    alt="你的手相" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay" />
                </div>
              </div>

              <div className="w-full rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-md p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                
                <div className="prose prose-invert prose-purple max-w-none prose-headings:font-serif prose-headings:font-normal prose-h2:text-3xl prose-h3:text-2xl prose-p:text-zinc-300 prose-p:leading-relaxed prose-strong:text-zinc-100">
                  <Markdown>{reading}</Markdown>
                </div>
              </div>

              <div className="flex justify-center mt-4 pb-12">
                <button
                  onClick={reset}
                  className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 text-zinc-300 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-700" />
                  <span className="font-medium tracking-wide">再看一次</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/50 border border-red-900/50 text-red-200"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
