import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

import {
  getAnimalById,
} from "../services/animalService";

import {
  addFavorite,
} from "../services/favoriteService";

import {
  createRequest,
} from "../services/adoptionService";


import { AuthContext } from "../context/AuthContext";

import Loader from "../components/Loader";

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [animal, setAnimal] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [reason, setReason] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  const fetchAnimal =
    async () => {
      try {
        setLoading(true);
        const data =
          await getAnimalById(id);

        setAnimal(data);
      } catch (error) {
        toast.error(
          "Animal not found"
        );
        navigate("/animals");
      } finally {
        setLoading(false);
      }
    };

  const handleFavorite =
    async () => {
      if (!user) {
        toast.error(
          "Please login to add favorites"
        );
        navigate("/login");
        return;
      }

      try {
        await addFavorite(
          animal._id
        );

        toast.success(
          "Added to favorites"
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to add favorite"
        );
      }
    };

  const handleAdoption =
    async (e) => {
      e.preventDefault();

      if (!user) {
        toast.error(
          "Please login to submit a request"
        );
        navigate("/login");
        return;
      }

      const phoneDigits = phone.replace(/\D/g, "");

      if (
        !phoneDigits ||
        !address.trim() ||
        !reason.trim()
      ) {
        toast.error(
          "Please fill in all fields"
        );
        return;
      }

      if (phoneDigits.length !== 10) {
        toast.error(
          "Phone number must be exactly 10 digits"
        );
        return;
      }

      try {
        await createRequest({
          animalId:
            animal._id,
          phone: phoneDigits,
          address,
          reason,
        });

        toast.success(
          "Adoption request submitted"
        );

        setReason("");
        setPhone("");
        setAddress("");
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to submit request"
        );
      }
    };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (!animal) {
    return null;
  }

  const canAdopt =
    animal.status ===
      "Ready For Adoption" ||
    animal.status === "Available";

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-5">

        <img
          src={
            animal.image ||
            "https://via.placeholder.com/600"
          }
          alt={animal.name}
          className="w-full h-96 object-cover rounded"
        />

        <h1 className="text-4xl font-bold mt-5">
          {animal.name}
        </h1>

        <div className="flex flex-wrap gap-4 mt-3 text-gray-700">
          <span>Type: {animal.type}</span>
          <span>Age: {animal.age}</span>
          <span>Gender: {animal.gender}</span>
          <span className="font-semibold text-orange-600">
            Status: {animal.status}
          </span>
        </div>

        <p className="mt-4 text-gray-700">
          {animal.description}
        </p>

        {animal.story && (
          <p className="mt-3 text-gray-600 italic">
            {animal.story}
          </p>
        )}

        <button
          onClick={handleFavorite}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded mt-4 transition-colors"
        >
          Add To Favorites ❤️
        </button>

        <div className="mt-8">

          <h2 className="text-2xl font-bold mb-3">
            Adoption Request
          </h2>

          {canAdopt ? (
            <form onSubmit={handleAdoption}>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/[^0-9]/g, "")
                  )
                }
                maxLength={10}
                className="w-full border p-3 rounded mb-3"
                placeholder="Phone number"
              />

              <input
                type="text"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded mb-3"
                placeholder="Your address"
              />

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded"
                rows="4"
                placeholder="Why do you want to adopt this animal?"
              />

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded mt-3 transition-colors"
              >
                Submit Request
              </button>

            </form>
          ) : (
            <p className="text-gray-600 bg-gray-100 p-4 rounded">
              This animal is not currently available for adoption.
            </p>
          )}

          {!user && (
            <p className="mt-3 text-sm text-gray-500">
              <Link
                to="/login"
                className="text-orange-500 hover:underline"
              >
                Login
              </Link>
              {" "}to submit an adoption request or save favorites.
            </p>
          )}

        </div>

      </div>
    </MainLayout>
  );
};

export default AnimalDetails;
