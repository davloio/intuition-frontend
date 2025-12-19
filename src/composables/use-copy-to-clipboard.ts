import { ref } from 'vue';

export function useCopyToClipboard() {
  const copied = ref(false);
  const error = ref<string | null>(null);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      error.value = null;

      setTimeout(() => {
        copied.value = false;
      }, 2000);

      return true;
    } catch (err) {
      error.value = 'Failed to copy';
      console.error('Copy failed:', err);
      return false;
    }
  };

  return {
    copied,
    error,
    copyToClipboard,
  };
}
