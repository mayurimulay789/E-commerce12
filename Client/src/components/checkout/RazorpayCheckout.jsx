"use client"

const RazorpayCheckout = ({ onPayment, isProcessing, total }) => {
  return (
    <div className="pt-6 border-t">
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment</h3>

        <div className="p-4 mb-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">Secure Payment with Razorpay</h4>
              <p className="text-sm text-blue-700">
                Pay securely using credit/debit cards, UPI, net banking, or digital wallets
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
          <div className="flex items-center justify-center p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Visa</span>
          </div>
          <div className="flex items-center justify-center p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Mastercard</span>
          </div>
          <div className="flex items-center justify-center p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">UPI</span>
          </div>
          <div className="flex items-center justify-center p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Net Banking</span>
          </div>
        </div>
      </div>

      <div className="p-4 mb-6 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onPayment}
        disabled={isProcessing}
        className="flex items-center justify-center w-full py-4 font-semibold text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Pay ₹{total.toLocaleString()}
          </>
        )}
      </button>

      <div className="mt-4 text-xs text-center text-gray-500">
        <p>
          By clicking "Pay", you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default RazorpayCheckout
