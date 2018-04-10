import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import { Toolbar } from 'material-ui';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
    flex: {
        flexGrow: 1
    }
});

class Header extends React.PureComponent {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    }

    render() {
        const { classes } = this.props as any;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static" style={{ position: 'fixed', top: '0' }}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            VS Code Settings
                        </Typography>
                        <Tabs value={value} onChange={this.handleChange}>
                            <Tab label="User Settings" />
                            <Tab label="Workspace Settings" />
                        </Tabs>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(Header as any);