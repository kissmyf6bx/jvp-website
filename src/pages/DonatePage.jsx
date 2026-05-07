import DonationForm from "../components/DonationForm";

function DonatePage() {

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        px-6
        py-16
      "
    >

      <div
        className="
          max-w-xl
          mx-auto
        "
      >

        <button
          onClick={() =>
            window.history.back()
          }
          className="
            text-gray-400
            mb-10
          "
        >
          ← Back
        </button>

        <div className="mb-12">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-gray-500
              mb-4
            "
          >
            Velankanni Parish
          </p>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-semibold
              tracking-tight
              leading-tight
              mb-4
            "
          >
            Donate
          </h1>

          <p
            className="
              text-gray-400
              text-sm
              md:text-base
              leading-relaxed
            "
          >
            Your support helps our
            parish continue its
            mission of faith,
            service and community.
          </p>

        </div>

        <DonationForm />

      </div>

    </div>
  );
}

export default DonatePage;