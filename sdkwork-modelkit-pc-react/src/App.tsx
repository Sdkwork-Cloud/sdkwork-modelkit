/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider } from '@sdkwork/modelkit-core';
import { ShopProvider } from '@sdkwork/modelkit-shop';
import { MainLayout } from './layouts/MainLayout';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AppProvider>
      <ShopProvider>
        <MainLayout />
        <Toaster theme="dark" position="bottom-right" />
      </ShopProvider>
    </AppProvider>
  );
}
