import venueRepository from "../repositories/venueRepository.js";

export const addVenue = async (req, res) => {
  try {
    const { name, block, inchargeIds, capacity } = req.body;

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!block) missingFields.push("block");
    if (!capacity) missingFields.push("capacity");
    if (!inchargeIds) missingFields.push("inchargeIds");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        missingFields,
      });
    }

    const staffsExist = await venueRepository.verifyStaffIds(
      inchargeIds
    );

    if (!staffsExist) {
      return res.status(400).json({
        status: "error",
        message: "Some staff IDs are invalid",
      });
    }

    const data = {
      name,
      block,
      inchargeIds,
      capacity,
    };

    const response = await venueRepository.insertNewVenue(data);

    return res.status(201).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export const patchVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const updateData = req.body;

    if (updateData.inchargeIds) {
      const staffsExist =
        await venueRepository.verifyStaffIds(
          updateData.inchargeIds
        );

      if (!staffsExist) {
        return res.status(400).json({
          status: "error",
          message: "Some staff IDs are invalid",
        });
      }
    }

    const response =
      await venueRepository.updateVenuePatch(
        venueId,
        updateData
      );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const putVenue = async (req, res) => {
  try {
    const { venueId } = req.params;

    const {
      name,
      block,
      capacity,
      inchargeIds,
    } = req.body;

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!block) missingFields.push("block");
    if (!capacity) missingFields.push("capacity");
    if (!inchargeIds)
      missingFields.push("inchargeIds");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        missingFields,
      });
    }

    const staffsExist =
      await venueRepository.verifyStaffIds(
        inchargeIds
      );

    if (!staffsExist) {
      return res.status(400).json({
        status: "error",
        message: "Some staff IDs are invalid",
      });
    }

    const response =
      await venueRepository.replaceVenuePut(
        venueId,
        {
          name,
          block,
          capacity,
          inchargeIds,
        }
      );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteVenue = async (req, res) => {
  try {
    const { venueId } = req.params;

    const response =
      await venueRepository.deleteVenueById(
        venueId
      );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getVenues = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 10,
      block,
      search,
    } = req.query;

    const response =
      await venueRepository.getVenues({
        page: Number(page),
        limit: Number(limit),
        block,
        search,
      });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};