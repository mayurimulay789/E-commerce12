"use client"

const PaymentMethods = ({ selectedMethod, onSelect, onBack }) => {
  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Pay securely with credit/debit cards, UPI, net banking",
      icon: "💳",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when your order is delivered",
      icon: "💵",
      disabled: true,
    },
  ]

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
        <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          ← Back to Address
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              method.disabled
                ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                : selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => !method.disabled && onSelect(method.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{method.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
                {method.disabled && <p className="mt-1 text-sm text-red-600">Coming Soon</p>}
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod === method.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                }`}
              >
                {selectedMethod === method.id && <div className="w-full h-full scale-50 bg-white rounded-full"></div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <button
          onClick={() => onSelect(selectedMethod)}
          className="w-full py-3 mt-6 font-semibold text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
        >
          Continue to Review
        </button>
      )}
    </div>
  )
}

export default PaymentMethods
