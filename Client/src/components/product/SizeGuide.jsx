"use client"

import { useState } from "react"

const SizeGuide = () => {
  const [isOpen, setIsOpen] = useState(false)

  const sizeChart = [
    { size: "XS", chest: "32-34", waist: "26-28", length: "26" },
    { size: "S", chest: "36-38", waist: "30-32", length: "27" },
    { size: "M", chest: "40-42", waist: "34-36", length: "28" },
    { size: "L", chest: "44-46", waist: "38-40", length: "29" },
    { size: "XL", chest: "48-50", waist: "42-44", length: "30" },
    { size: "XXL", chest: "52-54", waist: "46-48", length: "31" },
  ]

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-sm text-blue-600 underline hover:text-blue-800">
        Size Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Size Guide</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Size</th>
                    <th className="py-2 text-left">Chest (inches)</th>
                    <th className="py-2 text-left">Waist (inches)</th>
                    <th className="py-2 text-left">Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="border-b">
                      <td className="py-2 font-medium">{row.size}</td>
                      <td className="py-2">{row.chest}</td>
                      <td className="py-2">{row.waist}</td>
                      <td className="py-2">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-600">
              <p>• All measurements are in inches</p>
              <p>• For best fit, measure yourself and compare with the chart</p>
              <p>• Our t-shirts have an oversized fit</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SizeGuide
