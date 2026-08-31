import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, getResume } from '../services/resumeService';
import { UploadCloud, FileText, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const ResumeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Check if they already have a resume saved in the database
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResume();
        setExistingResume(data);
      } catch (err) {
        // If it fails (404), it just means no resume exists yet!
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      await uploadResume(file);
      // Once successful, send them to the setup page to choose their interview type!
      navigate('/interview-setup');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume. Please try again.');
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Step 1: Your Resume</h2>
          <p className="mt-2 text-slate-400">
            Upload your resume so our AI can tailor the interview questions exactly to your experience.
          </p>
        </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
        
        {/* Existing Resume Card (Only shows if they uploaded one previously) */}
        {existingResume && !file && (
          <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-400">Resume Already Uploaded</h3>
                <p className="text-sm text-slate-400 mt-1 mb-4">
                  We found your previously uploaded resume. You can continue with this one, or upload a new one to replace it.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/interview-setup')}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Continue with Current
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors border border-slate-700"
                  >
                    Upload New Instead
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {(!existingResume || file) && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
            {/* Hidden Input File Field */}
            

            <div
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
            >
              <div className="flex justify-center mb-4">
                {file ? (
                  <FileText className="w-12 h-12 text-indigo-400" />
                ) : (
                  <UploadCloud className="w-12 h-12 text-slate-500" />
                )}
              </div>

              <p className="text-lg font-medium text-slate-200">
                {file ? file.name : 'Click to select your PDF resume'}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {file ? 'Click again to choose a different file' : 'Only .pdf files are supported'}
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Extracting AI Data...
                  </>
                ) : (
                  <>
                    Parse & Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeUpload;
