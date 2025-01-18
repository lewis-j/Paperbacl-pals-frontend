import React from "react";
import styles from "./PrivacyPolicy.module.scss";
import { Container } from "../../lib/BootStrap";

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <Container>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Paperback Pals ("we," "our," or "us"). We are committed
            to protecting your privacy and ensuring you have a positive
            experience on our book-sharing platform.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li>Account information (name, email, username)</li>
            <li>Personal library information and book collections</li>
            <li>Friend connections and network information</li>
            <li>Messages and communications with other users</li>
            <li>Book transaction history and status updates</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Usage patterns and preferences</li>
            <li>Real-time interaction data through Socket.io</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Facilitate book sharing and borrowing between users</li>
            <li>Process and track book transactions</li>
            <li>Send notifications about book requests and status updates</li>
            <li>Enable friend connections and messaging</li>
            <li>Authenticate users through Firebase</li>
            <li>Improve our services and user experience</li>
            <li>Ensure platform security and prevent abuse</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Information Sharing</h2>
          <p>We share your information with:</p>
          <ul>
            <li>Other users (as necessary for platform functionality)</li>
            <li>Service providers (Firebase, MongoDB, Cloudinary)</li>
            <li>Third-party APIs (Google Books API)</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className={styles.section}>
          <h2>5. Data Security</h2>
          <p>We protect your data through:</p>
          <ul>
            <li>Firebase Authentication</li>
            <li>JWT token security</li>
            <li>Encrypted data storage</li>
            <li>Secure Socket.io connections</li>
            <li>Regular security audits</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Export your library data</li>
            <li>Opt-out of non-essential communications</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Maintain user sessions</li>
            <li>Remember preferences</li>
            <li>Analyze platform usage</li>
            <li>Improve user experience</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Children's Privacy</h2>
          <p>
            Paperback Pals is not intended for children under 13. We do not
            knowingly collect information from children under 13.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you
            of any material changes through the platform or via email.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or your data, please
            contact us at:
          </p>
          <p>Email: privacy@paperbackpals.com</p>
          <p>Address: [Your Business Address]</p>
        </section>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
