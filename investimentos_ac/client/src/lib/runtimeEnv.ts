export const isStaticSite = import.meta.env.VITE_STATIC_SITE === 'true';

export const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '5574981213461';

export function openWhatsAppWithMessage(message: string) {
  const phone = whatsappPhone;
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
  window.open(url, '_blank');
}

export function formatNationalPhoneE164ToBR(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('55') ? digits.slice(2) : digits;
  if (local.length === 11) {
    const ddd = local.slice(0, 2);
    const first = local.slice(2, 7);
    const last = local.slice(7);
    return `(${ddd}) ${first}-${last}`;
  }
  return phone;
}
