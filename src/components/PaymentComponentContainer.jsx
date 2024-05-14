import PropTypes from "prop-types"
export default function PaymentComponentContainer({ scriptRendered }) {
  PaymentComponentContainer.propTypes = {
    scriptRendered: PropTypes.bool.isRequired,
  }
  return (
    <div
      className={`${scriptRendered ? "shadow-lg bg-[#fff]" : undefined}`}
      style={{
        position: "absolute",
        top: 100,
        right: 50,
        backgroundColor: scriptRendered
          ? "var(--color-dark-elephant-white)"
          : undefined,
        borderRadius: "4px",
        marginTop: "20px",
      }}
    >
      <div
        className="col-6"
        id="fsc-embedded-checkout-container"
        style={{
          width: "500px",
          height: "500px",
        }}
      ></div>
    </div>
  )
}
