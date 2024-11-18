/* eslint-disable react/prop-types */
export default function CruiseCard({ cruise }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all">
      <div className="relative h-64">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `url(${cruise.image_url})`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
          <h3 className="text-white text-xl font-semibold">
            {cruise.starting_port.name} - {cruise.destination_port.name} (
            {cruise.nights}N/{cruise.nights + 1}D)
          </h3>
          <p className="text-white/80 text-sm mt-1">
            Operated by {cruise.ship.name}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Port Information */}
        <div className="space-y-2">
          <p className="text-gray-600">Route</p>
          <div className="flex flex-wrap gap-2">
            {cruise.ports.map((port, idx) => (
              <div key={idx} className="flex items-center">
                <span className="text-gray-900">{port.name}</span>
                {idx < cruise.ports.length - 1 && (
                  <span className="mx-2 text-gray-400">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions */}
        {cruise.inclusions && (
          <div className="space-y-2">
            <p className="text-gray-600">Inclusions</p>
            <div className="flex flex-wrap gap-2">
              {cruise.inclusions.map((inclusion, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {inclusion}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Offers */}
        {cruise.offers_present && cruise.offers_available?.length > 0 && (
          <div className="space-y-2">
            <p className="text-blue-600">Special Offers</p>
            <div className="flex flex-wrap gap-2">
              {cruise.offers_available.map((offer, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </span>
                  {offer}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dates and Trip Type */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span>{cruise.start_date}</span>
              <span>→</span>
              <span>{cruise.end_date}</span>
            </div>
            <span className="text-purple-600 text-sm capitalize">
              {cruise.trip_type.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-1">
          <p className="text-gray-600">Starting from</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{cruise.starting_fare.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            ₹{cruise.per_guest_per_night.toLocaleString()} per guest/night
          </p>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-2 rounded-lg transition-colors ${
            cruise.status === "BOOKING"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-100 text-gray-500 cursor-not-allowed"
          }`}
          disabled={cruise.status !== "BOOKING"}
        >
          {cruise.status === "BOOKING" ? "Book Now" : cruise.status}
        </button>
      </div>
    </div>
  );
}
