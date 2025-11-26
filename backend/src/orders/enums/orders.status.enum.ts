export const OrderStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    DELIVERD: 'DELIVERED',
    DECLINED: 'DECLINED'
} as const

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus]