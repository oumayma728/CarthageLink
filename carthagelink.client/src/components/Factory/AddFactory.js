import { useState } from "react";
import Form from "../../components/ui/Form.jsx";
import { CheckCircle, Copy, AlertCircle } from "lucide-react";

export default function AddFactory() {
  const [entry, setEntry] = useState({
    Name: "",
    Description: "",
    TaxNumber: "",
    Location: "",
    FactoryEmail: "",
    AssignedDevices: []
  });
  const [showModal, setShowModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const factoryFields = [
    { label: "Factory Name", name: "Name", type: "text", required: true },
    { label: "Description", name: "Description", type: "text" },
    { label: "Tax Number", name: "TaxNumber", type: "text", required: true },
    { label: "Location", name: "Location", type: "text", required: true },
    { label: "Factory Email", name: "FactoryEmail", type: "email", required: true },
    {
      label: "Assigned Devices",
      name: "AssignedDevices",
      type: "text",
      helperText: "devices"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntry(prev => ({
      ...prev,
      [name]: name === "AssignedDevices"
        ? (value ? value.split(",") : [])
        : value,
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(licenseKey);
    alert("License key copied to clipboard!");
  };

  const addNewFactory = () => {
    setIsSubmitting(true);
    setError(null);
  
    fetch("https://localhost:7086/api/Factory", {
      method: "POST",
      body: JSON.stringify(entry),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          // Detect if it's a duplicate email error
          if (data.message && data.message.toLowerCase().includes("email")) {
            throw new Error("This email already exists. Please use a different email.");
          }
          throw new Error(data.message || "Failed to add factory");
        }
        return data;
      })
      .then((data) => {
        setLicenseKey(data.licenseKey);
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Error adding new Factory:", err);
        setError(err.message || "Failed to add Factory. Please try again later.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  return (
    <div className="min-h-screen bg-surface-container-low py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className={`bg-surface-container rounded-xl shadow-xs p-6 sm:p-8 transition-all ${licenseKey ? 'max-w-2xl' : ''}`}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-on-surface">Add New Factory</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Register a new factory to manage devices and operations
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-error-container text-on-error-container flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error creating factory</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {licenseKey && showModal ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-zinc-900 w-full max-w-md mx-auto rounded-2xl shadow-2xl p-6 space-y-6 transition-all duration-300 scale-100">
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Factory Created!</h2>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your factory has been registered successfully. Save the license key below for authentication.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    License Key
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-md bg-gray-100 dark:bg-zinc-800 font-mono text-sm text-gray-800 dark:text-gray-200 break-all border">
                      {licenseKey}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition"
                      title="Copy license key"
                    >
                      <Copy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => window.location = "/Factory"}
                    className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                  >
                    View All Factories
                  </button>
                  <button
                    onClick={() => {
                      setLicenseKey("");
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
                  >
                    Add Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Form
              fields={factoryFields}
              values={entry}
              onChange={handleInputChange}
              onSubmit={addNewFactory}
              buttonText="Create Factory"
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
