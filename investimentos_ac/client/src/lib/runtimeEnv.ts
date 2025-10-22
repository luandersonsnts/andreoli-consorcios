export const isStaticSite = import.meta.env.VITE_STATIC_SITE === 'true';

export function openWhatsAppWithMessage(message: string) {
  const phone = '5587981620542';
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
  window.open(url, '_blank');
}
