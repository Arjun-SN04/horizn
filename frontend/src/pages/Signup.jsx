import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/animate-ui/components/buttons/button';

export const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signup } = useAuth();

  const validate = () => {
    const e = {};
    if (!formData.username.trim()) e.username = 'Please provide a username.';
    if (!formData.email.trim() || !formData.email.includes('@')) e.email = 'Please provide a valid email.';
    if (!formData.password || formData.password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await signup({ user: formData });
    if (success) navigate('/listing');
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-112 p-10 shadow-md gap-0">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="text-primary size-5" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Create account</h1>
          <p className="text-xs text-muted-foreground">Join Horizn and start exploring</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4.5">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <Label className="mb-1.5">{label}</Label>
              <Input type={type} name={name} value={formData[name]} onChange={handleChange}
                placeholder={placeholder} className="h-11 rounded-xl bg-muted/40"
                aria-invalid={!!errors[name]} />
              {errors[name] && <p className="text-xs text-destructive mt-1">{errors[name]}</p>}
            </div>
          ))}

          <Button type="submit" size="lg" className="w-full rounded-full bg-primary text-on-primary font-bold shadow-md hover:shadow-lg border-0 mt-1.5">
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 mb-0">
          Already have an account?{' '}
          <Link to="/user/login" className="text-primary font-bold no-underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
};
