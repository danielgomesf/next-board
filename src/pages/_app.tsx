import type { AppProps } from 'next/app';
import '../styles/global.scss';
import { Header } from '../components/Header';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  "client-id": "AeOSQSjfCnPUWgn14IUJwQiS1T9lEaG-3x86k7AfqRSD9fbIMUojLfMfhLuQP0AtSsXsRNUlG0CKzbmi",
  currency: "BRL",
  intent: "capture"
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  )
}
