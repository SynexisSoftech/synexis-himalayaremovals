"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateServiceForm() {
  const [title, setTitle] = useState("");
  const [subServices, setSubServices] = useState([{ title: "" }]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddSubService = () => {
    setSubServices([...subServices, { title: "" }]);
  };

  const handleRemoveSubService = (index: number) => {
    const updated = [...subServices];
    updated.splice(index, 1);
    setSubServices(updated);
  };

  const handleChangeSubService = (index: number, value: string) => {
    const updated = [...subServices];
    updated[index].title = value;
    setSubServices(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || subServices.some((s) => !s.title.trim())) {
      setError("Please provide service title and all subservice titles.");
      return;
    }

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, subServices }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create service.");
        return;
      }

      setTitle("");
      setSubServices([{ title: "" }]);
      router.refresh();
      alert("Service created successfully!");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Create Service</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Title */}
        <div>
          <label className="block font-medium mb-1">Service Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Removal"
            required
          />
        </div>

        {/* SubServices */}
        <div>
          <label className="block font-medium mb-1">Subservices</label>
          {subServices.map((sub, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={sub.title}
                onChange={(e) =>
                  handleChangeSubService(index, e.target.value)
                }
                className="flex-1 border rounded px-3 py-2"
                placeholder={`Subservice ${index + 1}`}
                required
              />
              {subServices.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSubService(index)}
                  className="px-2 text-red-600 hover:underline"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSubService}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add another subservice
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Service
        </button>
      </form>
    </div>
  );
}
