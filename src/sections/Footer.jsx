function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-8 text-center">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} Velankanni Parish. All rights reserved.
      </p>
      <a
        href="https://www.febiverse.tech"
        className="text-sm text-gray-400 hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        Liked the website? Connect to the{" "}
        <span className="text-blue-400 hover:text-blue-300">Developer</span>.
      </a>
    </footer>
  );
}

export default Footer;
