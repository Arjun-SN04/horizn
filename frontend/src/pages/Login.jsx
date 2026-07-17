import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/animate-ui/components/buttons/button';

export const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const e = {};
    if (!credentials.username.trim()) e.username = 'Please provide a username.';
    if (!credentials.password.trim()) e.password = 'Please provide a password.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await login(credentials);
    if (success) navigate('/listing');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-112 p-10 shadow-md gap-0">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="text-primary size-5" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Welcome back</h1>
          <p className="text-xs text-muted-foreground">Sign in to your Horizn account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4.5">
          <div>
            <Label className="mb-1.5">Username</Label>
            <Input name="username" type="text" value={credentials.username} onChange={handleChange}
              placeholder="Enter your username" className="h-11 rounded-xl bg-muted/40"
              aria-invalid={!!errors.username} />
            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
          </div>

          <div>
            <Label className="mb-1.5">Password</Label>
            <Input name="password" type="password" value={credentials.password} onChange={handleChange}
              placeholder="Enter your password" className="h-11 rounded-xl bg-muted/40"
              aria-invalid={!!errors.password} />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full bg-primary text-on-primary font-bold shadow-md hover:shadow-lg border-0 mt-1.5">
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 mb-0">
          Don't have an account?{' '}
          <Link to="/user/signup" className="text-primary font-bold no-underline">Sign up free</Link>
        </p>
      </Card>
    </div>
  );
};
