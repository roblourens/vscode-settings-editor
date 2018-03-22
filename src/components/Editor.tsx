import * as React from 'react';
import { SettingItem } from './SettingItem';
import './Editor.css';

export enum SettingType {
    string,
    number,
    boolean,
    object
}

export interface Setting {
    name: string;
    description: string;
    type: string;
    default?: any; // any
    enum?: string[];
    enumDescriptions?: string[];
}

export interface Props {
    configuration: Setting[];
}

function Editor(props: Props) {
    return (
        <div className="editor">
            {renderConfiguration(props.configuration)}
        </div>
    );
}

export default Editor;

// helpers

function renderConfiguration(config: Setting[]) {
    return config.map(setting => <SettingItem key={setting.name} setting={setting} />);
}
