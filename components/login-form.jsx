'use client';

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { signIn } from "@/lib/firebaseAuth"
import Link from "next/link"
import Image from "next/image"

function LoginFormContent({
  className,
  ...props
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      // Success - redirect to the original page or home
      const from = searchParams.get('from');
      router.push(from || '/');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Vítejte zpět</h1>
                <p className="text-muted-foreground text-balance">
                  Přihlaste se ke svému účtu.
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Heslo</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Zapomněli jste heslo?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Přihlašování...' : 'Přihlásit se'}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Nemáte účet? <Link href="/signup">Registrovat se</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/account-image.jpg"
              alt="Image"
              fill
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginForm(props) {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8 flex items-center justify-center">
              <div className="animate-pulse text-gray-600">Načítání...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginFormContent {...props} />
    </Suspense>
  );
}
