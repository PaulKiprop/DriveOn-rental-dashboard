import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Car, User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] items-center justify-center text-white p-12">
        <Car className="w-32 h-32 mb-8 text-blue-400" />
        <h1 className="text-5xl font-bold mb-4 tracking-tight">DriveOn</h1>
        <p className="text-xl text-blue-100 font-light">Managing your fleet, one ride at a time.</p>
      </div>
      
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start">
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <Car className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">DriveOn</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Username"
                  className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
            
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
