import { useState } from "react";
import { addEquipment } from "../../API/auth";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import InlineSpinner from "../components/ui/InlineSpinner";
import { isApiSuccess } from "../utils/apiResponse";

const Addequipment = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    src: "",
    equipmentName: "",
    description: "",
    rentRates: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await addEquipment(formData);
      if (isApiSuccess(data)) {
        showToast("Equipment added successfully", "success");
        navigate("/Equipment");
      } else {
        showToast(data?.message || "Equipment could not be added", "error");
      }
    } catch (error) {
      console.error("Error adding equipment:", error);
      showToast("An error occurred while adding the equipment.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

  return (
    <div className="mx-auto max-w-lg animate-fade-in-up px-4 py-10 sm:px-6 lg:py-14">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-brand-100 bg-white p-6 shadow-lg ring-1 ring-brand-50/50 sm:p-8"
        aria-busy={isLoading}
      >
        <h1 className="font-heading text-center text-2xl font-bold text-slate-900">Add equipment</h1>
        <label className="block text-lg font-medium text-slate-800">
          Equipment Name:
          <input
            type="text"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
            className={fieldClass}
            disabled={isLoading}
          />
        </label>
        <label className="block text-lg font-medium text-slate-800">
          Equipment Image:
          <input type="text" name="src" value={formData.src} onChange={handleChange} className={fieldClass} disabled={isLoading} />
        </label>
        <label className="block text-lg font-medium text-slate-800">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={fieldClass}
            disabled={isLoading}
          />
        </label>
        <label className="block text-lg font-medium text-slate-800">
          Amount:
          <input type="text" name="rentRates" value={formData.rentRates} onChange={handleChange} className={fieldClass} disabled={isLoading} />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-800 bg-gradient-to-r from-brand-600 to-brand-800 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-700 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-90 motion-reduce:transform-none"
        >
          {isLoading ? (
            <>
              <InlineSpinner className="h-5 w-5 text-white" />
              <span>Saving…</span>
            </>
          ) : (
            "Add"
          )}
        </button>
      </form>
    </div>
  );
};

export default Addequipment;
