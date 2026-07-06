import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';
import { registerServices } from '@sdkwork/modelkit-services';
import { bootstrapApplication } from './bootstrap';
import { AuthGate } from './AuthGate';

bootstrapApplication();
registerServices();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthGate>
      <App />
    </AuthGate>
  </StrictMode>,
);
