import React from 'react';
import { Box, Paper, Typography, Container, Divider } from '@mui/material';

export default function Privacy() {
    return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, bgcolor: '#f8fafb' }}>
        <Typography variant="h3" fontWeight={800} sx={{ mb: 2, color: 'primary.main', textAlign: 'center' }}>
          Privacy Policy
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          At <b>ShopNow</b>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          Information We Collect
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We may collect personal information such as your name, email address, shipping address, and payment details when you register, place an order, or contact us. We also collect non-personal data like browser type, device, and usage statistics to improve your experience.
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          How We Use Your Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We use your information to:
          <ul style={{ marginTop: 8, marginBottom: 8 }}>
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your account or orders</li>
            <li>Improve our website and services</li>
            <li>Send you updates, promotions, and marketing (you can opt out anytime)</li>
            <li>Comply with legal obligations</li>
</ul>
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          Cookies & Tracking
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We use cookies and similar technologies to personalize your experience, analyze site traffic, and improve our services. You can control cookies through your browser settings.
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          Data Security
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We take reasonable measures to protect your information from unauthorized access, loss, or misuse. However, no method of transmission over the Internet is 100% secure.
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          Your Rights
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at <b>support@shopnow.com</b>.
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          Changes to This Policy
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We may update this Privacy Policy from time to time. We encourage you to review it regularly.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} ShopNow. All rights reserved.
        </Typography>
      </Paper>
    </Container>
  );
}
