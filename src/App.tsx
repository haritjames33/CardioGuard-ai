import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Heart, FileText, History, Info, ChevronRight, RefreshCcw } from 'lucide-react';
import { HeartData, PredictionResult } from './types';
import { getPrediction } from './ml/model';
import { time } from 'console';

export default function App() {
  const [step, setStep] = useState<'home' | 'form' | 'result'>('home');
  const [formData, setFormData] = useState<HeartData>({
    age: 52, sex: 1, cp: 0, trestbps: 125, chol: 212, fbs: 0, restecg: 1, 
    thalach: 168, exang: 0, oldpeak: 1.0, slope: 2, ca: 2, thal: 3
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const dataArray = [
        formData.age, formData.sex, formData.cp, formData.trestbps, formData.chol,
        formData.fbs, formData.restecg, formData.thalach, formData.exang,
        formData.oldpeak, formData.slope, formData.ca, formData.thal
      ];
      const res = await getPrediction(dataArray);
      setResult(res);
      setStep('result');
    } catch (error) {
      console.error("Prediction failed", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('home')}>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">CardioGuard <span className="text-red-600">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button className="hover:text-red-600 transition-colors">Dashboard</button>
            <button className="hover:text-red-600 transition-colors">History</button>
            <button className="hover:text-red-600 transition-colors">Research</button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Clinical Decision Support <br />
                  <span className="text-red-600">Powered by Deep Learning</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Utilizing a 9-layer Dense Neural Network to provide accurate heart disease predictions 
                  based on clinical diagnostic data. Designed for medical professionals.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setStep('form')} className="btn-primary w-full sm:w-auto">
                  Start New Diagnosis <ChevronRight size={20} />
                </button>
                <button className="btn-secondary w-full sm:w-auto">
                  <History size={20} /> View Patient History
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {[
                  { icon: Activity, title: "93.2% Accuracy", desc: "Trained on benchmark datasets" },
                  { icon: FileText, title: "Instant Reports", desc: "Downloadable PDF clinical summaries" },
                  { icon: Info, title: "Clinical Support", desc: "Decision support for specialists" }
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 text-left space-y-3">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                      <item.icon size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Patient Diagnostic Data</h2>
                <button onClick={() => setStep('home')} className="text-slate-400 hover:text-slate-600">Cancel</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData).map((key) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {key === 'sex' ? (
                      <select 
                        value={formData[key as keyof HeartData]}
                        onChange={(e) => setFormData({...formData, [key]: parseFloat(e.target.value)})}
                        className="input-field"
                      >
                        <option value={0}>Female</option>
                        <option value={1}>Male</option>
                      </select>
                    ) : (
                      <input 
                        type="number"
                        value={formData[key as keyof HeartData]}
                        onChange={(e) => setFormData({...formData, [key]: parseFloat(e.target.value)})}
                        className="input-field"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button 
                  onClick={handlePredict} 
                  disabled={loading}
                  className="btn-primary w-full py-4 text-lg"
                >
                  {loading ? <RefreshCcw className="animate-spin" /> : "Generate Clinical Prediction"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div id="report-content" className="glass-card p-10 space-y-8">
                <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Clinical Prediction Report</h2>
                    <p className="text-slate-500 font-mono text-sm">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Generated On</p>
                    <p className="text-slate-600">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                      <Activity size={20} className="text-red-600" /> Prediction Analysis
                    </h3>
                    <div className={`p-6 rounded-2xl ${result.risk === 'High' ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Risk Assessment</p>
                      <p className={`text-4xl font-black ${result.risk === 'High' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {result.risk} Risk
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        Confidence Score: <span className="font-bold">{(result.probability * 100).toFixed(2)}%</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                      <Info size={20} className="text-slate-400" /> Patient Parameters
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-400">Age:</span> <span className="font-bold">{formData.age}</span></div>
                      <div><span className="text-slate-400">Sex:</span> <span className="font-bold">{formData.sex === 1 ? 'M' : 'F'}</span></div>
                      <div><span className="text-slate-400">BP:</span> <span className="font-bold">{formData.trestbps}</span></div>
                      <div><span className="text-slate-400">Chol:</span> <span className="font-bold">{formData.chol}</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-500 uppercase">Disclaimer:</span> This prediction is generated by a deep learning model (9-layer DNN) 
                    and should be used as a clinical decision support tool only. It does not replace professional medical diagnosis. 
                    Consult a cardiologist for final clinical assessment.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setStep('form')} className="btn-primary flex-1">
                  <RefreshCcw size={20} /> New Diagnosis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} CardioGuard AI Clinical Decision Support System. Built with TensorFlow.js</p>
      </footer>
    </div>
  );
}