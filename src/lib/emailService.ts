import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_globalforests';
const TEMPLATE_ID = 'template_invite';
const PUBLIC_KEY = 'jSPJyGYhYGWvKz5Xt'; // Replace with your actual EmailJS public key

interface EmailParams {
  to_email: string;
  from_name: string;
  message: string;
}

export const sendInvitationEmail = async (params: EmailParams) => {
  try {
    const templateParams = {
      to_email: params.to_email,
      from_name: params.from_name,
      message: params.message,
      reply_to: "noreply@globalforests.org"
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send invitation email. Please try again.');
  }
};