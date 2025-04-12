import PropTypes from "prop-types";

// Avatar Component
export const Avatar = ({ className, children }) => {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// Add PropTypes validation for Avatar
Avatar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// AvatarImage Component
export const AvatarImage = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />
  );
};

// Add PropTypes validation for AvatarImage
AvatarImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};
