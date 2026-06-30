import { Link } from "react-router-dom";

const AnimalCard = ({
  animal,
  isFavorite,
}) => {
  return (
    <div className="relative bg-white shadow-md rounded-xl overflow-hidden">

      <img
        src={
          animal.image ||
          "https://via.placeholder.com/400"
        }
        alt={animal.name}
        className="w-full h-56 object-cover"
      />

      {isFavorite && (
        <div className="absolute top-3 right-3 bg-white/85 backdrop-blur rounded-full p-2 shadow">
          <span className="text-red-500 text-xl">❤️</span>
        </div>
      )}

      <div className="p-4">

        <h2 className="text-xl font-bold">
          {animal.name}
        </h2>

        <p>
          Type: {animal.type}
        </p>

        <p>
          Age: {animal.age}
        </p>

        <p>
          Status: {animal.status}
        </p>

        <Link
          to={`/animals/${animal._id}`}
          className="inline-block mt-3 bg-orange-500 text-white px-4 py-2 rounded"
        >
          View Details
        </Link>

      </div>
    </div>
  );
};

export default AnimalCard;