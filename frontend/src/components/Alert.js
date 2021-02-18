import { React, Component } from 'react'
import { whiteAlert } from 'react-alert'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Alert extends Alert{

    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired,
    }
    
    
    componentDidUpdate(prevProps) {
    const { error, alert, message } = this.props;
    if (error !== prevProps.error) {
        if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
    }

    }

    render() {
        return <Fragment />;
    }


}

const mapStateToProps = (state) => ({
    error: state.errors,
    message: state.messages,
});

export default connect(mapStateToProps)(whiteAlert()(Alert)) 