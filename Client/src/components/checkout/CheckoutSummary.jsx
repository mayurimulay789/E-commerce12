const CheckoutSummary = ({ items, subtotal, shipping, tax, total }) => {
  return (
    <div className="sticky p-6 bg-white rounded-lg shadow-sm top-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

      {/* Items */}
      <div className="mb-6 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={item.product?.images?.[0]?.url || "/placeholder.svg?height=50&width=50"}
                alt={item.product?.name}
                className="object-cover w-12 h-12 rounded-md"
              />
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-gray-900 rounded-full -top-2 -right-2">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
              <p className="text-xs text-gray-600">Size: {item.size}</p>
            </div>
            <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST 18%)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-gray-900">We Accept</h3>
        <div className="flex items-center space-x-2">
          <div className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">Razorpay</div>
          <div className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">UPI</div>
          <div className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded">Cards</div>
          <div className="px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded">Net Banking</div>
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
          <span>256-bit SSL Encrypted</span>
        </div>
        <p>Your payment information is safe and secure</p>
      </div>
    </div>
  )
}

export default CheckoutSummary
