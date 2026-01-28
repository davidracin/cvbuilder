'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserCVs, deleteCV } from '@/lib/firestoreCVs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TEMPLATE_NAMES = {
  moderni: 'Moderní',
  klasicke: 'Klasické',
  kreativni: 'Kreativní',
  profesionalni: 'Profesionální'
};

export default function TemplatesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const loadCVs = async () => {
      setLoading(true);
      const { cvs: userCvs, error } = await getUserCVs(user.uid);
      if (error) {
        // Error loading CVs - show empty state
      } else {
        setCvs(userCvs);
      }
      setLoading(false);
    };

    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadCVs();
    }
  }, [user, authLoading, router]);

  const handleEdit = (cv) => {
    router.push(`/editor/${cv.templateType}?cvId=${cv.id}`);
  };

  const handleDelete = async (cvId) => {
    const { error } = await deleteCV(cvId, user.uid);
    if (!error) {
      setCvs(cvs.filter(cv => cv.id !== cvId));
      setDeleteId(null);
    }
  };

  const handleNewCV = () => {
    router.push('/');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Neznámé';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('cs-CZ', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Moje šablony
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {cvs.length} {cvs.length === 1 ? 'životopis' : cvs.length < 5 ? 'životopisy' : 'životopisů'}
            </p>
          </div>
          <Button onClick={handleNewCV} className="bg-blue-600 hover:bg-blue-700">
            + Nové CV
          </Button>
        </div>

        {cvs.length === 0 ? (
          <Card className="p-12">
            <CardContent className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Zatím nemáte žádné CV
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Začněte vytvořením svého prvního životopisu
              </p>
              <Button onClick={handleNewCV}>
                Vytvořit první CV
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cvs.map((cv) => (
              <Card key={cv.id} className="overflow-hidden hover:shadow-lg transition-shadow !p-0 !gap-0">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 overflow-hidden">
                    {cv.thumbnailUrl ? (
                      <img
                        src={cv.thumbnailUrl}
                        alt={cv.cvName}
                        className="w-full h-auto block"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <svg
                          className="h-16 w-16 text-gray-300 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* CV Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate">
                      {cv.cvName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {TEMPLATE_NAMES[cv.templateType] || cv.templateType}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Upraveno: {formatDate(cv.updatedAt)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleEdit(cv)}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Upravit
                      </Button>
                      <Button
                        onClick={() => setDeleteId(cv.id)}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        size="sm"
                      >
                        Smazat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Smazat CV?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Opravdu chcete smazat toto CV? Tuto akci nelze vrátit zpět.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setDeleteId(null)}
                    variant="outline"
                  >
                    Zrušit
                  </Button>
                  <Button
                    onClick={() => handleDelete(deleteId)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Smazat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
