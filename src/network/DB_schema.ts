import PropTypes from "prop-types"
export const DB_schema = {
	latest_page: PropTypes.string,
	language: PropTypes.string,
	token: PropTypes.string,
	testing: PropTypes.shape({
		card_no: PropTypes.string,
	}),
	caches: PropTypes.shape({
		path: PropTypes.string,
		data: PropTypes.shape({
			push_to_top: PropTypes.string,
		}),
	}),
}
