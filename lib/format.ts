export const formatPrice = (price: number) => (
    new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "INR",
    }).format(price)
)