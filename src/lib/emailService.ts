import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'service_globalforests';
const TEMPLATE_ID = 'template_invite';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // You need to replace this with your actual EmailJS public key

interface EmailParams {
  to_email: string;
  from_name: string;
  message: string;
}

export const sendInvitationEmail = async (params: EmailParams) => {
  try {
    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    const templateParams = {
      to_email: params.to_email,
      from_name: params.from_name,
      message: params.message,
      reply_to: "noreply@globalforests.org"
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    return response;
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.message.includes('Invalid public key')) {
      throw new Error('Email service not properly configured. Please contact support.');
    }
    throw new Error(error.message || 'Failed to send invitation email. Please try again.');
  }
};