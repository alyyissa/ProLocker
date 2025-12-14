import { useState } from "react";
import SearchBar from "./SearchBar";

const MobileSearch = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="md:hidden">
        🔍
      </button>

      {open && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <button onClick={() => setOpen(false)} className="mb-4">
            ✕ Close
          </button>

          <SearchBar />
        </div>
      )}
    </>
  );
};

export default MobileSearch;
