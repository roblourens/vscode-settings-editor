import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Checkbox, FormControlLabel } from 'material-ui';

import { DisplayProps, changeDisplayProp } from './../modules/settings'

interface ControlsProps {
    displayProps: DisplayProps;
    classes: any;

    onChangeDisplayProp: (propId: string, value: boolean) => void;
}

class EditorControls extends React.PureComponent<ControlsProps> {
    render() {
        return (
            <div className={this.props.classes.editorControlsContainer}>
                <FormControlLabel
                    className={this.props.classes.editorControl}
                    control={
                        <Checkbox
                            defaultChecked={this.props.displayProps.showOverriddenSettingsOnly}
                            onChange={this.getCheckboxChangeHandler('showOverriddenSettingsOnly')}
                        />
                    }
                    label="Show modified settings only"
                />
                <FormControlLabel
                    className={this.props.classes.editorControl}
                    control={
                        <Checkbox
                            defaultChecked={this.props.displayProps.showAdvancedSettings}
                            onChange={this.getCheckboxChangeHandler('showAdvancedSettings')}
                        />
                    }
                    label="Show advanced settings"
                />
            </div>
        )
    }

    private getCheckboxChangeHandler(displayPropName: string) {
        return (e, checked) => {
            this.props.onChangeDisplayProp(displayPropName, checked);
        }
    }
}

const mapStateToPropsEC = state => ({
    displayProps: state.settings.displayProps,
});

const mapDispatchToPropsEC = dispatch => bindActionCreators({
    onChangeDisplayProp: changeDisplayProp
}, dispatch);

export default connect(
    mapStateToPropsEC,
    mapDispatchToPropsEC
)(EditorControls as any) as any;