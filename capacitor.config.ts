import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.expense-man.netlify',
  appName: 'Expense Manager',
  webDir: 'dist',
  server: {
    cleartext: true
  },

};

export default config;
