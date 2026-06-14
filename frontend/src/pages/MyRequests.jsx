import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

import {
  getMyRequests,
  sendRequestMessage,
} from "../services/adoptionService";

import Loader from "../components/Loader";

const MyRequests = () => {
  const [requests,
    setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [messageInputs, setMessageInputs] =
    useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests =
    async () => {
      try {
        const data =
          await getMyRequests();

        setRequests(data);
      } catch (error) {
        toast.error(
          "Failed to load requests"
        );
      } finally {
        setLoading(false);
      }
    };

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const handleSendMessage =
    async (id, text) => {
      if (!text?.trim()) {
        return;
      }

      try {
        const updated =
          await sendRequestMessage(
            id,
            text
          );

        setRequests((prev) =>
          prev.map((request) =>
            request._id === id
              ? updated
              : request
          )
        );

        setMessageInputs((prev) => ({
          ...prev,
          [id]: "",
        }));
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to send message"
        );
      }
    };

  return (
    <MainLayout>

      <div className="max-w-6xl mx-auto p-5">

        <h1 className="text-4xl font-bold mb-6">
          My Adoption Requests
        </h1>

        {loading ? (
          <Loader />
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <p className="text-gray-600 text-lg mb-4">
              You haven't submitted any adoption requests yet.
            </p>
            <Link
              to="/animals"
              className="text-orange-500 hover:underline font-semibold"
            >
              Browse animals →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(
              (request) => (
                <div
                  key={
                    request._id
                  }
                  className="bg-white shadow p-5 rounded"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <div>
                      <h2 className="font-bold text-lg">
                        {request.animal?.name || "Unknown animal"}
                      </h2>

                      <p className="text-gray-600">
                        {request.animal?.type} · {request.animal?.age} years old
                      </p>

                      <p className="text-gray-600 mt-1">
                        Reason: {request.reason}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded text-sm font-medium self-start ${statusColor(request.status)}`}
                    >
                      {request.status}
                    </span>

                  </div>

                  <div className="mt-4 border-t pt-4 space-y-4">
                    <div className="space-y-3">
                      {request.messages?.length > 0 ? (
                        request.messages.map((message, index) => (
                          <div
                            key={index}
                            className={`rounded-xl p-3 text-sm ${
                              message.sender === "user"
                                ? "bg-orange-100 text-orange-900"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div className="font-semibold text-xs uppercase tracking-wide mb-1">
                              {message.sender === "user"
                                ? "You"
                                : "Admin"}
                            </div>
                            <p>{message.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No messages yet.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Message the admin"
                        value={messageInputs[request._id] || ""}
                        onChange={(e) =>
                          setMessageInputs((prev) => ({
                            ...prev,
                            [request._id]: e.target.value,
                          }))
                        }
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <button
                        onClick={() =>
                          handleSendMessage(
                            request._id,
                            messageInputs[request._id]
                          )
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                      >
                        Send
                      </button>
                    </div>
                  </div>

                </div>
              )
            )}
          </div>
        )}

      </div>

    </MainLayout>
  );
};

export default MyRequests;
