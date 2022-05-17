import React, {Component} from "react";

import withStyles from "@material-ui/core/styles/withStyles"
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
    progress:  {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flex: 1
    }
}

export class Loading extends Component {
    render(){
        const {css} = this.props
        return(
            <div className={css.progress}>
                <CircularProgress/>
            </div>
        )
    }
}

export default withStyles(styles)(Loading)