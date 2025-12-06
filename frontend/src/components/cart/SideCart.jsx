const SideCart = ({ show, onClose }) => {
return (
    <div
        className={`fixed top-0 right-0 h-full w-80 md:w-120 bg-cocoprimary shadow-2xl z-90 transform transition-transform duration-300
        ${show ? "translate-x-0" : "translate-x-full"}
        `}
    >
        <button onClick={onClose} className="absolute top-8 right-5 cursor-pointer">
        <i className="fa-solid fa-xmark text-2xl text-background"></i>
        </button>
    </div>
);
};

export default SideCart
