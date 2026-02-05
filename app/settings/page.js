'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/firebaseAuth";
import { resendVerificationEmail } from "@/lib/firebaseAuth";
import { validatePassword, verifyBeforeUpdateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getUserProfile, updateUserProfile } from "@/lib/firestoreUsers";

export const metadata = {
  title: "Nastavení účtu",
};

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email verification state
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [verificationError, setVerificationError] = useState('');

  // Load user profile data from Firestore
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserProfile(user.uid);
          
          if (userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
          }
        } catch (error) {
          // Failed to load profile
        }
      }
    };

    loadUserProfile();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (!loading && !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Načítání...
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      // Update user profile in Firestore
      await updateUserProfile(user.uid, {
        firstName,
        lastName
      });
      
      setProfileSuccess('Profil byl úspěšně aktualizován!');
      setProfileLoading(false);
    } catch (error) {
      setProfileError('Nepodařilo se aktualizovat profil.');
      setProfileLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationError('');
    setVerificationSuccess('');
    setVerificationLoading(true);

    const { error } = await resendVerificationEmail();
    
    if (error) {
      setVerificationError(error);
    } else {
      setVerificationSuccess('Ověřovací email byl odeslán. Zkontrolujte svou schránku.');
    }
    
    setVerificationLoading(false);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    setEmailLoading(true);

    try {
      // Re-authenticate user before changing email
      const credential = EmailAuthProvider.credential(user.email, emailPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Send verification email to new address before changing
      // The email will only be changed after the user verifies the new address
      await verifyBeforeUpdateEmail(user, newEmail);
      
      setEmailSuccess('Na novou adresu byl odeslán ověřovací email. Po jeho potvrzení bude email změněn.');
      setEmailLoading(false);
      setNewEmail('');
      setEmailPassword('');
    } catch (error) {
      // Handle specific error codes
      if (error.code === 'auth/wrong-password') {
        setEmailError('Nesprávné heslo.');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('Neplatný formát emailu.');
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailError('Tento email je již používán jiným účtem.');
      } else if (error.code === 'auth/requires-recent-login') {
        setEmailError('Pro tuto operaci musíte být nedávno přihlášeni. Odhlaste se a přihlaste znovu.');
      } else {
        setEmailError('Nepodařilo se změnit email. Zkuste to prosím znovu.');
      }
      
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('Nová hesla se neshodují.');
      return;
    }

    // Validate password using Firebase policy
    try {
      const status = await validatePassword(auth, newPassword);
      
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
        
        setPasswordError(`Heslo musí obsahovat: ${errors.join(', ')}`);
        return;
      }
    } catch (validationError) {
      setPasswordError('Chyba při validaci hesla.');
      return;
    }

    setPasswordLoading(true);

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      setPasswordSuccess('Heslo bylo úspěšně změněno!');
      setPasswordLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Handle specific error codes
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Nesprávné aktuální heslo.');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Heslo je příliš slabé.');
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Pro tuto operaci musíte být nedávno přihlášeni. Odhlaste se a přihlaste znovu.');
      } else {
        setPasswordError('Nepodařilo se změnit heslo. Zkuste to prosím znovu.');
      }
      
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nastavení účtu
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Spravujte své osobní údaje a nastavení účtu
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Verification Status Card */}
          {user && !user.emailVerified && (
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  ⚠️ Email není ověřen
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  Pro plné využití aplikace (ukládání CV) ověřte svůj email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {verificationSuccess && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-3">
                    {verificationSuccess}
                  </div>
                )}
                {verificationError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-3">
                    {verificationError}
                  </div>
                )}
                <Button 
                  onClick={handleResendVerification} 
                  disabled={verificationLoading}
                  variant="outline"
                  className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/40"
                >
                  {verificationLoading ? 'Odesílání...' : 'Odeslat ověřovací email'}
                </Button>
              </CardContent>
            </Card>
          )}
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Osobní údaje</CardTitle>
              <CardDescription>
                Aktualizujte své jméno a příjmení
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate}>
                <FieldGroup>
                  {profileSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                      {profileSuccess}
                    </div>
                  )}
                  {profileError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {profileError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="firstName">Jméno</FieldLabel>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Jan"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="lastName">Příjmení</FieldLabel>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Novák"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Field>
                  </div>

                  <Field>
                    <Button type="submit" disabled={profileLoading}>
                      {profileLoading ? 'Ukládání...' : 'Uložit změny'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          {/* Email Change Card */}
          <Card>
            <CardHeader>
              <CardTitle>Změnit email</CardTitle>
              <CardDescription>
                Aktuální email: {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailChange}>
                <FieldGroup>
                  {emailSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                      {emailSuccess}
                    </div>
                  )}
                  {emailError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {emailError}
                    </div>
                  )}

                  <Field>
                    <FieldLabel htmlFor="newEmail">Nový email</FieldLabel>
                    <Input
                      id="newEmail"
                      type="email"
                      placeholder="novy@email.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="emailPassword">Aktuální heslo</FieldLabel>
                    <Input
                      id="emailPassword"
                      type="password"
                      placeholder="Pro potvrzení zadejte heslo"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      required
                    />
                    <FieldDescription>
                      Pro změnu emailu musíte zadat své aktuální heslo
                    </FieldDescription>
                  </Field>

                  <Field>
                    <Button type="submit" disabled={emailLoading}>
                      {emailLoading ? 'Měním email...' : 'Změnit email'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <CardTitle>Změnit heslo</CardTitle>
              <CardDescription>
                Aktualizujte své heslo pro větší bezpečnost
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange}>
                <FieldGroup>
                  {passwordSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                      {passwordSuccess}
                    </div>
                  )}
                  {passwordError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}

                  <Field>
                    <FieldLabel htmlFor="currentPassword">Aktuální heslo</FieldLabel>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </Field>

                  <Separator />

                  <Field>
                    <FieldLabel htmlFor="newPassword">Nové heslo</FieldLabel>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <FieldDescription>
                      Musí obsahovat: alespoň 8 znaků, malé písmeno, velké písmeno a číslici
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Potvrďte nové heslo</FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? 'Měním heslo...' : 'Změnit heslo'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
