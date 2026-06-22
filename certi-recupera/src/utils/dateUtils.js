// utilitarios usados para trabalhar com datas dos certificados

export const BASE_DATE_STR = '2026-06-21';
export const BASE_DATE = new Date(BASE_DATE_STR + 'T00:00:00');

// verifica se o certificado ja venceu

export function isExpired(dateString) {
  const expiry = new Date(dateString + 'T00:00:00');
  return expiry < BASE_DATE;
}

// verifica se ainda esta valido

export function isActive(dateString) {
  const expiry = new Date(dateString + 'T00:00:00');
  return expiry >= BASE_DATE;
}

// ve se esta perto de vencer

export function isExpiringSoon(dateString) {
  const expiry = new Date(dateString + 'T00:00:00');
  const diffTime = expiry - BASE_DATE;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 7;
}

// converte data para formato brasileiro

export function formatDate(dateString) {
  if (!dateString) return '';

  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
}

// calcula quantos dias faltam para vencer

export function daysRemaining(dateString) {
  const expiry = new Date(dateString + 'T00:00:00');
  const diffTime = expiry - BASE_DATE;

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}