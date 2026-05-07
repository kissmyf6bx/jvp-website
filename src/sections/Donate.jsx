function Donate({ handleDonate }) {
  return (
    <section id="donate" className="bg-black text-white px-6 py-24 text-center">

      <div className="max-w-3xl mx-auto">

        <h2 className="text-4xl md:text-5xl font-semibold mb-6">
          Support Our Mission
        </h2>

        <p className="text-gray-300 mb-8">
          <b><i>"Each of you should give what you have decided in your heart to give, for God loves a cheerful giver."</i></b>
          <br></br>
          <b><u>(2 Corinthians 9:7)</u></b>
          <br></br>
          <br></br>
          With joyful and hopeful hearts, we are embarking on a sacred journey to build a permanent church where our community can gather in peace.
          To turn this beautiful vision into a reality, we urgently need your financial contributions. 
          Every gift, no matter the size, builds the physical walls of our sanctuary while strengthening the ties of our parish family. 
          We humbly invite you to support us; your generosity will leave a lasting legacy of faith.
        </p>

        <button
          onClick={handleDonate}
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Donate Now
        </button>

      </div>

    </section>
  );
}

export default Donate;
