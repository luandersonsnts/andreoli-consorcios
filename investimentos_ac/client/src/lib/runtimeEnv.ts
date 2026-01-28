export const isStaticSite = import.meta.env.VITE_STATIC_SITE === 'true';

export const whatsappPhone = '5574981213461';

export function openWhatsAppWithMessage(message: string) {
  const url = getWhatsAppUrlWithMessage(message);
  window.open(url, '_blank');
}

export function getWhatsAppUrlWithMessage(message: string) {
  const phone = whatsappPhone;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
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
