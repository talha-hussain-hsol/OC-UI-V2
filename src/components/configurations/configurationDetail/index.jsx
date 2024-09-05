import PropTypes from "prop-types";

export default function ConfigurationDetail({ selectedTab }) {
  return (
    <>
      <h4>{selectedTab?.title}</h4>
    </>
  );
}

ConfigurationDetail.propTypes = {
  selectedTab: PropTypes.string,
};
