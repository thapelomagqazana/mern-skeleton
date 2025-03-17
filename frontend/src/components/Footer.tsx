const Footer = () => {
    return (
      <footer className="w-full bg-gray-800 text-white py-4 mt-10">
        <div className="container mx-auto text-center text-sm">
          © {new Date().getFullYear()} SpringMERNify. All rights reserved.
          <br />
          Built with ❤️ by <span className="font-semibold">Thapelo Magqazana</span>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  