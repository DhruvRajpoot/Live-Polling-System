import React from "react";

const PollOptions = ({
  question,
  pollOptions,
  selectedOption,
  submitted,
  timeLeft,
  votes,
  calculatePercentage,
  onOptionSelect,
  viewOnly = false,
}) => {
  return (
    <div className="w-full bg-white rounded-lg border border-[#6766D5] overflow-hidden mb-6 lg:mb-8">
      <div className="bg-gradient-to-r from-[#343434] to-[#6E6E6E] px-3 lg:px-4 py-2 lg:py-3 rounded-t-lg">
        <h2 className="text-white font-semibold font-sora text-sm lg:text-base">{question}</h2>
      </div>

      <div className="p-3 lg:p-4 space-y-2 lg:space-y-3">
        {pollOptions.map((option) => (
          <div
            key={option.id}
            className={`flex items-center justify-between p-2 lg:p-3 rounded-md border relative overflow-hidden ${
              !viewOnly && selectedOption === option
                ? "bg-white border-[#8F64E1]"
                : "bg-[#F6F6F6] border-[#8d8d8d23]"
            }`}
            style={{
              cursor:
                viewOnly || submitted || timeLeft === 0
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={() => {
              if (!viewOnly && !submitted && timeLeft > 0) {
                onOptionSelect(option);
              }
            }}
          >
            {(viewOnly || submitted) && (
              <div
                className="absolute left-0 top-0 h-full bg-[#6766D5] transition-all duration-500 ease-out"
                style={{
                  width: `${Math.round(
                    calculatePercentage(votes[option.text] || 0)
                  )}%`,
                  zIndex: 1,
                }}
              />
            )}

            <div className="flex items-center gap-2 lg:gap-3 relative w-full z-10">
              <div
                className={`w-5 h-5 lg:w-6 lg:h-6 text-white rounded-full flex items-center justify-center ${
                  viewOnly || submitted
                    ? Math.round(calculatePercentage(votes[option.text] || 0)) <
                      10
                      ? "bg-[#8D8D8D]"
                      : "bg-white"
                    : selectedOption === option
                    ? "bg-[#8F64E1]"
                    : "bg-[#8D8D8D]"
                }`}
              >
                <span
                  className={`text-xs font-semibold font-sora ${
                    viewOnly || submitted
                      ? Math.round(
                          calculatePercentage(votes[option.text] || 0)
                        ) < 10
                        ? "text-white"
                        : "text-[#8F64E1]"
                      : "text-white"
                  }`}
                >
                  {option.id}
                </span>
              </div>

              <span
                className={`font-sora text-sm lg:text-base ${
                  viewOnly || submitted
                    ? Math.round(calculatePercentage(votes[option.text] || 0)) >
                      30
                      ? "text-white"
                      : "text-black"
                    : "text-black"
                }`}
              >
                {option.text}
              </span>
            </div>

            {(viewOnly || submitted) && (
              <span
                className={`font-semibold font-sora z-10 relative text-sm lg:text-base ${
                  Math.round(calculatePercentage(votes[option.text] || 0)) > 90
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {Math.round(calculatePercentage(votes[option.text] || 0))}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollOptions;
