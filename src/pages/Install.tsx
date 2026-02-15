import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Check, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-8">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Smartphone className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-3xl font-formal font-bold text-foreground">
          Install SSTU App
        </h1>
        <p className="text-muted-foreground text-lg">
          Get quick access to notices, events, results, and more — right from your home screen.
        </p>

        {isInstalled ? (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-3">
            <Check className="w-12 h-12 text-primary mx-auto" />
            <p className="text-primary font-semibold text-lg">App Already Installed!</p>
            <p className="text-muted-foreground text-sm">You can find SSTU on your home screen.</p>
          </div>
        ) : deferredPrompt ? (
          <Button size="lg" onClick={handleInstall} className="gap-2 text-lg px-8 py-6">
            <Download className="w-5 h-5" />
            Install Now
          </Button>
        ) : isIOS ? (
          <div className="bg-muted rounded-xl p-6 space-y-4 text-left">
            <p className="font-semibold text-center">Install on iPhone / iPad:</p>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3 items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Tap the <Share className="inline w-4 h-4 mx-1" /> Share button in Safari</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>Tap <strong>"Add"</strong> to confirm</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="bg-muted rounded-xl p-6 space-y-3">
            <p className="font-semibold">Install from your browser:</p>
            <p className="text-sm text-muted-foreground">
              Open this page in Chrome or Edge, then tap the menu (⋮) and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          {[
            { title: 'Offline Access', desc: 'Browse notices & info without internet' },
            { title: 'Fast & Lightweight', desc: 'No app store download required' },
            { title: 'Always Updated', desc: 'Get the latest content automatically' },
          ].map((f) => (
            <div key={f.title} className="bg-card border rounded-lg p-4 text-left">
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Install;
