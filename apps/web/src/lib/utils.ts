import { enqueueSnackbar } from 'notistack';

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => enqueueSnackbar('Link copied to clipboard', { variant: 'success' }))
    .catch(() => enqueueSnackbar('Link failed to copy', { variant: 'error' }));
}

export function formatMeetingCode(code: string) {
  return code.match(/.{1,3}/g).join('-');
}
