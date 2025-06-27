// frontend/src/stores/theme.store.js

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State: 'light', 'dark', atau 'system'. Diambil dari localStorage atau default ke 'system'.
  const theme = ref(localStorage.getItem('theme') || 'system');

  // Action untuk mengubah dan menyimpan tema
  function setTheme(newTheme) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
  }

  // Action untuk memutar tema (light -> dark -> system -> light)
  function toggleTheme() {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme.value);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  };
});
