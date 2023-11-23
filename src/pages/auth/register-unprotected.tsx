// next
import Head from 'next/head';
// sections
import Register from '../../sections/auth/Register';

// ----------------------------------------------------------------------

export default function RegisterUnprotectedPage() {
  return (
    <>
      <Head>
        <title> Register Unprotected | PayPilot</title>
      </Head>

      <Register />
    </>
  );
}
