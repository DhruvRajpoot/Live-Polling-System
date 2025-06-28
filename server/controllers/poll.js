import Poll from "../models/pollModel.js";

export const createPoll = async (req, res) => {
  try {
    const pollData = req.body;
    console.log("Creating poll via API:", pollData);

    const newPoll = new Poll(pollData);
    const savedPoll = await newPoll.save();

    console.log("Poll created successfully via API:", savedPoll);

    res.status(201).json({
      status: "success",
      data: savedPoll,
    });
  } catch (error) {
    console.error("Error creating poll via API:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create poll",
      error: error.message,
    });
  }
};

export const voteOnOption = async (pollId, optionText) => {
  try {
    const poll = await Poll.findOneAndUpdate(
      { _id: pollId, "options.text": optionText },
      { $inc: { "options.$.votes": 1 } },
      { new: true }
    );

    console.log("Vote registered successfully:", poll);
  } catch (error) {
    console.error("Error registering vote:", error);
  }
};

export const getPolls = async (req, res) => {
  let { teacherUsername } = req.params;
  let data = await Poll.find({ teacherUsername }).sort({ createdAt: -1 });
  res.status(200).json({
    data,
  });
};
