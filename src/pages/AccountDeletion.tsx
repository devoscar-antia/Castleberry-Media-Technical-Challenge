import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Mail, AlertTriangle, Database, ShieldCheck } from "lucide-react";

const AccountDeletion = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6 pt-8 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Account Deletion</h1>
          </div>

          <p className="text-muted-foreground">
            We're sorry to see you go. This page explains what data we store, what will be permanently deleted, and how
            to request account deletion.
          </p>

          {/* Step 1: Data we collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Step 1: Understand the data we store</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              When you use KOL, we collect and store the following information associated with your account:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li>
                <strong>Profile information:</strong> Display name, avatar URL (from LinkedIn)
              </li>
              <li>
                <strong>LinkedIn OAuth token:</strong> Used to publish posts on your behalf (encrypted, expires
                periodically)
              </li>
              <li>
                <strong>Preferences:</strong> Selected industries, keywords, regions, languages, and trusted media
                sources
              </li>
              <li>
                <strong>Generated posts:</strong> AI-generated LinkedIn post drafts and published posts
              </li>
              <li>
                <strong>Saved articles:</strong> Articles you've bookmarked or interacted with
              </li>
              <li>
                <strong>Activity data:</strong> Weekly goals, streaks, and monthly points
              </li>
              <li>
                <strong>Device tokens:</strong> Push notification tokens for your mobile devices
              </li>
              <li>
                <strong>Consent records:</strong> Records of terms acceptance
              </li>
            </ul>
          </section>

          {/* Step 2: What gets deleted */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-semibold text-foreground">Step 2: What will be permanently deleted</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Upon account deletion, <strong>all</strong> of the following data will be permanently removed and cannot
              be recovered:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li>Your profile and all personal information</li>
              <li>Your LinkedIn OAuth token</li>
              <li>All your preferences and settings</li>
              <li>All generated posts (drafts, scheduled, and published records)</li>
              <li>All saved/bookmarked articles</li>
              <li>Your activity history (streaks, goals, points)</li>
              <li>All device tokens and push notification registrations</li>
              <li>Any trusted sources you've added</li>
              <li>Your consent records</li>
            </ul>
            <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">
                This action is irreversible. Once your account is deleted, there is no way to restore your data.
              </p>
            </div>
          </section>

          {/* Step 3: How to request */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Step 3: Request account deletion</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              To request the deletion of your account, please send an email with the following details:
            </p>
            <div className="p-4 rounded-md border bg-muted/50 space-y-2">
              <p className="text-sm text-foreground">
                <strong>To:</strong>{" "}
                <a
                  href="mailto:david.romero@castleberrymedia.co?subject=KOL%20Account%20Deletion%20Request"
                  className="text-primary underline"
                >
                  david.romero@castleberrymedia.co
                </a>
              </p>
              <p className="text-sm text-foreground">
                <strong>Subject:</strong> KOL Account Deletion Request
              </p>
              <p className="text-sm text-foreground">
                <strong>Body:</strong> Include the email address associated with your LinkedIn account connected to KOL.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              We will process your request and permanently delete all your data within 30 days of receiving your email.
            </p>
          </section>

          {/* Step 4: Confirmation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Step 4: Confirmation</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Once your account has been successfully deleted, you will receive a confirmation email. After deletion,
              all generated data, posts, and user preferences will be permanently removed. You can reconnect with KOL in
              the future, but your account will be reset from scratch. Please note: your LinkedIn account will not be
              affected by this process.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDeletion;
