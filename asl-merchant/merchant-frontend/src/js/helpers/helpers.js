import moment from 'moment'

const helpers = {
    /**
     * description: this function is used to format the date
     * @param {String} date 
     * @returns {String}
     */
    formatDate: (date) => {
        return moment(date).format('MMMM Do YYYY')
    },

    /**
     * this method helps to convert values to lower case
     */
    toLower(val) {
        return val.toLowerCase();
    },
}

export default helpers