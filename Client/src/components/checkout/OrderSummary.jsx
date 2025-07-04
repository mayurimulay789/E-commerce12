const OrderSummary = ({ items, subtotal, shipping, tax, total }) => {
  return (
    <div className="sticky p-6 bg-white rounded-lg shadow-sm top-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

      {/* Items */}
      <div className="mb-6 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center space-x-3">
            <img
              src={item.product?.images?.[0]?.url || "/placeholder.svg?height=50&width=50"}
              alt={item.product?.name}
              className="object-cover w-12 h-12 rounded-md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
              <p className="text-xs text-gray-600">
                {item.size} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST)</span>
          <span>₹{tax}</span>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="text-xs text-center text-gray-500">
        <div className="flex items-center justify-center mb-2 space-x-1">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure Checkout</span>
        </div>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  )
}

export default OrderSummary
