import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../services/products/productsService";


const highlight = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "ig");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-cocoprimary font-semibold">{part}</span>
    ) : (
      part
    )
  );
};

const placeholderTexts = [
  "What are you looking for?",
  "Search for the products you need",
  "Type and explore..."
];

const SearchBar = ({ scrolled }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = placeholderTexts[textIndex];
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + currentText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPlaceholder("");
        setCharIndex(0);
        setTextIndex((prev) => (prev + 1) % placeholderTexts.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, textIndex]);

  // Live search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await ProductService.search(query);
        setResults(data);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        const selectedProduct = results[activeIndex];
        navigate(`/products/${selectedProduct.slug}`);

        setQuery("");
        setPlaceholder("");
        setTextIndex(0);
        setCharIndex(0);
        setOpen(false);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Handle click on a product
  const handleSelectProduct = (slug) => {
    navigate(`/products/${slug}`);
    setQuery("");
    setPlaceholder("");
    setTextIndex(0);
    setCharIndex(0);
    setOpen(false);
  };

  return (
    <div className="relative text-gray-600">
      <input
        type="search"
        name="search"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={`pl-7 h-[45px] w-[400px] py-5 rounded-full text-md focus:outline-none bg-transparent backdrop-blur-md border ${
          scrolled
            ? "text-cocoprimary placeholder-gray-500 border-cocoprimary"
            : "text-background placeholder-gray-300 border-gray-300"
        }`}
      />

      <button type="submit" className="absolute right-0 top-0 mt-4 mr-4 text-background">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 56.966 56.966">
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23
            s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
            c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17
            s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-[55px] left-0 w-full bg-white rounded-xl shadow-xl z-50 overflow-hidden">
          {loading && <p className="p-4 text-sm text-gray-500">Searching...</p>}
          {!loading && results.length === 0 && <p className="p-4 text-sm text-gray-500">No results found</p>}
          {results.map((product, index) => (
            <div
              key={product.id}
              onMouseDown={() => handleSelectProduct(product.slug)}
              className={`flex items-center gap-6 p-3 cursor-pointer ${
                index === activeIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <img
                src={product.mainImage || "/placeholder.png"}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium">{highlight(product.name, query)}</p>
                {product.priceAfterSale &&
                  product.priceAfterSale < product.price && (
                    <span className="text-gray-400 line-through text-xs">
                      ${product.price}
                    </span>
                  )}
                  &nbsp;
                <span className="text-xs font-semibold">
                    ${product.priceAfterSale && product.priceAfterSale < product.price
                    ? product.priceAfterSale
                    : product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;