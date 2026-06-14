import AdoptionRequest from "../models/AdoptionRequest.js";
import Animal from "../models/Animal.js";


// USER APPLY FOR ADOPTION
export const createAdoptionRequest = async (
  req,
  res
) => {
  try {
    const {
      animalId,
      phone,
      address,
      reason,
    } = req.body;

    const animal = await Animal.findById(
      animalId
    );

    if (!animal) {
      return res.status(404).json({
        message: "Animal not found",
      });
    }

    let matchScore = 70;

    if (
      animal.status ===
        "Ready For Adoption" ||
      animal.status === "Available"
    ) {
      matchScore += 20;
    }

    const request =
      await AdoptionRequest.create({
        user: req.user.id,
        animal: animalId,
        phone,
        address,
        reason,
        matchScore,
      });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// USER VIEW OWN REQUESTS
export const getMyRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await AdoptionRequest.find({
        user: req.user.id,
      })
        .populate("animal")
        .populate(
          "user",
          "name email"
        );

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ADMIN VIEW ALL REQUESTS
export const getAllRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await AdoptionRequest.find()
        .populate(
          "user",
          "name email"
        )
        .populate("animal");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ADMIN APPROVE / REJECT
export const updateRequestStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const request =
        await AdoptionRequest.findById(
          req.params.id
        );

      if (!request) {
        return res.status(404).json({
          message:
            "Request not found",
        });
      }

      request.status = status;

      await request.save();

      if (status === "Approved") {
        await Animal.findByIdAndUpdate(
          request.animal,
          {
            status: "Adopted",
          }
        );
      }

      res.status(200).json(
        request
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


export const addMessageToRequest = async (
  req,
  res
) => {
  try {
    const { text } = req.body;

    const request = await AdoptionRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      request.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "Not authorized to message on this request",
      });
    }

    request.messages.push({
      sender:
        req.user.role === "admin"
          ? "admin"
          : "user",
      text,
    });

    await request.save();

    const populatedRequest = await AdoptionRequest.findById(
      request._id
    )
      .populate("user", "name email")
      .populate("animal");

    res.status(200).json(populatedRequest);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};