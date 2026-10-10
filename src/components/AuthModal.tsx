import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  KeyRound, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Send, 
  RefreshCw, 
  Inbox,
  ExternalLink,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../utils/soundEffects';

interface StoredAccount {
  identifier: string; // email or gmail
  username: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  avatar: string;
  city: string;
  phone: string;
  isVerified?: boolean;
}

const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    identifier: 'soorajs9495@gmail.com',
    username: 'soorajs',
    password: 'password123',
    name: 'Sooraj S',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    city: 'Kochi',
    phone: '+91 94950 12345',
    isVerified: true
  },
  {
    identifier: 'admin@evento.in',
    username: 'admin',
    password: 'admin123',
    name: 'Sooraj S (Admin)',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    city: 'Kochi',
    phone: '+91 94950 99999',
    isVerified: true
  }
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onSelectGuest?: () => void;
  defaultEmail?: string;
  activityPrompt?: string | null;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSelectGuest,
  activityPrompt,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'mail-sent' | 'create-new-password'>(initialMode);

  // Sign In inputs
  const [signinUsernameOrEmail, setSigninUsernameOrEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [showSigninPassword, setShowSigninPassword] = useState(false);

  // Sign Up inputs (Exactly 4 fields: Full Name, Gmail, New Password, Confirm Password)
  const [signupName, setSignupName] = useState('');
  const [signupGmail, setSignupGmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Forgot Password & Reset inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState<StoredAccount | null>(null);
  const [unverifiedGmailNotice, setUnverifiedGmailNotice] = useState<string | null>(null);

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset errors and clear sensitive inputs when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setStatusFeedback(null);
      setSigninPassword('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      if (initialMode) {
        setMode(initialMode);
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Retrieve stored accounts from localStorage (guaranteeing DEFAULT_ACCOUNTS are always included)
  const getRegisteredAccounts = (): StoredAccount[] => {
    try {
      const stored = localStorage.getItem('evento_registered_accounts_v2');
      if (stored) {
        const parsed: StoredAccount[] = JSON.parse(stored);
        const merged = [...parsed];
        for (const def of DEFAULT_ACCOUNTS) {
          if (!merged.some(m => m.identifier.toLowerCase() === def.identifier.toLowerCase() || m.username.toLowerCase() === def.username.toLowerCase())) {
            merged.push(def);
          }
        }
        return merged;
      }
    } catch {
      // fallback
    }
    return DEFAULT_ACCOUNTS;
  };

  const saveRegisteredAccounts = (accounts: StoredAccount[]) => {
    try {
      localStorage.setItem('evento_registered_accounts_v2', JSON.stringify(accounts));
    } catch {
      // fallback
    }
  };

  // 1. HANDLE SIGN IN
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusFeedback(null);

    const cleanInput = signinUsernameOrEmail.trim();
    const cleanPassword = signinPassword.trim();

    if (!cleanInput) {
      setErrorMessage('Please enter your Username or Gmail address.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    setStatusFeedback('Verifying credentials...');

    setTimeout(() => {
      setIsLoading(false);
      const accounts = getRegisteredAccounts();
      const inputLower = cleanInput.toLowerCase();

      // Find matching registered account by email or username
      let matched = accounts.find(
        acc => 
          acc.identifier.toLowerCase() === inputLower ||
          acc.username.toLowerCase() === inputLower
      );

      // Fallback checks for initial demo accounts
      if (!matched) {
        if (inputLower === 'admin' || inputLower === 'admin@evento.in') {
          matched = DEFAULT_ACCOUNTS.find(a => a.role === 'admin');
        } else if (
          inputLower === 'soorajs' || 
          inputLower === 'soorajs9495@gmail.com'
        ) {
          matched = DEFAULT_ACCOUNTS.find(a => a.role === 'user');
        }
      }

      if (matched) {
        if (matched.password !== cleanPassword) {
          setErrorMessage('Incorrect password. Please verify or click "Forgot Password?" below.');
          return;
        }

        // Verified successfully!
        const authenticatedUser: UserProfile = {
          id: matched.role === 'admin' ? 'usr-admin-evento' : `usr-${matched.username}`,
          name: matched.name,
          email: matched.identifier,
          phone: matched.phone,
          city: matched.city,
          avatar: matched.avatar,
          role: matched.role,
          savedEventIds: matched.role === 'admin' ? ['feat-1', 'feat-2', 'trend-1'] : ['feat-1', 'trend-1'],
          bookings: [],
          interests: ['music', 'football', 'company-collab'],
          emailNotifications: true,
          nearbyAlerts: true
        };

        sounds.playSuccess();
        onLoginSuccess(authenticatedUser);
        onClose();
        return;
      }

      setErrorMessage('Account not found. Please check your username/gmail or click "Create Account" below.');
    }, 450);
  };

  // 2. HANDLE SIGN UP (EXACTLY 4 FIELDS: Full Name, Gmail, New Password, Confirm Password)
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusFeedback(null);

    const cleanName = signupName.trim();
    const cleanGmail = signupGmail.trim().toLowerCase();
    const cleanPassword = signupPassword.trim();
    const cleanConfirm = signupConfirmPassword.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!cleanGmail) {
      setErrorMessage('Please enter your Gmail address.');
      return;
    }

    if (!cleanGmail.includes('@') || !cleanGmail.includes('.')) {
      setErrorMessage('Please enter a valid Gmail address (e.g. yourname@gmail.com).');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please create a new password.');
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (!cleanConfirm) {
      setErrorMessage('Please confirm your new password.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setStatusFeedback('Creating your account...');

    setTimeout(() => {
      setIsLoading(false);
      const accounts = getRegisteredAccounts();

      // Check if Gmail or username already registered
      const existing = accounts.find(
        acc => 
          acc.identifier.toLowerCase() === cleanGmail ||
          acc.username.toLowerCase() === cleanGmail.split('@')[0]
      );

      if (existing) {
        setErrorMessage('An account with this Gmail address already exists. Please sign in or use "Forgot Password".');
        return;
      }

      const usernameVal = cleanGmail.split('@')[0];

      const newAccount: StoredAccount = {
        identifier: cleanGmail,
        username: usernameVal,
        password: cleanPassword,
        name: cleanName,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        city: 'Kochi',
        phone: '+91 94950 12345'
      };

      // Save into registered accounts
      saveRegisteredAccounts([...accounts, newAccount]);

      // Construct user session
      const newUserProfile: UserProfile = {
        id: `usr-${Date.now().toString(36)}`,
        name: newAccount.name,
        email: newAccount.identifier,
        phone: newAccount.phone,
        city: newAccount.city,
        avatar: newAccount.avatar,
        role: newAccount.role,
        savedEventIds: ['feat-1', 'trend-1'],
        bookings: [],
        interests: ['music', 'football', 'cultural'],
        emailNotifications: true,
        nearbyAlerts: true
      };

      sounds.playSuccess();
      onLoginSuccess(newUserProfile);
      onClose();
    }, 500);
  };

  // 3. HANDLE FORGOT PASSWORD (VERIFIES GMAIL & SENDS RESET MAIL)
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusFeedback(null);
    setUnverifiedGmailNotice(null);

    const rawInput = forgotEmail.trim();

    if (!rawInput) {
      setErrorMessage('Please enter your registered Gmail address.');
      return;
    }

    // Normalize email (if user typed only username, format to @gmail.com)
    const cleanEmail = rawInput.includes('@') 
      ? rawInput.toLowerCase() 
      : `${rawInput.toLowerCase()}@gmail.com`;
    const cleanUsername = cleanEmail.split('@')[0];

    setIsLoading(true);
    setStatusFeedback('Verifying Gmail in Evento security registry...');

    setTimeout(() => {
      setIsLoading(false);
      const accounts = getRegisteredAccounts();

      // Check if Gmail or username matches an already verified/registered account
      let matched = accounts.find(
        acc => 
          acc.identifier.toLowerCase() === cleanEmail ||
          acc.username.toLowerCase() === cleanUsername ||
          (cleanEmail.startsWith('soorajs') && (acc.identifier.toLowerCase().includes('soorajs') || acc.username.toLowerCase().includes('soorajs'))) ||
          (cleanEmail.startsWith('admin') && (acc.identifier.toLowerCase().includes('admin') || acc.username.toLowerCase().includes('admin')))
      );

      // Check default fallback accounts
      if (!matched) {
        matched = DEFAULT_ACCOUNTS.find(
          acc => 
            acc.identifier.toLowerCase() === cleanEmail ||
            acc.username.toLowerCase() === cleanUsername ||
            (cleanEmail.startsWith('soorajs') && acc.identifier.toLowerCase().includes('soorajs'))
        );
      }

      if (matched) {
        // GMAIL IS VERIFIED IN SYSTEM: DISPATCH PASSWORD RESET MAIL
        setVerifiedAccount(matched);
        setMode('mail-sent');
        sounds.playSuccess();
        setStatusFeedback(`Password reset email successfully dispatched to ${matched.identifier}!`);
      } else {
        // GMAIL IS NOT YET VERIFIED OR REGISTERED
        setErrorMessage(`The Gmail address "${cleanEmail}" is not yet registered or verified.`);
        setUnverifiedGmailNotice(cleanEmail);
      }
    }, 400);
  };

  // INSTANT VERIFY & SEND HANDLER (Ensures testing with any Gmail is seamless)
  const handleInstantVerifyAndSend = (emailToVerify: string) => {
    sounds.playClick();
    const clean = emailToVerify.trim().toLowerCase();
    const usernamePart = clean.split('@')[0];
    const accounts = getRegisteredAccounts();
    const newVerifiedAccount: StoredAccount = {
      identifier: clean,
      username: usernamePart,
      password: 'password123',
      name: usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1),
      role: clean.includes('admin') ? 'admin' : 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      city: 'Kochi',
      phone: '+91 94950 12345',
      isVerified: true
    };
    saveRegisteredAccounts([...accounts, newVerifiedAccount]);
    setVerifiedAccount(newVerifiedAccount);
    setUnverifiedGmailNotice(null);
    setErrorMessage(null);
    setMode('mail-sent');
    sounds.playSuccess();
    setStatusFeedback(`Gmail verified & security reset email sent to ${clean}!`);
  };

  // RESEND RESET MAIL HANDLER
  const handleResendEmail = () => {
    sounds.playClick();
    setStatusFeedback(`Password reset security mail resent to ${verifiedAccount?.identifier}!`);
  };

  // 4. HANDLE NEW PASSWORD CREATION AFTER MAIL LINK
  const handleResetNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!verifiedAccount) {
      setErrorMessage('Verification session expired. Please enter your Gmail again.');
      setMode('forgot');
      return;
    }

    const cleanNew = resetNewPassword.trim();
    const cleanConfirm = resetConfirmPassword.trim();

    if (!cleanNew) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (cleanNew.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (!cleanConfirm) {
      setErrorMessage('Please confirm your new password.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const accounts = getRegisteredAccounts();

      // Update password for verified account
      let foundInList = false;
      const updatedAccounts = accounts.map(acc => {
        if (
          acc.identifier.toLowerCase() === verifiedAccount.identifier.toLowerCase() ||
          acc.username.toLowerCase() === verifiedAccount.username.toLowerCase()
        ) {
          foundInList = true;
          return { ...acc, password: cleanNew };
        }
        return acc;
      });

      if (!foundInList) {
        updatedAccounts.push({ ...verifiedAccount, password: cleanNew });
      }

      saveRegisteredAccounts(updatedAccounts);

      // Sign the user in directly with updated credentials
      const updatedUser: UserProfile = {
        id: verifiedAccount.role === 'admin' ? 'usr-admin-evento' : `usr-${verifiedAccount.username}`,
        name: verifiedAccount.name,
        email: verifiedAccount.identifier,
        phone: verifiedAccount.phone,
        city: verifiedAccount.city,
        avatar: verifiedAccount.avatar,
        role: verifiedAccount.role,
        savedEventIds: verifiedAccount.role === 'admin' ? ['feat-1', 'feat-2', 'trend-1'] : ['feat-1', 'trend-1'],
        bookings: [],
        interests: ['music', 'football', 'cultural'],
        emailNotifications: true,
        nearbyAlerts: true
      };

      sounds.playSuccess();
      onLoginSuccess(updatedUser);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md liquid-glass rounded-3xl shadow-2xl overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">EVENTO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Authentication</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Activity Prompt Banner (when guest attempts a guarded activity) */}
          {activityPrompt && mode !== 'forgot' && mode !== 'mail-sent' && mode !== 'create-new-password' && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/90 dark:border-indigo-800/80 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-1 rounded-lg bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-indigo-950 dark:text-indigo-200">Sign in to continue</p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{activityPrompt}</p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                  Guests can view everything; sign in or create an account to take actions.
                </p>
              </div>
            </div>
          )}

          {/* Heading */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === 'signin' && 'Sign In to Evento'}
              {mode === 'signup' && 'Create New Account'}
              {mode === 'forgot' && 'Reset Your Password'}
              {mode === 'mail-sent' && 'Password Reset Mail Dispatched'}
              {mode === 'create-new-password' && 'Create New Password'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'signin' && 'Sign in with your Username or Gmail and Password.'}
              {mode === 'signup' && 'Fill in the 4 fields below to create your authenticated account.'}
              {mode === 'forgot' && 'Enter your registered Gmail. If verified, we will send a mail to create a new password.'}
              {mode === 'mail-sent' && `We verified your Gmail (${verifiedAccount?.identifier}) and dispatched the password reset link.`}
              {mode === 'create-new-password' && `Create a new secure password for ${verifiedAccount?.identifier}.`}
            </p>
          </div>

          {/* Mode Switcher Tabs (Only shown on signin / signup) */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Status Feedback */}
          {statusFeedback && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{statusFeedback}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: SIGN IN FORM */}
          {/* ------------------------------------------------------------- */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Username or Gmail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. soorajs9495@gmail.com or username"
                    value={signinUsernameOrEmail}
                    onChange={(e) => setSigninUsernameOrEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {/* FORGOT PASSWORD HYPERLINK */}
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMode('forgot');
                      setErrorMessage(null);
                      setStatusFeedback(null);
                      if (signinUsernameOrEmail) {
                        setForgotEmail(signinUsernameOrEmail);
                      }
                    }}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSigninPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSigninPassword(!showSigninPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showSigninPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Sign In with Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 2: CREATE NEW ACCOUNT (EXACT 4 FIELDS: Full Name, Gmail, New Password, Confirm Password) */}
          {/* ------------------------------------------------------------- */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              {/* Field 1: Full Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Field 2: Gmail */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Gmail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={signupGmail}
                    onChange={(e) => setSignupGmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Field 3: New Password */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a new password (min. 4 characters)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 4: Confirm Password */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password to confirm"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-0.5"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showSignupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Registering account...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Create Account & Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 3: FORGOT PASSWORD (EMAIL VERIFICATION) */}
          {/* ------------------------------------------------------------- */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <form onSubmit={handleForgotPassword} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Registered Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your Gmail (e.g. soorajs9495@gmail.com)"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        setUnverifiedGmailNotice(null);
                        setErrorMessage(null);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    If this Gmail is already verified in our system, we will immediately send an official email with a secure link to create a new password.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Verifying Gmail & Sending Mail...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Verify Gmail & Send Reset Mail</span>
                    </>
                  )}
                </button>
              </form>

              {/* UNVERIFIED GMAIL HELPER ACTION CARD */}
              {unverifiedGmailNotice && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        "{unverifiedGmailNotice}" is not yet in our verified accounts
                      </p>
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                        To receive a password reset mail, the Gmail must belong to an account. Would you like to verify this Gmail now or create an account with it?
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleInstantVerifyAndSend(unverifiedGmailNotice)}
                      className="w-full py-2 px-2.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify & Send Mail Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSignupGmail(unverifiedGmailNotice);
                        setMode('signup');
                        setErrorMessage(null);
                        setUnverifiedGmailNotice(null);
                      }}
                      className="w-full py-2 px-2.5 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-[11px] font-bold rounded-xl border border-amber-300 dark:border-amber-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Create Account Instead</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signin');
                  setErrorMessage(null);
                  setStatusFeedback(null);
                  setUnverifiedGmailNotice(null);
                }}
                className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 4: MAIL SENT CONFIRMATION WITH DIRECT ACTION & GMAIL PREVIEW */}
          {/* ------------------------------------------------------------- */}
          {mode === 'mail-sent' && (
            <div className="space-y-4">
              
              {/* Interactive Gmail Mail Delivery Envelope Card */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-white/95 dark:bg-slate-900/95 p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      M
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Evento Security</span>
                        <span className="text-[10px] text-slate-400 font-normal">· &lt;security@evento.in&gt;</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[210px]">
                        To: {verifiedAccount?.identifier}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Mail Sent</span>
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Subject: Reset your Evento account password
                    </p>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Hello <strong>{verifiedAccount?.name}</strong>, a password reset request was verified for your Gmail. Click the button below to create your new password:
                  </p>

                  {/* Primary Link from Email to Create New Password */}
                  <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-center space-y-2">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                      Official Security Link
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setMode('create-new-password');
                        setErrorMessage(null);
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Click Here to Create New Password</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] text-slate-400">
                      Clicking above simulates following the link sent to your Gmail
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Gmail (mail.google.com)</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleResendEmail}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend Mail</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Next Step Action */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('create-new-password');
                  setErrorMessage(null);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Create New Password Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signin');
                  setErrorMessage(null);
                  setStatusFeedback(null);
                }}
                className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 5: CREATE NEW PASSWORD (AFTER VERIFIED EMAIL) */}
          {/* ------------------------------------------------------------- */}
          {mode === 'create-new-password' && (
            <form onSubmit={handleResetNewPasswordSubmit} className="space-y-3.5">
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">Creating new password for verified account:</p>
                  <p className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{verifiedAccount?.identifier}</p>
                </div>
              </div>

              {/* Field 1: New Password */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showResetNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your new password (min. 4 characters)"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showResetNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 2: Confirm New Password */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showResetConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your new password to confirm"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-0.5"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showResetConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Updating password...</span>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Save New Password & Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </form>
          )}

          {/* Footer switcher / Continue as Guest */}
          <div className="text-center pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer text-left"
              >
                Need an account? Sign up
              </button>
            )}

            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer text-left"
              >
                Already registered? Sign in
              </button>
            )}

            {(mode === 'forgot' || mode === 'mail-sent' || mode === 'create-new-password') && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('signin');
                  setErrorMessage(null);
                  setUnverifiedGmailNotice(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer text-left"
              >
                ← Back to Sign In
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onSelectGuest) {
                  onSelectGuest();
                }
                onClose();
              }}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer ml-auto"
            >
              Continue as Guest →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
