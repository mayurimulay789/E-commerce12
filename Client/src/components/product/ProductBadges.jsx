const ProductBadges = ({ product }) => {
  const badges = []

  if (product.featured) {
    badges.push({ text: "Featured", color: "bg-blue-500" })
  }

  if (product.trending) {
    badges.push({ text: "Trending", color: "bg-green-500" })
  }

  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    badges.push({ text: `${discount}% OFF`, color: "bg-red-500" })
  }

  const totalStock = product.sizes?.reduce((sum, size) => sum + size.stock, 0) || 0
  if (totalStock < 10 && totalStock > 0) {
    badges.push({ text: "Limited Stock", color: "bg-orange-500" })
  }

  if (totalStock === 0) {
    badges.push({ text: "Out of Stock", color: "bg-gray-500" })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {badges.map((badge, index) => (
        <span key={index} className={`${badge.color} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
          {badge.text}
        </span>
      ))}
    </div>
  )
}

export default ProductBadges
