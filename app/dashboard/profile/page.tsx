"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Account {
  id: string;
  sourceName: string;
  connected: boolean;
  lastUploaded: string | null;
  createdAt: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAccountId, setUploadingAccountId] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/accounts");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch accounts");
      }
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchAccounts();
  }, [status, fetchAccounts]);

  const openFilePicker = (accountId?: string) => {
    if (accountId) setUploadingAccountId(accountId);
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const accountId = uploadingAccountId || accounts[0]?.id;
    if (!accountId) {
      setUploadMessage({ type: "error", text: "No account available to attach the CSV to." });
      e.target.value = "";
      setUploadingAccountId(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadMessage({ type: "error", text: "Please select a CSV file" });
      e.target.value = "";
      setUploadingAccountId(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage({ type: "error", text: "File size must be less than 10MB" });
      e.target.value = "";
      setUploadingAccountId(null);
      return;
    }

    setUploadMessage(null);
    setUploadingAccountId(accountId);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("accountId", accountId);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadMessage({ type: "success", text: `Successfully uploaded ${file.name}` });
      await fetchAccounts();
    } catch (err) {
      setUploadMessage({ type: "error", text: err instanceof Error ? err.message : "Upload failed" });
      console.error("Upload error:", err);
    } finally {
      setUploadingAccountId(null);
      e.target.value = "";
      setTimeout(() => setUploadMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information, data sources, and account security.</p>
        </div>

        {uploadMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${uploadMessage.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            {uploadMessage.type === "success" ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <p className={uploadMessage.type === "success" ? "text-green-900" : "text-red-900"}>{uploadMessage.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Bank Statement CSV
                </h2>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload CSV Bank Statement</p>

                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => openFilePicker()} className="text-sm text-blue-600 hover:text-blue-800">Choose File</button>
                    <span className="text-xs text-gray-500">or attach to an account below</span>
                  </div>

                  <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">You can also select an account below and then upload a CSV specifically for that account.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Your Accounts</h3>
                  {loading ? (
                    <div className="flex items-center gap-2 text-gray-600"><Loader2 className="animate-spin" /> Loading accounts...</div>
                  ) : accounts.length === 0 ? (
                    <p className="text-gray-600">No accounts found.</p>
                  ) : (
                    <div className="space-y-2">
                      {accounts.map((acct) => (
                        <div key={acct.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{acct.sourceName}</div>
                            <div className="text-sm text-gray-500">Last uploaded: {acct.lastUploaded ? new Date(acct.lastUploaded).toLocaleString() : 'Never'}</div>
                          </div>
                          <div>
                            <button onClick={() => openFilePicker(acct.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                              {uploadingAccountId === acct.id ? 'Uploading...' : 'Upload CSV'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Change Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
}
