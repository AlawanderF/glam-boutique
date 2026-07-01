import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { resizeImageFile, ACCEPTED_IMAGE_TYPES, MAX_AVATAR_FILE_SIZE_MB } from '@/utils/image';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, phone });
    showToast({ type: 'success', message: 'Dados atualizados com sucesso' });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast({ type: 'error', message: 'A nova senha deve ter ao menos 6 caracteres' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    showToast({ type: 'success', message: 'Senha alterada com sucesso' });
  };

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite selecionar o mesmo arquivo novamente depois
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      showToast({ type: 'error', message: 'Formato não suportado', description: 'Use JPG, PNG ou WEBP.' });
      return;
    }
    if (file.size > MAX_AVATAR_FILE_SIZE_MB * 1024 * 1024) {
      showToast({
        type: 'error',
        message: 'Arquivo muito grande',
        description: `O tamanho máximo é ${MAX_AVATAR_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const dataUrl = await resizeImageFile(file, { maxDimension: 480, quality: 0.85 });
      // Em produção: enviar `file` para um endpoint de upload (services/uploadService.ts)
      // e salvar a URL retornada (S3/Cloudinary/etc) em vez do data URL local.
      updateUser({ avatarUrl: dataUrl });
      showToast({ type: 'success', message: 'Foto de perfil atualizada' });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Não foi possível atualizar a foto',
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="border border-ink-200 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink-900">Dados pessoais</h2>

        <div className="mt-5 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-ink-100 font-display text-2xl text-ink-500">
              {isUploadingPhoto ? (
                <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
              ) : user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handlePhotoSelected}
              className="sr-only"
              aria-label="Selecionar foto de perfil"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              aria-label="Alterar foto de perfil"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-soft transition-colors hover:bg-gold-500 hover:text-ink-950 disabled:opacity-60"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">{name}</p>
            <p className="text-xs text-ink-500">Cliente desde 2024</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="link-underline mt-1 text-2xs font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-900 disabled:opacity-60"
            >
              Alterar foto
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          <FormField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormField label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(83) 99999-0000" />
          <div className="flex items-end sm:col-span-2">
            <Button type="submit" variant="primary">
              Salvar alterações
            </Button>
          </div>
        </form>
      </section>

      <section className="border border-ink-200 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink-900">Alterar senha</h2>
        <form onSubmit={handleChangePassword} className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Senha atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <FormField
            label="Nova senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex items-end sm:col-span-2">
            <Button type="submit" variant="secondary">
              Atualizar senha
            </Button>
          </div>
        </form>
      </section>

      <section className="border border-ink-200 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink-900">Preferências</h2>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex items-center gap-2.5 text-sm text-ink-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 text-ink-900 focus:ring-gold-500" />
            Quero receber novidades e promoções por e-mail
          </label>
          <label className="flex items-center gap-2.5 text-sm text-ink-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 text-ink-900 focus:ring-gold-500" />
            Quero receber atualizações de pedidos por WhatsApp
          </label>
        </div>
      </section>
    </div>
  );
}
