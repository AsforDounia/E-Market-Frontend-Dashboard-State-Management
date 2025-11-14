import Logo from "../../assets/images/e-market-logo.jpeg";

const LogoWithText = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={Logo}
          alt="E-Market Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-3xl font-bold">-Market</span>
    </div>
  );
};

export default LogoWithText;
