"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Application
        </Link>

        <div className="glass-card p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
              <Shield size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
              <p className="text-sm text-slate-400">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose-custom space-y-8">
            <Section title="1. Introduction">
              <p>
                Changan Motors Pakistan (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the
                Rejection Management System (&quot;the Application&quot;). This Privacy Policy explains
                how we collect, use, store, and protect your personal data in compliance with the
                General Data Protection Regulation (GDPR) and applicable data protection laws.
              </p>
              <p>
                By using this Application, you acknowledge that you have read and understood this
                Privacy Policy. If you do not agree with this policy, please do not use the Application.
              </p>
            </Section>

            <Section title="2. Data Controller">
              <p>
                The data controller responsible for your personal data is:<br />
                <strong className="text-white">Changan Motors Pakistan</strong><br />
                Contact: privacy@changanmotors.pk
              </p>
            </Section>

            <Section title="3. What Data We Collect">
              <p>We collect and process the following categories of personal data:</p>
              <ul>
                <li>
                  <strong className="text-white">User Identity Data:</strong> Your SAP user ID,
                  display name, and role — sourced from your SAP S/4HANA account when you log in.
                </li>
                <li>
                  <strong className="text-white">Rejection Document Data:</strong> Documents you
                  create, edit, or approve — including rejection IDs, model/batch details, department,
                  item descriptions, quantities, and approval workflow records.
                </li>
                <li>
                  <strong className="text-white">Audit Trail Data:</strong> Timestamps and user IDs
                  for document creation, modification, approval, and rejection actions.
                </li>
                <li>
                  <strong className="text-white">Functional Preferences:</strong> Your chosen theme
                  (dark/light mode), stored in browser localStorage only with your explicit consent.
                </li>
              </ul>
            </Section>

            <Section title="4. Legal Basis for Processing">
              <p>We process your personal data under the following legal bases (GDPR Article 6):</p>
              <ul>
                <li>
                  <strong className="text-white">Legitimate Interest (Art. 6(1)(f)):</strong> Processing
                  rejection documents is necessary for quality management operations at Changan Motors.
                </li>
                <li>
                  <strong className="text-white">Consent (Art. 6(1)(a)):</strong> Functional cookies
                  (theme preferences) are only stored after you give explicit consent via our cookie banner.
                </li>
                <li>
                  <strong className="text-white">Legal Obligation (Art. 6(1)(c)):</strong> Audit trail
                  data is retained to meet manufacturing quality compliance requirements.
                </li>
              </ul>
            </Section>

            <Section title="5. How We Use Your Data">
              <ul>
                <li>To operate the rejection document management workflow</li>
                <li>To route documents through the multi-level approval process</li>
                <li>To maintain audit trails for quality compliance and traceability</li>
                <li>To display your name and role within the application interface</li>
                <li>To remember your theme preference (only with consent)</li>
              </ul>
            </Section>

            <Section title="6. Data Storage and Security">
              <p>
                All rejection document data is stored in SAP S/4HANA Public Cloud, which is hosted
                in SAP-managed data centers with enterprise-grade security certifications
                (ISO 27001, SOC 1/2, GDPR compliance).
              </p>
              <ul>
                <li>All data transmission uses HTTPS/TLS encryption</li>
                <li>SAP credentials are stored server-side only — never exposed to the browser</li>
                <li>CSRF token protection is enforced on all write operations</li>
                <li>No personal data is stored in the browser except theme preference (with consent)</li>
                <li>No data is shared with third-party analytics or advertising services</li>
              </ul>
            </Section>

            <Section title="7. Data Retention">
              <p>
                Rejection documents and audit trails are retained as long as required by Changan Motors&apos;
                quality management policies and applicable manufacturing regulations. Theme preferences
                stored in your browser persist until you clear your browser data or withdraw consent.
              </p>
            </Section>

            <Section title="8. Your Rights Under GDPR">
              <p>As a data subject under GDPR, you have the following rights:</p>
              <ul>
                <li><strong className="text-white">Right of Access (Art. 15):</strong> Request a copy of your personal data</li>
                <li><strong className="text-white">Right to Rectification (Art. 16):</strong> Request correction of inaccurate data</li>
                <li><strong className="text-white">Right to Erasure (Art. 17):</strong> Request deletion of your data (subject to legal retention requirements)</li>
                <li><strong className="text-white">Right to Restriction (Art. 18):</strong> Request limited processing of your data</li>
                <li><strong className="text-white">Right to Data Portability (Art. 20):</strong> Receive your data in a machine-readable format</li>
                <li><strong className="text-white">Right to Object (Art. 21):</strong> Object to data processing based on legitimate interest</li>
                <li><strong className="text-white">Right to Withdraw Consent (Art. 7):</strong> Withdraw cookie consent at any time via the settings menu</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at <strong className="text-indigo-400">privacy@changanmotors.pk</strong>.
                We will respond within 30 days as required by GDPR.
              </p>
            </Section>

            <Section title="9. Cookies and Local Storage">
              <p>This Application uses the following storage mechanisms:</p>
              <table className="w-full text-sm mt-3 border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-slate-400 font-medium">Name</th>
                    <th className="text-left py-2 pr-4 text-slate-400 font-medium">Type</th>
                    <th className="text-left py-2 pr-4 text-slate-400 font-medium">Purpose</th>
                    <th className="text-left py-2 text-slate-400 font-medium">Consent</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-xs">gdpr_consent</td>
                    <td className="py-2 pr-4">localStorage</td>
                    <td className="py-2 pr-4">Stores your cookie consent preferences</td>
                    <td className="py-2 text-emerald-400">Necessary</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-xs">theme</td>
                    <td className="py-2 pr-4">localStorage</td>
                    <td className="py-2 pr-4">Remembers your dark/light mode choice</td>
                    <td className="py-2 text-amber-400">Functional</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy to reflect changes in our practices or legal
                requirements. When we make significant changes, we will notify you through the
                Application and request renewed consent where required.
              </p>
            </Section>

            <Section title="11. Contact">
              <p>
                For privacy-related inquiries or to exercise your GDPR rights:<br />
                Email: <strong className="text-indigo-400">privacy@changanmotors.pk</strong><br />
                You also have the right to lodge a complaint with your local Data Protection Authority.
              </p>
            </Section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-sm text-slate-400 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}
