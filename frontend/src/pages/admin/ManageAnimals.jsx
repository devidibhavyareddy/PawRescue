import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getAnimals,
  deleteAnimal,
  updateAnimal,
} from "../../services/animalService";

import Loader from "../../components/Loader";

const ManageAnimals = () => {
  const [animals, setAnimals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals =
    async () => {
      try {
        const data =
          await getAnimals();

        setAnimals(data);
      } catch (error) {
        toast.error(
          "Failed to load animals"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleStatusChange =
    async (id, status) => {
      try {
        setUpdatingId(id);
        await updateAnimal(id, {
          status,
        });

        setAnimals((prev) =>
          prev.map((animal) =>
            animal._id === id
              ? { ...animal, status }
              : animal
          )
        );

        toast.success(
          "Animal status updated"
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to update status"
        );
      } finally {
        setUpdatingId(null);
      }
    };

  const handleDelete =
    async (id, name) => {
      if (
        !window.confirm(
          `Delete ${name}? This cannot be undone.`
        )
      ) {
        return;
      }

      try {
        await deleteAnimal(id);

        setAnimals((prev) =>
          prev.filter(
            (animal) =>
              animal._id !== id
          )
        );

        toast.success(
          "Animal deleted"
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to delete animal"
        );
      }
    };

  return (
    <AdminLayout>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Manage Animals
        </h1>

        <Link
          to="/admin/add-animal"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
        >
          + Add Animal
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : animals.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600 mb-4">
            No animals yet.
          </p>
          <Link
            to="/admin/add-animal"
            className="text-orange-500 hover:underline"
          >
            Add your first animal
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Age</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr
                  key={animal._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {animal.name}
                  </td>
                  <td className="p-4">
                    {animal.type}
                  </td>
                  <td className="p-4">
                    {animal.age}
                  </td>
                  <td className="p-4">
                    <select
                      value={animal.status}
                      onChange={(e) =>
                        handleStatusChange(
                          animal._id,
                          e.target.value
                        )
                      }
                      disabled={
                        updatingId === animal._id
                      }
                      className="border p-2 rounded w-full"
                    >
                      <option value="Rescued">
                        Rescued
                      </option>
                      <option value="Under Care">
                        Under Care
                      </option>
                      <option value="Ready For Adoption">
                        Ready For Adoption
                      </option>
                      <option value="Adopted">
                        Adopted
                      </option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/animals/edit/${animal._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(
                            animal._id,
                            animal.name
                          )
                        }
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageAnimals;
