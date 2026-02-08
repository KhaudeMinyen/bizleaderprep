
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { OrgType } from '../App';

interface AuthProps {
  onLogin: () => void;
  onCancel: () => void;
  defaultView?: 'login' | 'signup';
  orgType?: OrgType;
}

type AuthView = 'login' | 'signup' | 'forgot_password';

const Auth: React.FC<AuthProps> = ({ onLogin, onCancel, defaultView = 'login', orgType = 'NONE' }) => {
  const [view, setView] = useState<AuthView>(defaultView);
  const brandBgClass = orgType === 'FBLA' ? 'bg-rh-green' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-yellow';
  const brandTextClass = orgType === 'FBLA' ? 'text-rh-green' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-yellow';
  const brandBorderClass = orgType === 'FBLA' ? 'border-rh-green' : orgType === 'DECA' ? 'border-rh-cyan' : 'border-rh-yellow';
  const brandShadowClass = orgType === 'FBLA' ? 'shadow-[0_0_40px_rgba(0,200,5,0.4)]' : orgType === 'DECA' ? 'shadow-[0_0_40px_rgba(0,166,224,0.4)]' : 'shadow-[0_0_40px_rgba(255,218,0,0.4)]';
  const brandFocusClass = orgType === 'FBLA' ? 'focus:border-rh-green' : orgType === 'DECA' ? 'focus:border-rh-cyan' : 'focus:border-rh-yellow';
  const brandSuccessBgClass = orgType === 'FBLA' ? 'bg-rh-green/10 border-rh-green/50 text-rh-green' : orgType === 'DECA' ? 'bg-rh-cyan/10 border-rh-cyan/50 text-rh-cyan' : 'bg-rh-yellow/10 border-rh-yellow/50 text-rh-yellow';
  const brandButtonShadowClass = orgType === 'FBLA' ? 'shadow-[0_10px_30px_rgba(0,200,5,0.2)]' : orgType === 'DECA' ? 'shadow-[0_10px_30px_rgba(0,166,224,0.2)]' : 'shadow-[0_10px_30px_rgba(255,218,0,0.2)]';
  const brandHoverClass = orgType === 'FBLA' ? 'hover:bg-rh-green' : orgType === 'DECA' ? 'hover:bg-rh-cyan' : 'hover:bg-rh-yellow';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  const supabaseUrl = (supabase as any).supabaseUrl || '';

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    
    if (!isSupabaseConfigured()) {
       setIsLoading(false);
       setErrorMsg("Supabase keys are missing in supabaseClient.ts");
       return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('OAuth Connection Error:', error.message);
      setErrorMsg(error.message);
      setIsLoading(false);
      setShowConfigGuide(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMsg("Check your email for a verification link!");
      } else if (view === 'forgot_password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccessMsg("Instructions sent to your email.");
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-slide-up relative">
       <div className="w-full max-w-md">
         {/* Branding */}
         <div className="text-center mb-10">
           <div className={`w-14 h-14 ${brandBgClass} rounded-xl rotate-45 flex items-center justify-center mx-auto mb-8 ${brandShadowClass}`}>
              <div className="w-5 h-5 bg-black rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white mb-3">
              {view === 'login' ? 'Mastery Awaits' : 'Join PrepHub'}
            </h1>
            <p className="text-rh-gray text-sm font-medium tracking-wide">
              {view === 'login' ? 'Secure access to your FBLA portfolio.' : 'The premium platform for competition success.'}
            </p>
         </div>

         {/* Card */}
         <div className="bg-rh-dark border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
           
           {/* Google Auth Button (Sign Up / Log In) */}
           {view !== 'forgot_password' && (
             <>
               <button
                 onClick={handleGoogleAuth}
                 disabled={isLoading}
                 className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-3 mb-8 shadow-xl hover:scale-[1.01] active:scale-[0.99]"
               >
                 <svg className="w-6 h-6" viewBox="0 0 24 24">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 <span className="text-[11px] uppercase tracking-[0.2em] font-black">
                   {view === 'signup' ? 'Sign up with Google' : 'Log in with Google'}
                 </span>
               </button>

               <div className="relative mb-8">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-white/10"></div>
                 </div>
                 <div className="relative flex justify-center text-[10px] uppercase">
                   <span className="bg-rh-dark px-4 text-rh-gray font-black tracking-[0.3em]">Or use email</span>
                 </div>
               </div>
             </>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
             {errorMsg && (
               <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                 {errorMsg}
               </div>
             )}
             {successMsg && (
                <div className={`${brandSuccessBgClass} border p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center`}>
                  {successMsg}
                </div>
             )}
             
             <div>
               <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-rh-gray mb-3 ml-1">Account Email</label>
               <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white ${brandFocusClass} outline-none transition-all placeholder:text-gray-700`}
                  placeholder="name@email.com"
               />
             </div>
             
             {view !== 'forgot_password' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-rh-gray ml-1">Password</label>
                     <button type="button" onClick={() => setView('forgot_password')} className="text-[10px] font-bold text-rh-gray hover:text-white underline underline-offset-4">Forgot?</button>
                  </div>
                  <input 
                     type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                     className={`w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white ${brandFocusClass} outline-none transition-all placeholder:text-gray-700`}
                     placeholder="••••••••"
                  />
                </div>
             )}

             <button type="submit" disabled={isLoading} className={`w-full ${brandBgClass} text-black font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-2xl hover:scale-[1.01] transition-all ${brandButtonShadowClass}`}>
                {isLoading ? 'Processing...' : (view === 'login' ? 'Sign In' : (view === 'signup' ? 'Create Account' : 'Reset'))}
             </button>
           </form>

           <div className="mt-10 text-center space-y-6">
              <button 
                  onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                  className="text-xs font-bold text-rh-gray hover:text-white transition-colors"
              >
                  {view === 'login' ? "New to PrepHub? Create account" : "Have an account? Log in"}
              </button>
              
              <div className="pt-6 border-t border-white/5 flex flex-col items-center space-y-4">
                 <button onClick={onCancel} className="text-[10px] font-black uppercase tracking-[0.2em] text-rh-gray/50 hover:text-white transition-colors">Return Home</button>
              </div>
           </div>

           {/* Troubleshooting Guide Overlay */}
           {showConfigGuide && (
             <div className="absolute inset-0 bg-rh-dark/98 backdrop-blur-2xl z-30 p-8 flex flex-col overflow-y-auto animate-slide-up">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-white font-black text-xl tracking-tighter">Connection Guide</h3>
                 <button onClick={() => setShowConfigGuide(false)} className="text-rh-gray hover:text-white">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
               </div>
               
               <div className="space-y-8 text-left">
                 {/* Section for Linking New Projects */}
                 <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                   <h4 className="text-white text-[10px] font-black uppercase mb-3 tracking-widest flex items-center">
                     <span className={`w-1.5 h-1.5 ${brandBgClass} rounded-full mr-2`}></span>
                     How to Link a New Project
                   </h4>
                   <p className="text-gray-300 text-xs leading-relaxed mb-4">
                     To move to a different Google Cloud project, update the <strong>Client ID</strong> and <strong>Secret</strong> here:
                   </p>
                   <a 
                     href="https://supabase.com/dashboard/project/pvusqaabryhcsmwwhfot/auth/providers" 
                     target="_blank" 
                     className={`inline-block bg-white text-black font-black text-[9px] uppercase px-4 py-2 rounded-lg tracking-widest ${brandHoverClass} transition-colors`}
                   >
                     Supabase → Auth → Google
                   </a>
                 </div>

                 <div>
                   <h4 className={`${brandTextClass} text-[10px] font-black uppercase mb-3 tracking-widest`}>Verify Redirect URI</h4>
                   <p className="text-gray-400 text-xs mb-3 leading-relaxed">Ensure this link is saved in your (new) Google OAuth project under <strong>"Authorized redirect URIs"</strong>:</p>
                   <div className="bg-black/60 p-4 rounded-xl border border-white/10 select-all group cursor-pointer">
                     <code className={`text-[10px] ${brandTextClass} font-mono break-all leading-relaxed`}>
                       {`${supabaseUrl}/auth/v1/callback`}
                     </code>
                   </div>
                 </div>

                 <div>
                   <h4 className="text-white text-[10px] font-black uppercase mb-2 tracking-widest">Status Check</h4>
                   <p className="text-gray-400 text-xs leading-relaxed">
                     If your Google project is already <strong>"In Production"</strong> (published), the 403 error is almost always a Client ID or Secret mismatch in Supabase.
                   </p>
                 </div>
               </div>

               <button 
                 onClick={() => setShowConfigGuide(false)} 
                 className="mt-12 w-full bg-white/5 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/10"
               >
                 Close Troubleshooting
               </button>
             </div>
           )}
         </div>
       </div>
    </div>
  );
};

export default Auth;
