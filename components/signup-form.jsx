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
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/firebaseAuth"

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

    // Validate password length
    if (password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků');
      return;
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
                  Musí mít alespoň 8 znaků.
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
