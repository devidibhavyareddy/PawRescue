import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getAllRequests,
  updateRequestStatus,
  sendRequestMessage,
} from "../../services/adoptionService";

import Loader from "../../components/Loader";

const ManageRequests = () => {
  const [requests, setRequests] =
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
          await getAllRequests();

        setRequests(data);
      } catch (error) {
        toast.error(
          "Failed to load requests"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleStatusUpdate =
    async (id, status) => {
      try {
        await updateRequestStatus(
          id,
          status
        );

        setRequests((prev) =>
          prev.map((request) =>
            request._id === id
              ? { ...request, status }
              : request
          )
        );

        toast.success(
          `Request ${status.toLowerCase()}`
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to update request"
        );
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

  return (
    <AdminLayout>

      <h1 className="text-3xl font-bold mb-6">
        Adoption Requests
      </h1>

      {loading ? (
        <Loader />
      ) : requests.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center text-gray-600">
          No adoption requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white shadow p-5 rounded"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold">
                    {request.animal?.name || "Unknown animal"}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Applicant: {request.user?.name} ({request.user?.email})
                  </p>

                  <p className="text-gray-600">
                    Phone: {request.phone}
                  </p>

                  <p className="text-gray-600">
                    Address: {request.address}
                  </p>

                  <p className="mt-2 text-gray-700">
                    <span className="font-medium">Reason:</span> {request.reason}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Match score: {request.matchScore}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${statusColor(request.status)}`}
                  >
                    {request.status}
                  </span>

                  {request.status === "Pending" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            request._id,
                            "Approved"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            request._id,
                            "Rejected"
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div className="mt-4 border-t pt-4 space-y-4">
                <div className="space-y-3">
                  {request.messages?.length > 0 ? (
                    request.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`rounded-xl p-3 text-sm ${
                          message.sender === "admin"
                            ? "bg-orange-100 text-orange-900"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="font-semibold text-xs uppercase tracking-wide mb-1">
                          {message.sender === "admin"
                            ? "Admin"
                            : request.user?.name || "Client"}
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
                    placeholder="Send a message"
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
          ))}
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageRequests;
