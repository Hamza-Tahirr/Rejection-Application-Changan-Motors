"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
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
              <FileText size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
              <p className="text-sm text-slate-400">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose-custom space-y-8">
            <Section title="1. Acceptance of Terms">
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
                Rejection Management System (&quot;the Application&quot;) provided by Changan Motors
                Pakistan (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing or using the
                Application, you agree to be bound by these Terms. If you do not agree, do not use
                the Application.
              </p>
            </Section>

            <Section title="2. Authorized Use">
              <p>
                The Application is intended exclusively for authorized employees, contractors, and
                partners of Changan Motors Pakistan who have been granted SAP S/4HANA system access.
                You must not share your access credentials with unauthorized individuals.
              </p>
              <ul>
                <li>You must use the Application only for legitimate quality management purposes</li>
                <li>You must not attempt to bypass security controls or access restrictions</li>
                <li>You must not use the Application to process, store, or transmit data unrelated to rejection management</li>
                <li>You are responsible for all actions performed under your user account</li>
              </ul>
            </Section>

            <Section title="3. Data Accuracy">
              <p>
                You are responsible for ensuring the accuracy of all data you enter into the Application,
                including rejection document details, item information, and approval decisions. Inaccurate
                data may impact quality compliance records and manufacturing processes.
              </p>
            </Section>

            <Section title="4. Intellectual Property">
              <p>
                The Application, including its design, codebase, and user interface, is the intellectual
                property of Changan Motors Pakistan. You may not reproduce, distribute, modify, or create
                derivative works from any part of the Application without written permission.
              </p>
            </Section>

            <Section title="5. System Availability">
              <p>
                We aim to maintain Application availability but do not guarantee uninterrupted access.
                The Application depends on SAP S/4HANA Public Cloud services, and availability may be
                affected by scheduled maintenance, system updates, or third-party service disruptions.
              </p>
            </Section>

            <Section title="6. Data Protection">
              <p>
                Our handling of personal data is governed by our{" "}
                <Link href="/privacy" className="text-indigo-400 hover:underline">
                  Privacy Policy
                </Link>
                , which forms part of these Terms. We process data in accordance with the General Data
                Protection Regulation (GDPR) and applicable local data protection laws.
              </p>
            </Section>

            <Section title="7. Limitation of Liability">
              <p>
                To the maximum extent permitted by applicable law, Changan Motors Pakistan shall not be
                liable for any indirect, incidental, special, consequential, or punitive damages arising
                from your use of the Application, including but not limited to data loss, business
                interruption, or manufacturing delays.
              </p>
            </Section>

            <Section title="8. Indemnification">
              <p>
                You agree to indemnify and hold harmless Changan Motors Pakistan and its officers,
                directors, employees, and agents from any claims, damages, or expenses arising from
                your violation of these Terms or misuse of the Application.
              </p>
            </Section>

            <Section title="9. Modifications">
              <p>
                We reserve the right to modify these Terms at any time. Continued use of the Application
                after changes constitutes acceptance of the modified Terms. We will notify users of
                significant changes through the Application.
              </p>
            </Section>

            <Section title="10. Governing Law">
              <p>
                These Terms are governed by the laws of Pakistan and applicable international data
                protection regulations including GDPR. Any disputes shall be resolved through the
                competent courts of Pakistan.
              </p>
            </Section>

            <Section title="11. Contact">
              <p>
                For questions about these Terms:<br />
                Email: <strong className="text-indigo-400">legal@changanmotors.pk</strong>
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
