"use client";

import { useState } from "react";
import FilmForm from "@/components/film/FilmForm";
import { useRouter } from "next/navigation";
import BatchImportModal from "@/components/film/BatchImportModal";

export default function NewFilmPage() {
  const router = useRouter();
  const [showBatchModal, setShowBatchModal] = useState(false);

  return (
    <div className="p-4 md:p-6 flex flex-col text-center md:text-left">
      <div className="flex flex-col space-x-2 items-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Track A New Film</h1>
        <div className="flex">
          <button
            type="button"
            onClick={() => setShowBatchModal(true)}
            className="px-4 py-2 text-white bg-primary hover:text-background rounded hover:bg-neutral-mid transition-all duration-300 mb-4 cursor-pointer"
          >
            Import from TMDb
          </button>
        </div>
      </div>

      <BatchImportModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
      />
      <FilmForm
        onSuccess={() => {
          router.push("/films");
        }}
      />
    </div>
  );
}
