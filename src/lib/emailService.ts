import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_globalforests';
const TEMPLATE_ID = 'template_invite';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

interface EmailParams {
  to_email: string;
  from_name: string;
  message: string;
}

export const sendInvitationEmail = async (params: EmailParams) => {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, {
      publicKey: PUBLIC_KEY,
    });
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};