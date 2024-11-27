import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white text-center py-4 fixed bottom-0 w-full font-sans text-sm shadow-md">
      <p>
        © 2024 Your Company. All rights reserved.{" "}
        <a
          href="https://yourcompany.com"
          className="text-yellow-400 font-bold hover:underline"
        >
          Visit Us
        </a>
      </p>
    </footer>
  );
};

export default Footer;
