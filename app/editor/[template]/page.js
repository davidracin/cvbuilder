"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { exportToPDF } from "../../../lib/pdfExportNew";
import { useToast } from "../../../components/Toast";
import { useCVData } from "../../../hooks/useCVData";
import { useAuth } from "../../../hooks/useAuth";
import { createCV, updateCV, getCV } from "../../../lib/firestoreCVs";
import EditorSidebar from "../../../components/editor/EditorSidebar";
import TemplateRenderer from "../../../components/editor/TemplateRenderer";
import { PenLine, Eye } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateSlug = params.template;
  const { addToast, ToastContainer } = useToast();
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState(false);

  const { 
    cvData, 
    cvId, 
    cvName, 
    setCVName, 
    updateCvData, 
    addItem, 
    removeItem, 
    reorderItems,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    reorderCustomSectionItems,
    updateDesignSettings,
    resetDesignSettings,
    getDesignSettings,
    loadCV 
  } = useCVData();

  // Memoize design settings - recalculates when designSettings in cvData changes
  const designSettings = useMemo(
    () => getDesignSettings(templateSlug), 
    [getDesignSettings, templateSlug]
  );

  // Validation helpers
  const validateUserForSave = useCallback(() => {
    if (!user) {
      addToast('Musíte být přihlášeni', 'error');
      router.push('/login');
      return false;
    }
    if (!user.emailVerified) {
      addToast(
        'Pro uložení CV musíte nejprve ověřit svůj email. ' +
        'Zkontrolujte svou emailovou schránku nebo přejděte do nastavení ' +
        'pro opětovné odeslání ověřovacího emailu.', 
        'error'
      );
      return false;
    }
    if (profile && profile.gdprConsent === false) {
      addToast(
        'Odvolali jste souhlas se zpracováním osobních údajů. ' +
        'Ukládání CV je zablokované. Obnovřte souhlas v Nastavení.',
        'error'
      );
      return false;
    }
    return true;
  }, [user, profile, addToast, router]);

  // Firestore operations
  const loadCVFromFirestore = useCallback(async (id) => {
    const { cv, error } = await getCV(id);
    
    if (error) {
      addToast('Chyba při načítání CV', 'error');
      return;
    }
    
    const hasAccess = cv && cv.userId === user?.uid;
    if (!hasAccess) {
      addToast('Nemáte oprávnění k tomuto CV', 'error');
      router.push('/');
      return;
    }
    
    loadCV(cv.cvData, cv.id, cv.cvName);
  }, [addToast, loadCV, router, user?.uid]);

  const saveExistingCV = useCallback(async () => {
    const { error } = await updateCV(cvId, cvData, cvName);
    if (error) {
      addToast('Chyba při ukládání', 'error');
      return null;
    }
    return cvId;
  }, [cvId, cvData, cvName, addToast]);

  const createNewCV = useCallback(async () => {
    const { id, cvName: generatedName, error } = await createCV(
      user.uid, 
      cvData, 
      templateSlug, 
      cvName || null
    );
    
    if (error) {
      addToast('Chyba při vytváření CV', 'error');
      return null;
    }
    
    loadCV(cvData, id, generatedName);
    router.replace(`/editor/${templateSlug}?cvId=${id}`);
    return id;
  }, [user?.uid, cvData, templateSlug, cvName, addToast, loadCV, router]);

  // Thumbnail generation
  const generateAndSaveThumbnail = useCallback(async (savedCvId) => {
    if (!savedCvId) return;
    try {
      const { generateThumbnailFromId } = await import('../../../lib/thumbnailService');
      const { updateThumbnailUrl } = await import('../../../lib/firestoreCVs');
      const thumbnailBase64 = await generateThumbnailFromId('cv-page');
      if (thumbnailBase64) await updateThumbnailUrl(savedCvId, thumbnailBase64);
    } catch {
      // Thumbnail failed silently
    }
  }, []);

  // Main action handlers
  const handleSave = useCallback(async () => {
    if (!validateUserForSave()) return;

    setSaving(true);

    const savedCvId = cvId 
      ? await saveExistingCV() 
      : await createNewCV();

    if (savedCvId) {
      await generateAndSaveThumbnail(savedCvId);
      addToast(cvId ? 'CV uloženo' : 'CV vytvořeno', 'success');
    }

    setSaving(false);
  }, [validateUserForSave, cvId, saveExistingCV, createNewCV, generateAndSaveThumbnail, addToast]);

  const handleExport = useCallback(async (filename) => {
    try {
      const success = await exportToPDF(cvData, templateSlug, filename, designSettings);
      
      if (!success) {
        addToast('Nepodařilo se exportovat CV. Zkuste to prosím znovu.', 'error');
        return false;
      }

      addToast('CV bylo úspěšně exportováno do PDF!', 'success');
      
      // Update export timestamp if CV is saved
      if (cvId) {
        const { updateLastExported } = await import('../../../lib/firestoreCVs');
        await updateLastExported(cvId);
      }
      
      return true;
    } catch (error) {
      addToast('Došlo k chybě při exportu PDF. Zkuste to prosím znovu.', 'error');
      return false;
    }
  }, [cvData, templateSlug, designSettings, cvId, addToast]);

  const handleResetDesign = useCallback(() => {
    resetDesignSettings(templateSlug);
    addToast('Design resetován na výchozí nastavení', 'success');
  }, [resetDesignSettings, templateSlug, addToast]);

  // Effects
  const hasInitializedUserData = useRef(false);

  // Auto-fill name & email from user profile for new CVs (no cvId in URL)
  useEffect(() => {
    if (searchParams.get('cvId') || !profile || hasInitializedUserData.current) return;
    hasInitializedUserData.current = true;
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
    if (fullName) updateCvData('personal', 'name', fullName);
    if (user?.email) updateCvData('personal', 'email', user.email);
  }, [profile, searchParams, updateCvData, user]);

  // Load CV from URL parameter on mount (only once)
  useEffect(() => {
    const cvIdFromUrl = searchParams.get('cvId');
    // Only load if URL has cvId, user is logged in, and we haven't already loaded this CV
    if (cvIdFromUrl && user && cvId !== cvIdFromUrl) {
      loadCVFromFirestore(cvIdFromUrl);
    }
  }, [searchParams, user, cvId, loadCVFromFirestore]);

  // Mobile view toggle
  const [mobileView, setMobileView] = useState('edit');

  // Preview scaling for mobile
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth;
      const padding = 32; // 16px each side
      const availableWidth = containerWidth - padding;
      const scale = Math.min(1, availableWidth / 794);
      setPreviewScale(scale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [mobileView]);

  // Render
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Mobile toggle bar */}
      <div className="lg:hidden flex border-b border-sidebar-border bg-sidebar shrink-0">
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileView === 'edit'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
          }`}
        >
          <PenLine className="size-4" />
          Upravit
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileView === 'preview'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
          }`}
        >
          <Eye className="size-4" />
          Náhled
        </button>
      </div>

      {/* Sidebar - full width on mobile, 1/3 on desktop */}
      <div className={`w-full lg:w-1/3 ${
        mobileView === 'edit' ? 'flex-1 overflow-y-auto' : 'hidden'
      } lg:block lg:overflow-y-auto`}>
        <EditorSidebar
          cvName={cvName}
          setCVName={setCVName}
          cvId={cvId}
          templateSlug={templateSlug}
          user={user}
          profile={profile}
          saving={saving}
          onSave={handleSave}
          onExport={handleExport}
          onResetDesign={handleResetDesign}
          cvData={cvData}
          designSettings={designSettings}
          updateCvData={updateCvData}
          addItem={addItem}
          removeItem={removeItem}
          reorderItems={reorderItems}
          addCustomSection={addCustomSection}
          updateCustomSection={updateCustomSection}
          removeCustomSection={removeCustomSection}
          addCustomSectionItem={addCustomSectionItem}
          updateCustomSectionItem={updateCustomSectionItem}
          removeCustomSectionItem={removeCustomSectionItem}
          reorderCustomSectionItems={reorderCustomSectionItems}
          updateDesignSettings={updateDesignSettings}
        />
      </div>

      {/* Preview area - full width on mobile, 2/3 on desktop */}
      <div
        ref={previewContainerRef}
        className={`w-full lg:w-2/3 overflow-x-auto lg:overflow-x-hidden p-4 lg:p-6 bg-gray-100 ${
          mobileView === 'preview'
            ? 'flex-1 flex flex-col items-center overflow-y-auto'
            : 'hidden'
        } lg:flex lg:flex-col lg:items-center lg:overflow-y-auto`}
      >
        {/* Wrapper constrains layout height to the scaled CV size */}
        <div
          style={{
            width: previewScale < 1 ? `${794 * previewScale}px` : '794px',
            height: previewScale < 1 ? `${1123 * previewScale}px` : 'auto',
            minHeight: previewScale < 1 ? undefined : '1123px',
            position: 'relative',
          }}
        >
          <div
            id="cv-page"
            className="shadow-lg"
            style={{
              backgroundColor: designSettings.colors.background,
              width: '794px',
              minHeight: '1123px',
              padding: '40px',
              border: '1px solid #e5e7eb',
              position: previewScale < 1 ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              transform: previewScale < 1 ? `scale(${previewScale})` : undefined,
              transformOrigin: 'top left',
            }}
          >
            <TemplateRenderer
              templateSlug={templateSlug}
              data={cvData}
              designSettings={designSettings}
            />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
