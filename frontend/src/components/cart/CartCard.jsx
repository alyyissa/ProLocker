import React from 'react'

const CartCard = ({item, onIncrement, onDecrement, onRemove}) => {
return (
        <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
            <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded"
            />
            <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button
            onClick={() => onDecrement(item.id)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
            -
            </button>
            <span className="px-2">{item.qty}</span>
            <button
            onClick={() => onIncrement(item)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
            +
            </button>
            <button
            onClick={() => onRemove(item.id)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
            Remove
            </button>
        </div>
        </div>
)
}

export default CartCard
