import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import { Toolbar, WithStyles, Select, TextField, MenuItem } from 'material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SettingsScope, changeCurrentScope } from '../modules/settings';

const decorate = withStyles(theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
    flex: {
        flexGrow: 1
    }
}));

interface HeaderProps {
    classes?: any;
    currentScope: SettingsScope;
    changeCurrentScope: typeof changeCurrentScope
}

const Header = decorate(class extends React.PureComponent<HeaderProps & WithStyles<'root'>> {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.props.changeCurrentScope(value);
    }

    render() {
        const { classes, currentScope } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static" style={{ position: 'fixed', top: '0' }}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            VS Code Settings
                        </Typography>
                        <Tabs value={currentScope} onChange={this.handleChange}>
                            <Tab label="User Settings" value={SettingsScope.User} />
                            <Tab label="Workspace Settings" value={SettingsScope.Workspace} />
                            <Tab label="Folder A Settings" value={SettingsScope.FolderA} />
                            <Tab label="Folder B Settings" value={SettingsScope.FolderB} />
                        </Tabs>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
});

const mapStateToProps = state => ({
    currentScope: state.settings.currentScope
});

const mapDispatchToProps = dispatch => bindActionCreators({
    changeCurrentScope
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header) as any;
