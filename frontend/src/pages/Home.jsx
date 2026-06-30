import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <MainLayout>
      <section className="bg-orange-50 min-h-[80vh] flex items-center justify-center px-5">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-orange-500 mb-6">
            PawRescue 🐾
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            {user ? (
              <>Welcome back, {user.name}! Discover pets already waiting for your love.</>
            ) : (
              <>Giving rescued animals a second chance at life. Browse our animals, save your favorites, and apply to adopt today.</>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/favorites")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  aria-label="View Favorites"
                >
                  My Favorites
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/my-requests")}
                  className="bg-white hover:bg-gray-50 text-orange-500 border-2 border-orange-500 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  My Requests
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/animals")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  aria-label="Adopt a Friend"
                >
                  Adopt a Friend
                </button>

                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-50 text-orange-500 border-2 border-orange-500 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Join PawRescue
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="text-4xl mb-3">🐕</div>
          <h3 className="text-xl font-bold mb-2">Browse Animals</h3>
          <p className="text-gray-600 mb-4">
            Explore dogs, cats, birds, and more waiting for a loving home.
          </p>
          <Link
            to="/animals"
            className="text-orange-500 font-semibold hover:underline"
          >
            View Animals →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="text-4xl mb-3">❤️</div>
          <h3 className="text-xl font-bold mb-2">Save Favorites</h3>
          <p className="text-gray-600 mb-4">
            Keep track of animals you love and revisit them anytime.
          </p>
          <Link
            to="/favorites"
            className="text-orange-500 font-semibold hover:underline"
          >
            My Favorites →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="text-4xl mb-3">🏠</div>
          <h3 className="text-xl font-bold mb-2">Apply to Adopt</h3>
          <p className="text-gray-600 mb-4">
            Submit an adoption request and follow your application status.
          </p>
          <Link
            to="/my-requests"
            className="text-orange-500 font-semibold hover:underline"
          >
            My Requests →
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;