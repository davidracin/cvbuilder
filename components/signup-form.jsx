'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUp, auth } from "@/lib/firebaseAuth"
import { validatePassword } from "firebase/auth"

export function SignupForm({
  className,
  ...props
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Hesla se neshodují');
      return;
    }

    // Validate password using Firebase policy
    try {
      const status = await validatePassword(auth, password);
      
      if (!status.isValid) {
        const errors = [];
        
        if (status.meetsMinPasswordLength === false) {
          errors.push('alespoň 8 znaků');
        }
        if (status.containsLowercaseLetter === false) {
          errors.push('malé písmeno');
        }
        if (status.containsUppercaseLetter === false) {
          errors.push('velké písmeno');
        }
        if (status.containsNumericCharacter === false) {
          errors.push('číslici');
        }
        
        setError(`Heslo musí obsahovat: ${errors.join(', ')}`);
        return;
      }
    } catch (validationError) {
      console.error('Password validation error:', validationError);
    }

    setLoading(true);

    const { user, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      // Success - redirect to home or editor
      router.push('/');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Vytvořte si účet</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Zadejte svůj email níže pro vytvoření účtu
                </p>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="name">Jméno</FieldLabel>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Jan" 
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="surname">Příjmení</FieldLabel>
                <Input 
                  id="surname" 
                  type="text" 
                  placeholder="Novák" 
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Heslo</FieldLabel>
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Potvrďte heslo
                    </FieldLabel>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Musí obsahovat: alespoň 8 znaků, malé písmeno, velké písmeno a číslici.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Vytváření účtu...' : 'Vytvořit účet'}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Již máte účet? <a href="/login">Přihlásit se</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
