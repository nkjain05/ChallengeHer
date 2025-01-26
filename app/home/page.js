export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#FEDEF1" }}>
      {/* Logo Section */}
      <div className="relative flex justify-center z-0">
        <img
          src="/logo.png" // Ensure this matches where your logo is saved
          alt="ChallengeHer Logo"
          className="w-[800px] h-auto" // Large size for better visibility
        />
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col items-center text-center -mt-32 z-10">
        {/* Description */}
        <p className="text-lg text-pink-600 font-medium max-w-lg mb-6">
          Take on fitness challenges, create personalized workout plans, and achieve your goals with ease!
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <a
            href="/signup"
            className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition duration-200 text-center text-xl"
          >
            Signup
          </a>
          <a
            href="/login"
            className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition duration-200 text-center text-xl"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
