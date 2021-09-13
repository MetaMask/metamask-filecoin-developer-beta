import { connect } from "react-redux"
import IpfsEnable from "./ipfs-enable.component"
import {setIpfsIpnsHandlerShouldUpdate} from "../../store/actions"
import console from "console";

const mapStateToProps = (state) => {
    const {metamask} = state;
    const {
        ipfsGateway,
        ipfsIpnsEnabled,
        ipfsIpnsHandlerShouldUpdate,
    } = metamask;

    console.log(state);

    return {
        ipfsGateway,
        ipfsIpnsEnabled,
        ipfsIpnsHandlerShouldUpdate,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setIpfsIpnsHandlerShouldUpdate: (value) => {
            dispatch(setIpfsIpnsHandlerShouldUpdate(value))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IpfsEnable)