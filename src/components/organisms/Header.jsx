import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import AuthForm from "@/components/organisms/AuthForm";

const Header = ({ isAuthenticated, onAuthSuccess }) => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowMobileMenu(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onAuthSuccess();
  };

  if (isAuthenticated) {
    return null; // Authenticated header is handled in Layout component
  }

  return (
    <>
      <motion.header
        className="fixed w-full top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <ApperIcon name="BarChart3" className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                SalesPulse
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                About
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => handleAuthClick("login")}
              >
                Login
              </Button>
              <Button
                onClick={() => handleAuthClick("signup")}
                icon="ArrowRight"
                iconPosition="right"
              >
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ApperIcon name={showMobileMenu ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                className="md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-100">
                  <a
                    href="#features"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Pricing
                  </a>
                  <a
                    href="#about"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    About
                  </a>
                  <div className="pt-4 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => handleAuthClick("login")}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => handleAuthClick("signup")}
                      icon="ArrowRight"
                      iconPosition="right"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        size="md"
      >
        <AuthForm
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={handleAuthSuccess}
        />
      </Modal>
    </>
  );
};

export default Header;