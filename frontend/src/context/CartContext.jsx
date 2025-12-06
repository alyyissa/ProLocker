import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({children}) =>{
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if(storedCart){
            setCart(JSON.parse(storedCart))
        }
    },[])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (item) => {
        setCart((prev) =>{
            const existing = prev.find((i) => i.id === item.id)
            if(existing){
                return prev.map((i) =>
                i.id === item.id ? {...i, qty: i.qyy +1}:  1
                )
            }
            return [...prev, {...item, qty:1}] 
        }
    )
    }

    const removeFromCart = (id) =>{
        setCart((prev) => prev.filter((i) => i.id !== id))
    }

    const clearCart = () =>{
        setCart([])
    }

    return(
        <CartContext.Provider value={{cart, addToCart,removeFromCart,clearCart}}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
