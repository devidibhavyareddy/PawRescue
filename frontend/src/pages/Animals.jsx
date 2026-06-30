import {
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

import {
  getAnimals,
} from "../services/animalService";

import AnimalCard from "../components/AnimalCard";
import { AuthContext } from "../context/AuthContext";
import { getFavorites } from "../services/favoriteService";

import SearchBar from "../components/SearchBar";

import Loader from "../components/Loader";

import FilterBar from "../components/FilterBar";

const Animals = () => {

  const [animals, setAnimals] =
    useState([]);

  const { user } = useContext(AuthContext);
  const [loading, setLoading] =
    useState(true);
  const [favoriteIds, setFavoriteIds] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filterType,
    setFilterType] =
    useState("");

  const [filterStatus,
    setFilterStatus] =
    useState("");

  useEffect(() => {
    fetchAnimals();
  }, []);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    const fetchUserFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavoriteIds(data.map((favorite) => favorite._id));
      } catch (error) {
        toast.error(
          "Failed to load favorites"
        );
      }
    };

    fetchUserFavorites();
  }, [user]);

  const fetchAnimals =
    async () => {
      try {
        const data =
          await getAnimals();

        setAnimals(data);
      } catch (error) {
        toast.error(
          "Failed to load animals. Is the backend running?"
        );
      } finally {
        setLoading(false);
      }
    };

  const filteredAnimals =
    animals.filter((animal) => {

      const matchesSearch =
        animal.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesType =
        filterType === ""
          ? true
          : animal.type ===
            filterType;

      const matchesStatus =
        filterStatus === ""
          ? true
          : animal.status ===
            filterStatus;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });

  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto p-5">

        <h1 className="text-4xl font-bold mb-6">
          Rescue Animals
        </h1>

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <FilterBar
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {filteredAnimals.length > 0 ? (
              filteredAnimals.map(
                (animal) => (
                  <AnimalCard
                    key={animal._id}
                    animal={animal}
                    isFavorite={favoriteIds.includes(
                      animal._id
                    )}
                  />
                )
              )
            ) : (
              <p className="text-lg text-gray-600 col-span-full text-center py-10">
                No animals found.
              </p>
            )}

          </div>
        )}

      </div>

    </MainLayout>
  );
};

export default Animals;
